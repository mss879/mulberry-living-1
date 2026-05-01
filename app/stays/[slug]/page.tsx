import type { Metadata } from "next";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import StayDetail from "@/views/stays/StayDetail";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: stay } = await supabase
    .from("stays")
    .select("id, title, headline, summary, slug")
    .eq("slug", params.slug)
    .single();

  if (!stay) {
    return {
      title: "Stay Not Found",
      description: "The stay option you are looking for could not be found.",
    };
  }

  // Fetch the primary image (position 0) from stay_images
  const { data: primaryImage } = await (supabase as any)
    .from("stay_images")
    .select("url, alt")
    .eq("stay_id", stay.id)
    .order("position", { ascending: true })
    .limit(1)
    .single();

  const ogImage = primaryImage?.url || "/hero.jpg";

  const title = `${stay.title} — ${stay.headline || "Mulberry Living"}`;
  const description =
    stay.summary ||
    `Book the ${stay.title} at Mulberry Living in Negombo, Sri Lanka.`;

  return {
    title,
    description,
    keywords: [
      stay.title,
      "Mulberry Living",
      "Negombo accommodation",
      "Sri Lanka stay",
      stay.headline || "",
    ].filter(Boolean),
    alternates: {
      canonical: `https://mulberry-living.com/stays/${params.slug}`,
    },
    openGraph: {
      title: `${stay.title} | Mulberry Living — Negombo`,
      description,
      url: `https://mulberry-living.com/stays/${params.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: primaryImage?.alt || `${stay.title} at Mulberry Living`,
        },
      ],
    },
  };
}

export default function StayDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <StayDetail slug={params.slug} />;
}

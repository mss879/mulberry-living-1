import type { Metadata } from "next";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import StayDetail from "@/views/stays/StayDetail";

const getImageForSlug = (slug: string): string => {
  switch (slug) {
    case "dorms":
    case "6-bed-mixed-dormitory-room":
      return "/6-Bed Mixed Dormitory Room/843450146.jpg";
    case "apartment":
      return "/Apartment/843683565 (1).jpg";
    case "private-rooms":
    case "queen":
    case "queen-room":
      return "/Queen Room/843449793.jpg";
    case "twin":
    case "twin-room-with-balcony":
      return "/Twin Room with Balcony/843449275.jpg";
    default:
      return "/hero.jpg";
  }
};

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
    .select("title, headline, summary, slug")
    .eq("slug", params.slug)
    .single();

  if (!stay) {
    return {
      title: "Stay Not Found",
      description: "The stay option you are looking for could not be found.",
    };
  }

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
          url: getImageForSlug(stay.slug),
          width: 1200,
          height: 630,
          alt: `${stay.title} at Mulberry Living`,
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

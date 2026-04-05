import { MetadataRoute } from "next";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mulberry-living.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stays`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic stay pages
  let stayPages: MetadataRoute.Sitemap = [];
  try {
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

    const { data: stays } = await supabase
      .from("stays")
      .select("slug, updated_at")
      .eq("is_visible", true);

    if (stays) {
      stayPages = stays.map((stay) => ({
        url: `${baseUrl}/stays/${stay.slug}`,
        lastModified: stay.updated_at ? new Date(stay.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    // Silently handle — static pages will still be in the sitemap
    console.error("Sitemap: Failed to fetch stays", error);
  }

  return [...staticPages, ...stayPages];
}

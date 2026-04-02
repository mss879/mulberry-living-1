import StayDetail from "@/views/stays/StayDetail";

export default function StayDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <StayDetail slug={params.slug} />;
}

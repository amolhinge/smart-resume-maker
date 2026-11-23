import { PrintView } from "@/components/resume/PrintView";

export default async function PrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ doc?: string }>;
}) {
  const { id } = await params;
  const { doc } = await searchParams;
  return <PrintView id={id} initialMode={doc === "cover" ? "cover" : "resume"} />;
}

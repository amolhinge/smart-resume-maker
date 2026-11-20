import type { Metadata } from "next";
import { Builder } from "@/components/builder/Builder";

export const metadata: Metadata = {
  title: "Resume builder",
};

export default async function BuildPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Builder id={id} />;
}

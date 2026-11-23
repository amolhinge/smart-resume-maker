import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Resume templates",
  description:
    "Preview all 10 free resume templates — Classic, Modern, Minimal, Elegant, Bold, Technical, Compact and more. Pick one and download a clean one-page A4 PDF.",
  path: "/templates",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

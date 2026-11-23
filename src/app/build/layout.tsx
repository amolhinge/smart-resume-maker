import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Resume builder",
  description:
    "Fill your details in Marathi, Hindi or English, pick a template and download a clean one-page A4 PDF.",
  path: "/build",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Plans and pricing",
  description:
    "Smart Resume Maker is free to use. See what is included in the Free, Premium and Pro plans, and why no payment is needed today.",
  path: "/pricing",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

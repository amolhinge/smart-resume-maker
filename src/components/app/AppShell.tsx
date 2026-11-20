"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  FileText,
  Globe,
  Home,
  LayoutTemplate,
  Sparkles,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { languages } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "brand-gradient relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
        className,
      )}
    >
      <FileText className="h-[18px] w-[18px]" strokeWidth={2.2} />
      <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-amber-300" />
    </span>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <BrandMark />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight">Smart Resume</span>
        {!compact && (
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Maker
          </span>
        )}
      </span>
    </Link>
  );
}

export function LanguageSelect({ className }: { className?: string }) {
  const { lang, setLang } = useStore();
  return (
    <label
      className={cn(
        "relative inline-flex h-9 items-center gap-1.5 rounded-full border bg-card pl-2.5 pr-1 text-xs font-medium shadow-sm",
        className,
      )}
    >
      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
      <select
        aria-label={lang === "hi" || lang === "mr" ? "भाषा" : "Language"}
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="h-full cursor-pointer appearance-none bg-transparent pr-4 text-xs font-semibold outline-none"
      >
        {languages.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-muted-foreground" />
    </label>
  );
}

const navItems = [
  { href: "/", key: "nav.dashboard" as const, icon: Home },
  { href: "/templates", key: "nav.templates" as const, icon: LayoutTemplate },
  { href: "/pricing", key: "nav.plans" as const, icon: Wallet },
];

function DesktopNav() {
  const pathname = usePathname();
  const { lang } = useStore();
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navItems.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {lang === "en"
              ? item.key === "nav.dashboard"
                ? "Dashboard"
                : item.key === "nav.templates"
                  ? "Templates"
                  : "Plans"
              : item.key === "nav.dashboard"
                ? lang === "hi"
                  ? "डैशबोर्ड"
                  : "डॅशबोर्ड"
                : item.key === "nav.templates"
                  ? lang === "hi"
                    ? "टेम्पलेट"
                    : "टेम्पलेट्स"
                  : lang === "hi"
                    ? "प्लान"
                    : "प्लॅन"}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const { lang } = useStore();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200/70 sm:inline-flex">
            {lang === "en" ? "₹0 Free plan" : lang === "hi" ? "₹0 फ्री प्लान" : "₹0 मोफत प्लॅन"}
          </span>
          <LanguageSelect />
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { lang } = useStore();
  const labels: Record<string, string> = {
    "/": lang === "hi" ? "डैशबोर्ड" : lang === "mr" ? "डॅशबोर्ड" : "Home",
    "/templates": lang === "hi" ? "टेम्पलेट" : lang === "mr" ? "टेम्पलेट्स" : "Templates",
    "/pricing": lang === "hi" ? "प्लान" : lang === "mr" ? "प्लॅन" : "Plans",
  };
  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 px-2 pb-2 pt-2.5 text-[10.5px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                  active && "bg-secondary",
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
              </span>
              {labels[item.href]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Footer() {
  const { lang } = useStore();
  return (
    <footer className="no-print mt-12 border-t bg-card/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-8 w-8 rounded-lg" />
          <div>
            <p className="font-semibold text-foreground">Smart Resume Maker</p>
            <p className="text-xs">
              {lang === "en"
                ? "Made for Indian job seekers. Works on your phone."
                : lang === "hi"
                  ? "भारतीय जॉब सीकर्स के लिए बनाया गया। आपके फोन पर चलता है।"
                  : "भारतीय जॉब सीकर्ससाठी बनवले. तुमच्या फोनवर चालते."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <Link href="/" className="hover:text-foreground">
            {lang === "en" ? "Dashboard" : lang === "hi" ? "डैशबोर्ड" : "डॅशबोर्ड"}
          </Link>
          <Link href="/templates" className="hover:text-foreground">
            {lang === "en" ? "Templates" : lang === "hi" ? "टेम्पलेट" : "टेम्पलेट्स"}
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            {lang === "en" ? "Plans" : lang === "hi" ? "प्लान" : "प्लॅन"}
          </Link>
          <span className="text-[11px]">₹ INR</span>
        </div>
      </div>
    </footer>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-6 sm:py-8", className)}>
      {children}
    </div>
  );
}

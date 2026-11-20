"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Crown, IndianRupee, Sparkles, Star, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageContainer } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { TKey } from "@/lib/i18n";

const plans: {
  id: "free" | "premium" | "pro";
  title: TKey;
  price: TKey;
  note: TKey;
  desc: TKey;
  features: TKey[];
  icon: typeof Wallet;
  popular?: boolean;
}[] = [
  {
    id: "free",
    title: "pricing.freeTitle",
    price: "pricing.freePrice",
    note: "pricing.freeNote",
    desc: "pricing.freeDesc",
    features: ["pricing.f1", "pricing.f2", "pricing.f3", "pricing.f4", "pricing.f5", "pricing.f6"],
    icon: Wallet,
  },
  {
    id: "premium",
    title: "pricing.premiumTitle",
    price: "pricing.premiumPrice",
    note: "pricing.oneTime",
    desc: "pricing.premiumDesc",
    features: ["pricing.p1", "pricing.p2", "pricing.p3", "pricing.p4", "pricing.p5"],
    icon: Crown,
    popular: true,
  },
  {
    id: "pro",
    title: "pricing.proTitle",
    price: "pricing.proPrice",
    note: "pricing.oneTime",
    desc: "pricing.proDesc",
    features: ["pricing.pr1", "pricing.pr2", "pricing.pr3", "pricing.pr4"],
    icon: Star,
  },
];

export default function PricingPage() {
  const t = useT();

  const notify = () => {
    toast.success(t("pricing.notified"));
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold">
            <Sparkles className="mr-1 h-3 w-3" />
            {t("pricing.launch")}
          </Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("pricing.title")}</h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-3xl border bg-card p-5 shadow-sm",
                  plan.popular
                    ? "border-indigo-300 ring-2 ring-indigo-500/15 lg:-mt-2 lg:mb-2"
                    : "",
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full brand-gradient px-3 py-0.5 text-[10px] font-semibold text-white shadow">
                    {t("pricing.popular")}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  {plan.id === "free" && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      {t("pricing.current")}
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-bold">{t(plan.title)}</h2>
                <p className="mt-0.5 min-h-[34px] text-[11.5px] leading-relaxed text-muted-foreground">
                  {t(plan.desc)}
                </p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight">{t(plan.price)}</span>
                  <span className="text-[11px] font-medium text-muted-foreground">{t(plan.note)}</span>
                </div>
                <Button
                  className="mt-4 h-10 w-full rounded-xl"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={plan.id === "free"}
                  onClick={notify}
                >
                  {plan.id === "free" ? t("pricing.current") : t("pricing.notify")}
                </Button>
                <ul className="mt-4 space-y-2 border-t pt-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={3} />
                      {t(f)}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <IndianRupee className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-950">{t("pricing.noPaymentTitle")}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-emerald-900/70">
              {t("pricing.noPaymentDesc")}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold tracking-tight">{t("pricing.faqTitle")}</h2>
          <div className="mt-3 space-y-2">
            {(["q1", "q2", "q3", "q4"] as const).map((q, i) => (
              <details
                key={q}
                className="group rounded-2xl border bg-card px-4 py-3 open:shadow-sm"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-semibold">
                  {t(`pricing.${q}` as TKey)}
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  {t(`pricing.a${i + 1}` as TKey)}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <p className="text-[11.5px] text-muted-foreground">{t("pricing.footerNote")}</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">
              {t("dash.startBuilding")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PageContainer>
    </AppShell>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LayoutTemplate, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageContainer } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore, useT } from "@/lib/store";
import { getTemplate, templates } from "@/lib/templates";
import { MiniPreview } from "@/components/resume/Preview";
import { sampleResume, type TemplateId } from "@/lib/types";

const tagClass: Record<string, string> = {
  Free: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Premium: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Pro: "bg-amber-50 text-amber-700 ring-amber-200",
};

export default function TemplatesPage() {
  const t = useT();
  const router = useRouter();
  const { resumes, lang, hydrated, create } = useStore();
  const demo = React.useMemo(() => sampleResume(), []);
  const base = resumes[0] ?? demo;

  const use = (templateId: TemplateId) => {
    const r = create(templateId);
    toast.success(t("templatesPage.created"));
    router.push(`/build/${r.id}`);
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="relative overflow-hidden rounded-3xl border bg-card px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-indigo-100/60" />
          <div className="relative max-w-2xl">
            <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold">
              <LayoutTemplate className="mr-1 h-3 w-3" />
              {templates.length} {t("nav.templates")}
            </Badge>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("templatesPage.title")}
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
              {t("templatesPage.subtitle")}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-100">
              <Sparkles className="h-3 w-3" />
              {t("templatesPage.launchNote")}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => {
            const selected = resumes[0]?.templateId === tpl.id;
            const preview = { ...base, templateId: tpl.id };
            return (
              <div
                key={tpl.id}
                className="card-lift overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="relative bg-slate-100 p-2">
                  {selected && (
                    <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9.5px] font-semibold text-white shadow">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      {t("templatesPage.selected")}
                    </span>
                  )}
                  <MiniPreview
                    resume={hydrated ? preview : { ...demo, templateId: tpl.id }}
                    lang={lang}
                    scale={0.3}
                    className="h-[252px] rounded-lg bg-white ring-1 ring-slate-900/5"
                  />
                </div>
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-[15px] font-bold leading-tight">{tpl.name}</h2>
                      <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                        {tpl.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ring-1 ${tagClass[tpl.tag]}`}
                    >
                      {tpl.tag === "Free"
                        ? t("common.free")
                        : tpl.tag === "Premium"
                          ? t("common.premium")
                          : t("common.pro")}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                      <span
                        className="h-3 w-3 rounded-full ring-2 ring-white"
                        style={{ backgroundColor: getTemplate(tpl.id).accent }}
                      />
                      {tpl.tag === "Free" ? t("common.free") : tpl.tag}
                    </span>
                    <Button size="sm" className="h-8 rounded-full px-3" onClick={() => use(tpl.id)}>
                      {t("common.useTemplate")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card p-4 text-center sm:flex-row sm:text-left">
          <p className="text-[12.5px] text-muted-foreground">{t("dash.localOnlyDesc")}</p>
          <Button variant="outline" className="shrink-0 rounded-full" onClick={() => router.push("/")}>
            {t("nav.dashboard")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </PageContainer>
    </AppShell>
  );
}

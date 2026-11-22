"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Info,
  Loader2,
  Printer,
  FileQuestion,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { translate, type TKey } from "@/lib/i18n";
import { useStore, useT } from "@/lib/store";
import { missingSections } from "@/lib/types";
import type { DocMode } from "./Preview";
import { CoverLetterDocument, ResumeDocument } from "./ResumeDocument";

export function PrintView({ id, initialMode }: { id: string; initialMode: DocMode }) {
  const t = useT();
  const { hydrated, get, lang } = useStore();
  const resume = get(id);
  const [mode, setMode] = React.useState<DocMode>(initialMode);
  const printed = React.useRef(false);

  React.useEffect(() => {
    if (!resume) return;
    const name = resume.personal.fullName || resume.title || "Resume";
    document.title = `${name} — ${mode === "cover" ? t("print.cover") : t("print.resume")}`;
    return () => {
      document.title = "Smart Resume Maker — Free Resume Builder";
    };
  }, [resume, mode, t]);

  React.useEffect(() => {
    if (!hydrated || !resume || printed.current) return;
    const timer = setTimeout(() => {
      printed.current = true;
      try {
        window.print();
      } catch {
        /* printing can be blocked by the browser */
      }
    }, 1100);
    return () => clearTimeout(timer);
  }, [hydrated, resume]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center gap-2 bg-slate-100 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("print.preparing")}
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <FileQuestion className="h-10 w-10 text-slate-400" />
        <h1 className="text-lg font-bold">{t("build.notFound")}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t("build.notFoundDesc")}</p>
        <Button asChild className="mt-2 rounded-full">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            {t("build.goHome")}
          </Link>
        </Button>
      </div>
    );
  }

  const missing = mode === "cover" ? [] : missingSections(resume);
  const printCss = `@page{size:A4;margin:0}@media print{html,body{background:#fff!important;margin:0!important;padding:0!important}.no-print{display:none!important}.print-root{min-height:0!important;background:#fff!important;padding:0!important}.resume-sheet{width:calc(210mm / var(--rs-fit,1))!important;min-height:calc(296mm / var(--rs-fit,1))!important;zoom:var(--rs-fit,1);margin:0!important;box-shadow:none!important;border:0!important;border-radius:0!important;overflow:visible!important}.print-zoom{width:210mm!important;zoom:1!important}}`;

  return (
    <div className="print-root min-h-dvh bg-slate-200/80">
      <style dangerouslySetInnerHTML={{ __html: printCss }} />
      <div className="no-print sticky top-0 z-30 border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-1.5 px-2.5 sm:px-4">
          <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full px-2.5">
            <Link href={`/build/${resume.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t("print.back")}</span>
            </Link>
          </Button>
          <div className="flex min-w-0 flex-1 justify-center">
            <div className="flex rounded-full bg-muted p-0.5">
              {(["resume", "cover"] as DocMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
                    mode === m
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "resume" ? t("print.resume") : t("print.cover")}
                </button>
              ))}
            </div>
          </div>
          <a
            href={`/print/${resume.id}?doc=${mode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-1 rounded-full px-2.5 text-[11.5px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t("print.openNewTab")}
          </a>
          <Button
            type="button"
            size="sm"
            className="h-9 shrink-0 rounded-full px-3 sm:px-4"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("print.print")}</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
        <div className="mx-auto flex max-w-4xl items-center gap-1.5 px-3 pb-2 text-[10.5px] leading-snug text-muted-foreground">
          <Info className="h-3 w-3 shrink-0" />
          {t("print.tip")}
        </div>
        {missing.length > 0 && (
          <div className="mx-auto max-w-4xl px-3 pb-2">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10.5px] leading-snug text-amber-900 ring-1 ring-amber-200">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span className="font-semibold">{t("print.missing")}</span>
              <span>
                {missing
                  .map((k) => translate(lang, k as TKey))
                  .join(" · ")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center px-2 py-5 sm:px-4 sm:py-8 print:p-0">
        <div className="print-zoom w-[794px] shrink-0 shadow-[0_18px_60px_-18px_rgba(15,23,42,0.4)] ring-1 ring-black/5 print:shadow-none print:ring-0">
          {mode === "cover" ? (
            <CoverLetterDocument resume={resume} lang={lang} />
          ) : (
            <ResumeDocument resume={resume} lang={lang} />
          )}
        </div>
      </div>
    </div>
  );
}

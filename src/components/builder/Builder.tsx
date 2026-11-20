"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Eye,
  FileSignature,
  GraduationCap,
  LayoutTemplate,
  Loader2,
  Sparkles,
  User,
  X,
  BriefcaseBusiness,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LanguageSelect } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { useStore, useT } from "@/lib/store";
import { cn } from "@/lib/utils";
import { completion, type Resume } from "@/lib/types";
import { getTemplate } from "@/lib/templates";
import { ResumePreview, type DocMode } from "@/components/resume/Preview";
import type { TKey } from "@/lib/i18n";
import { PersonalForm } from "./PersonalForm";
import { EducationForm } from "./EducationForm";
import { ExperienceForm } from "./ExperienceForm";
import { SkillsForm } from "./SkillsForm";
import { CoverLetterForm } from "./CoverLetterForm";
import { DesignForm } from "./DesignForm";

const steps = [
  { id: "personal", icon: User, key: "build.personal" as TKey },
  { id: "education", icon: GraduationCap, key: "build.education" as TKey },
  { id: "experience", icon: BriefcaseBusiness, key: "build.experience" as TKey },
  { id: "skills", icon: Sparkles, key: "build.skills" as TKey },
  { id: "cover", icon: FileSignature, key: "build.coverLetter" as TKey },
  { id: "design", icon: LayoutTemplate, key: "build.design" as TKey },
] as const;

function SaveBadge() {
  const t = useT();
  const { saveState } = useStore();
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground">
      {saveState === "saving" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          {t("common.saving")}
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          {saveState === "saved" ? t("common.savedAuto") : t("build.unsaved")}
        </>
      )}
    </span>
  );
}

function BuilderSkeleton() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="h-14 border-b bg-card" />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_460px]">
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-2xl bg-slate-200/60" />
          <div className="h-96 animate-pulse rounded-2xl bg-slate-200/60" />
        </div>
        <div className="hidden h-[520px] animate-pulse rounded-2xl bg-slate-200/60 lg:block" />
      </div>
    </div>
  );
}

function PreviewTabs({
  mode,
  setMode,
}: {
  mode: DocMode;
  setMode: (m: DocMode) => void;
}) {
  const t = useT();
  return (
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
          {m === "resume" ? t("build.previewResume") : t("build.previewCover")}
        </button>
      ))}
    </div>
  );
}

export function Builder({ id }: { id: string }) {
  const t = useT();
  const router = useRouter();
  const { hydrated, get, update, flush, lang } = useStore();
  const resume = get(id);
  const [step, setStep] = React.useState(0);
  const [mode, setMode] = React.useState<DocMode>("resume");
  const [previewOpen, setPreviewOpen] = React.useState(false);

  React.useEffect(() => {
    if (previewOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [previewOpen]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const active = document.querySelector('[data-step-active="true"]');
    active?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [step]);

  if (!hydrated) return <BuilderSkeleton />;

  if (!resume) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertCircle className="h-7 w-7" />
        </span>
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

  const pct = completion(resume);
  const isLast = step === steps.length - 1;
  const meta = getTemplate(resume.templateId);

  const onChange = (patch: Partial<Resume>) => update(resume.id, patch);

  const goNext = () => {
    if (isLast) {
      flush();
      router.push(`/print/${resume.id}?doc=resume`);
    } else {
      setStep((s) => Math.min(steps.length - 1, s + 1));
    }
  };

  const download = (doc: DocMode) => {
    flush();
    router.push(`/print/${resume.id}?doc=${doc}`);
  };

  const ActiveIcon = steps[step].icon;

  return (
    <div className="min-h-dvh bg-background pb-24 lg:pb-0">
      <header className="no-print sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-1.5 px-3 sm:gap-2 sm:px-4">
          <Button asChild variant="ghost" size="icon-sm" className="shrink-0 rounded-full">
            <Link href="/" aria-label={t("common.back")}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold leading-tight sm:text-sm">
              {resume.title || t("build.titleDefault")}
            </p>
            <SaveBadge />
          </div>
          <Badge
            variant="secondary"
            className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-flex"
          >
            {meta.name}
          </Badge>
          <LanguageSelect className="h-8 px-2 [&_select]:text-[11px]" />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full lg:hidden"
            aria-label={t("build.openPreview")}
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 shrink-0 rounded-full px-3 sm:px-4"
            onClick={() => download(mode)}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("common.download")}</span>
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
          <div className="min-w-0">
            <div className="rounded-2xl border bg-card p-3 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <ActiveIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("build.step")} {step + 1} {t("common.of")} {steps.length}
                    </p>
                    <p className="text-[13px] font-bold leading-tight">{t(steps[step].key)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold leading-none text-indigo-600">{pct}%</p>
                  <p className="text-[9.5px] text-muted-foreground">{t("dash.complete")}</p>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === step;
                  const done = i < step;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-step-active={active ? "true" : "false"}
                      onClick={() => setStep(i)}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : done
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                      )}
                    >
                      {done ? <Check className="h-3 w-3" strokeWidth={3} /> : <Icon className="h-3.5 w-3.5" />}
                      {t(s.key)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div key={step} className="animate-fade-up mt-3 rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
              {step === 0 && <PersonalForm resume={resume} onChange={onChange} />}
              {step === 1 && <EducationForm resume={resume} onChange={onChange} />}
              {step === 2 && <ExperienceForm resume={resume} onChange={onChange} />}
              {step === 3 && <SkillsForm resume={resume} onChange={onChange} />}
              {step === 4 && <CoverLetterForm resume={resume} onChange={onChange} />}
              {step === 5 && <DesignForm resume={resume} onChange={onChange} />}

              <div className="mt-6 hidden items-center justify-between gap-3 border-t pt-4 sm:flex">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("common.back")}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full lg:hidden"
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                    {t("common.preview")}
                  </Button>
                  <Button type="button" className="rounded-full px-5" onClick={goNext}>
                    {isLast ? (
                      <>
                        <Download className="h-4 w-4" />
                        {t("common.download")}
                      </>
                    ) : (
                      <>
                        {t("common.next")}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[72px]">
              <div className="rounded-2xl border bg-card p-2.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 px-1 pb-2">
                  <PreviewTabs mode={mode} setMode={setMode} />
                  <div className="flex items-center gap-1">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9.5px] font-semibold text-slate-500">
                      A4
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={t("common.download")}
                      onClick={() => download(mode)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="h-[calc(100dvh-180px)] overflow-y-auto rounded-xl bg-slate-100 p-2">
                  <ResumePreview resume={resume} lang={lang} mode={mode} maxWidth={520} />
                </div>
                <p className="px-1 pt-2 text-center text-[10px] leading-relaxed text-muted-foreground">
                  {t("build.downloadHint")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-12 rounded-xl"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            aria-label={t("common.back")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 items-center justify-center gap-1">
            {steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={t(s.key)}
                onClick={() => setStep(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step ? "w-6 bg-indigo-600" : i < step ? "w-1.5 bg-emerald-400" : "w-1.5 bg-slate-200",
                )}
              />
            ))}
          </div>
          <Button type="button" className="h-11 flex-1 rounded-xl text-[14px]" onClick={goNext}>
            {isLast ? t("common.download") : t("common.next")}
            {isLast ? <Download className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {previewOpen && (
        <div className="no-print fixed inset-0 z-50 flex flex-col bg-slate-200">
          <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-2.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setPreviewOpen(false)}
              aria-label={t("common.close")}
            >
              <X className="h-4 w-4" />
            </Button>
            <PreviewTabs mode={mode} setMode={setMode} />
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              onClick={() => download(mode)}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-3">
            <ResumePreview resume={resume} lang={lang} mode={mode} />
          </div>
          <div className="shrink-0 border-t bg-background px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] text-center text-[10.5px] leading-relaxed text-muted-foreground">
            {t("build.downloadHint")}
          </div>
        </div>
      )}
    </div>
  );
}

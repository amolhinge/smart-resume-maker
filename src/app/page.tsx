"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  LayoutTemplate,
  Pencil,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageContainer } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useStore, useT } from "@/lib/store";
import { completion, type Lang, type Resume } from "@/lib/types";
import { getTemplate, templates } from "@/lib/templates";
import { MiniPreview } from "@/components/resume/Preview";

function formatDate(ts: number, lang: Lang) {
  try {
    return new Intl.DateTimeFormat(
      lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN",
      { day: "numeric", month: "short" },
    ).format(new Date(ts));
  } catch {
    return "";
  }
}

function ResumeCard({
  resume,
  lang,
  onDelete,
}: {
  resume: Resume;
  lang: Lang;
  onDelete: (r: Resume) => void;
}) {
  const t = useT();
  const router = useRouter();
  const { duplicate } = useStore();
  const pct = completion(resume);
  const meta = getTemplate(resume.templateId);

  return (
    <div className="card-lift group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => router.push(`/build/${resume.id}`)}
        className="relative block h-[214px] w-full overflow-hidden bg-slate-100 text-left"
        aria-label={t("dash.editResume")}
      >
        <MiniPreview resume={resume} lang={lang} scale={0.26} className="h-full" />
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-900/5">
          <LayoutTemplate className="h-3 w-3" />
          {meta.name}
        </span>
        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-900/5">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          {pct}%
        </span>
      </button>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold leading-tight">
              {resume.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {[resume.personal.fullName, resume.personal.jobTitle]
                .filter(Boolean)
                .join(" · ") || t("dash.emptyResume")}
            </p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10.5px] font-medium text-muted-foreground">
            {pct}% {t("dash.complete")}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2.5">
          <span className="inline-flex items-center gap-1 text-[10.5px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDate(resume.updatedAt, lang)}
          </span>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("dash.duplicateResume")}
              title={t("dash.duplicateResume")}
              onClick={() => {
                const copy = duplicate(resume.id);
                if (copy) {
                  toast.success(t("dash.duplicated"));
                  router.push(`/build/${copy.id}`);
                }
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("dash.deleteResume")}
              title={t("dash.deleteResume")}
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(resume)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="ml-1 rounded-full"
              onClick={() => router.push(`/build/${resume.id}`)}
            >
              <Pencil className="h-3.5 w-3.5" />
              {t("common.edit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const t = useT();
  const router = useRouter();
  const { resumes, lang, hydrated, create, remove } = useStore();
  const [pendingDelete, setPendingDelete] = React.useState<Resume | null>(null);
  const [showWelcome, setShowWelcome] = React.useState(true);

  const newest = resumes[0];
  const firstName =
    newest?.personal.fullName.trim().split(" ")[0] ||
    (lang === "en" ? "there" : "");

  const createNew = () => {
    const r = create("modern");
    toast.success(t("dash.created"));
    router.push(`/build/${r.id}`);
  };

  if (!hydrated) {
    return (
      <AppShell>
        <PageContainer>
          <div className="h-48 animate-pulse rounded-3xl bg-slate-200/60" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-200/60" />
            ))}
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer>
        <section className="brand-gradient relative overflow-hidden rounded-3xl px-5 py-7 text-white shadow-lg sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-16 h-48 w-48 rounded-full bg-white/5" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/20">
                <Sparkles className="h-3 w-3 text-amber-300" />
                {t("app.privacy")}
              </span>
              <h1 className="mt-3 text-[27px] font-bold leading-[1.15] tracking-tight sm:text-4xl">
                {t("dash.hello")}
                {firstName ? `, ${firstName}` : ""}
              </h1>
              <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-white/85 sm:text-sm">
                {t("dash.subtitle")}
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Button
                  onClick={createNew}
                  className="h-11 rounded-full bg-white px-5 text-[15px] font-semibold text-indigo-700 shadow-sm hover:bg-white/90"
                >
                  <Plus className="h-4 w-4" />
                  {t("dash.createResume")}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-white/30 bg-white/10 px-4 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href="/templates">
                    <LayoutTemplate className="h-4 w-4" />
                    {t("dash.viewTemplates")}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden shrink-0 lg:block">
              {newest ? (
                <div className="w-[210px] rotate-[-4deg] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10 transition-transform hover:rotate-0">
                  <MiniPreview resume={newest} lang={lang} scale={0.25} className="h-[292px] bg-white" />
                </div>
              ) : (
                <div className="flex h-[270px] w-[200px] flex-col items-center justify-center gap-2 rounded-xl bg-white/10 p-6 text-center text-xs text-white/80 ring-1 ring-white/20">
                  <FileText className="h-8 w-8" />
                  {t("dash.noResumesDesc")}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { icon: FileText, value: String(resumes.length), label: t("dash.statResumes") },
            { icon: LayoutTemplate, value: String(templates.length), label: t("dash.statTemplates") },
            { icon: Wallet, value: "₹0", label: t("dash.statPrice") },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-2xl border bg-card px-3 py-3 shadow-sm sm:gap-3 sm:px-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold leading-none">{value}</p>
                <p className="mt-1 truncate text-[10.5px] text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {showWelcome && resumes.length === 1 && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-950">{t("dash.welcomeTitle")}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-indigo-900/70">{t("dash.welcomeDesc")}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowWelcome(false)}
              className="text-xs font-semibold text-indigo-700 hover:underline"
            >
              {t("common.close")}
            </button>
          </div>
        )}

        <section className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold tracking-tight">{t("dash.getStarted")}</h2>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 rounded-full text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
              onClick={createNew}
            >
              {t("dash.startBuilding")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3.5">
            {[
              { icon: Pencil, title: t("dash.how1Title"), desc: t("dash.how1Desc") },
              { icon: LayoutTemplate, title: t("dash.how2Title"), desc: t("dash.how2Desc") },
              { icon: Download, title: t("dash.how3Title"), desc: t("dash.how3Desc") },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative rounded-2xl border bg-card p-3.5 shadow-sm sm:p-4">
                <span className="absolute right-3 top-2.5 text-[11px] font-bold tabular-nums text-slate-300">
                  0{i + 1}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-9 sm:w-9">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-2 text-[12.5px] font-semibold leading-tight sm:text-sm">{title}</p>
                <p className="mt-1 hidden text-[11.5px] leading-relaxed text-muted-foreground sm:block">
                  {desc}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[10.5px] leading-snug text-muted-foreground sm:hidden">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight">{t("dash.myResumes")}</h2>
              <p className="text-xs text-muted-foreground">
                {resumes.length}{" "}
                {lang === "en"
                  ? resumes.length === 1
                    ? "resume"
                    : "resumes"
                  : t("dash.resumes")}
              </p>
            </div>
            <Button size="sm" variant="outline" className="h-9 rounded-full bg-card" onClick={createNew}>
              <Plus className="h-4 w-4" />
              {t("common.new")}
            </Button>
          </div>

          {resumes.length === 0 ? (
            <div className="mt-3 flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <FileText className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{t("dash.noResumes")}</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">{t("dash.noResumesDesc")}</p>
              <Button className="mt-4 rounded-full" onClick={createNew}>
                <Plus className="h-4 w-4" />
                {t("dash.createFirst")}
              </Button>
            </div>
          ) : (
            <div className="mt-3 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((r) => (
                <ResumeCard key={r.id} resume={r} lang={lang} onDelete={setPendingDelete} />
              ))}
              <button
                type="button"
                onClick={createNew}
                className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-card/50 px-4 py-8 text-sm font-semibold text-muted-foreground transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-700"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Plus className="h-5 w-5" />
                </span>
                {t("dash.createResume")}
              </button>
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-3.5 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 md:col-span-2">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              {t("dash.tipTitle")}
            </h2>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {[t("dash.tip1"), t("dash.tip2"), t("dash.tip3"), t("dash.tip4")].map((tip) => (
                <li key={tip} className="flex gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-1 items-start gap-3 rounded-2xl border bg-card p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{t("dash.localOnly")}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                  {t("dash.localOnlyDesc")}
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-3 rounded-2xl border bg-card p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Smartphone className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{t("dash.planTitle")}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                  {t("dash.launchNote")}
                </p>
                <Link
                  href="/pricing"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
                >
                  {t("dash.seePlans")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dash.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("dash.deleteDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (pendingDelete) {
                  remove(pendingDelete.id);
                  toast.success(t("dash.deleted"));
                  setPendingDelete(null);
                }
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

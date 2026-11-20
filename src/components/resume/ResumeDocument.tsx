"use client";

import * as React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { translate, type TKey } from "@/lib/i18n";
import type { Lang, Resume } from "@/lib/types";
import { getTemplate } from "@/lib/templates";

interface DocProps {
  resume: Resume;
  lang: Lang;
}

const lines = (text: string) =>
  text
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

function locationOf(r: Resume) {
  return [r.personal.address, r.personal.city, r.personal.state, r.personal.pincode]
    .filter(Boolean)
    .join(", ");
}

function monthYear(value: string, lang: Lang) {
  if (!value) return "";
  const [y, m] = value.split("-");
  if (!m) return y;
  const date = new Date(Number(y), Number(m) - 1, 1);
  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  try {
    return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
  } catch {
    return y;
  }
}

function range(
  start: string,
  end: string,
  current: boolean,
  present: string,
  lang: Lang,
) {
  const from = monthYear(start, lang);
  const to = current ? present : monthYear(end, lang);
  if (!from && !to) return "";
  if (!from) return to;
  if (!to) return from;
  return `${from} — ${to}`;
}

function Contact({
  resume,
  className,
  iconClassName,
  gap = "gap-x-4 gap-y-1",
}: {
  resume: Resume;
  className?: string;
  iconClassName?: string;
  gap?: string;
}) {
  const loc = locationOf(resume);
  const items = [
    { icon: Mail, value: resume.personal.email },
    { icon: Phone, value: resume.personal.phone },
    { icon: MapPin, value: loc },
  ].filter((i) => i.value);
  if (!items.length) return null;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center text-[11.5px] leading-5 [overflow-wrap:anywhere]",
        gap,
        className,
      )}
    >
      {items.map(({ icon: Icon, value }) => (
        <span key={value} className="inline-flex items-start gap-1.5">
          <Icon className={cn("mt-[3px] shrink-0", iconClassName)} size={11} strokeWidth={1.9} />
          <span>{value}</span>
        </span>
      ))}
    </div>
  );
}

function Bullets({
  text,
  className,
  accent,
  marker = "•",
}: {
  text: string;
  className?: string;
  accent?: string;
  marker?: string;
}) {
  const items = lines(text);
  if (!items.length) return null;
  return (
    <ul className={cn("space-y-1", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span
            className="mt-[1px] shrink-0 text-[10px] leading-5"
            style={{ color: accent ?? "inherit" }}
          >
            {marker}
          </span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Pills({
  items,
  accent,
  soft,
  className,
  rounded = false,
}: {
  items: string[];
  accent: string;
  soft: string;
  className?: string;
  rounded?: boolean;
}) {
  if (!items.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((s) => (
        <span
          key={s}
          className={cn("px-2 py-[3px] text-[10.5px] font-medium leading-4", rounded ? "rounded-full" : "rounded")}
          style={{ backgroundColor: soft, color: accent }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function Avatar({
  src,
  name,
  accent,
  className,
}: {
  src?: string;
  name?: string;
  accent: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cn("shrink-0 bg-white object-cover object-top", className)}
      />
    );
  }
  const initials = (name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
  if (!initials) return null;
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center font-bold text-white", className)}
      style={{ backgroundColor: accent }}
    >
      {initials}
    </div>
  );
}

function ExpItems({
  resume,
  lang,
  accent,
  muted,
  titleClass,
  dense,
  timeline,
}: {
  resume: Resume;
  lang: Lang;
  accent: string;
  muted: string;
  titleClass?: string;
  dense?: boolean;
  timeline?: boolean;
}) {
  const t = (k: TKey) => translate(lang, k);
  return (
    <div className={dense ? "space-y-3" : "space-y-5"}>
      {resume.experience.map((e) => (
        <div key={e.id} className={cn("resume-section", timeline && "relative pl-4")}>
          {timeline && (
            <span
              className="absolute left-0 top-[7px] h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: accent }}
            />
          )}
          <div className="flex items-baseline justify-between gap-3">
            {e.role && (
              <h3 className={cn("text-[14px] font-semibold leading-[1.45]", titleClass)}>
                {e.role}
              </h3>
            )}
            {(e.startDate || e.endDate || e.current) && (
              <span className="ml-auto shrink-0 text-[11px] font-medium tabular-nums" style={{ color: muted }}>
                {range(e.startDate, e.endDate, e.current, t("common.present"), lang)}
              </span>
            )}
          </div>
          {(e.company || e.location) && (
            <p className="text-[12px] font-medium leading-[1.45]" style={{ color: accent }}>
              {[e.company, e.location].filter(Boolean).join(" · ")}
            </p>
          )}
          <Bullets text={e.description} className="mt-1.5 text-[12px] leading-[1.62]" accent={accent} />
        </div>
      ))}
    </div>
  );
}

function EduItems({
  resume,
  lang,
  accent,
  muted,
  dense,
}: {
  resume: Resume;
  lang: Lang;
  accent: string;
  muted: string;
  dense?: boolean;
}) {
  return (
    <div className={dense ? "space-y-2.5" : "space-y-4"}>
      {resume.education.map((e) => (
        <div key={e.id} className="resume-section">
          <div className="flex items-baseline justify-between gap-3">
            {e.degree && (
              <h3 className="text-[13.5px] font-semibold leading-[1.45]">{e.degree}</h3>
            )}
            {(e.startYear || e.endYear) && (
              <span className="ml-auto shrink-0 text-[11px] tabular-nums" style={{ color: muted }}>
                {[e.startYear, e.endYear].filter(Boolean).join(" — ")}
              </span>
            )}
          </div>
          {e.institution && (
            <p className="text-[12px] leading-[1.45]" style={{ color: accent }}>
              {e.institution}
            </p>
          )}
          {(e.field || e.score) && (
            <p className="mt-0.5 text-[11px] leading-[1.45]" style={{ color: muted }}>
              {[e.field, e.score].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Sheet({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("resume-sheet", className)}>{children}</div>;
}

function Name({
  resume,
  lang,
  className,
  roleClass,
}: {
  resume: Resume;
  lang: Lang;
  className?: string;
  roleClass?: string;
}) {
  const { fullName, jobTitle } = resume.personal;
  if (!fullName && !jobTitle) return null;
  return (
    <>
      {fullName && (
        <h1 className={cn("font-bold leading-[1.15]", className)}>{fullName}</h1>
      )}
      {jobTitle && (
        <p className={cn("mt-1 text-[14px] font-medium", roleClass)}>{jobTitle}</p>
      )}
    </>
  );
}

function Classic({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const a = getTemplate(resume.templateId).accent;
  const strong = "#1e293b";
  const muted = "#64748b";
  const H = ({ children }: { children: string }) => (
    <h2
      className="mb-2 border-b pb-1 text-[11px] font-bold uppercase tracking-[0.18em]"
      style={{ borderColor: "#cbd5e1", color: strong }}
    >
      {children}
    </h2>
  );
  return (
    <Sheet className="px-14 py-12">
      <header className="text-center">
        {resume.personal.photo && (
          <Avatar
            src={resume.personal.photo}
            name={resume.personal.fullName}
            accent={a}
            className="mx-auto mb-5 h-[96px] w-[96px] rounded-full border-4 border-white shadow-[0_6px_18px_rgba(15,23,42,0.16)] ring-1 ring-slate-200"
          />
        )}
        <Name resume={resume} lang={lang} className="text-[36px] tracking-tight" roleClass="uppercase tracking-[0.24em] text-[12px] text-slate-500" />
        <Contact resume={resume} className="mt-3 justify-center text-slate-600" />
      </header>
      <div className="my-5 border-t-2 border-slate-800" />
      {resume.personal.summary && (
        <section className="resume-section mb-5">
          <H>{t("resume.profile")}</H>
          <p className="text-[11.5px] leading-[1.6] text-slate-700 whitespace-pre-line">{resume.personal.summary}</p>
        </section>
      )}
      {resume.experience.length > 0 && (
        <section className="mb-5">
          <H>{t("resume.experience")}</H>
          <ExpItems resume={resume} lang={lang} accent={a} muted={muted} />
        </section>
      )}
      {resume.education.length > 0 && (
        <section className="mb-5">
          <H>{t("resume.education")}</H>
          <EduItems resume={resume} lang={lang} accent={a} muted={muted} />
        </section>
      )}
      {resume.skills.length > 0 && (
        <section className="resume-section mb-5">
          <H>{t("resume.skills")}</H>
          <p className="text-[11.5px] leading-[1.7] text-slate-700">{resume.skills.join("  ·  ")}</p>
        </section>
      )}
      {resume.achievements.length > 0 && (
        <section className="resume-section mb-5">
          <H>{t("resume.achievements")}</H>
          <ul className="space-y-1 text-[11.5px] leading-[1.55] text-slate-700">
            {resume.achievements.map((x, ai) => (
              <li key={`${x}-${ai}`} className="flex gap-2">
                <span style={{ color: a }}>•</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {resume.languagesKnown.length > 0 && (
        <section className="resume-section">
          <H>{t("resume.languages")}</H>
          <p className="text-[11.5px] text-slate-700">{resume.languagesKnown.join("  ·  ")}</p>
        </section>
      )}
    </Sheet>
  );
}

function Modern({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const meta = getTemplate(resume.templateId);
  const a = meta.accent;
  const soft = meta.soft;
  return (
    <Sheet className="flex flex-row-reverse">
      {/* Main content comes first in the DOM so ATS parsers read the name and roles before the sidebar. */}
      <div className="min-w-0 flex-1 px-9 py-11">
        <Name resume={resume} lang={lang} className="text-[34px]" roleClass="text-[14px] font-semibold" />
        <div className="mt-3 h-[3px] w-12 rounded-full" style={{ backgroundColor: a }} />
        {resume.personal.summary && (
          <section className="resume-section mt-6">
            <p className="text-[12px] leading-[1.68] text-slate-700 whitespace-pre-line">{resume.personal.summary}</p>
          </section>
        )}
        {resume.experience.length > 0 && (
          <section className="mt-7">
            <h2 className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.16em]" style={{ color: a }}>
              {t("resume.experience")}
            </h2>
            <ExpItems resume={resume} lang={lang} accent={a} muted="#64748b" />
          </section>
        )}
        {resume.education.length > 0 && (
          <section className="mt-7">
            <h2 className="mb-3 text-[11.5px] font-bold uppercase tracking-[0.16em]" style={{ color: a }}>
              {t("resume.education")}
            </h2>
            <EduItems resume={resume} lang={lang} accent={a} muted="#64748b" />
          </section>
        )}
      </div>
      <aside className="w-[255px] shrink-0 px-7 py-11" style={{ backgroundColor: soft }}>
        <Avatar
          src={resume.personal.photo}
          name={resume.personal.fullName}
          accent={a}
          className="mb-6 h-[112px] w-[112px] rounded-full border-4 border-white text-3xl shadow-[0_6px_18px_rgba(15,23,42,0.16)]"
        />
        <h2 className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: a }}>
          {t("resume.contact")}
        </h2>
        <div className="space-y-2.5 text-[11.5px] leading-[1.55] text-slate-700">
          {resume.personal.phone && (
            <div className="flex gap-2">
              <Phone size={12} className="mt-[3px] shrink-0" style={{ color: a }} />
              <span>{resume.personal.phone}</span>
            </div>
          )}
          {resume.personal.email && (
            <div className="flex gap-2">
              <Mail size={12} className="mt-[3px] shrink-0" style={{ color: a }} />
              <span className="break-all">{resume.personal.email}</span>
            </div>
          )}
          {locationOf(resume) && (
            <div className="flex gap-2">
              <MapPin size={12} className="mt-[3px] shrink-0" style={{ color: a }} />
              <span>{locationOf(resume)}</span>
            </div>
          )}
        </div>
        {resume.skills.length > 0 && (
          <>
            <h2 className="mb-2.5 mt-8 text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: a }}>
              {t("resume.skills")}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((s) => (
                <span key={s} className="rounded bg-white px-2 py-[3px] text-[10.5px] font-medium text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </>
        )}
        {resume.languagesKnown.length > 0 && (
          <>
            <h2 className="mb-2.5 mt-8 text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: a }}>
              {t("resume.languages")}
            </h2>
            <p className="text-[11px] leading-[1.7] text-slate-700">{resume.languagesKnown.join(", ")}</p>
          </>
        )}
        {resume.achievements.length > 0 && (
          <>
            <h2 className="mb-2.5 mt-8 text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: a }}>
              {t("resume.achievements")}
            </h2>
            <ul className="space-y-1.5 text-[11px] leading-[1.55] text-slate-700">
              {resume.achievements.map((x, ai) => (
                <li key={`${x}-${ai}`} className="flex gap-1.5">
                  <span style={{ color: a }}>•</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>
    </Sheet>
  );
}

function Minimal({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const a = getTemplate(resume.templateId).accent;
  const H = ({ children }: { children: string }) => (
    <h2 className="mb-2.5 flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-slate-500">
      <span className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: a }} />
      {children}
    </h2>
  );
  return (
    <Sheet className="px-16 py-14">
      <header>
        <Name resume={resume} lang={lang} className="text-[30px] font-medium tracking-tight" roleClass="mt-1 text-[12px] font-normal uppercase tracking-[0.18em] text-slate-500" />
        <Contact resume={resume} className="mt-4 text-slate-500" iconClassName="text-slate-400" gap="gap-x-5 gap-y-1" />
      </header>
      <div className="my-7 h-px bg-slate-200" />
      {resume.personal.summary && (
        <section className="resume-section mb-7">
          <p className="max-w-[560px] text-[12px] leading-[1.75] text-slate-600 whitespace-pre-line">{resume.personal.summary}</p>
        </section>
      )}
      {resume.experience.length > 0 && (
        <section className="mb-7">
          <H>{t("resume.experience")}</H>
          <ExpItems resume={resume} lang={lang} accent={a} muted="#94a3b8" />
        </section>
      )}
      {resume.education.length > 0 && (
        <section className="mb-7">
          <H>{t("resume.education")}</H>
          <EduItems resume={resume} lang={lang} accent={a} muted="#94a3b8" />
        </section>
      )}
      <div className="grid grid-cols-2 gap-8">
        {resume.skills.length > 0 && (
          <section className="resume-section">
            <H>{t("resume.skills")}</H>
            <p className="text-[11.5px] leading-[1.8] text-slate-600">{resume.skills.join(", ")}</p>
          </section>
        )}
        {resume.languagesKnown.length > 0 && (
          <section className="resume-section">
            <H>{t("resume.languages")}</H>
            <p className="text-[11.5px] leading-[1.8] text-slate-600">{resume.languagesKnown.join(", ")}</p>
          </section>
        )}
      </div>
      {resume.achievements.length > 0 && (
        <section className="resume-section mt-7">
          <H>{t("resume.achievements")}</H>
          <ul className="space-y-1.5 text-[11.5px] leading-[1.6] text-slate-600">
            {resume.achievements.map((x, ai) => (
              <li key={`${x}-${ai}`}>{x}</li>
            ))}
          </ul>
        </section>
      )}
    </Sheet>
  );
}

function Executive({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const meta = getTemplate(resume.templateId);
  const a = meta.accent;
  const H = ({ children }: { children: string }) => (
    <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: a }}>
      {children}
      <span className="mt-1.5 block h-px w-full" style={{ backgroundColor: "#e2d9d1" }} />
    </h2>
  );
  return (
    <Sheet>
      <header className="px-14 py-11 text-white" style={{ backgroundColor: "#292524" }}>
        <div className="flex items-center gap-6">
          <Avatar
            src={resume.personal.photo}
            name={resume.personal.fullName}
            accent={a}
            className="h-[104px] w-[104px] rounded-full border-2 border-white/40 text-3xl shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
          />
          <div className="min-w-0">
            {resume.personal.fullName && (
              <h1 className="text-[36px] font-semibold leading-[1.15] tracking-tight">
                {resume.personal.fullName}
              </h1>
            )}
            {resume.personal.jobTitle && (
              <p className="mt-1 text-[14px] font-medium tracking-wide text-white/75">
                {resume.personal.jobTitle}
              </p>
            )}
            <Contact resume={resume} className="mt-3 text-white/75" iconClassName="text-white/50" />
          </div>
        </div>
      </header>
      <div className="h-1.5 w-full" style={{ backgroundColor: a }} />
      <div className="px-14 py-9">
        {resume.personal.summary && (
          <section className="resume-section mb-6">
            <H>{t("resume.profile")}</H>
            <p className="text-[11.5px] leading-[1.7] text-slate-700 whitespace-pre-line">{resume.personal.summary}</p>
          </section>
        )}
        {resume.experience.length > 0 && (
          <section className="mb-6">
            <H>{t("resume.experience")}</H>
            <ExpItems resume={resume} lang={lang} accent={a} muted="#78716c" />
          </section>
        )}
        {resume.education.length > 0 && (
          <section className="mb-6">
            <H>{t("resume.education")}</H>
            <EduItems resume={resume} lang={lang} accent={a} muted="#78716c" />
          </section>
        )}
        <div className="grid grid-cols-2 gap-8">
          {resume.skills.length > 0 && (
            <section className="resume-section">
              <H>{t("resume.skills")}</H>
              <p className="text-[11.5px] leading-[1.8] text-slate-700">{resume.skills.join(", ")}</p>
            </section>
          )}
          {resume.languagesKnown.length > 0 && (
            <section className="resume-section">
              <H>{t("resume.languages")}</H>
              <p className="text-[11.5px] leading-[1.8] text-slate-700">{resume.languagesKnown.join(", ")}</p>
            </section>
          )}
        </div>
        {resume.achievements.length > 0 && (
          <section className="resume-section mt-6">
            <H>{t("resume.achievements")}</H>
            <ul className="space-y-1.5 text-[11.5px] leading-[1.6] text-slate-700">
              {resume.achievements.map((x, ai) => (
                <li key={`${x}-${ai}`} className="flex gap-2">
                  <span style={{ color: a }}>▪</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Sheet>
  );
}

function Creative({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const meta = getTemplate(resume.templateId);
  const a = meta.accent;
  const soft = meta.soft;
  const H = ({ children }: { children: string }) => (
    <h2 className="mb-2.5 flex items-center gap-2 text-[12px] font-bold" style={{ color: a }}>
      <span className="inline-block h-2 w-2 rotate-45" style={{ backgroundColor: a }} />
      {children}
    </h2>
  );
  return (
    <Sheet>
      <header className="relative overflow-hidden px-12 pb-10 pt-12" style={{ backgroundColor: soft }}>
        <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full opacity-10" style={{ backgroundColor: a }} />
        <div className="relative flex items-center gap-6">
          <Avatar
            src={resume.personal.photo}
            name={resume.personal.fullName}
            accent={a}
            className="h-[112px] w-[112px] rounded-2xl border-4 border-white text-3xl shadow-[0_6px_18px_rgba(15,23,42,0.16)]"
          />
          <div className="min-w-0">
            {resume.personal.fullName && (
              <h1 className="text-[37px] font-extrabold leading-[1.15] tracking-tight text-slate-900">
                {resume.personal.fullName}
              </h1>
            )}
            {resume.personal.jobTitle && (
              <p className="mt-1.5 inline-block rounded-full px-3 py-1 text-[12.5px] font-semibold text-white" style={{ backgroundColor: a }}>
                {resume.personal.jobTitle}
              </p>
            )}
            <Contact resume={resume} className="mt-3 text-slate-600" iconClassName="text-slate-500" />
          </div>
        </div>
      </header>
      <div className="px-12 py-9">
        {resume.personal.summary && (
          <section className="resume-section mb-6">
            <H>{t("resume.profile")}</H>
            <p className="text-[11.5px] leading-[1.7] text-slate-700 whitespace-pre-line">{resume.personal.summary}</p>
          </section>
        )}
        {resume.experience.length > 0 && (
          <section className="mb-6">
            <H>{t("resume.experience")}</H>
            <ExpItems resume={resume} lang={lang} accent={a} muted="#94a3b8" />
          </section>
        )}
        {resume.education.length > 0 && (
          <section className="mb-6">
            <H>{t("resume.education")}</H>
            <EduItems resume={resume} lang={lang} accent={a} muted="#94a3b8" />
          </section>
        )}
        {resume.skills.length > 0 && (
          <section className="resume-section mb-6">
            <H>{t("resume.skills")}</H>
            <Pills items={resume.skills} accent={a} soft={soft} rounded />
          </section>
        )}
        <div className="grid grid-cols-2 gap-8">
          {resume.achievements.length > 0 && (
            <section className="resume-section">
              <H>{t("resume.achievements")}</H>
              <ul className="space-y-1.5 text-[11px] leading-[1.55] text-slate-700">
                {resume.achievements.map((x, ai) => (
                  <li key={`${x}-${ai}`} className="flex gap-1.5">
                    <span style={{ color: a }}>•</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {resume.languagesKnown.length > 0 && (
            <section className="resume-section">
              <H>{t("resume.languages")}</H>
              <p className="text-[11.5px] leading-[1.8] text-slate-700">{resume.languagesKnown.join(", ")}</p>
            </section>
          )}
        </div>
      </div>
    </Sheet>
  );
}

function Elegant({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const meta = getTemplate(resume.templateId);
  const a = meta.accent;
  const serif =
    lang === "en"
      ? 'Georgia, "Times New Roman", serif'
      : '"Noto Sans Devanagari", "Noto Sans", sans-serif';
  const H = ({ children }: { children: string }) => (
    <div className="mb-3 text-center">
      <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.3em]" style={{ color: a }}>
        {children}
      </h2>
      <div className="mx-auto mt-1.5 flex items-center justify-center gap-1.5">
        <span className="h-px w-8" style={{ backgroundColor: "#d6c9a8" }} />
        <span className="h-1 w-1 rotate-45" style={{ backgroundColor: a }} />
        <span className="h-px w-8" style={{ backgroundColor: "#d6c9a8" }} />
      </div>
    </div>
  );
  return (
    <Sheet className="px-16 py-12">
      <header className="border-y-2 py-7 text-center" style={{ borderColor: "#d6c9a8" }}>
        {resume.personal.fullName && (
          <h1 className="text-[38px] leading-[1.2] tracking-[0.04em] text-slate-900" style={{ fontFamily: serif }}>
            {resume.personal.fullName}
          </h1>
        )}
        {resume.personal.jobTitle && (
          <p className="mt-1.5 text-[12.5px] uppercase tracking-[0.3em]" style={{ color: a }}>
            {resume.personal.jobTitle}
          </p>
        )}
        <Contact resume={resume} className="mt-3 justify-center text-slate-600" iconClassName="text-slate-400" />
      </header>
      {resume.personal.summary && (
        <section className="resume-section mt-6">
          <p className="mx-auto max-w-[580px] text-center text-[11.5px] leading-[1.75] text-slate-700 whitespace-pre-line">
            {resume.personal.summary}
          </p>
        </section>
      )}
      {resume.experience.length > 0 && (
        <section className="mt-7">
          <H>{t("resume.experience")}</H>
          <ExpItems resume={resume} lang={lang} accent={a} muted="#8a7a63" />
        </section>
      )}
      {resume.education.length > 0 && (
        <section className="mt-7">
          <H>{t("resume.education")}</H>
          <EduItems resume={resume} lang={lang} accent={a} muted="#8a7a63" />
        </section>
      )}
      <div className="mt-7 grid grid-cols-2 gap-8">
        {resume.skills.length > 0 && (
          <section className="resume-section">
            <H>{t("resume.skills")}</H>
            <p className="text-center text-[11.5px] leading-[1.8] text-slate-700">{resume.skills.join(" · ")}</p>
          </section>
        )}
        {resume.languagesKnown.length > 0 && (
          <section className="resume-section">
            <H>{t("resume.languages")}</H>
            <p className="text-center text-[11.5px] leading-[1.8] text-slate-700">{resume.languagesKnown.join(" · ")}</p>
          </section>
        )}
      </div>
      {resume.achievements.length > 0 && (
        <section className="resume-section mt-7">
          <H>{t("resume.achievements")}</H>
          <ul className="mx-auto max-w-[560px] space-y-1.5 text-center text-[11.5px] leading-[1.65] text-slate-700">
            {resume.achievements.map((x, ai) => (
              <li key={`${x}-${ai}`}>{x}</li>
            ))}
          </ul>
        </section>
      )}
    </Sheet>
  );
}

function Technical({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const meta = getTemplate(resume.templateId);
  const a = meta.accent;
  const soft = meta.soft;
  const H = ({ children }: { children: string }) => (
    <h2 className="mb-2.5 border-b border-slate-200 pb-1 text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: a }}>
      {children}
    </h2>
  );
  return (
    <Sheet>
      <header className="px-12 pb-7 pt-11">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            {resume.personal.fullName && (
              <h1 className="text-[34px] font-bold leading-[1.15] tracking-tight text-slate-900">
                {resume.personal.fullName}
              </h1>
            )}
            {resume.personal.jobTitle && (
              <p className="mt-1 text-[13.5px] font-semibold" style={{ color: a }}>
                {resume.personal.jobTitle}
              </p>
            )}
          </div>
          <div className="max-w-[300px]">
            <Contact resume={resume} className="justify-end text-right text-slate-600" iconClassName="hidden" gap="gap-y-0.5" />
          </div>
        </div>
        <div className="mt-4 h-1 w-full rounded" style={{ backgroundColor: a }} />
      </header>
      <div className="flex gap-8 px-12 pb-10">
        <div className="flex-1">
          {resume.personal.summary && (
            <section className="resume-section mb-5">
              <H>{t("resume.profile")}</H>
              <p className="text-[11.5px] leading-[1.65] text-slate-700 whitespace-pre-line">{resume.personal.summary}</p>
            </section>
          )}
          {resume.experience.length > 0 && (
            <section className="mb-5">
              <H>{t("resume.experience")}</H>
              <ExpItems resume={resume} lang={lang} accent={a} muted="#64748b" />
            </section>
          )}
          {resume.education.length > 0 && (
            <section>
              <H>{t("resume.education")}</H>
              <EduItems resume={resume} lang={lang} accent={a} muted="#64748b" />
            </section>
          )}
        </div>
        <aside className="w-[210px] shrink-0">
          {resume.skills.length > 0 && (
            <section className="resume-section mb-5 rounded-lg p-4" style={{ backgroundColor: soft }}>
              <H>{t("resume.skills")}</H>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((s) => (
                  <span key={s} className="rounded border bg-white px-1.5 py-[2px] text-[10px] font-medium text-slate-700" style={{ borderColor: "#dbeafe" }}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}
          {resume.achievements.length > 0 && (
            <section className="resume-section mb-5">
              <H>{t("resume.achievements")}</H>
              <ul className="space-y-1.5 text-[10.5px] leading-[1.55] text-slate-700">
                {resume.achievements.map((x, ai) => (
                  <li key={`${x}-${ai}`} className="flex gap-1.5">
                    <span style={{ color: a }}>›</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {resume.languagesKnown.length > 0 && (
            <section className="resume-section">
              <H>{t("resume.languages")}</H>
              <p className="text-[10.5px] leading-[1.8] text-slate-700">{resume.languagesKnown.join(", ")}</p>
            </section>
          )}
        </aside>
      </div>
    </Sheet>
  );
}

function Compact({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const a = getTemplate(resume.templateId).accent;
  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-[132px_1fr] gap-5 border-t border-slate-200 py-3.5">
      <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</h2>
      <div>{children}</div>
    </div>
  );
  return (
    <Sheet className="px-12 py-12">
      <header className="flex items-end justify-between gap-4 pb-4">
        <div className="min-w-0">
          {resume.personal.fullName && (
            <h1 className="text-[30px] font-bold leading-[1.15] tracking-tight text-slate-900">
              {resume.personal.fullName}
            </h1>
          )}
          {resume.personal.jobTitle && (
            <p className="mt-0.5 text-[13px] font-semibold" style={{ color: a }}>
              {resume.personal.jobTitle}
            </p>
          )}
        </div>
        <div className="max-w-[330px]">
          <Contact resume={resume} className="justify-end text-right text-slate-600" iconClassName="hidden" gap="gap-y-0" />
        </div>
      </header>
      {resume.personal.summary && (
        <p className="mt-1 border-y border-slate-200 py-2 text-[11px] leading-[1.6] text-slate-700 whitespace-pre-line">
          {resume.personal.summary}
        </p>
      )}
      <div className="mt-2">
        {resume.experience.length > 0 && (
          <Row label={t("resume.experience")}>
            <ExpItems resume={resume} lang={lang} accent={a} muted="#94a3b8" dense />
          </Row>
        )}
        {resume.education.length > 0 && (
          <Row label={t("resume.education")}>
            <EduItems resume={resume} lang={lang} accent={a} muted="#94a3b8" dense />
          </Row>
        )}
        {resume.skills.length > 0 && (
          <Row label={t("resume.skills")}>
            <p className="text-[11px] leading-[1.7] text-slate-700">{resume.skills.join(", ")}</p>
          </Row>
        )}
        {resume.achievements.length > 0 && (
          <Row label={t("resume.achievements")}>
            <ul className="space-y-1 text-[11px] leading-[1.5] text-slate-700">
              {resume.achievements.map((x, ai) => (
                <li key={`${x}-${ai}`}>• {x}</li>
              ))}
            </ul>
          </Row>
        )}
        {resume.languagesKnown.length > 0 && (
          <Row label={t("resume.languages")}>
            <p className="text-[11px] leading-[1.7] text-slate-700">{resume.languagesKnown.join(", ")}</p>
          </Row>
        )}
      </div>
    </Sheet>
  );
}

function Bold({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const meta = getTemplate(resume.templateId);
  const a = meta.accent;
  const soft = meta.soft;
  const H = ({ children }: { children: string }) => (
    <h2 className="mb-3 flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-wide" style={{ color: "#1c1917" }}>
      <span className="inline-block h-4 w-1.5 rounded-sm" style={{ backgroundColor: a }} />
      {children}
    </h2>
  );
  return (
    <Sheet className="px-14 py-12">
      <header>
        {resume.personal.fullName && (
          <h1 className="text-[48px] font-black leading-[1.08] tracking-tight text-slate-900">
            {resume.personal.fullName}
          </h1>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          {resume.personal.jobTitle && (
            <span className="rounded px-2.5 py-1 text-[12.5px] font-bold uppercase tracking-[0.12em] text-white" style={{ backgroundColor: a }}>
              {resume.personal.jobTitle}
            </span>
          )}
          <Contact resume={resume} className="text-slate-600" iconClassName="text-slate-400" />
        </div>
      </header>
      {resume.personal.summary && (
        <section className="resume-section mt-6 rounded-r-lg border-l-4 py-1 pl-4" style={{ borderColor: a, backgroundColor: soft }}>
          <p className="text-[11.5px] leading-[1.7] text-slate-700 whitespace-pre-line">{resume.personal.summary}</p>
        </section>
      )}
      {resume.experience.length > 0 && (
        <section className="mt-6">
          <H>{t("resume.experience")}</H>
          <ExpItems resume={resume} lang={lang} accent={a} muted="#78716c" timeline />
        </section>
      )}
      {resume.education.length > 0 && (
        <section className="mt-6">
          <H>{t("resume.education")}</H>
          <EduItems resume={resume} lang={lang} accent={a} muted="#78716c" />
        </section>
      )}
      {resume.skills.length > 0 && (
        <section className="resume-section mt-6">
          <H>{t("resume.skills")}</H>
          <Pills items={resume.skills} accent={a} soft={soft} />
        </section>
      )}
      <div className="mt-6 grid grid-cols-2 gap-8">
        {resume.achievements.length > 0 && (
          <section className="resume-section">
            <H>{t("resume.achievements")}</H>
            <ul className="space-y-1.5 text-[11px] leading-[1.55] text-slate-700">
              {resume.achievements.map((x, ai) => (
                <li key={`${x}-${ai}`} className="flex gap-1.5">
                  <span style={{ color: a }}>▪</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {resume.languagesKnown.length > 0 && (
          <section className="resume-section">
            <H>{t("resume.languages")}</H>
            <p className="text-[11px] leading-[1.8] text-slate-700">{resume.languagesKnown.join(", ")}</p>
          </section>
        )}
      </div>
    </Sheet>
  );
}

function Fresh({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const meta = getTemplate(resume.templateId);
  const a = meta.accent;
  const soft = meta.soft;
  const H = ({ children }: { children: string }) => (
    <h2 className="mb-2.5 text-[12px] font-bold text-slate-800">{children}</h2>
  );
  return (
    <Sheet className="px-11 py-11">
      <header
        className="relative overflow-hidden rounded-2xl px-8 py-8"
        style={{ backgroundImage: `linear-gradient(135deg, ${soft}, #ffffff 70%)` }}
      >
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full opacity-20" style={{ backgroundColor: a }} />
        <div className="relative flex items-center gap-5">
          <Avatar
            src={resume.personal.photo}
            name={resume.personal.fullName}
            accent={a}
            className="h-[100px] w-[100px] rounded-full border-[3px] border-white text-3xl shadow-[0_6px_18px_rgba(15,23,42,0.16)]"
          />
          <div className="min-w-0 flex-1">
            {resume.personal.fullName && (
              <h1 className="text-[34px] font-bold leading-[1.15] tracking-tight text-slate-900">
                {resume.personal.fullName}
              </h1>
            )}
            {resume.personal.jobTitle && (
              <p className="mt-0.5 text-[13.5px] font-semibold" style={{ color: a }}>
                {resume.personal.jobTitle}
              </p>
            )}
            <Contact resume={resume} className="mt-2 text-slate-600" iconClassName="text-slate-400" />
          </div>
        </div>
      </header>
      <div className="mt-6">
        {resume.personal.summary && (
          <section className="resume-section mb-5 rounded-xl border border-slate-100 p-4">
            <H>{t("resume.profile")}</H>
            <p className="text-[11.5px] leading-[1.7] text-slate-700 whitespace-pre-line">{resume.personal.summary}</p>
          </section>
        )}
        <div className="grid grid-cols-[1fr_205px] gap-5">
          <div>
            {resume.experience.length > 0 && (
              <section className="mb-5">
                <H>{t("resume.experience")}</H>
                <ExpItems resume={resume} lang={lang} accent={a} muted="#94a3b8" />
              </section>
            )}
            {resume.education.length > 0 && (
              <section>
                <H>{t("resume.education")}</H>
                <EduItems resume={resume} lang={lang} accent={a} muted="#94a3b8" />
              </section>
            )}
          </div>
          <aside>
            {resume.skills.length > 0 && (
              <section className="resume-section mb-4 rounded-xl p-4" style={{ backgroundColor: soft }}>
                <H>{t("resume.skills")}</H>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((s) => (
                    <span key={s} className="rounded-full bg-white px-2 py-[3px] text-[10px] font-medium" style={{ color: a }}>
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {resume.achievements.length > 0 && (
              <section className="resume-section mb-4 rounded-xl border border-slate-100 p-4">
                <H>{t("resume.achievements")}</H>
                <ul className="space-y-1.5 text-[10.5px] leading-[1.5] text-slate-700">
                  {resume.achievements.map((x, ai) => (
                    <li key={`${x}-${ai}`} className="flex gap-1.5">
                      <span style={{ color: a }}>+</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {resume.languagesKnown.length > 0 && (
              <section className="resume-section rounded-xl border border-slate-100 p-4">
                <H>{t("resume.languages")}</H>
                <p className="text-[10.5px] leading-[1.7] text-slate-700">{resume.languagesKnown.join(", ")}</p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </Sheet>
  );
}

const renderers: Record<string, (p: DocProps) => React.ReactElement> = {
  classic: Classic,
  modern: Modern,
  minimal: Minimal,
  executive: Executive,
  creative: Creative,
  elegant: Elegant,
  technical: Technical,
  compact: Compact,
  bold: Bold,
  fresh: Fresh,
};

export function ResumeDocument({ resume, lang }: DocProps) {
  const safe: Resume = {
    ...resume,
    skills: resume.skills.map((s) => s.trim()).filter(Boolean),
    achievements: resume.achievements.map((s) => s.trim()).filter(Boolean),
    languagesKnown: resume.languagesKnown.map((s) => s.trim()).filter(Boolean),
    education: resume.education.filter((e) =>
      [e.degree, e.institution, e.field, e.startYear, e.endYear, e.score].some(
        (v) => v.trim(),
      ),
    ),
    experience: resume.experience.filter((e) =>
      [e.role, e.company, e.location, e.startDate, e.endDate, e.description].some(
        (v) => v.trim(),
      ),
    ),
  };
  const Renderer = renderers[safe.templateId] ?? Classic;
  return <Renderer resume={safe} lang={lang} />;
}

export function CoverLetterDocument({ resume, lang }: DocProps) {
  const t = (k: TKey) => translate(lang, k);
  const meta = getTemplate(resume.templateId);
  const a = meta.accent;
  const name = resume.personal.fullName;
  const role = resume.personal.jobTitle;
  const manager = resume.coverLetter.manager;
  const salutation = manager ? `${t("resume.dear")} ${manager}` : `${t("resume.dear")} ${t("resume.hiringManager")}`;
  const subject = [resume.coverLetter.jobTitle, resume.coverLetter.company]
    .filter(Boolean)
    .join(" · ");
  const date = new Date().toLocaleDateString(
    lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const paragraphs = resume.coverLetter.body.split(/\n+/).filter(Boolean);

  return (
    <Sheet className="px-16 py-14">
      <header className="border-b-2 pb-6" style={{ borderColor: a }}>
        {name && <h1 className="text-[32px] font-bold leading-[1.2] text-slate-900">{name}</h1>}
        {role && (
          <p className="mt-0.5 text-[13.5px] font-semibold" style={{ color: a }}>
            {role}
          </p>
        )}
        <Contact resume={resume} className="mt-2.5 text-slate-600" iconClassName="text-slate-400" />
      </header>
      <div className="mt-9 text-[12.5px] leading-[1.75] text-slate-700">
        <p className="text-right text-slate-500">{date}</p>
        {(manager || resume.coverLetter.company) && (
          <div className="mt-5 space-y-0.5">
            {manager && <p className="font-semibold text-slate-900">{manager}</p>}
            {resume.coverLetter.company && <p>{resume.coverLetter.company}</p>}
          </div>
        )}
        {subject && (
          <p className="mt-5 font-semibold text-slate-900">
            {lang === "en" ? "Subject: " : ""}
            {subject}
          </p>
        )}
        <p className="mt-5">{salutation},</p>
        <div className="mt-4 space-y-3.5">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p className="text-slate-400 print:hidden">
              {lang === "en"
                ? "Your cover letter will appear here. Add the job details and tap “Generate from resume”."
                : lang === "hi"
                  ? "आपका कवर लेटर यहाँ दिखेगा। नौकरी की जानकारी भरें और “रिज़्यूमे से ड्राफ्ट बनाएं” दबाएं।"
                  : "तुमचे कव्हर लेटर येथे दिसेल. नोकरीची माहिती भरा आणि “रिझ्युमेवरून मसुदा तयार करा” दाबा."}
            </p>
          )}
        </div>
        <div className="mt-10">
          <p>{t("resume.sincerely")},</p>
          {name && <p className="mt-7 text-[14px] font-semibold text-slate-900">{name}</p>}
          {role && (
            <p className="mt-0.5 text-[12px]" style={{ color: a }}>
              {role}
            </p>
          )}
        </div>
      </div>
    </Sheet>
  );
}

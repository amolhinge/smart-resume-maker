"use client";

import * as React from "react";
import { Check, LayoutTemplate, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, useT } from "@/lib/store";
import { getTemplate, templates } from "@/lib/templates";
import type { Resume, TemplateId } from "@/lib/types";
import { MiniPreview } from "@/components/resume/Preview";
import { SectionHeading } from "./Fields";

const tagStyles: Record<string, string> = {
  Free: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Premium: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Pro: "bg-amber-50 text-amber-700 ring-amber-200",
};

function Thumb({
  resume,
  templateId,
  selected,
  onSelect,
  name,
  tag,
  tagLabel,
  lan,
}: {
  resume: Resume;
  templateId: TemplateId;
  selected: boolean;
  onSelect: () => void;
  name: string;
  tag: string;
  tagLabel: string;
  lan: "en" | "hi" | "mr";
}) {
  const preview = React.useMemo(
    () => ({ ...resume, templateId }),
    [resume, templateId],
  );
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 bg-white p-1.5 text-left transition-all",
        selected
          ? "border-indigo-500 shadow-md ring-2 ring-indigo-500/15"
          : "border-transparent bg-slate-50 hover:border-indigo-200 hover:shadow-sm",
      )}
    >
      <div className="relative overflow-hidden rounded-xl ring-1 ring-slate-900/5">
        <MiniPreview resume={preview} lang={lan} scale={0.18} className="h-[196px] bg-white" />
        {selected && (
          <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-1 py-1.5">
        <span className="text-[12.5px] font-semibold">{name}</span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[9px] font-semibold ring-1",
            tagStyles[tag] ?? tagStyles.Free,
          )}
        >
          {tagLabel}
        </span>
      </div>
    </button>
  );
}

export function DesignForm({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (patch: Partial<Resume>) => void;
}) {
  const t = useT();
  const { lang } = useStore();
  const current = getTemplate(resume.templateId);

  return (
    <div>
      <SectionHeading
        icon={<LayoutTemplate className="h-5 w-5" />}
        title={t("build.chooseTemplate")}
        description={t("build.templateHint")}
      />

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-[11.5px] font-medium text-emerald-800">
        <LockOpen className="h-3.5 w-3.5 shrink-0" />
        {t("templatesPage.launchNote")}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {templates.map((tpl) => (
          <Thumb
            key={tpl.id}
            resume={resume}
            templateId={tpl.id}
            selected={resume.templateId === tpl.id}
            onSelect={() => onChange({ templateId: tpl.id })}
            name={tpl.name}
            tag={tpl.tag}
            tagLabel={
              tpl.tag === "Free"
                ? t("common.free")
                : tpl.tag === "Premium"
                  ? t("common.premium")
                  : t("common.pro")
            }
            lan={lang}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        {t("build.currentTemplate")}: <span className="font-semibold text-foreground">{current.name}</span>
      </p>
    </div>
  );
}

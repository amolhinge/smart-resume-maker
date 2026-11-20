"use client";

import * as React from "react";
import { Award, Languages, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/store";
import type { Resume } from "@/lib/types";
import { SectionHeading } from "./Fields";

function ChipEditor({
  label,
  hint,
  placeholder,
  addLabel,
  items,
  onChange,
  icon,
}: {
  label: string;
  hint: string;
  placeholder: string;
  addLabel: string;
  items: string[];
  onChange: (next: string[]) => void;
  icon: React.ReactNode;
}) {
  const [value, setValue] = React.useState("");

  const add = () => {
    const parts = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const merged = [...items];
    for (const part of parts) {
      if (!merged.some((s) => s.toLowerCase() === part.toLowerCase())) merged.push(part);
    }
    onChange(merged);
    setValue("");
  };

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          {icon}
        </span>
        <h3 className="text-[14px] font-bold">{label}</h3>
        <span className="ml-auto text-[10.5px] text-muted-foreground">{items.length}</span>
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="h-10 rounded-xl border-slate-200 bg-white text-[15px]"
        />
        <Button type="button" size="sm" className="h-10 shrink-0 rounded-xl px-3" onClick={add}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
      {items.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-indigo-50 py-1 pl-2.5 pr-1 text-xs font-medium text-indigo-800 ring-1 ring-indigo-100"
            >
              {item}
              <button
                type="button"
                aria-label={`${label}: ${item}`}
                onClick={() => onChange(items.filter((x) => x !== item))}
                className="flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-100 hover:text-indigo-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-slate-400">{hint}</p>
      )}
    </section>
  );
}

export function SkillsForm({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (patch: Partial<Resume>) => void;
}) {
  const t = useT();
  const setAchievement = (index: number, value: string) => {
    const next = [...resume.achievements];
    next[index] = value;
    onChange({ achievements: next });
  };

  return (
    <div>
      <SectionHeading
        icon={<Sparkles className="h-5 w-5" />}
        title={t("build.skills")}
        description={t("build.skillsDesc")}
      />

      <div className="space-y-6">
        <div>
          <ChipEditor
            label={t("build.skillsLabel")}
            hint={t("build.noSkills")}
            placeholder={t("build.skillPlaceholder")}
            addLabel={t("common.add")}
            items={resume.skills}
            onChange={(skills) => onChange({ skills })}
            icon={<Sparkles className="h-3.5 w-3.5" />}
          />
          <p className="mt-1.5 text-[11px] text-slate-400">{t("build.skillsHint")}</p>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Award className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-[14px] font-bold">{t("build.achievementsLabel")}</h3>
          </div>
          <div className="space-y-2">
            {resume.achievements.length === 0 && (
              <p className="text-[11px] text-slate-400">{t("build.noAchievements")}</p>
            )}
            {resume.achievements.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <Textarea
                  rows={2}
                  value={item}
                  onChange={(e) => setAchievement(i, e.target.value)}
                  placeholder={t("build.achievementPlaceholder")}
                  className="min-h-[52px] flex-1 resize-y rounded-xl border-slate-200 bg-white py-2 text-[14px]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mt-1 text-slate-400 hover:bg-red-50 hover:text-destructive"
                  onClick={() =>
                    onChange({ achievements: resume.achievements.filter((_, idx) => idx !== i) })
                  }
                  aria-label={t("common.remove")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 h-9 w-full rounded-xl border-dashed border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50"
            onClick={() => onChange({ achievements: [...resume.achievements, ""] })}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("build.addAchievement")}
          </Button>
          <p className="mt-1.5 text-[11px] text-slate-400">{t("build.achievementsHint")}</p>
        </div>

        <div>
          <ChipEditor
            label={t("build.languagesLabel")}
            hint={t("build.languagesHint")}
            placeholder={t("build.languagePlaceholder")}
            addLabel={t("common.add")}
            items={resume.languagesKnown}
            onChange={(languagesKnown) => onChange({ languagesKnown })}
            icon={<Languages className="h-3.5 w-3.5" />}
          />
          <p className="mt-1.5 text-[11px] text-slate-400">{t("build.languagesHint")}</p>
        </div>
      </div>
    </div>
  );
}

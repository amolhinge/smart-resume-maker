"use client";

import * as React from "react";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useT } from "@/lib/store";
import { emptyExperience, type ExperienceItem, type Resume } from "@/lib/types";
import { AreaField, Field, ItemCard, SectionHeading, TextField } from "./Fields";

export function ExperienceForm({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (patch: Partial<Resume>) => void;
}) {
  const t = useT();
  const setItem = (id: string, patch: Partial<ExperienceItem>) =>
    onChange({
      experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });

  return (
    <div>
      <SectionHeading
        icon={<BriefcaseBusiness className="h-5 w-5" />}
        title={t("build.experience")}
        description={t("build.experienceDesc")}
      />

      <div className="space-y-3">
        {resume.experience.length === 0 && (
          <p className="rounded-xl border border-dashed bg-slate-50 p-4 text-center text-xs text-muted-foreground">
            {t("build.noExperience")}
          </p>
        )}
        {resume.experience.map((e, i) => (
          <ItemCard
            key={e.id}
            index={i + 1}
            title={t("build.experience")}
            removeLabel={t("common.remove")}
            onRemove={() =>
              onChange({ experience: resume.experience.filter((x) => x.id !== e.id) })
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label={t("build.role")}
                value={e.role}
                onChange={(ev) => setItem(e.id, { role: ev.target.value })}
                placeholder="Software Engineer"
              />
              <TextField
                label={t("build.company")}
                value={e.company}
                onChange={(ev) => setItem(e.id, { company: ev.target.value })}
                placeholder="TechSarthi Solutions"
              />
            </div>
            <TextField
              label={t("build.location")}
              optional={`(${t("common.optional")})`}
              value={e.location}
              onChange={(ev) => setItem(e.id, { location: ev.target.value })}
              placeholder="Pune"
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("build.startDate")}>
                <input
                  type="month"
                  value={e.startDate}
                  onChange={(ev) => setItem(e.id, { startDate: ev.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[15px] text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                />
              </Field>
              <Field label={t("build.endDate")}>
                <input
                  type="month"
                  value={e.endDate}
                  disabled={e.current}
                  onChange={(ev) => setItem(e.id, { endDate: ev.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[15px] text-slate-700 outline-none disabled:bg-slate-100 disabled:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                />
              </Field>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`current-${e.id}`}
                checked={e.current}
                onCheckedChange={(v) =>
                  setItem(e.id, {
                    current: v === true,
                    endDate: v === true ? "" : e.endDate,
                  })
                }
              />
              <label
                htmlFor={`current-${e.id}`}
                className="cursor-pointer select-none text-[12.5px] font-medium text-slate-600"
              >
                {t("build.current")}
              </label>
            </div>
            <AreaField
              label={t("build.description")}
              hint={t("build.descriptionHint")}
              rows={4}
              value={e.description}
              onChange={(ev) => setItem(e.id, { description: ev.target.value })}
              placeholder={
                "Built a dashboard used by 40,000 users\nImproved load time by 45%\nMentored 2 junior developers"
              }
            />
          </ItemCard>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full rounded-xl border-dashed border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50"
        onClick={() => onChange({ experience: [...resume.experience, emptyExperience()] })}
      >
        <Plus className="h-4 w-4" />
        {t("build.addExperience")}
      </Button>
    </div>
  );
}

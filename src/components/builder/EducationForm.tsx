"use client";

import * as React from "react";
import { GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/store";
import { emptyEducation, type EducationItem, type Resume } from "@/lib/types";
import { ItemCard, SectionHeading, TextField } from "./Fields";

export function EducationForm({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (patch: Partial<Resume>) => void;
}) {
  const t = useT();
  const setItem = (id: string, patch: Partial<EducationItem>) =>
    onChange({
      education: resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });

  return (
    <div>
      <SectionHeading
        icon={<GraduationCap className="h-5 w-5" />}
        title={t("build.education")}
        description={t("build.educationDesc")}
      />

      <div className="space-y-3">
        {resume.education.length === 0 && (
          <p className="rounded-xl border border-dashed bg-slate-50 p-4 text-center text-xs text-muted-foreground">
            {t("build.noEducation")}
          </p>
        )}
        {resume.education.map((e, i) => (
          <ItemCard
            key={e.id}
            index={i + 1}
            title={t("build.education")}
            removeLabel={t("common.remove")}
            onRemove={() =>
              onChange({ education: resume.education.filter((x) => x.id !== e.id) })
            }
          >
            <TextField
              label={t("build.degree")}
              value={e.degree}
              onChange={(ev) => setItem(e.id, { degree: ev.target.value })}
              placeholder={t("build.degreeHint")}
            />
            <TextField
              label={t("build.institution")}
              value={e.institution}
              onChange={(ev) => setItem(e.id, { institution: ev.target.value })}
              placeholder="Savitribai Phule Pune University"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label={t("build.field")}
                value={e.field}
                onChange={(ev) => setItem(e.id, { field: ev.target.value })}
                placeholder="Computer Science"
              />
              <TextField
                label={t("build.score")}
                value={e.score}
                onChange={(ev) => setItem(e.id, { score: ev.target.value })}
                placeholder="8.2 CGPA / 82%"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label={t("build.startYear")}
                inputMode="numeric"
                value={e.startYear}
                onChange={(ev) =>
                  setItem(e.id, { startYear: ev.target.value.replace(/[^\d]/g, "").slice(0, 4) })
                }
                placeholder="2019"
              />
              <TextField
                label={t("build.endYear")}
                inputMode="numeric"
                value={e.endYear}
                onChange={(ev) =>
                  setItem(e.id, { endYear: ev.target.value.replace(/[^\d]/g, "").slice(0, 4) })
                }
                placeholder="2023"
              />
            </div>
          </ItemCard>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full rounded-xl border-dashed border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50"
        onClick={() => onChange({ education: [...resume.education, emptyEducation()] })}
      >
        <Plus className="h-4 w-4" />
        {t("build.addEducation")}
      </Button>
    </div>
  );
}

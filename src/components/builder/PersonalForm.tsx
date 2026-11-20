"use client";

import * as React from "react";
import { Camera, ImagePlus, User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/store";
import type { PersonalInfo, Resume } from "@/lib/types";
import { AreaField, Field, SectionHeading, TextField } from "./Fields";

async function shrinkPhoto(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("decode-failed"));
    image.src = dataUrl;
  });
  const max = 420;
  const ratio = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * ratio));
  const h = Math.max(1, Math.round(img.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.86);
}

export function PersonalForm({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (patch: Partial<Resume>) => void;
}) {
  const t = useT();
  const p = resume.personal;
  const [busy, setBusy] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const set = (patch: Partial<PersonalInfo>) =>
    onChange({ personal: { ...p, ...patch } });

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("build.photoError"));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("build.photoBig"));
      return;
    }
    setBusy(true);
    try {
      const photo = await shrinkPhoto(file);
      set({ photo });
      toast.success(t("build.photoAdded"));
    } catch {
      toast.error(t("build.photoError"));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const initials = (p.fullName || "Y")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div>
      <SectionHeading
        icon={<User className="h-5 w-5" />}
        title={t("build.personal")}
        description={t("build.personalDesc")}
      />

      <TextField
        label={t("build.resumeTitle")}
        hint={t("build.resumeTitleHint")}
        value={resume.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder={t("build.titleDefault")}
        className="mb-4"
      />

      <div className="mb-4 flex items-center gap-3.5 rounded-2xl border bg-slate-50/60 p-3.5">
        <div className="relative h-[72px] w-[72px] shrink-0">
          {p.photo ? (
            <img
              src={p.photo}
              alt={t("build.photo")}
              className="h-[72px] w-[72px] rounded-2xl object-cover ring-2 ring-white shadow-sm"
            />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-secondary text-xl font-bold text-secondary-foreground">
              {initials}
            </div>
          )}
          {p.photo && (
            <button
              type="button"
              aria-label={t("build.removePhoto")}
              onClick={() => set({ photo: "" })}
              className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-destructive shadow ring-1 ring-black/5"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-slate-700">{t("build.photo")}</p>
          <p className="text-[10.5px] leading-relaxed text-slate-400">{t("build.photoHint")}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-full bg-white text-xs"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              {p.photo ? <Camera className="h-3.5 w-3.5" /> : <ImagePlus className="h-3.5 w-3.5" />}
              {busy ? t("common.loading") : p.photo ? t("build.changePhoto") : t("build.uploadPhoto")}
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <TextField
          label={t("build.fullName")}
          value={p.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
          placeholder={t("build.namePlaceholder")}
          autoComplete="name"
        />
        <TextField
          label={t("build.jobTitle")}
          value={p.jobTitle}
          onChange={(e) => set({ jobTitle: e.target.value })}
          placeholder={t("build.rolePlaceholder")}
        />
        <TextField
          label={t("build.email")}
          type="email"
          inputMode="email"
          value={p.email}
          onChange={(e) => set({ email: e.target.value })}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <TextField
          label={t("build.phone")}
          type="tel"
          inputMode="tel"
          value={p.phone}
          onChange={(e) => set({ phone: e.target.value })}
          placeholder="+91 98765 43210"
          autoComplete="tel"
        />
      </div>

      <div className="mt-3.5">
        <TextField
          label={t("build.address")}
          value={p.address}
          onChange={(e) => set({ address: e.target.value })}
          placeholder="12, Shivaji Nagar"
          autoComplete="street-address"
        />
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5">
        <TextField
          label={t("build.city")}
          value={p.city}
          onChange={(e) => set({ city: e.target.value })}
          placeholder="Pune"
        />
        <TextField
          label={t("build.state")}
          value={p.state}
          onChange={(e) => set({ state: e.target.value })}
          placeholder="Maharashtra"
        />
        <TextField
          label={t("build.pincode")}
          inputMode="numeric"
          value={p.pincode}
          onChange={(e) => set({ pincode: e.target.value.replace(/[^\d]/g, "").slice(0, 6) })}
          placeholder="411005"
        />
        <Field label={t("build.dob")} optional={`(${t("common.optional")})`}>
          <input
            type="date"
            value={p.dob}
            onChange={(e) => set({ dob: e.target.value })}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[15px] text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
          />
        </Field>
      </div>

      <div className="mt-3.5">
        <AreaField
          label={t("build.summary")}
          hint={t("build.summaryHint")}
          rows={4}
          maxLength={800}
          value={p.summary}
          onChange={(e) => set({ summary: e.target.value })}
          placeholder={t("build.summaryHint")}
        />
        <p className="mt-1 text-right text-[10.5px] text-slate-400">
          {p.summary.length} / 800 {t("common.chars")}
        </p>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Download, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
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
import {
  BackupError,
  backupFilename,
  backupToJson,
  createBackup,
  parseBackup,
} from "@/lib/backup";
import type { Resume } from "@/lib/types";

export function BackupCard() {
  const { resumes, lang, restore, setLang } = useStore();
  const t = useT();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [pending, setPending] = React.useState<Resume[] | null>(null);
  const [confirmReplace, setConfirmReplace] = React.useState(false);

  const handleExport = React.useCallback(() => {
    if (resumes.length === 0) {
      toast.error(t("backup.empty"));
      return;
    }
    const json = backupToJson(createBackup(resumes, lang));
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = backupFilename();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success(t("backup.exported"));
  }, [resumes, lang, t]);

  const handleFile = React.useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setBusy(true);
      try {
        const text = await file.text();
        const result = parseBackup(text);
        if (result.lang) setLang(result.lang);
        setPending(result.resumes);
      } catch (error) {
        if (error instanceof BackupError) {
          const key =
            error.code === "not-json"
              ? "backup.notJson"
              : error.code === "no-resumes" || error.code === "too-many"
                ? "backup.empty"
                : "backup.invalid";
          toast.error(t(key));
        } else {
          toast.error(t("backup.failed"));
        }
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [setLang, t],
  );

  const apply = React.useCallback(
    (mode: "merge" | "replace") => {
      if (!pending) return;
      const result = restore(pending, mode);
      toast.success(
        mode === "replace"
          ? t("backup.restored")
          : `${t("backup.restored")} · ${result.added + result.updated}/${result.total}`,
      );
      setPending(null);
      setConfirmReplace(false);
    },
    [pending, restore, t],
  );

  return (
    <section className="mt-8 rounded-2xl border bg-card p-5">
      <h2 className="flex items-center gap-2 text-base font-bold">
        <Download className="h-4 w-4 text-indigo-600" />
        {t("backup.title")}
      </h2>
      <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
        {t("backup.desc")}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="rounded-full" onClick={handleExport}>
          <Download className="h-4 w-4" />
          {t("backup.export")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {t("backup.import")}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
      </div>

      <AlertDialog
        open={pending !== null && !confirmReplace}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("backup.restoreTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.length ?? 0} {t("dash.statResumes")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <Button variant="outline" onClick={() => apply("merge")}>
              {t("backup.merge")}
            </Button>
            <Button variant="destructive" onClick={() => setConfirmReplace(true)}>
              {t("backup.replace")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmReplace} onOpenChange={setConfirmReplace}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("backup.replaceTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("backup.replaceDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmReplace(false)}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => apply("replace")}
            >
              {t("backup.replace")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

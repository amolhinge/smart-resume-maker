import { sanitizeResume, type Lang, type Resume } from "./types";
import { templates } from "./templates";

export const BACKUP_APP_ID = "smart-resume-maker";
export const BACKUP_VERSION = 1;
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
export const MAX_BACKUP_RESUMES = 200;

const MAX_STRING = 20000;

export interface BackupFile {
  app: typeof BACKUP_APP_ID;
  version: number;
  exportedAt: string;
  lang: Lang;
  resumes: Resume[];
}

export type BackupErrorCode =
  | "not-json"
  | "not-backup"
  | "no-resumes"
  | "too-big"
  | "too-many"
  | "invalid";

export class BackupError extends Error {
  code: BackupErrorCode;
  constructor(code: BackupErrorCode, message = code) {
    super(message);
    this.name = "BackupError";
    this.code = code;
  }
}

const templateIds = new Set(templates.map((t) => t.id));

export function createBackup(resumes: Resume[], lang: Lang): BackupFile {
  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    lang,
    resumes: resumes.map((r) => sanitizeResume(r)),
  };
}

export function backupToJson(backup: BackupFile): string {
  return JSON.stringify(backup, null, 2);
}

export function backupFilename(date = new Date()): string {
  const iso = date.toISOString().slice(0, 10);
  return `smart-resume-maker-backup-${iso}.json`;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Parses and validates an exported backup. Never throws raw errors — callers
 * catch `BackupError` and show a translated message. Only known fields survive
 * (everything is rebuilt through `sanitizeResume`), so a hostile or malformed
 * file cannot inject unexpected keys into app state.
 */
export function parseBackup(text: string): { resumes: Resume[]; lang: Lang } {
  if (typeof text !== "string" || !text.trim()) {
    throw new BackupError("invalid");
  }
  if (new Blob([text]).size > MAX_BACKUP_BYTES) {
    throw new BackupError("too-big");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new BackupError("not-json");
  }

  let list: unknown;
  let lang: Lang = "en";

  if (Array.isArray(raw)) {
    list = raw;
  } else if (isPlainObject(raw)) {
    if (raw.app !== undefined && raw.app !== BACKUP_APP_ID) {
      throw new BackupError("not-backup");
    }
    if (raw.version !== undefined) {
      const version = Number(raw.version);
      if (!Number.isFinite(version) || version < 1 || version > BACKUP_VERSION) {
        throw new BackupError("invalid");
      }
    }
    if (raw.lang === "hi" || raw.lang === "mr" || raw.lang === "en") {
      lang = raw.lang;
    }
    list = raw.resumes;
  } else {
    throw new BackupError("not-backup");
  }

  if (!Array.isArray(list)) throw new BackupError("no-resumes");
  if (list.length > MAX_BACKUP_RESUMES) throw new BackupError("too-many");

  const byId = new Map<string, Resume>();
  for (const entry of list) {
    if (!isPlainObject(entry)) throw new BackupError("invalid");

    const candidate = sanitizeResume(entry as unknown as Resume);
    if (candidate.templateId && !templateIds.has(candidate.templateId)) {
      candidate.templateId = "classic";
    }
    if (!candidate.language || !["en", "hi", "mr"].includes(candidate.language)) {
      candidate.language = "en";
    }

    const clamp = (value: string) => value.slice(0, MAX_STRING);
    candidate.title = clamp(candidate.title);
    candidate.personal.fullName = clamp(candidate.personal.fullName);
    candidate.personal.summary = clamp(candidate.personal.summary);
    candidate.personal.address = clamp(candidate.personal.address);
    candidate.coverLetter.body = clamp(candidate.coverLetter.body);

    byId.set(candidate.id, candidate);
  }

  if (byId.size === 0) throw new BackupError("no-resumes");

  return {
    resumes: Array.from(byId.values()).sort(
      (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0),
    ),
    lang,
  };
}

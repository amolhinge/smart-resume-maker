"use client";

import * as React from "react";
import {
  createResume,
  newId,
  sampleResume,
  type Lang,
  type Resume,
  type TemplateId,
} from "./types";
import { translate, type TKey } from "./i18n";

const STORAGE_KEY = "smart-resume-maker:v1";

type SaveState = "idle" | "saving" | "saved";

interface Persisted {
  resumes: Resume[];
  lang: Lang;
}

interface StoreValue {
  resumes: Resume[];
  lang: Lang;
  hydrated: boolean;
  saveState: SaveState;
  setLang: (lang: Lang) => void;
  create: (templateId?: TemplateId, title?: string) => Resume;
  update: (id: string, patch: Partial<Resume>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => Resume | null;
  get: (id: string) => Resume | undefined;
  flush: () => void;
}

const StoreContext = React.createContext<StoreValue | null>(null);

function normalize(raw: unknown): Persisted | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Partial<Persisted>;
  if (!Array.isArray(data.resumes)) return null;
  const lang: Lang = data.lang === "hi" || data.lang === "mr" ? data.lang : "en";
  const resumes = data.resumes
    .filter((r): r is Resume => Boolean(r && typeof r.id === "string"))
    .map((r) => ({
      ...r,
      personal: r.personal ?? {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        dob: "",
        summary: "",
        photo: "",
      },
      education: Array.isArray(r.education) ? r.education : [],
      experience: Array.isArray(r.experience) ? r.experience : [],
      skills: Array.isArray(r.skills) ? r.skills : [],
      achievements: Array.isArray(r.achievements) ? r.achievements : [],
      languagesKnown: Array.isArray(r.languagesKnown) ? r.languagesKnown : [],
      coverLetter: r.coverLetter ?? {
        jobTitle: "",
        company: "",
        manager: "",
        body: "",
      },
    }));
  return { resumes, lang };
}

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resumes, setResumes] = React.useState<Resume[]>([]);
  const [lang, setLangState] = React.useState<Lang>("en");
  const [hydrated, setHydrated] = React.useState(false);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    let next: Persisted = { resumes: [sampleResume()], lang: "en" };
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = normalize(JSON.parse(raw));
        if (parsed) next = parsed;
        else next = { resumes: [], lang: "en" };
      }
    } catch {
      next = { resumes: [], lang: "en" };
    }
    setResumes(next.resumes);
    setLangState(next.lang);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = lang;
  }, [lang, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    setSaveState("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ resumes, lang }),
        );
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [resumes, lang, hydrated]);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  const create = React.useCallback(
    (templateId: TemplateId = "classic", title?: string) => {
      const resume = createResume(
        templateId,
        lang,
        title || translate(lang, "build.titleDefault"),
      );
      setResumes((prev) => [resume, ...prev]);
      return resume;
    },
    [lang],
  );

  const update = React.useCallback((id: string, patch: Partial<Resume>) => {
    setResumes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, ...patch, updatedAt: Date.now() } : r,
      ),
    );
  }, []);

  const remove = React.useCallback((id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const duplicate = React.useCallback(
    (id: string) => {
      const source = resumes.find((r) => r.id === id);
      if (!source) return null;
      const copy: Resume = {
        ...structuredClone(source),
        id: newId(),
        title: `${source.title} (${translate(lang, "common.duplicate")})`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setResumes((prev) => [copy, ...prev]);
      return copy;
    },
    [resumes, lang],
  );

  const get = React.useCallback(
    (id: string) => resumes.find((r) => r.id === id),
    [resumes],
  );

  const flush = React.useCallback(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ resumes, lang }),
      );
      setSaveState("saved");
    } catch {
      /* storage full or blocked */
    }
  }, [resumes, lang]);

  React.useEffect(() => {
    if (!hydrated) return;
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", onHide);
    };
  }, [flush, hydrated]);

  const value: StoreValue = {
    resumes,
    lang,
    hydrated,
    saveState,
    setLang,
    create,
    update,
    remove,
    duplicate,
    get,
    flush,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside ResumeProvider");
  return ctx;
}

export function useT() {
  const { lang } = useStore();
  return React.useCallback(
    (key: TKey, vars?: Record<string, string | number>) =>
      translate(lang, key, vars),
    [lang],
  );
}

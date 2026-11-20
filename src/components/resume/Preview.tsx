"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Lang, Resume } from "@/lib/types";
import { CoverLetterDocument, ResumeDocument } from "./ResumeDocument";

export type DocMode = "resume" | "cover";

const A4_WIDTH = 794;

export function ResumePreview({
  resume,
  lang,
  mode = "resume",
  className,
  maxWidth = 760,
}: {
  resume: Resume;
  lang: Lang;
  mode?: DocMode;
  className?: string;
  maxWidth?: number;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.5);
  const [height, setHeight] = React.useState(1123);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const measure = () => {
      const available = Math.min(wrap.clientWidth, maxWidth);
      const next = Math.max(0.2, Math.min(1, available / A4_WIDTH));
      setScale(next);
      setHeight(inner.scrollHeight || 1123);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [maxWidth, mode, resume.templateId]);

  return (
    <div ref={wrapRef} className={cn("w-full", className)}>
      <div style={{ height: height * scale }} className="relative w-full">
        <div
          className="absolute left-1/2 top-0 origin-top"
          style={{
            transform: `translateX(-50%) scale(${scale})`,
          }}
        >
          <div ref={innerRef} className="shadow-[0_10px_40px_-12px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5">
            {mode === "cover" ? (
              <CoverLetterDocument resume={resume} lang={lang} />
            ) : (
              <ResumeDocument resume={resume} lang={lang} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MiniPreview({
  resume,
  lang,
  mode = "resume",
  scale = 0.24,
  className,
}: {
  resume: Resume;
  lang: Lang;
  mode?: DocMode;
  scale?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-slate-100", className)}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div
          className="origin-top shrink-0"
          style={{ width: A4_WIDTH, transform: `scale(${scale})` }}
        >
          {mode === "cover" ? (
            <CoverLetterDocument resume={resume} lang={lang} />
          ) : (
            <ResumeDocument resume={resume} lang={lang} />
          )}
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-100 to-transparent"
      />
    </div>
  );
}


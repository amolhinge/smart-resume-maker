"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const inputClass =
  "h-11 rounded-xl border-slate-200 bg-white px-3 text-[15px] shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500/30";

export function Field({
  label,
  hint,
  optional,
  children,
  className,
}: {
  label: string;
  hint?: string;
  optional?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] font-semibold text-slate-700">{label}</span>
        {optional && <span className="text-[10.5px] text-slate-400">{optional}</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">{hint}</span>}
    </label>
  );
}

type InputProps = React.ComponentProps<typeof Input>;

export function TextField({
  label,
  hint,
  optional,
  className,
  ...props
}: InputProps & { label: string; hint?: string; optional?: string }) {
  return (
    <Field label={label} hint={hint} optional={optional} className={className}>
      <Input className={inputClass} {...props} />
    </Field>
  );
}

export function AreaField({
  label,
  hint,
  optional,
  className,
  rows = 5,
  ...props
}: React.ComponentProps<typeof Textarea> & {
  label: string;
  hint?: string;
  optional?: string;
}) {
  return (
    <Field label={label} hint={hint} optional={optional} className={className}>
      <Textarea rows={rows} className={cn(inputClass, "h-auto min-h-24 resize-y py-2.5")} {...props} />
    </Field>
  );
}

export function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
        {icon}
      </span>
      <div>
        <h2 className="text-[17px] font-bold leading-tight tracking-tight">{title}</h2>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function ItemCard({
  index,
  title,
  onRemove,
  removeLabel,
  children,
}: {
  index: number;
  title: string;
  onRemove?: () => void;
  removeLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-slate-50/60 p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title} {index}
        </span>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onRemove}
            className="text-slate-400 hover:bg-red-50 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {removeLabel}
          </Button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

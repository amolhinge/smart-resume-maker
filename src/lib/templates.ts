import type { TemplateId } from "./types";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  tag: "Free" | "Premium" | "Pro";
  accent: string;
  soft: string;
  description: string;
}

export const templates: TemplateMeta[] = [
  {
    id: "classic",
    name: "Classic",
    tag: "Free",
    accent: "#1e293b",
    soft: "#f1f5f9",
    description: "Timeless single-column layout trusted by recruiters.",
  },
  {
    id: "modern",
    name: "Modern",
    tag: "Free",
    accent: "#4f46e5",
    soft: "#eef2ff",
    description: "Clean accent sidebar with photo and key skills.",
  },
  {
    id: "minimal",
    name: "Minimal",
    tag: "Free",
    accent: "#0f766e",
    soft: "#f0fdfa",
    description: "Lots of white space. Calm, readable and precise.",
  },
  {
    id: "executive",
    name: "Executive",
    tag: "Free",
    accent: "#7c2d12",
    soft: "#fdf7f3",
    description: "A confident dark header for senior roles.",
  },
  {
    id: "creative",
    name: "Creative",
    tag: "Premium",
    accent: "#be185d",
    soft: "#fdf2f8",
    description: "A warm colour block for design and marketing.",
  },
  {
    id: "elegant",
    name: "Elegant",
    tag: "Premium",
    accent: "#854d0e",
    soft: "#fefce8",
    description: "Centred serif headings with fine gold rules.",
  },
  {
    id: "technical",
    name: "Technical",
    tag: "Premium",
    accent: "#1d4ed8",
    soft: "#eff6ff",
    description: "Two-column engineering layout with skill grid.",
  },
  {
    id: "compact",
    name: "Compact",
    tag: "Premium",
    accent: "#334155",
    soft: "#f8fafc",
    description: "Fits a long career on a single page.",
  },
  {
    id: "bold",
    name: "Bold",
    tag: "Pro",
    accent: "#c2410c",
    soft: "#fff7ed",
    description: "Big name, strong rules and a timeline feel.",
  },
  {
    id: "fresh",
    name: "Fresh",
    tag: "Pro",
    accent: "#047857",
    soft: "#ecfdf5",
    description: "Soft gradient header for students and freshers.",
  },
];

export const getTemplate = (id: TemplateId | string) =>
  templates.find((t) => t.id === id) ?? templates[0];

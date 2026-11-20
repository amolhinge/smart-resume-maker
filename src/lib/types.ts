export type Lang = "en" | "hi" | "mr";

export type TemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "creative"
  | "elegant"
  | "technical"
  | "compact"
  | "bold"
  | "fresh";

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dob: string;
  summary: string;
  photo: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startYear: string;
  endYear: string;
  score: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CoverLetter {
  jobTitle: string;
  company: string;
  manager: string;
  body: string;
}

export interface Resume {
  id: string;
  title: string;
  templateId: TemplateId;
  language: Lang;
  createdAt: number;
  updatedAt: number;
  personal: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  achievements: string[];
  languagesKnown: string[];
  coverLetter: CoverLetter;
}

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const emptyPersonal = (): PersonalInfo => ({
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
});

export const emptyEducation = (): EducationItem => ({
  id: newId(),
  degree: "",
  institution: "",
  field: "",
  startYear: "",
  endYear: "",
  score: "",
});

export const emptyExperience = (): ExperienceItem => ({
  id: newId(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

export function createResume(
  templateId: TemplateId = "classic",
  language: Lang = "en",
  title = "Untitled Resume",
): Resume {
  const now = Date.now();
  return {
    id: newId(),
    title,
    templateId,
    language,
    createdAt: now,
    updatedAt: now,
    personal: emptyPersonal(),
    education: [emptyEducation()],
    experience: [],
    skills: [],
    achievements: [],
    languagesKnown: [],
    coverLetter: { jobTitle: "", company: "", manager: "", body: "" },
  };
}

export function sampleResume(): Resume {
  const r = createResume("modern", "en", "Sample Resume");
  r.personal = {
    fullName: "Aarav Kulkarni",
    jobTitle: "Software Engineer",
    email: "aarav.kulkarni@example.com",
    phone: "+91 98765 43210",
    address: "12, Shivaji Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
    dob: "1998-04-12",
    summary:
      "Software engineer with 4+ years of experience building reliable web applications. Skilled in React, Node.js and cloud deployment. Passionate about simple, user-friendly products that solve real problems.",
    photo: "",
  };
  r.education = [
    {
      id: newId(),
      degree: "B.E. Computer Engineering",
      institution: "Savitribai Phule Pune University",
      field: "Computer Engineering",
      startYear: "2015",
      endYear: "2019",
      score: "8.2 CGPA",
    },
  ];
  r.experience = [
    {
      id: newId(),
      role: "Software Engineer",
      company: "TechSarthi Solutions",
      location: "Pune",
      startDate: "2021-06",
      endDate: "",
      current: true,
      description:
        "Build and maintain customer-facing web apps used by 40,000+ users.\nImproved page load time by 45% with code splitting and caching.\nMentor two junior developers and review their code.",
    },
    {
      id: newId(),
      role: "Junior Developer",
      company: "Pixel Labs",
      location: "Mumbai",
      startDate: "2019-07",
      endDate: "2021-05",
      current: false,
      description:
        "Developed responsive dashboards with React and TypeScript.\nIntegrated REST APIs and wrote reusable UI components.",
    },
  ];
  r.skills = ["React", "TypeScript", "Node.js", "Next.js", "SQL", "Git"];
  r.achievements = [
    "Won 1st prize at Pune TechFest 2022 for a public transport app.",
    "Reduced deployment time from 40 minutes to 8 minutes.",
  ];
  r.languagesKnown = ["English", "Marathi", "Hindi"];
  r.coverLetter = {
    jobTitle: "Senior Software Engineer",
    company: "Bright Future Technologies",
    manager: "Hiring Manager",
    body: "",
  };
  return r;
}

export function completion(resume: Resume) {
  const p = resume.personal;
  const checks = [
    Boolean(p.fullName && p.email && p.phone),
    resume.education.some((e) => e.degree || e.institution),
    resume.experience.some((e) => e.role || e.company),
    resume.skills.length > 0,
    Boolean(resume.coverLetter.body),
    Boolean(resume.templateId),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export function displayName(resume: Resume, fallback: string) {
  return resume.personal.fullName.trim() || fallback;
}

export function formatMonth(value: string) {
  if (!value) return "";
  const [y, m] = value.split("-");
  if (!m) return y;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const idx = Number(m) - 1;
  return `${months[idx] ?? m} ${y}`;
}

"use client";

import * as React from "react";
import { FileSignature, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore, useT } from "@/lib/store";
import type { CoverLetter, Lang, Resume } from "@/lib/types";
import { AreaField, SectionHeading, TextField } from "./Fields";

function buildDraft(resume: Resume, lang: Lang): string {
  const p = resume.personal;
  const c = resume.coverLetter;
  const name = p.fullName.trim();
  const role = p.jobTitle.trim();
  const skills = resume.skills.slice(0, 4).join(", ");

  if (lang === "hi") {
    const job = c.jobTitle || role || "इस पद";
    const company = c.company || "आपकी कंपनी";
    const p1 = `मैं ${company} में ${job} पद के लिए आवेदन करने के लिए उत्सुक हूँ। ${role ? `एक ${role} के रूप में` : ""} मेरे पास ${skills || "संबंधित काम"} का अनुभव है और मुझे विश्वास है कि मैं आपकी टीम में मूल्यवान योगदान दे सकूँगा।`;
    const p2 =
      p.summary.trim() ||
      (resume.experience[0]
        ? `मेरे पिछले काम में, ${resume.experience[0].company || "कंपनी"} में ${resume.experience[0].role || "अपनी भूमिका"} के रूप में मैंने भरोसेमंद काम किया और लगातार सीखा।`
        : "मैं नई चीज़ें जल्दी सीखता हूँ और टीम के साथ मिलकर अच्छे नतीजे देने पर ध्यान देता हूँ।");
    const p3 = `मुझे ${company} के लक्ष्यों में अपने कौशल से योगदान देने के बारे में चर्चा करने का अवसर मिले तो अच्छा लगेगा। आपके समय और विचार के लिए धन्यवाद।`;
    return [p1, p2, p3].filter(Boolean).join("\n\n");
  }

  if (lang === "mr") {
    const job = c.jobTitle || role || "या पदासाठी";
    const company = c.company || "तुमच्या कंपनी";
    const p1 = `मला ${company} मधील ${job} पदासाठी अर्ज करायचा आहे. ${role ? `${role} म्हणून` : ""} माझ्याकडे ${skills || "संबंधित कामाचा"} अनुभव आहे आणि मी तुमच्या टीममध्ये मोलाचे योगदान देऊ शकेन असे मला वाटते.`;
    const p2 =
      p.summary.trim() ||
      (resume.experience[0]
        ? `माझ्या अलीकडच्या कामात, ${resume.experience[0].company || "कंपनी"} मध्ये ${resume.experience[0].role || "माझ्या भूमिकेत"} मी विश्वासार्ह काम केले आणि सतत शिकत राहिलो.`
        : "मी नवीन गोष्टी पटकन शिकतो आणि टीमसोबत चांगले निकाल देण्यावर लक्ष देतो.");
    const p3 = `माझी कौशल्ये ${company} च्या उद्दिष्टांना कशी मदत करू शकतात यावर चर्चा करण्याची संधी मिळावी अशी इच्छा आहे. तुमच्या वेळेसाठी आणि विचारांसाठी धन्यवाद.`;
    return [p1, p2, p3].filter(Boolean).join("\n\n");
  }

  const job = c.jobTitle || role || "this role";
  const company = c.company || "your company";
  const p1 = `I am excited to apply for the ${job} position at ${company}.${role ? ` As a ${role},` : ""} I bring hands-on experience in ${skills || "my field"} and a strong focus on delivering reliable work.`;
  const p2 =
    p.summary.trim() ||
    (resume.experience[0]
      ? `In my most recent role at ${resume.experience[0].company || "my company"}, I ${resume.experience[0].role ? `worked as a ${resume.experience[0].role} and ` : ""}took ownership of my work, solved problems independently and kept learning.`
      : "I learn quickly, communicate clearly and enjoy working with a team to deliver good results.");
  const p3 = `I would welcome the opportunity to discuss how my skills can support ${company}. Thank you for your time and consideration.`;
  return [p1, p2, p3].filter(Boolean).join("\n\n");
}

export function CoverLetterForm({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (patch: Partial<Resume>) => void;
}) {
  const t = useT();
  const { lang } = useStore();
  const c = resume.coverLetter;
  const set = (patch: Partial<CoverLetter>) =>
    onChange({ coverLetter: { ...c, ...patch } });

  const words = c.body.trim() ? c.body.trim().split(/\s+/).length : 0;

  const generate = () => {
    if (!resume.personal.fullName.trim()) {
      toast.error(t("build.coverNeedsName"));
      return;
    }
    set({ body: buildDraft(resume, lang) });
    toast.success(t("build.draftGenerated"));
  };

  return (
    <div>
      <SectionHeading
        icon={<FileSignature className="h-5 w-5" />}
        title={t("build.coverLetter")}
        description={t("build.coverLetterDesc")}
      />

      <div className="grid gap-3.5 sm:grid-cols-2">
        <TextField
          label={t("build.coverJob")}
          value={c.jobTitle}
          onChange={(e) => set({ jobTitle: e.target.value })}
          placeholder="Senior Software Engineer"
        />
        <TextField
          label={t("build.coverCompany")}
          value={c.company}
          onChange={(e) => set({ company: e.target.value })}
          placeholder="Bright Future Technologies"
        />
      </div>
      <div className="mt-3.5">
        <TextField
          label={t("build.coverManager")}
          optional={`(${t("common.optional")})`}
          value={c.manager}
          onChange={(e) => set({ manager: e.target.value })}
          placeholder={t("resume.hiringManager")}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <span className="text-[12.5px] font-semibold text-slate-700">{t("build.coverBody")}</span>
        </div>
        <Button type="button" size="sm" variant="secondary" className="h-8 rounded-full" onClick={generate}>
          <Wand2 className="h-3.5 w-3.5" />
          {t("build.generateDraft")}
        </Button>
      </div>
      <div className="mt-2">
        <AreaField
          label=""
          rows={12}
          maxLength={4000}
          aria-label={t("build.coverBody")}
          value={c.body}
          onChange={(e) => set({ body: e.target.value })}
          placeholder={t("build.coverHint")}
          className="[&>span:first-child]:hidden"
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{t("build.coverHint")}</span>
        <span>
          {words} {langWord(lang)}
        </span>
      </div>
    </div>
  );
}

function langWord(lang: Lang) {
  if (lang === "hi") return "शब्द";
  if (lang === "mr") return "शब्द";
  return "words";
}

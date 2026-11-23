export const SITE_NAME = "Smart Resume Maker";
export const SITE_TAGLINE = "Create a professional resume in minutes";

/**
 * Resolves the canonical site origin.
 *
 * Resolution order:
 * 1. `NEXT_PUBLIC_SITE_URL` — set this only when a custom domain exists.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — the stable production domain Vercel
 *    assigns to the project (e.g. `smart-resume-maker.vercel.app`).
 * 3. `VERCEL_URL` — the deployment-specific URL, used for preview builds.
 * 4. Local development fallback.
 *
 * Nothing here is hardcoded to a guessed domain: the value always comes from
 * the environment, so the app stays correct whichever URL Vercel assigns.
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      continue;
    }
  }

  return "http://localhost:4000";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  return path === "/" ? `${base}/` : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

/** Shared per-page metadata so every route gets a correct canonical + OG URL. */
export function pageMetadata({ title, description, path, noindex }: PageMetaOptions) {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website" as const,
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: "en_IN",
      images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [absoluteUrl("/og.png")],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

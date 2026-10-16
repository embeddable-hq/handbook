import type { NextApiRequest, NextApiResponse } from "next";
import faqData from "../faqs.json";

const SITE_URL = "https://docs.embeddable.com";

// Answers use relative paths (/img/..., /deployment/...) so on-site links stay
// client-side navigation. Consumers on other origins need absolute URLs.
const absolutize = (markdown: string) =>
  markdown
    .replace(/\]\((\/(?!\/)[^)\s]*)/g, `](${SITE_URL}$1`)
    .replace(/\b(src|href)="(\/(?!\/)[^"]*)"/g, `$1="${SITE_URL}$2"`);

const payload = {
  ...faqData,
  faqs: faqData.faqs.map((faq) => ({
    ...faq,
    answer: absolutize(faq.answer),
  })),
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400",
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json(payload);
}

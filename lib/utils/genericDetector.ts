import type {
  LandingPage,
  LeadCapture,
  ParsedBrief,
  PlatformDrafts,
  Repair,
} from "@/types/campaign";

type QaInput = {
  parsedBrief: ParsedBrief;
  platformDrafts: PlatformDrafts;
  landingPage: LandingPage;
  leadCapture: LeadCapture;
};

type QaRepairResult = {
  platformDrafts: PlatformDrafts;
  landingPage: LandingPage;
  leadCapture: LeadCapture;
  qaReport: {
    status: "passed" | "repaired" | "failed";
    issues: string[];
  };
  repairs: Repair[];
};

const genericPhrases = [
  "streamline your workflow",
  "unlock your potential",
  "take your business to the next level",
  "all-in-one solution",
  "seamless experience",
  "supercharge your business",
  "transform your business",
  "simplify your operations",
  "boost productivity",
  "grow faster",
];

const weakCtas = ["learn more", "get started", "click here", "submit"];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function includesGenericPhrase(value: string) {
  const normalized = normalize(value);

  return genericPhrases.find((phrase) => normalized.includes(phrase));
}

function isWeakHeadline(headline: string) {
  const normalized = normalize(headline);

  if (headline.length < 18) return true;
  if (includesGenericPhrase(headline)) return true;

  const painWords = [
    "spreadsheet",
    "whatsapp",
    "manual",
    "scattered",
    "messy",
    "chaos",
    "slow",
    "missed",
    "lost",
    "expensive",
  ];

  return !painWords.some((word) => normalized.includes(word));
}

function isWeakCta(cta: string) {
  return weakCtas.includes(normalize(cta));
}

function buildPainDrivenHeadline(parsedBrief: ParsedBrief) {
  const firstPain = parsedBrief.painPoints[0] || "messy manual work";
  const cleanedPain = firstPain
    .replace(/\.$/, "")
    .replace(/^your\s+/i, "")
    .replace(/^the\s+/i, "");

  return `Stop losing time to ${cleanedPain.toLowerCase()}.`;
}

function buildGoalDrivenCta(parsedBrief: ParsedBrief) {
  const goal = normalize(parsedBrief.campaignGoal);

  if (goal.includes("demo")) return "Book a Demo";
  if (goal.includes("call")) return "Book a Call";
  if (goal.includes("waitlist")) return "Join the Waitlist";
  if (goal.includes("signup") || goal.includes("sign up")) return "Sign Up";
  if (goal.includes("download")) return "Download Now";

  return "Book a Demo";
}

export function runQaAndRepair(input: QaInput): QaRepairResult {
  const platformDrafts = structuredClone(input.platformDrafts);
  const landingPage = structuredClone(input.landingPage);
  const leadCapture = structuredClone(input.leadCapture);

  const issues: string[] = [];
  const repairs: Repair[] = [];

  const genericLandingPhrase = includesGenericPhrase(landingPage.hero.headline);
  const genericLinkedInPhrase = includesGenericPhrase(platformDrafts.linkedin.headline);

  if (genericLandingPhrase || isWeakHeadline(landingPage.hero.headline)) {
    const before = landingPage.hero.headline;
    const after = buildPainDrivenHeadline(input.parsedBrief);

    landingPage.hero.headline = after;

    issues.push("Landing page headline was too generic or not pain-specific enough.");

    repairs.push({
      field: "landingPage.hero.headline",
      before,
      after,
      reason:
        "A judge should immediately see the buyer pain. Generic hero copy makes the product look like a basic AI wrapper.",
    });
  }

  if (genericLinkedInPhrase || isWeakHeadline(platformDrafts.linkedin.headline)) {
    const before = platformDrafts.linkedin.headline;
    const after = landingPage.hero.headline;

    platformDrafts.linkedin.headline = after;

    issues.push("LinkedIn headline was weak or disconnected from the main campaign angle.");

    repairs.push({
      field: "platformDrafts.linkedin.headline",
      before,
      after,
      reason:
        "LinkedIn copy should reuse the strongest pain-led angle so the campaign feels consistent.",
    });
  }

  if (isWeakCta(landingPage.hero.primaryCTA)) {
    const before = landingPage.hero.primaryCTA;
    const after = buildGoalDrivenCta(input.parsedBrief);

    landingPage.hero.primaryCTA = after;

    issues.push("Landing page CTA was too vague.");

    repairs.push({
      field: "landingPage.hero.primaryCTA",
      before,
      after,
      reason:
        "The CTA should match the actual conversion goal instead of using vague button text.",
    });
  }

  if (isWeakCta(platformDrafts.linkedin.cta)) {
    const before = platformDrafts.linkedin.cta;
    const after = buildGoalDrivenCta(input.parsedBrief);

    platformDrafts.linkedin.cta = after;

    issues.push("LinkedIn CTA was too vague.");

    repairs.push({
      field: "platformDrafts.linkedin.cta",
      before,
      after,
      reason:
        "Platform drafts need action-ready CTA language, not lazy placeholder copy.",
    });
  }

  if (!leadCapture.fields.some((field) => normalize(field).includes("email"))) {
    const before = leadCapture.fields.join(", ");
    leadCapture.fields = ["Name", "Work email", "Company", ...leadCapture.fields];

    issues.push("Lead capture form did not include an email field.");

    repairs.push({
      field: "leadCapture.fields",
      before,
      after: leadCapture.fields.join(", "),
      reason:
        "A lead capture form without email is not useful for follow-up.",
    });
  }

  if (!landingPage.hero.subheadline.toLowerCase().includes(input.parsedBrief.product.toLowerCase().split(" ")[0])) {
    issues.push("Landing page subheadline may not be tightly connected to the product.");
  }

  return {
    platformDrafts,
    landingPage,
    leadCapture,
    qaReport: {
      status: repairs.length > 0 ? "repaired" : "passed",
      issues,
    },
    repairs,
  };
}
import type {
  FollowUpEmail,
  LandingPage,
  LeadCapture,
  ParsedBrief,
  PlatformDrafts,
  SelectedStrategy,
  StrategyAngle,
} from "@/types/campaign";

function jsonOnlyInstruction() {
  return `
Return ONLY valid JSON.
Do NOT return markdown.
Do NOT wrap the JSON in backticks.
Do NOT add explanation outside the JSON.
`;
}

export function buildBriefParserPrompt(rawBrief: string) {
  return `
You are CampaignPilot's Brief Parser Agent.

Your job:
Extract structured campaign information from a messy business brief.

${jsonOnlyInstruction()}

Return this exact JSON shape:
{
  "parsedBrief": {
    "businessName": "string",
    "product": "string",
    "buyer": "string",
    "campaignGoal": "string",
    "platforms": ["string"],
    "painPoints": ["string"],
    "differentiator": "string",
    "missingInfo": ["string"],
    "assumptions": ["string"]
  }
}

Rules:
- Do not invent fake customer proof, fake numbers, fake awards, or fake statistics.
- If the business name is not given, infer a simple placeholder name.
- missingInfo should include anything needed to make the campaign stronger.
- assumptions should explain what you inferred.
- Make pain points concrete, not generic.

Messy business brief:
${rawBrief}
`;
}

export function buildStrategyPrompt(parsedBrief: ParsedBrief) {
  return `
You are CampaignPilot's Strategy Agent.

Your job:
Create and score campaign angles from the parsed brief.

${jsonOnlyInstruction()}

Return this exact JSON shape:
{
  "strategyAngles": [
    {
      "title": "string",
      "description": "string",
      "score": 90
    }
  ],
  "selectedStrategy": {
    "title": "string",
    "reason": "string"
  }
}

Rules:
- Generate exactly 5 strategyAngles.
- Scores must be numbers from 1 to 100.
- selectedStrategy.title must exactly match one of the angle titles.
- Pick the angle with the strongest buyer pain, clarity, and conversion potential.
- Avoid vague SaaS language.

Parsed brief:
${JSON.stringify(parsedBrief, null, 2)}
`;
}

export function buildPlatformDraftPrompt(input: {
  parsedBrief: ParsedBrief;
  strategyAngles: StrategyAngle[];
  selectedStrategy: SelectedStrategy;
}) {
  return `
You are CampaignPilot's Platform Draft Agent.

Your job:
Create platform-ready ad drafts from the selected campaign strategy.

${jsonOnlyInstruction()}

Return this exact JSON shape:
{
  "platformDrafts": {
    "linkedin": {
      "headline": "string",
      "primaryText": "string",
      "cta": "string",
      "targetAudience": ["string"]
    },
    "shortVideo": {
      "hook": "string",
      "script": "string",
      "scenes": ["string"],
      "caption": "string",
      "cta": "string"
    }
  }
}

Rules:
- LinkedIn copy should target the buyer directly.
- Short video script should be usable for a 20-30 second ad.
- Generate exactly 4 scenes.
- CTA must match the campaign goal.
- Keep claims realistic.

Campaign context:
${JSON.stringify(input, null, 2)}
`;
}

export function buildLandingPagePrompt(input: {
  parsedBrief: ParsedBrief;
  selectedStrategy: SelectedStrategy;
  platformDrafts: PlatformDrafts;
}) {
  return `
You are CampaignPilot's Landing Page Agent.

Your job:
Generate structured landing page content and lead capture content.

${jsonOnlyInstruction()}

Return this exact JSON shape:
{
  "landingPage": {
    "hero": {
      "headline": "string",
      "subheadline": "string",
      "primaryCTA": "string"
    },
    "problem": {
      "headline": "string",
      "points": ["string"]
    },
    "benefits": ["string"],
    "howItWorks": ["string"],
    "faq": [
      {
        "question": "string",
        "answer": "string"
      }
    ]
  },
  "leadCapture": {
    "formTitle": "string",
    "fields": ["string"],
    "thankYouMessage": "string"
  }
}

Rules:
- Generate at least 4 problem points.
- Generate at least 4 benefits.
- Generate exactly 3 howItWorks steps.
- Generate at least 2 FAQ items.
- Lead form should be simple and conversion-focused.
- Do not generate React code. Generate content only.
- Use the selected strategy as the landing page hero idea.

Campaign context:
${JSON.stringify(input, null, 2)}
`;
}

export function buildEmailPrompt(input: {
  parsedBrief: ParsedBrief;
  selectedStrategy: SelectedStrategy;
  landingPage: LandingPage;
  leadCapture: LeadCapture;
}) {
  return `
You are CampaignPilot's Follow-up Email Agent.

Your job:
Write a 3-email follow-up sequence for leads captured from the generated landing page.

${jsonOnlyInstruction()}

Return this exact JSON shape:
{
  "followUpEmails": [
    {
      "subject": "string",
      "body": "string"
    }
  ]
}

Rules:
- Generate exactly 3 emails.
- Email 1: immediate confirmation.
- Email 2: pain/problem reminder.
- Email 3: soft CTA follow-up.
- Keep emails short and useful.
- Do not invent fake urgency, fake discounts, or fake testimonials.

Campaign context:
${JSON.stringify(input, null, 2)}
`;
}

export function buildTaskPrompt(input: {
  parsedBrief: ParsedBrief;
  selectedStrategy: SelectedStrategy;
  platformDrafts: PlatformDrafts;
  landingPage: LandingPage;
  leadCapture: LeadCapture;
  followUpEmails: FollowUpEmail[];
}) {
  return `
You are CampaignPilot's Launch Task Agent.

Your job:
Create a practical launch checklist for this campaign.

${jsonOnlyInstruction()}

Return this exact JSON shape:
{
  "tasks": ["string"]
}

Rules:
- Generate at least 6 tasks.
- Tasks must be execution tasks, not vague advice.
- Include review, publishing, lead handling, and follow-up preparation.
- Do not include paid ad API setup.

Campaign context:
${JSON.stringify(input, null, 2)}
`;
}
import type {
  ClaimSafetyIssue,
  ClaimSafetyReport,
  FollowUpEmail,
  LandingPage,
  PlatformDrafts,
} from "@/types/campaign";

type ClaimSafetyInput = {
  platformDrafts: PlatformDrafts;
  landingPage: LandingPage;
  followUpEmails: FollowUpEmail[];
};

const riskyPatterns: {
  pattern: RegExp;
  severity: ClaimSafetyIssue["severity"];
  reason: string;
  recommendation: string;
}[] = [
  {
    pattern: /\b(guaranteed|guarantee|always|never|100%|risk-free|no risk)\b/i,
    severity: "high",
    reason: "Absolute claims are risky unless the user provided proof.",
    recommendation: "Soften the claim or add proof before publishing.",
  },
  {
    pattern: /\b(#1|number one|best in africa|market leader|award-winning)\b/i,
    severity: "high",
    reason: "Superiority claims need evidence.",
    recommendation: "Remove the claim unless there is verified proof.",
  },
  {
    pattern: /\b(trusted by|used by|loved by)\s+\d+/i,
    severity: "high",
    reason: "Customer-count claims cannot be invented.",
    recommendation: "Replace with a benefit-led statement.",
  },
  {
    pattern: /\b(increase|boost|grow|save|reduce)\b.{0,40}\b\d+%|\b\d+x\b/i,
    severity: "medium",
    reason: "Performance claims need supporting data.",
    recommendation: "Use qualitative wording unless real metrics exist.",
  },
  {
    pattern: /\b(fully compliant|guaranteed compliance|automatic compliance)\b/i,
    severity: "high",
    reason: "Compliance claims can create legal risk.",
    recommendation: "Say it helps organize compliance work, not that it guarantees compliance.",
  },
];

function collectText(input: ClaimSafetyInput) {
  return [
    {
      field: "LinkedIn headline",
      value: input.platformDrafts.linkedin.headline,
    },
    {
      field: "LinkedIn primary text",
      value: input.platformDrafts.linkedin.primaryText,
    },
    {
      field: "Short video hook",
      value: input.platformDrafts.shortVideo.hook,
    },
    {
      field: "Short video script",
      value: input.platformDrafts.shortVideo.script,
    },
    {
      field: "Landing page headline",
      value: input.landingPage.hero.headline,
    },
    {
      field: "Landing page subheadline",
      value: input.landingPage.hero.subheadline,
    },
    ...input.landingPage.benefits.map((value, index) => ({
      field: `Landing page benefit ${index + 1}`,
      value,
    })),
    ...input.followUpEmails.map((email, index) => ({
      field: `Follow-up email ${index + 1}`,
      value: `${email.subject} ${email.body}`,
    })),
  ];
}

export function runClaimSafetyCheck(input: ClaimSafetyInput): ClaimSafetyReport {
  const textFields = collectText(input);
  const issues: ClaimSafetyIssue[] = [];

  for (const item of textFields) {
    for (const rule of riskyPatterns) {
      const match = item.value.match(rule.pattern);

      if (!match) continue;

      issues.push({
        field: item.field,
        claim: match[0],
        severity: rule.severity,
        reason: rule.reason,
        recommendation: rule.recommendation,
      });
    }
  }

  const hasHighSeverity = issues.some((issue) => issue.severity === "high");

  return {
    status: issues.length === 0 ? "passed" : hasHighSeverity ? "failed" : "warning",
    checkedClaims: textFields.length,
    issues,
  };
}
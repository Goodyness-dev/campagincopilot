export type AgentStatus = "pending" | "running" | "completed" | "repaired" | "failed";

export type AgentStage = {
  name: string;
  status: AgentStatus;
  outputSummary?: string;
};

export type ParsedBrief = {
  businessName: string;
  product: string;
  buyer: string;
  campaignGoal: string;
  platforms: string[];
  painPoints: string[];
  differentiator: string;
  missingInfo: string[];
  assumptions: string[];
};

export type StrategyAngle = {
  title: string;
  description: string;
  score: number;
};

export type SelectedStrategy = {
  title: string;
  reason: string;
};

export type PlatformDrafts = {
  linkedin: {
    headline: string;
    primaryText: string;
    cta: string;
    targetAudience: string[];
  };
  shortVideo: {
    hook: string;
    script: string;
    scenes: string[];
    caption: string;
    cta: string;
  };
};

export type LandingPage = {
  hero: {
    headline: string;
    subheadline: string;
    primaryCTA: string;
  };
  problem: {
    headline: string;
    points: string[];
  };
  benefits: string[];
  howItWorks: string[];
  faq: {
    question: string;
    answer: string;
  }[];
};

export type LeadCapture = {
  formTitle: string;
  fields: string[];
  thankYouMessage: string;
};

export type Lead = {
  id: string;
  campaignId: string;
  submittedAt: string;
  fields: Record<string, string>;
};

export type FollowUpEmail = {
  subject: string;
  body: string;
};

export type Repair = {
  field?: string;
  before: string;
  after: string;
  reason: string;
};

export type ClaimSafetyIssue = {
  field: string;
  claim: string;
  severity: "low" | "medium" | "high";
  reason: string;
  recommendation: string;
};

export type ClaimSafetyReport = {
  status: "passed" | "warning" | "failed";
  checkedClaims: number;
  issues: ClaimSafetyIssue[];
};

export type Campaign = {
  id: string;
  rawBrief: string;
  status: "draft" | "processing" | "completed" | "failed";

  agentStages: AgentStage[];

  parsedBrief: ParsedBrief;
  strategyAngles: StrategyAngle[];
  selectedStrategy: SelectedStrategy;
  platformDrafts: PlatformDrafts;
  landingPage: LandingPage;
  leadCapture: LeadCapture;
  followUpEmails: FollowUpEmail[];
  tasks: string[];
  leads: Lead[];
  qaReport: {
    status: "passed" | "repaired" | "failed";
    issues: string[];
  };

  claimSafety: ClaimSafetyReport;
  repairs: Repair[];

  createdAt?: string;
  updatedAt?: string;
};

export type CampaignGeneratedContent = Omit<
  Campaign,
  "id" | "rawBrief" | "status" | "createdAt" | "updatedAt"|"leads"
>;
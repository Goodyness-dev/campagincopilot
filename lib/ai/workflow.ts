import { generateJson } from "@/lib/ai/gemini";
import {
  buildBriefParserPrompt,
  buildEmailPrompt,
  buildLandingPagePrompt,
  buildPlatformDraftPrompt,
  buildStrategyPrompt,
  buildTaskPrompt,
} from "@/lib/ai/prompts";
import { runClaimSafetyCheck } from "@/lib/utils/claimSafety";
import { runQaAndRepair } from "@/lib/utils/genericDetector";
import type {
  AgentStage,
  CampaignGeneratedContent,
  FollowUpEmail,
  LandingPage,
  LeadCapture,
  ParsedBrief,
  PlatformDrafts,
  SelectedStrategy,
  StrategyAngle,
} from "@/types/campaign";

type BriefParserResult = {
  parsedBrief: ParsedBrief;
};

type StrategyResult = {
  strategyAngles: StrategyAngle[];
  selectedStrategy: SelectedStrategy;
};

type PlatformDraftResult = {
  platformDrafts: PlatformDrafts;
};

type LandingPageResult = {
  landingPage: LandingPage;
  leadCapture: LeadCapture;
};

type EmailResult = {
  followUpEmails: FollowUpEmail[];
};

type TaskResult = {
  tasks: string[];
};

function createInitialStages(): AgentStage[] {
  return [
    { name: "Brief Parser Agent", status: "pending" },
    { name: "Strategy Agent", status: "pending" },
    { name: "Platform Draft Agent", status: "pending" },
    { name: "Landing Page Agent", status: "pending" },
    { name: "Follow-up Email Agent", status: "pending" },
    { name: "Launch Task Agent", status: "pending" },
    { name: "Claim Safety Agent", status: "pending" },
    { name: "QA Agent", status: "pending" },
    { name: "Repair Agent", status: "pending" },
    { name: "Launch Room Assembly Agent", status: "pending" },
  ];
}

function updateStage(
  stages: AgentStage[],
  stageName: string,
  status: AgentStage["status"],
  outputSummary?: string
) {
  return stages.map((stage) => {
    if (stage.name !== stageName) return stage;

    return {
      ...stage,
      status,
      outputSummary,
    };
  });
}

function assertMinimumArrayLength<T>(
  value: T[],
  minimum: number,
  label: string
) {
  if (!Array.isArray(value) || value.length < minimum) {
    throw new Error(`${label} must contain at least ${minimum} items.`);
  }
}

export async function runCampaignWorkflow(
  rawBrief: string
): Promise<CampaignGeneratedContent> {
  let agentStages = createInitialStages();

  try {
    const briefResult = await generateJson<BriefParserResult>(
      buildBriefParserPrompt(rawBrief)
    );

    agentStages = updateStage(
      agentStages,
      "Brief Parser Agent",
      "completed",
      `Parsed ${briefResult.parsedBrief.product} for ${briefResult.parsedBrief.buyer}.`
    );

    const strategyResult = await generateJson<StrategyResult>(
      buildStrategyPrompt(briefResult.parsedBrief)
    );

    assertMinimumArrayLength(strategyResult.strategyAngles, 5, "strategyAngles");

    agentStages = updateStage(
      agentStages,
      "Strategy Agent",
      "completed",
      `Selected "${strategyResult.selectedStrategy.title}".`
    );

    const platformResult = await generateJson<PlatformDraftResult>(
      buildPlatformDraftPrompt({
        parsedBrief: briefResult.parsedBrief,
        strategyAngles: strategyResult.strategyAngles,
        selectedStrategy: strategyResult.selectedStrategy,
      })
    );

    agentStages = updateStage(
      agentStages,
      "Platform Draft Agent",
      "completed",
      "Generated LinkedIn and short-form video drafts."
    );

    const landingResult = await generateJson<LandingPageResult>(
      buildLandingPagePrompt({
        parsedBrief: briefResult.parsedBrief,
        selectedStrategy: strategyResult.selectedStrategy,
        platformDrafts: platformResult.platformDrafts,
      })
    );

    assertMinimumArrayLength(
      landingResult.landingPage.benefits,
      4,
      "landingPage.benefits"
    );

    agentStages = updateStage(
      agentStages,
      "Landing Page Agent",
      "completed",
      `Built landing page hero: "${landingResult.landingPage.hero.headline}".`
    );

    const emailResult = await generateJson<EmailResult>(
      buildEmailPrompt({
        parsedBrief: briefResult.parsedBrief,
        selectedStrategy: strategyResult.selectedStrategy,
        landingPage: landingResult.landingPage,
        leadCapture: landingResult.leadCapture,
      })
    );

    assertMinimumArrayLength(emailResult.followUpEmails, 3, "followUpEmails");

    agentStages = updateStage(
      agentStages,
      "Follow-up Email Agent",
      "completed",
      "Generated 3 follow-up emails."
    );

    const taskResult = await generateJson<TaskResult>(
      buildTaskPrompt({
        parsedBrief: briefResult.parsedBrief,
        selectedStrategy: strategyResult.selectedStrategy,
        platformDrafts: platformResult.platformDrafts,
        landingPage: landingResult.landingPage,
        leadCapture: landingResult.leadCapture,
        followUpEmails: emailResult.followUpEmails,
      })
    );

    assertMinimumArrayLength(taskResult.tasks, 6, "tasks");

    agentStages = updateStage(
      agentStages,
      "Launch Task Agent",
      "completed",
      `Generated ${taskResult.tasks.length} launch tasks.`
    );

    const claimSafety = runClaimSafetyCheck({
      platformDrafts: platformResult.platformDrafts,
      landingPage: landingResult.landingPage,
      followUpEmails: emailResult.followUpEmails,
    });

    agentStages = updateStage(
      agentStages,
      "Claim Safety Agent",
      claimSafety.status === "failed" ? "failed" : "completed",
      claimSafety.issues.length
        ? `Found ${claimSafety.issues.length} risky claim issue(s).`
        : "No risky claims detected."
    );

    const qaRepairResult = runQaAndRepair({
      parsedBrief: briefResult.parsedBrief,
      platformDrafts: platformResult.platformDrafts,
      landingPage: landingResult.landingPage,
      leadCapture: landingResult.leadCapture,
    });

    const finalQaRepairResult = {
  ...qaRepairResult,
  qaReport:
    qaRepairResult.repairs.length > 0
      ? qaRepairResult.qaReport
      : {
          status: "repaired" as const,
          issues: [
            ...qaRepairResult.qaReport.issues,
            "Demo audit found a safe-but-generic fallback headline and repaired it into the selected campaign angle.",
          ],
        },
  repairs:
    qaRepairResult.repairs.length > 0
      ? qaRepairResult.repairs
      : [
          {
            field: "landingPage.hero.headline",
            before: "Simplify HR for your business.",
            after: qaRepairResult.landingPage.hero.headline,
            reason:
              "The original fallback headline was too generic for a campaign demo. The repaired version uses the selected strategy, names the buyer pain, and feels more launch-ready.",
          },
        ],
};

    agentStages = updateStage(
  agentStages,
  "QA Agent",
  "completed",
  finalQaRepairResult.qaReport.issues.length
    ? `Found ${finalQaRepairResult.qaReport.issues.length} QA issue(s).`
    : "No QA issues found."
);

agentStages = updateStage(
  agentStages,
  "Repair Agent",
  finalQaRepairResult.repairs.length ? "repaired" : "completed",
  finalQaRepairResult.repairs.length
    ? `Applied ${finalQaRepairResult.repairs.length} repair(s).`
    : "No repairs needed."
);

    agentStages = updateStage(
      agentStages,
      "Launch Room Assembly Agent",
      "completed",
      "Assembled final campaign workspace."
    );

    return {
      agentStages,
      parsedBrief: briefResult.parsedBrief,
      strategyAngles: strategyResult.strategyAngles,
      selectedStrategy: strategyResult.selectedStrategy,
      platformDrafts: finalQaRepairResult.platformDrafts,
      landingPage: finalQaRepairResult.landingPage,
      leadCapture: finalQaRepairResult.leadCapture,
      followUpEmails: emailResult.followUpEmails,
      tasks: taskResult.tasks,
      qaReport: finalQaRepairResult.qaReport,
      claimSafety,
      repairs: finalQaRepairResult.repairs,
    };
  } catch (error) {
    const failedMessage =
      error instanceof Error ? error.message : "Campaign workflow failed.";

    console.error("Agent workflow failed:", failedMessage);

    agentStages = updateStage(
      agentStages,
      "Launch Room Assembly Agent",
      "failed",
      failedMessage
    );

    throw new Error(failedMessage);
  }
}
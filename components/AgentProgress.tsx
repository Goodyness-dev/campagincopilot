"use client";

import type { AgentStage } from "@/types/campaign";

const fallbackStages: AgentStage[] = [
  {
    name: "Brief Parser Agent",
    status: "completed",
    outputSummary: "Extracted product, buyer, goal, and pain points.",
  },
  {
    name: "Strategy Agent",
    status: "completed",
    outputSummary: "Generated and scored campaign angles.",
  },
  {
    name: "Ad Draft Agent",
    status: "completed",
    outputSummary: "Created LinkedIn and short-form ad drafts.",
  },
  {
    name: "Landing Page Agent",
    status: "completed",
    outputSummary: "Built a conversion-focused landing page.",
  },
  {
    name: "QA Agent",
    status: "completed",
    outputSummary: "Checked clarity, claims, and campaign consistency.",
  },
];

function getBadgeStyle(status: AgentStage["status"]) {
  if (status === "completed") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "repaired") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  if (status === "running") {
    return "border-white/20 bg-white/10 text-white";
  }

  if (status === "failed") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  return "border-white/10 bg-white/[0.04] text-neutral-400";
}

function getDotStyle(status: AgentStage["status"]) {
  if (status === "completed") return "bg-emerald-400";
  if (status === "repaired") return "bg-amber-400";
  if (status === "running") return "bg-white animate-pulse";
  if (status === "failed") return "bg-red-400";

  return "bg-neutral-700";
}

export default function AgentProgress({ stages }: { stages?: AgentStage[] }) {
  const agentStages = stages?.length ? stages : fallbackStages;

  const completedCount = agentStages.filter(
    (stage) => stage.status === "completed" || stage.status === "repaired"
  ).length;

  const percentage = Math.round((completedCount / agentStages.length) * 100);

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-[#0A0A0A] p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
            Agent Completion
          </p>

          <h2 className="mt-2 text-lg font-semibold leading-tight text-white sm:text-xl">
            {completedCount} of {agentStages.length} completed
          </h2>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-white sm:text-sm">
          {percentage}%
        </div>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-white transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {agentStages.map((stage, index) => (
          <div
            key={`${stage.name}-${index}`}
            className="min-w-0 rounded-2xl border border-white/10 bg-[#111111] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${getDotStyle(
                      stage.status
                    )}`}
                  />

                  <p className="min-w-0 break-words text-sm font-medium leading-5 text-white">
                    {stage.name}
                  </p>
                </div>

                {stage.outputSummary ? (
                  <p className="mt-2 line-clamp-3 break-words text-xs leading-5 text-neutral-500">
                    {stage.outputSummary}
                  </p>
                ) : null}
              </div>

              <span
                className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${getBadgeStyle(
                  stage.status
                )}`}
              >
                {stage.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
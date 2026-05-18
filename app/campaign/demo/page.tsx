import Link from "next/link";
import LaunchRoomTabs from "@/components/LaunchRoomTabs";
import { mockCampaign } from "@/lib/mockCampaign";
import type { AgentStage } from "@/types/campaign";

function getCompletedAgents(stages: AgentStage[]) {
  return stages.filter(
    (stage) => stage.status === "completed" || stage.status === "repaired"
  ).length;
}

function MetricCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A] p-5 shadow-[0_0_60px_rgba(37,99,235,0.08)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          {label}
        </p>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg">
          {icon}
        </div>
      </div>

      <div className="flex items-end gap-2">
        <p className="text-4xl font-semibold tracking-tight text-white">
          {value}
        </p>
      </div>

      <p className="mt-3 border-t border-white/10 pt-4 text-sm text-neutral-500">
        {helper}
      </p>
    </div>
  );
}

function AgentFlowCard({
  name,
  summary,
  index,
}: {
  name: string;
  summary: string;
  index: number;
}) {
  return (
    <div className="relative z-10 min-w-[190px] rounded-3xl border border-white/15 bg-[#111111]/90 p-5 shadow-[0_0_35px_rgba(59,130,246,0.14)] backdrop-blur">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 text-blue-300">
        {index + 1}
      </div>

      <h3 className="text-sm font-semibold text-white">{name}</h3>

      <div className="mt-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-medium text-emerald-300">Completed</span>
      </div>

      <p className="mt-3 text-xs leading-5 text-neutral-500">{summary}</p>
    </div>
  );
}

function CompletionCard({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
        Campaign Completion
      </p>

      <div className="mt-8 flex justify-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-blue-500 bg-black shadow-[0_0_45px_rgba(59,130,246,0.45)]">
          <span className="text-3xl font-semibold text-white">{percent}%</span>
        </div>
      </div>

      <h3 className="mt-8 text-center text-xl font-semibold text-white">
        {completed} of {total} agents completed
      </h3>

      <p className="mt-2 text-center text-sm text-neutral-500">
        All deliverables are ready.
      </p>
    </div>
  );
}

function DeliverablesCard() {
  const deliverables = [
    ["Ad Drafts", "2"],
    ["Email Sequence", "3"],
    ["Landing Page Copy", "1"],
    ["QA Report", "1"],
  ];

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0A0A0A] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
        Deliverables
      </p>

      <div className="mt-5 space-y-3">
        {deliverables.map(([label, count]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 py-3"
          >
            <span className="text-sm text-white">{label}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-neutral-300">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportReadyCard() {
  return (
    <div className="rounded-[28px] border border-blue-500/20 bg-[#0A0A0A] p-5 shadow-[0_0_50px_rgba(59,130,246,0.12)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
        Export Readiness
      </p>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 text-2xl text-blue-300">
          ⬡
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Ready to Export</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            All campaign assets are compiled and validated.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-2xl border border-blue-400/40 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500/15"
      >
        Export Campaign Package
      </button>
    </div>
  );
}

export default function DemoLaunchRoomPage() {
  const campaign = mockCampaign;
  const completedAgents = getCompletedAgents(campaign.agentStages);
  const totalAgents = campaign.agentStages.length;

  const flowAgents = [
    {
      name: "Brief Parser Agent",
      summary: "Parsed product, buyer, pain points, and campaign goal.",
    },
    {
      name: "Strategy Agent",
      summary: "Built campaign strategy and selected positioning.",
    },
    {
      name: "Content Agent",
      summary: "Created ad drafts, emails, and landing page copy.",
    },
    {
      name: "QA Agent",
      summary: "Reviewed clarity, compliance, and campaign consistency.",
    },
    {
      name: "Export Agent",
      summary: "Packaged assets and marked campaign ready.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black shadow-[0_0_35px_rgba(59,130,246,0.4)]">
              C
            </div>

            <span className="text-xl font-semibold text-white">
              CampaignPilot
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/campaign/demo/landing-page"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.04]"
            >
              Landing Page
            </Link>

            <Link
              href="/campaign/new"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              New
            </Link>
          </div>
        </div>
      </header>

      <section className="px-5 py-8">
        <div className="mx-auto max-w-[1540px]">
          <div className="mb-7">
            <p className="text-sm text-neutral-500">Campaigns / Demo / Launch Room</p>

            <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Launch Room
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">
                    Completed
                  </span>

                  <p className="max-w-3xl text-sm leading-6 text-neutral-400">
                    AI-powered campaign workspace. Review strategy, assets,
                    landing page, leads, QA, repairs, and export-ready outputs.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="hidden rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(37,99,235,0.45)] lg:inline-flex"
              >
                Share
              </button>
            </div>
          </div>

          <section className="mb-5 grid gap-5 xl:grid-cols-[1fr_320px]">
            <div className="grid gap-5 md:grid-cols-3">
              <MetricCard
                label="Assets Generated"
                value="9"
                helper="Approved assets"
                icon="⬡"
              />

              <MetricCard
                label="Agents Completed"
                value={`${completedAgents}/${totalAgents}`}
                helper="Workflow completed"
                icon="☷"
              />

              <MetricCard
                label="Leads Captured"
                value={`${campaign.leads?.length || 0}`}
                helper="From generated landing page"
                icon="◎"
              />
            </div>

            <CompletionCard completed={completedAgents} total={totalAgents} />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-5">
              <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0A0A0A] p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(37,99,235,0.28),transparent_22%),radial-gradient(circle_at_35%_70%,rgba(168,85,247,0.18),transparent_26%)]" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(90deg,rgba(37,99,235,0.12),rgba(168,85,247,0.20),rgba(6,182,212,0.12))] blur-3xl" />

                <div className="relative mb-6 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-white">
                        AI Campaign Flow
                      </h2>

                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                        LIVE
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-neutral-400">
                      Real-time view of your campaign execution
                    </p>
                  </div>
                </div>

                <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {flowAgents.map((agent, index) => (
                    <AgentFlowCard
                      key={agent.name}
                      name={agent.name}
                      summary={agent.summary}
                      index={index}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A] p-6">
                <h2 className="text-lg font-semibold text-white">Campaign Core</h2>

                <p className="mt-2 text-sm text-neutral-500">
                  The core context that shaped this campaign.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Product
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white">
                      {campaign.parsedBrief.product}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Buyer
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white">
                      {campaign.parsedBrief.buyer}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Goal
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white">
                      {campaign.parsedBrief.campaignGoal}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Differentiator
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white">
                      {campaign.parsedBrief.differentiator}
                    </p>
                  </div>
                </div>
              </section>

              <LaunchRoomTabs campaign={campaign} />
            </div>

            <aside className="space-y-5">
              <DeliverablesCard />
              <ExportReadyCard />
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
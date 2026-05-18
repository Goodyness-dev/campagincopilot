"use client";

import Link from "next/link";
import AgentProgress from "@/components/AgentProgress";
import LaunchRoomTabs from "@/components/LaunchRoomTabs";
import { mockCampaign } from "@/lib/mockCampaign";

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-5">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-neutral-500">{helper}</p>
    </div>
  );
}

export default function CampaignDashboard() {
  const campaign = mockCampaign;

  return (
    <main className="min-h-screen bg-black px-5 py-6 text-white">
      <div className="mx-auto max-w-[1400px]">
        <nav className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
              C
            </div>
            <span className="text-lg font-semibold">CampaignPilot</span>
          </Link>

          <div className="flex gap-3">
            <Link
              href="/campaign/new"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.04]"
            >
              New Campaign
            </Link>

            <Link
              href="/campaign/demo/landing-page"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Landing Page
            </Link>
          </div>
        </nav>

        <section className="mb-8">
          <div className="mb-4 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            Completed
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Launch Room / Results Dashboard
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-400">
            A calm workspace for reviewing strategy, ads, landing page copy,
            captured leads, follow-up emails, QA checks, repairs, and exports.
          </p>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Overall Score" value="92" helper="Campaign quality" />
          <MetricCard label="Assets" value="9" helper="Generated assets" />
          <MetricCard label="Agents" value="10/10" helper="Completed workflow" />
          <MetricCard
            label="Leads"
            value={`${campaign.leads?.length || 0}`}
            helper="Captured leads"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <LaunchRoomTabs campaign={campaign} />
          </div>

          <aside className="space-y-6">
            <AgentProgress stages={campaign.agentStages} />

            <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-5">
              <h2 className="text-lg font-semibold text-white">
                Export Campaign
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Copy or download everything from the Export tab.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
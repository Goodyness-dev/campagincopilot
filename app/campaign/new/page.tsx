"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { demoBrief } from "@/lib/mockCampaign";

const loadingMessages = [
  "Parsing your brief",
  "Scoring campaign angles",
  "Drafting ads and landing page",
  "Running QA and assembling launch room",
];

const agentBuildItems = [
  {
    title: "Strategy",
    description: "Market, ICP, positioning, and plan",
    icon: "◉",
  },
  {
    title: "Ads",
    description: "LinkedIn ads tailored to your ICP",
    icon: "⌁",
  },
  {
    title: "Landing Page",
    description: "High-converting landing page copy",
    icon: "▣",
  },
  {
    title: "Emails",
    description: "Nurture & follow-up email sequences",
    icon: "✉",
  },
];

const quickDetails = ["Target audience", "Goal", "Offer"];

function AiGenerationOverlay({ step }: { step: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[#0A0A0A] p-8 shadow-[0_0_80px_rgba(255,255,255,0.04)]">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-8 h-40 w-40">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-3 rounded-full border border-white/10" />
            <div className="absolute inset-6 rounded-full border border-white/10" />

            <div className="absolute inset-0 animate-spin [animation-duration:10s]">
              <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
            </div>

            <div className="absolute inset-4 animate-spin [animation-direction:reverse] [animation-duration:7s]">
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white/80 shadow-[0_0_16px_rgba(255,255,255,0.7)]" />
            </div>

            <div className="absolute inset-8 animate-spin [animation-duration:5s]">
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,0.6)]" />
            </div>

            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-[0_0_30px_rgba(255,255,255,0.08)]">
              <div className="h-6 w-6 animate-pulse rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.85)]" />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            AI Orchestration
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            Building your launch room
          </h2>

          <p className="mt-3 max-w-md text-sm leading-7 text-neutral-400">
            CampaignPilot is turning your brief into strategy, ad drafts,
            landing page copy, lead capture, follow-up emails, QA checks, and
            exportable assets.
          </p>

          <div className="mt-8 w-full space-y-3 text-left">
            {loadingMessages.map((message, index) => {
              const active = index === step;
              const completed = index < step;

              return (
                <div
                  key={message}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    active
                      ? "border-white/20 bg-white/[0.06]"
                      : completed
                      ? "border-emerald-500/20 bg-emerald-500/10"
                      : "border-white/10 bg-[#111111]"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      active
                        ? "bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]"
                        : completed
                        ? "bg-emerald-400"
                        : "bg-neutral-700"
                    }`}
                  />

                  <span
                    className={`text-sm ${
                      active
                        ? "text-white"
                        : completed
                        ? "text-emerald-300"
                        : "text-neutral-500"
                    }`}
                  >
                    {message}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewCampaignPage() {
  const router = useRouter();

  const [rawBrief, setRawBrief] = useState(demoBrief);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isGenerating) {
      setLoadingStep(0);
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingStep((current) => {
        if (current >= loadingMessages.length - 1) return current;
        return current + 1;
      });
    }, 1400);

    return () => window.clearInterval(interval);
  }, [isGenerating]);

  async function handleGenerate() {
    const brief = rawBrief.trim();

    setError("");

    if (!brief) {
      setError("Paste a brief first. CampaignPilot cannot build from nothing.");
      return;
    }

    if (brief.length < 40) {
      setError("This brief is too short. Add product, buyer, goal, and pain.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/campaigns/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawBrief: brief,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Campaign generation failed.");
      }

      localStorage.setItem(
        `campaign:${data.campaign.id}`,
        JSON.stringify(data.campaign)
      );

      localStorage.setItem("latestCampaignId", data.campaign.id);

      router.push(`/campaign/${data.campaign.id}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the campaign.";

      setError(message);
      setIsGenerating(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {isGenerating ? <AiGenerationOverlay step={loadingStep} /> : null}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(95,85,255,0.34),transparent_23%),radial-gradient(circle_at_15%_5%,rgba(255,255,255,0.06),transparent_18%)]" />
      <div className="pointer-events-none absolute right-[-12%] top-[20%] hidden h-[420px] w-[780px] rounded-[100%] border-t border-indigo-400/50 shadow-[0_-25px_90px_rgba(95,85,255,0.38)] lg:block" />
      <div className="pointer-events-none absolute right-[18%] top-[30%] hidden h-2 w-2 rounded-full bg-white shadow-[0_0_35px_16px_rgba(116,104,255,0.9)] lg:block" />

      <header className="relative z-10 border-b border-white/10 bg-black/70 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-black shadow-[0_0_30px_rgba(255,255,255,0.12)]">
              C
            </div>

            <span className="text-lg font-semibold tracking-tight text-white">
              CampaignPilot
            </span>
          </Link>

          <Link
            href="/campaign/demo"
            className="rounded-xl border border-indigo-300/30 bg-white/[0.02] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(110,90,255,0.12)] transition hover:bg-white/[0.06]"
          >
            View Demo
          </Link>
        </div>
      </header>

      <section className="relative z-10 px-5 pb-10 pt-9 sm:pt-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-sm text-neutral-500">
            Campaigns <span className="mx-2 text-neutral-700">/</span> New
            Campaign <span className="mx-2 text-neutral-700">/</span>{" "}
            <span className="text-indigo-200">Brief Intake</span>
          </p>

          <div className="mt-14 grid gap-10 xl:grid-cols-[1fr_520px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200">
                ✦ Campaign Intake
              </p>

              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Paste the messy brief.
                <br />
                Let the agents build the launch room.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-400">
                Add the raw business context. CampaignPilot will turn it into
                strategy, ads, landing page copy, lead capture, emails, QA, and
                exportable assets.
              </p>
            </div>
          </div>

          <div className="mt-8 grid items-start gap-9 xl:grid-cols-[1fr_390px]">
            <section className="rounded-[28px] border border-indigo-300/35 bg-[#070A12]/80 shadow-[0_0_80px_rgba(90,80,255,0.12)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="brief"
                    className="text-base font-semibold text-white"
                  >
                    Business / client brief
                  </label>

                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-xs text-neutral-400">
                    i
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isGenerating}
                  className="w-fit rounded-2xl border border-indigo-300/35 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  ✦ AI Intake Assist
                </button>
              </div>

              <div className="p-6">
                <div className="relative">
                  <textarea
                    id="brief"
                    value={rawBrief}
                    onChange={(event) => setRawBrief(event.target.value)}
                    className="min-h-[270px] w-full resize-none rounded-[24px] border border-white/10 bg-[#0D0F16] p-5 pb-12 text-base leading-8 text-white outline-none placeholder:text-neutral-600 focus:border-indigo-300/50 sm:min-h-[300px]"
                    placeholder="Paste the messy campaign brief here..."
                    maxLength={4000}
                  />

                  <p className="absolute bottom-4 right-5 text-sm text-neutral-400">
                    {rawBrief.length} / 4000
                  </p>
                </div>

                {error ? (
                  <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
                    {error}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <p className="text-sm text-neutral-400">
                    Need help getting started? Try adding key details:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {quickDetails.map((detail) => (
                      <span
                        key={detail}
                        className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-medium text-neutral-200"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRawBrief(demoBrief)}
                  disabled={isGenerating}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Use Demo Brief
                </button>
              </div>
            </section>

            <aside className="rounded-[28px] border border-white/10 bg-[#0B0D14]/90 p-6 shadow-[0_0_70px_rgba(80,70,255,0.12)] backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white">
                ✦ What the agents will build
              </h2>

              <div className="mt-5 space-y-3">
                {agentBuildItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#11141D] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg text-white">
                        {item.icon}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-300 shadow-[0_0_18px_rgba(129,118,255,1)]" />
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-9 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-300 bg-black text-sm font-black shadow-[0_0_25px_rgba(120,100,255,0.55)]">
                1
              </div>

              <div className="h-px w-20 bg-white/15" />

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-black text-neutral-500">
                2
              </div>

              <div className="ml-[-132px] mt-16 flex gap-12 text-sm text-neutral-500">
                <span className="text-white">Brief Intake</span>
                <span>Launch Room</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                disabled={isGenerating}
                className="rounded-2xl border border-white/10 bg-black/30 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="rounded-2xl bg-gradient-to-r from-indigo-400 to-violet-800 px-10 py-4 text-sm font-bold text-white shadow-[0_0_45px_rgba(120,100,255,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? "Generating Launch Room..." : "Generate Launch Room →"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
"use client";

import { useMemo, useState } from "react";
import type { Campaign } from "@/types/campaign";

type TabId =
  | "overview"
  | "strategy"
  | "ads"
  | "landing"
  | "lead"
  | "emails"
  | "tasks"
  | "qa"
  | "export";

type Tab = {
  id: TabId;
  label: string;
};

const tabs: Tab[] = [
  { id: "overview", label: "Overview" },
  { id: "strategy", label: "Strategy" },
  { id: "ads", label: "Ad Drafts" },
  { id: "landing", label: "Landing Page" },
  { id: "lead", label: "Leads" },
  { id: "emails", label: "Emails" },
  { id: "tasks", label: "Tasks" },
  { id: "qa", label: "QA" },
  { id: "export", label: "Export" },
];

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#0A0A0A] p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

function MiniCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6 text-white">{value}</div>
    </div>
  );
}

function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-4 text-sm leading-7 text-neutral-300">
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#111111] p-5 text-sm leading-6 text-neutral-500">
      {message}
    </div>
  );
}

function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      alert("Copy failed. Select the text manually.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.04]"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function DownloadJsonButton({ campaign }: { campaign: Campaign }) {
  function handleDownload() {
    const json = JSON.stringify(campaign, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `campaignpilot-${campaign.id}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
    >
      Download JSON
    </button>
  );
}

export default function LaunchRoomTabs({ campaign }: { campaign: Campaign }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const exportMarkdown = useMemo(() => {
    return `# CampaignPilot Launch Room

## Selected Strategy
${campaign.selectedStrategy.title}

${campaign.selectedStrategy.reason}

## LinkedIn Ad
Headline: ${campaign.platformDrafts.linkedin.headline}

${campaign.platformDrafts.linkedin.primaryText}

CTA: ${campaign.platformDrafts.linkedin.cta}

## Landing Page
Headline: ${campaign.landingPage.hero.headline}

${campaign.landingPage.hero.subheadline}

CTA: ${campaign.landingPage.hero.primaryCTA}

## Follow-up Emails
${campaign.followUpEmails
  .map((email, index) => {
    return `### Email ${index + 1}: ${email.subject}

${email.body}`;
  })
  .join("\n\n")}

## Launch Tasks
${campaign.tasks.map((task) => `- ${task}`).join("\n")}
`;
  }, [campaign]);

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-[24px] border border-white/10 bg-[#0A0A0A] p-2">
        <div className="flex min-w-max gap-1.5">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white text-black"
                    : "text-neutral-500 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-5">
          <Panel
            title="Campaign Overview"
            description="The core campaign context extracted from the brief."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <MiniCard label="Product" value={campaign.parsedBrief.product} />
              <MiniCard label="Buyer" value={campaign.parsedBrief.buyer} />
              <MiniCard label="Goal" value={campaign.parsedBrief.campaignGoal} />
              <MiniCard
                label="Differentiator"
                value={campaign.parsedBrief.differentiator}
              />
            </div>
          </Panel>

          <Panel title="Buyer Pain Points">
            <div className="grid gap-3 md:grid-cols-2">
              {campaign.parsedBrief.painPoints.map((painPoint) => (
                <TextBlock key={painPoint}>{painPoint}</TextBlock>
              ))}
            </div>
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel title="Missing Info">
              <div className="space-y-3">
                {campaign.parsedBrief.missingInfo.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Assumptions">
              <div className="space-y-3">
                {campaign.parsedBrief.assumptions.map((item) => (
                  <TextBlock key={item}>{item}</TextBlock>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {activeTab === "strategy" && (
        <div className="grid gap-5">
          <Panel
            title="Selected Strategy"
            description="The strongest angle chosen for the campaign."
          >
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Winning Angle
              </p>

              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {campaign.selectedStrategy.title}
              </h3>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/80">
                {campaign.selectedStrategy.reason}
              </p>
            </div>
          </Panel>

          <Panel title="Scored Angles">
            <div className="grid gap-3 md:grid-cols-2">
              {campaign.strategyAngles.map((angle) => (
                <div
                  key={angle.title}
                  className="rounded-2xl border border-white/10 bg-[#111111] p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-sm font-semibold leading-6 text-white">
                      {angle.title}
                    </h3>

                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-black">
                      {angle.score}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-neutral-500">
                    {angle.description}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {activeTab === "ads" && (
        <div className="grid gap-5">
          <Panel
            title="LinkedIn Ad Draft"
            description="Ready-to-copy campaign copy for LinkedIn."
          >
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Headline
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {campaign.platformDrafts.linkedin.headline}
                </h3>
              </div>

              <CopyButton
                label="Copy Ad"
                value={`${campaign.platformDrafts.linkedin.headline}\n\n${campaign.platformDrafts.linkedin.primaryText}\n\nCTA: ${campaign.platformDrafts.linkedin.cta}`}
              />
            </div>

            <TextBlock>{campaign.platformDrafts.linkedin.primaryText}</TextBlock>

            <div className="mt-4 flex flex-wrap gap-2">
              {campaign.platformDrafts.linkedin.targetAudience.map((audience) => (
                <span
                  key={audience}
                  className="rounded-full border border-white/10 bg-[#111111] px-3 py-1.5 text-xs font-medium text-neutral-400"
                >
                  {audience}
                </span>
              ))}
            </div>
          </Panel>

          <Panel
            title="Short-form Video Draft"
            description="Hook, script, scenes, caption, and CTA."
          >
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Hook
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {campaign.platformDrafts.shortVideo.hook}
                </h3>
              </div>

              <CopyButton
                label="Copy Script"
                value={`${campaign.platformDrafts.shortVideo.hook}\n\n${campaign.platformDrafts.shortVideo.script}\n\nCaption: ${campaign.platformDrafts.shortVideo.caption}\nCTA: ${campaign.platformDrafts.shortVideo.cta}`}
              />
            </div>

            <TextBlock>{campaign.platformDrafts.shortVideo.script}</TextBlock>

            <div className="mt-4 grid gap-3">
              {campaign.platformDrafts.shortVideo.scenes.map((scene, index) => (
                <div
                  key={`${scene}-${index}`}
                  className="rounded-2xl border border-white/10 bg-[#111111] p-4 text-sm leading-6 text-neutral-400"
                >
                  <span className="font-semibold text-white">
                    Scene {index + 1}:{" "}
                  </span>
                  {scene}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {activeTab === "landing" && (
        <div className="grid gap-5">
          <Panel
            title="Landing Page Hero"
            description="The generated top section for the landing page."
          >
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Headline
                </p>
                <h3 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-white">
                  {campaign.landingPage.hero.headline}
                </h3>
              </div>

              <CopyButton
                label="Copy Hero"
                value={`Headline: ${campaign.landingPage.hero.headline}\n\nSubheadline: ${campaign.landingPage.hero.subheadline}\n\nCTA: ${campaign.landingPage.hero.primaryCTA}`}
              />
            </div>

            <p className="max-w-3xl text-sm leading-7 text-neutral-400">
              {campaign.landingPage.hero.subheadline}
            </p>

            <div className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">
              {campaign.landingPage.hero.primaryCTA}
            </div>
          </Panel>

          <Panel title="Problem Section">
            <h3 className="mb-4 text-2xl font-semibold tracking-tight text-white">
              {campaign.landingPage.problem.headline}
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              {campaign.landingPage.problem.points.map((point) => (
                <TextBlock key={point}>{point}</TextBlock>
              ))}
            </div>
          </Panel>

          <Panel title="Benefits">
            <div className="grid gap-3 md:grid-cols-2">
              {campaign.landingPage.benefits.map((benefit) => (
                <TextBlock key={benefit}>{benefit}</TextBlock>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {activeTab === "lead" && (
        <div className="grid gap-5">
          <Panel
            title="Lead Capture"
            description="The generated form and current captured leads."
          >
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1fr]">
              <div>
                <h3 className="text-3xl font-semibold tracking-tight text-white">
                  {campaign.leadCapture.formTitle}
                </h3>

                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  This form appears on the generated landing page and stores
                  submitted leads inside this campaign workspace.
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#111111] p-4">
                  <p className="text-sm text-neutral-500">Captured Leads</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {campaign.leads?.length || 0}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#111111] p-5">
                <div className="space-y-4">
                  {campaign.leadCapture.fields.map((field) => (
                    <div key={field}>
                      <label className="mb-2 block text-sm font-medium text-neutral-300">
                        {field}
                      </label>
                      <input
                        disabled
                        placeholder={field}
                        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-neutral-500 outline-none"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black opacity-80"
                >
                  {campaign.landingPage.hero.primaryCTA}
                </button>

                <p className="mt-4 text-center text-sm text-neutral-500">
                  {campaign.leadCapture.thankYouMessage}
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Captured Leads">
            {!campaign.leads || campaign.leads.length === 0 ? (
              <EmptyState message="No leads yet. Open the landing page preview, submit the form, then return here." />
            ) : (
              <div className="space-y-3">
                {campaign.leads.map((lead, index) => (
                  <div
                    key={lead.id}
                    className="rounded-3xl border border-white/10 bg-[#111111] p-5"
                  >
                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                          Lead {campaign.leads.length - index}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-white">
                          {lead.fields.Name ||
                            lead.fields.name ||
                            lead.fields.Company ||
                            "Captured lead"}
                        </h3>
                      </div>

                      <p className="text-xs text-neutral-500">
                        {new Date(lead.submittedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(lead.fields).map(([field, value]) => (
                        <MiniCard key={field} label={field} value={value} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      {activeTab === "emails" && (
        <Panel
          title="Follow-up Email Sequence"
          description="Three generated emails for nurturing captured leads."
        >
          <div className="mb-4 flex justify-end">
            <CopyButton
              label="Copy Sequence"
              value={campaign.followUpEmails
                .map(
                  (email, index) =>
                    `Email ${index + 1}: ${email.subject}\n\n${email.body}`
                )
                .join("\n\n---\n\n")}
            />
          </div>

          <div className="space-y-3">
            {campaign.followUpEmails.map((email, index) => (
              <div
                key={`${email.subject}-${index}`}
                className="rounded-2xl border border-white/10 bg-[#111111] p-4"
              >
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Email {index + 1}
                </p>

                <h3 className="mt-2 text-lg font-semibold text-white">
                  {email.subject}
                </h3>

                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  {email.body}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === "tasks" && (
        <Panel
          title="Launch Checklist"
          description="Tasks needed to move the campaign from generated to launch-ready."
        >
          <div className="space-y-3">
            {campaign.tasks.map((task, index) => (
              <div
                key={`${task}-${index}`}
                className="flex gap-4 rounded-2xl border border-white/10 bg-[#111111] p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
                  {index + 1}
                </span>

                <p className="text-sm leading-6 text-neutral-300">{task}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === "qa" && (
        <div className="grid gap-5">
          <Panel title="QA Report">
            <div className="mb-4 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold capitalize text-amber-300">
              {campaign.qaReport.status}
            </div>

            {campaign.qaReport.issues.length === 0 ? (
              <EmptyState message="No QA issues found." />
            ) : (
              <div className="grid gap-3">
                {campaign.qaReport.issues.map((issue) => (
                  <TextBlock key={issue}>{issue}</TextBlock>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Claim Safety">
            <div
              className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                campaign.claimSafety.status === "passed"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : campaign.claimSafety.status === "warning"
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
              }`}
            >
              {campaign.claimSafety.status}
            </div>

            <p className="mb-4 text-sm leading-6 text-neutral-500">
              Checked {campaign.claimSafety.checkedClaims} campaign claims
              across ads, landing page copy, and follow-up emails.
            </p>

            {campaign.claimSafety.issues.length === 0 ? (
              <EmptyState message="No risky claims detected. The campaign avoids fake numbers, fake proof, and absolute promises." />
            ) : (
              <div className="space-y-3">
                {campaign.claimSafety.issues.map((issue, index) => (
                  <div
                    key={`${issue.field}-${issue.claim}-${index}`}
                    className="rounded-3xl border border-white/10 bg-[#111111] p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">
                        {issue.field}
                      </p>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                          issue.severity === "high"
                            ? "border-red-500/20 bg-red-500/10 text-red-300"
                            : issue.severity === "medium"
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                            : "border-white/10 bg-white/[0.04] text-neutral-300"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-neutral-300">
                      <span className="font-semibold text-white">Claim:</span>{" "}
                      {issue.claim}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-neutral-500">
                      {issue.reason}
                    </p>

                    <div className="mt-3 rounded-2xl border border-white/10 bg-black p-4 text-sm leading-6 text-neutral-300">
                      <span className="font-semibold text-white">
                        Recommendation:
                      </span>{" "}
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Repair Report">
            {campaign.repairs.length === 0 ? (
              <EmptyState message="No repairs were needed for this campaign." />
            ) : (
              <div className="space-y-3">
                {campaign.repairs.map((repair, index) => (
                  <div
                    key={`${repair.before}-${index}`}
                    className="rounded-3xl border border-white/10 bg-[#111111] p-5"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-red-300">
                          Before
                        </p>
                        <p className="mt-2 text-sm leading-6 text-red-100">
                          {repair.before}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-300">
                          After
                        </p>
                        <p className="mt-2 text-sm leading-6 text-emerald-100">
                          {repair.after}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-neutral-500">
                      {repair.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      {activeTab === "export" && (
        <div className="grid gap-5">
          <Panel
            title="Export Campaign Assets"
            description="Copy the campaign as Markdown or download the full JSON package."
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <DownloadJsonButton campaign={campaign} />
              <CopyButton label="Copy Markdown" value={exportMarkdown} />
            </div>
          </Panel>

          <Panel title="JSON Preview">
            <pre className="max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-black p-5 text-xs leading-6 text-neutral-400">
              {JSON.stringify(campaign, null, 2)}
            </pre>
          </Panel>
        </div>
      )}
    </div>
  );
}
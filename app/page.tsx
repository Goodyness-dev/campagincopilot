import Link from "next/link";

type AgentStatus = "Completed" | "In Progress" | "Preparing";

type AgentCard = {
  name: string;
  status: AgentStatus;
  description: string;
  icon: "target" | "search" | "mail" | "pen" | "palette" | "shield" | "rocket";
  progress?: number;
};

const agents: AgentCard[] = [
  {
    name: "Strategy Agent",
    status: "Completed",
    description: "Campaign strategy locked in",
    icon: "target",
  },
  {
    name: "Research Agent",
    status: "Completed",
    description: "Market & competitor insights done",
    icon: "search",
  },
  {
    name: "Content Agent",
    status: "Completed",
    description: "Ad drafts & landing copy ready",
    icon: "pen",
  },
  {
    name: "Email Agent",
    status: "Completed",
    description: "Email sequence ready to send",
    icon: "mail",
  },
  {
    name: "Design Agent",
    status: "In Progress",
    description: "Visual assets in production",
    icon: "palette",
    progress: 73,
  },
  {
    name: "QA Agent",
    status: "Completed",
    description: "All checks passed",
    icon: "shield",
  },
  {
    name: "Launch Agent",
    status: "Preparing",
    description: "Finalizing assets for launch",
    icon: "rocket",
    progress: 71,
  },
];

const stats = [
  { value: "8+", label: "AI Agents" },
  { value: "100%", label: "Autonomous Execution" },
  { value: "< 2 min", label: "From Brief to Launch Plan" },
  { value: "24/7", label: "Campaign Intelligence" },
];

const launchTabs = ["Overview", "Plan", "Assets", "Tasks", "Performance", "Export"];

function Icon({
  name,
}: {
  name: AgentCard["icon"] | "spark" | "play";
}) {
  if (name === "spark") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <path
          d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "play") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M8 5.5v13l10-6.5-10-6.5Z" />
      </svg>
    );
  }

  const paths: Record<AgentCard["icon"], React.ReactNode> = {
    target: (
      <>
        <path d="M12 21a9 9 0 1 0-9-9" />
        <path d="M12 17a5 5 0 1 0-5-5" />
        <path d="M12 13a1 1 0 1 0-1-1" />
        <path d="M13 11l5-5" />
        <path d="M18 6V3h3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    mail: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    pen: (
      <>
        <path d="m5 19 4.2-1 9.3-9.3a2.1 2.1 0 0 0-3-3L6.2 15 5 19Z" />
        <path d="m14 6 4 4" />
      </>
    ),
    palette: (
      <>
        <path d="M12 21a9 9 0 1 1 8.4-5.8c.5 1.3-.4 2.8-1.9 2.8h-1.3c-.9 0-1.6.7-1.6 1.6 0 .8-.7 1.4-1.5 1.4H12Z" />
        <circle cx="7.5" cy="10" r="1" />
        <circle cx="10.5" cy="7" r="1" />
        <circle cx="14.5" cy="7.5" r="1" />
        <circle cx="16.5" cy="11" r="1" />
      </>
    ),
    shield: (
      <>
        <path d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    rocket: (
      <>
        <path d="M12 15 9 12c1.2-4.4 4.2-7.4 9-9 .4 4.8-1.2 8.2-6 12Z" />
        <path d="M9 12H5l-2 4 5-1" />
        <path d="M12 15v4l-4 2 1-5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const styles: Record<AgentStatus, string> = {
    Completed: "bg-emerald-400/15 text-emerald-300",
    "In Progress": "bg-slate-500/25 text-slate-200",
    Preparing: "bg-slate-500/25 text-slate-200",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${styles[status]}`}>
      {status}
    </span>
  );
}

function AgentCardItem({ agent }: { agent: AgentCard }) {
  return (
    <div className="rounded-[1.35rem] border border-[#8EA7FF]/35 bg-[#0A0E1A]/90 p-4 shadow-[0_0_30px_rgba(96,112,255,0.18)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-slate-200">
          <Icon name={agent.icon} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-black tracking-tight text-white">
            {agent.name}
          </h3>

          <div className="mt-2">
            <StatusBadge status={agent.status} />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-slate-300">
            {agent.description}
          </p>
        </div>
      </div>

      {typeof agent.progress === "number" ? (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6D4DFF] to-[#7EC8FF]"
              style={{ width: `${agent.progress}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-300">
            {agent.progress}%
          </span>
        </div>
      ) : null}
    </div>
  );
}

function CampaignPilotCore() {
  return (
    <div className="relative mx-auto grid h-[180px] w-[180px] place-items-center sm:h-[220px] sm:w-[220px] lg:h-[250px] lg:w-[250px]">
      <div className="absolute inset-0 rounded-full bg-[#493BFF]/25 blur-3xl" />
      <div className="absolute inset-5 rounded-full border border-[#7C8CFF]/25" />
      <div className="absolute inset-10 rounded-full border border-[#7C8CFF]/20" />

      <div className="relative grid h-[120px] w-[120px] place-items-center rounded-[1.75rem] border border-[#B9C7FF]/55 bg-[#080A14] shadow-[0_0_70px_rgba(101,92,255,0.85)] sm:h-[145px] sm:w-[145px]">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6B5BFF]/20 text-[#C5B8FF]">
            <Icon name="spark" />
          </div>

          <p className="text-sm font-black text-white sm:text-base">
            CampaignPilot
          </p>
          <p className="text-sm font-black text-white sm:text-base">Core</p>
        </div>
      </div>
    </div>
  );
}

function AgentNetwork() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-1/2 top-[18%] hidden h-[360px] w-[360px] -translate-x-1/2 rounded-full border border-indigo-500/10 lg:block" />
      <div className="pointer-events-none absolute left-1/2 top-[23%] hidden h-[250px] w-[250px] -translate-x-1/2 rounded-full border border-indigo-500/10 lg:block" />

      <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_230px_1fr] lg:items-center">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <AgentCardItem agent={agents[1]} />
          <AgentCardItem agent={agents[3]} />
        </div>

        <div className="relative py-4 lg:py-0">
          <CampaignPilotCore />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <AgentCardItem agent={agents[0]} />
          <AgentCardItem agent={agents[2]} />
        </div>
      </div>

      <div className="relative z-10 mt-4 grid gap-4 sm:grid-cols-3">
        <AgentCardItem agent={agents[4]} />
        <AgentCardItem agent={agents[5]} />
        <AgentCardItem agent={agents[6]} />
      </div>
    </div>
  );
}

function LaunchRoomPreview() {
  return (
    <div className="mx-auto mt-8 max-w-[780px] rounded-[1.25rem] border border-[#7C8CFF]/45 bg-[#080B18]/90 p-4 shadow-[0_0_80px_rgba(74,92,255,0.35)] backdrop-blur-2xl lg:mt-10">
      <div className="relative">
        <h2 className="mb-4 px-2 text-lg font-black text-white">Launch Room</h2>

        <div className="grid overflow-hidden rounded-xl border border-white/5 bg-[#080B18] lg:grid-cols-[145px_1fr]">
          <aside className="hidden border-r border-white/5 bg-white/[0.02] p-3 lg:block">
            <div className="space-y-2">
              {launchTabs.map((tab, index) => (
                <div
                  key={tab}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold ${
                    index === 0
                      ? "bg-[#635BFF]/25 text-white"
                      : "text-slate-400"
                  }`}
                >
                  <span className="h-3 w-3 rounded-[4px] border border-current" />
                  {tab}
                </div>
              ))}
            </div>
          </aside>

          <section className="p-4">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">
                Campaign Progress
              </h3>
              <p className="text-sm font-black text-white">88%</p>
            </div>

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#6B4DFF] via-[#586BFF] to-[#74BFFF]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Tasks Completed", "24", "/28"],
                ["Assets Ready", "32", "/36"],
                ["Checks Passed", "18", "/20"],
                ["Est. Launch", "12", "min"],
              ].map(([label, value, suffix]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/5 bg-white/[0.04] p-4"
                >
                  <p className="text-[11px] font-semibold text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {value}
                    <span className="ml-1 text-sm text-slate-400">{suffix}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2">
                <p className="text-sm font-black text-white">
                  Live Activity Feed
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>

              <div className="flex items-center justify-between gap-4 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#6B5BFF]" />
                  All systems operational. Launch sequence on track.
                </p>
                <span className="hidden text-slate-400 sm:inline">Just now</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(70,86,255,0.2),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(126,200,255,0.12),transparent_20%),linear-gradient(180deg,#000000_0%,#02030A_55%,#030614_100%)]" />
      <div className="pointer-events-none absolute left-[-10%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#4238FF]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[65%] h-[280px] w-[520px] rounded-full bg-[#3C7DFF]/15 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1720px] flex-col px-5 py-6 sm:px-8 lg:px-14">
        <nav className="z-30 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-black tracking-tight sm:text-2xl">
            CampaignPilot
          </Link>

          <Link
            href="/campaign/new"
            className="rounded-full border border-[#8B7CFF]/70 bg-black/60 px-5 py-3 text-xs font-black text-white shadow-[0_0_30px_rgba(126,111,255,0.45)] transition hover:border-[#AEB8FF] hover:bg-white hover:text-black sm:px-7 sm:text-sm"
          >
            Build a Campaign
          </Link>
        </nav>

        <div className="relative z-10 grid flex-1 items-center gap-12 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:py-8">
          <section className="max-w-[690px]">
            <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-[#7160FF]/70 bg-white/[0.03] px-5 py-3 text-xs font-bold text-slate-200 shadow-[0_0_24px_rgba(113,96,255,0.35)] sm:mb-16 sm:text-sm">
              <span className="text-[#8A7CFF]">
                <Icon name="spark" />
              </span>
              Autonomous campaign execution agent
            </div>

            <h1 className="text-[3rem] font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-[4.7rem] lg:text-[5.45rem]">
              Your AI agents.
              <br />
              Your next launch.
              <br />
              <span className="bg-gradient-to-r from-[#704CFF] via-[#7777FF] to-[#78D8FF] bg-clip-text text-transparent">
                Fully autonomous.
              </span>
            </h1>

            <p className="mt-7 max-w-[650px] text-base leading-8 text-slate-400 sm:text-lg">
              CampaignPilot turns brief to launch into a closed-loop system. AI
              agents plan, create, execute, and optimize — while you stay in
              control.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:mt-14 sm:flex-row">
              <Link
                href="/campaign/new"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5D3DFF] to-[#8BC7FF] px-8 py-5 text-base font-black text-white shadow-[0_0_35px_rgba(100,97,255,0.7)] transition hover:scale-[1.02] sm:text-lg"
              >
                Build a Campaign
                <span className="text-xl">↗</span>
              </Link>

              <Link
                href="/campaign/demo"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-black/35 px-8 py-5 text-base font-black text-white transition hover:bg-white hover:text-black"
              >
                Explore Launch Room
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-black">
                  <Icon name="play" />
                </span>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-6 sm:mt-24 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`${
                    index === 0 ? "" : "sm:border-l sm:border-white/10 sm:pl-6"
                  }`}
                >
                  <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-medium text-slate-400 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative">
            <AgentNetwork />
            <LaunchRoomPreview />
          </section>
        </div>
      </section>
    </main>
  );
}
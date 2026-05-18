import Link from "next/link";
import { mockCampaign } from "@/lib/mockCampaign";

export default function DemoLandingPagePreview() {
  const campaign = mockCampaign;
  const page = campaign.landingPage;

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="border-b border-slate-200 bg-slate-950 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/campaign/demo" className="text-sm font-bold">
            ← Back to Launch Room
          </Link>

          <p className="text-sm font-semibold text-slate-300">
            Generated Landing Page Preview
          </p>
        </div>
      </div>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
              Built for African SMEs
            </p>

            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
              {page.hero.headline}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {page.hero.subheadline}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#lead-form"
                className="rounded-full bg-slate-950 px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-slate-800"
              >
                {page.hero.primaryCTA}
              </a>

              <a
                href="#how-it-works"
                className="rounded-full border border-slate-300 px-7 py-4 text-center text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-2xl shadow-slate-200">
            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-slate-500">HR Dashboard</p>

              <div className="mt-5 grid gap-4">
                {[
                  "Payroll",
                  "Leave requests",
                  "Employee records",
                  "Compliance",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <span className="font-bold text-slate-700">{item}</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                      Organized
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              The Problem
            </p>

            <h2 className="text-4xl font-black tracking-tight">
              {page.problem.headline}
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {page.problem.points.map((point) => (
              <div
                key={point}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 h-10 w-10 rounded-full bg-slate-950" />
                <p className="font-bold leading-7 text-slate-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              Benefits
            </p>

            <h2 className="text-4xl font-black tracking-tight">
              Everything your HR team needs in one cleaner workflow.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {page.benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-lg font-black">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              How it works
            </p>

            <h2 className="text-4xl font-black tracking-tight">
              Move from scattered HR work to one simple system.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {page.howItWorks.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">
                  {index + 1}
                </div>

                <h3 className="text-xl font-black">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lead-form" className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              Book Demo
            </p>

            <h2 className="text-4xl font-black tracking-tight">
              {campaign.leadCapture.formTitle}
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              See how your team can manage payroll, leave, records, and
              compliance from one workspace.
            </p>
          </div>

          <form className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-xl shadow-slate-200">
            <div className="grid gap-4">
              {campaign.leadCapture.fields.map((field) => (
                <div key={field}>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {field}
                  </label>

                  <input
                    type={field.toLowerCase().includes("email") ? "email" : "text"}
                    placeholder={field}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white transition hover:bg-slate-800"
            >
              {page.hero.primaryCTA}
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              {campaign.leadCapture.thankYouMessage}
            </p>
          </form>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-sm font-black uppercase tracking-[0.2em] text-slate-500">
            FAQ
          </p>

          <h2 className="text-center text-4xl font-black tracking-tight">
            Questions your buyers may ask
          </h2>

          <div className="mt-10 space-y-4">
            {page.faq.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-black">{item.question}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { Campaign, Lead } from "@/types/campaign";

function createLeadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function GeneratedLandingPagePreview() {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!params.id) return;

    const stored = localStorage.getItem(`campaign:${params.id}`);

    if (stored) {
      const parsedCampaign = JSON.parse(stored) as Campaign;

      setCampaign({
        ...parsedCampaign,
        leads: parsedCampaign.leads || [],
      });
    }
  }, [params.id]);

  const page = campaign?.landingPage;

  const requiredFields = useMemo(() => {
    if (!campaign) return [];

    return campaign.leadCapture.fields;
  }, [campaign]);

  function updateField(field: string, value: string) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!campaign) return;

    setSubmitError("");

    const cleanedValues: Record<string, string> = {};

    for (const field of requiredFields) {
      const value = String(formValues[field] || "").trim();

      if (!value) {
        setSubmitError(`Please fill in "${field}" before submitting.`);
        return;
      }

      cleanedValues[field] = value;
    }

    const emailField = requiredFields.find((field) =>
      field.toLowerCase().includes("email")
    );

    if (emailField) {
      const emailValue = cleanedValues[emailField];

      if (!emailValue.includes("@") || !emailValue.includes(".")) {
        setSubmitError("Please enter a valid work email.");
        return;
      }
    }

    const lead: Lead = {
      id: createLeadId(),
      campaignId: campaign.id,
      submittedAt: new Date().toISOString(),
      fields: cleanedValues,
    };

    const updatedCampaign: Campaign = {
      ...campaign,
      leads: [lead, ...(campaign.leads || [])],
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `campaign:${updatedCampaign.id}`,
      JSON.stringify(updatedCampaign)
    );

    setCampaign(updatedCampaign);
    setSubmittedLead(lead);
    setFormValues({});
  }

  if (!campaign || !page) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-slate-950">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-black">Landing page not found</h1>
          <p className="mt-3 text-slate-600">Generate a campaign first.</p>

          <Link
            href="/campaign/new"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white"
          >
            Create Campaign
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="border-b border-slate-200 bg-slate-950 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href={`/campaign/${campaign.id}`} className="text-sm font-bold">
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
              {campaign.parsedBrief.product}
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
              <p className="text-sm font-bold text-slate-500">
                Campaign Dashboard
              </p>

              <div className="mt-5 grid gap-4">
                {campaign.landingPage.benefits.slice(0, 4).map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <span className="font-bold text-slate-700">{item}</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                      Ready
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-500">
                  Leads captured
                </p>
                <p className="mt-1 text-3xl font-black">
                  {campaign.leads?.length || 0}
                </p>
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
              Everything your buyer needs in one cleaner workflow.
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
              Move from messy interest to a clear next step.
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
              Lead Capture
            </p>

            <h2 className="text-4xl font-black tracking-tight">
              {campaign.leadCapture.formTitle}
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              This form now saves real demo leads into the generated campaign
              workspace.
            </p>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                Captured leads for this campaign
              </p>
              <p className="mt-2 text-4xl font-black">
                {campaign.leads?.length || 0}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleLeadSubmit}
            className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-xl shadow-slate-200"
          >
            {submittedLead ? (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                <p className="font-black">Lead captured.</p>
                <p>{campaign.leadCapture.thankYouMessage}</p>
              </div>
            ) : null}

            {submitError ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                {submitError}
              </div>
            ) : null}

            <div className="grid gap-4">
              {campaign.leadCapture.fields.map((field) => (
                <div key={field}>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    {field}
                  </label>

                  <input
                    required
                    value={formValues[field] || ""}
                    onChange={(event) => updateField(field, event.target.value)}
                    type={field.toLowerCase().includes("email") ? "email" : "text"}
                    placeholder={field}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
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
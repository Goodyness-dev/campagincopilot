import { NextRequest, NextResponse } from "next/server";
import { runCampaignWorkflow } from "@/lib/ai/workflow";
import type { Campaign } from "@/types/campaign";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawBrief = String(body.rawBrief || "").trim();

    if (!rawBrief) {
      return NextResponse.json(
        { error: "Paste a campaign brief first." },
        { status: 400 }
      );
    }

    if (rawBrief.length < 40) {
      return NextResponse.json(
        {
          error:
            "Brief is too short. Add the product, buyer, pain point, and campaign goal.",
        },
        { status: 400 }
      );
    }

    const generated = await runCampaignWorkflow(rawBrief);
    const now = new Date().toISOString();

    const campaign: Campaign = {
      id: crypto.randomUUID(),
      rawBrief,
      status: "completed",
      ...generated,
      leads: [],
      createdAt: now,
      updatedAt: now,
    };

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Campaign generation failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while generating the campaign.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
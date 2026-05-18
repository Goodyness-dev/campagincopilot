# CampaignPilot

CampaignPilot is an autonomous campaign execution agent that turns a messy business brief into a launch-ready campaign funnel.

It generates a Launch Room containing:

- Campaign strategy
- Selected campaign angle
- LinkedIn ad draft
- Short-form video ad draft
- Landing page preview
- Lead capture form
- Follow-up email sequence
- Launch tasks
- QA report
- Claim safety report
- Repair report
- Exportable JSON and Markdown assets

## Why it matters

Small businesses and agencies do not just need campaign ideas. They need launch-ready execution.

CampaignPilot turns raw business context into practical campaign assets that can be reviewed, copied, exported, and launched.

## Demo flow

1. Open the campaign intake page.
2. Paste a messy business brief or use the demo brief.
3. Generate a Launch Room.
4. Review the agent workflow.
5. Open the landing page preview.
6. Submit the lead capture form.
7. Return to the Launch Room and view the captured lead.
8. Export campaign assets as JSON or Markdown.

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Gemini API
- Browser localStorage for hackathon MVP persistence

## Architecture

```txt
User Brief
   ↓
Next.js Campaign Intake UI
   ↓
/api/campaigns/run
   ↓
Agent Workflow Orchestrator
   ↓
Gemini Model Calls
   ↓
Validation + Minimum Output Checks
   ↓
Claim Safety Check
   ↓
QA + Repair Layer
   ↓
Generated Campaign JSON
   ↓
Launch Room UI
   ↓
Landing Page Preview
   ↓
Lead Capture Form
   ↓
Export JSON / Markdown
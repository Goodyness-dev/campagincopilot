import { Campaign } from "@/types/campaign";

export const demoBrief = `We built HR software for African SMEs. HR teams are managing payroll, employee records, leave requests, and compliance with spreadsheets and WhatsApp. We want to get demo bookings from founders and HR managers on LinkedIn. We are new, competitors are bigger, but we are simpler and built for local teams.`;

export const mockCampaign: Campaign = {
  id: "demo",
  rawBrief: demoBrief,
  status: "completed",

  agentStages: [
    {
      name: "Brief Parser Agent",
      status: "completed",
      outputSummary: "Parsed HR software for African SMEs.",
    },
    {
      name: "Strategy Agent",
      status: "completed",
      outputSummary: 'Selected "Stop running HR from five spreadsheets".',
    },
    {
      name: "Platform Draft Agent",
      status: "completed",
      outputSummary: "Generated LinkedIn and short-form video drafts.",
    },
    {
      name: "Landing Page Agent",
      status: "completed",
      outputSummary:
        'Built landing page hero: "Stop running HR from five spreadsheets."',
    },
    {
      name: "Follow-up Email Agent",
      status: "completed",
      outputSummary: "Generated 3 follow-up emails.",
    },
    {
      name: "Launch Task Agent",
      status: "completed",
      outputSummary: "Generated 6 launch tasks.",
    },
    {
      name: "Claim Safety Agent",
      status: "completed",
      outputSummary: "Checked 14 claims. No risky claims detected.",
    },
    {
      name: "QA Agent",
      status: "completed",
      outputSummary: "Found 3 QA issues in the fallback campaign copy.",
    },
    {
      name: "Repair Agent",
      status: "repaired",
      outputSummary: "Applied 1 visible copy repair.",
    },
    {
      name: "Launch Room Assembly Agent",
      status: "completed",
      outputSummary: "Assembled final campaign workspace.",
    },
  ],

  parsedBrief: {
    businessName: "LocalHR",
    product: "HR software for African SMEs",
    buyer: "Founders, HR managers, and operations leads",
    campaignGoal: "Book product demos",
    platforms: ["LinkedIn", "Short-form video"],
    painPoints: [
      "Payroll is managed across spreadsheets",
      "Leave requests get buried in WhatsApp",
      "Employee records are scattered across files",
      "Compliance feels manual and risky",
    ],
    differentiator: "Simpler HR software built for African teams",
    missingInfo: ["Pricing", "Customer proof", "Exact company name"],
    assumptions: [
      "LinkedIn is the primary channel because the buyer is B2B",
      "The strongest CTA is demo booking",
    ],
  },

  strategyAngles: [
    {
      title: "Stop running HR from five spreadsheets",
      description:
        "A direct pain-led angle focused on scattered HR operations.",
      score: 94,
    },
    {
      title: "WhatsApp is not an HR system",
      description:
        "A memorable angle that attacks the messy current workflow.",
      score: 89,
    },
    {
      title: "Payroll should not steal your Friday",
      description:
        "An emotional angle focused on time loss and manual payroll stress.",
      score: 82,
    },
    {
      title: "Built for African teams, not imported workflows",
      description:
        "A differentiation angle based on local context and simplicity.",
      score: 80,
    },
    {
      title: "One place for payroll, leave, records, and compliance",
      description: "A clarity angle focused on product consolidation.",
      score: 78,
    },
  ],

  selectedStrategy: {
    title: "Stop running HR from five spreadsheets",
    reason:
      "It is specific, visual, painful, and instantly understandable to founders and HR managers.",
  },

  platformDrafts: {
    linkedin: {
      headline: "Stop running HR from five spreadsheets.",
      primaryText:
        "Payroll in one file. Leave requests in WhatsApp. Employee records somewhere else. That works until your team starts growing. LocalHR gives African SMEs one simple place to manage payroll, leave, records, and compliance without spreadsheet chaos.",
      cta: "Book Demo",
      targetAudience: [
        "Founders",
        "HR Managers",
        "Operations Managers",
        "SMEs with 20–200 employees",
        "Nigeria, Ghana, Kenya",
      ],
    },
    shortVideo: {
      hook: "Your HR system is probably five spreadsheets and a WhatsApp group.",
      script:
        "Payroll is in one file. Leave requests are in WhatsApp. Employee records are scattered everywhere. That might work for five employees, but not for fifty. LocalHR helps African SMEs manage payroll, leave, records, and compliance in one simple workspace. Stop chasing files. Start running HR properly.",
      scenes: [
        "Founder switching between messy spreadsheets",
        "HR manager searching WhatsApp for leave requests",
        "Dashboard showing payroll, leave, and employee records in one place",
        "Final CTA screen: Book a demo",
      ],
      caption: "Still running HR from spreadsheets? It is time to fix that.",
      cta: "Book a demo",
    },
  },

  landingPage: {
    hero: {
      headline: "Stop running HR from five spreadsheets.",
      subheadline:
        "Payroll, employee records, leave requests, and compliance in one simple workspace built for African SMEs.",
      primaryCTA: "Book a Demo",
    },
    problem: {
      headline: "HR gets messy when your team starts growing.",
      points: [
        "Payroll lives in spreadsheets.",
        "Leave requests disappear in WhatsApp.",
        "Employee records are scattered across files.",
        "Compliance tracking becomes stressful and manual.",
      ],
    },
    benefits: [
      "Run payroll with less manual work",
      "Keep employee records organized",
      "Track leave requests in one place",
      "Prepare for compliance without spreadsheet chaos",
    ],
    howItWorks: [
      "Add your employees",
      "Manage payroll and leave",
      "Track records from one dashboard",
    ],
    faq: [
      {
        question: "Who is this for?",
        answer:
          "African SMEs that want a simpler way to manage HR operations.",
      },
      {
        question: "Does this replace spreadsheets?",
        answer:
          "Yes. The goal is to move payroll, leave, records, and compliance into one organized workspace.",
      },
    ],
  },

  leadCapture: {
    formTitle: "Book a 15-minute demo",
    fields: ["Name", "Work email", "Company", "Team size"],
    thankYouMessage: "Thanks — we’ll reach out with demo times shortly.",
  },

    leads: [
    {
      id: "lead-demo-1",
      campaignId: "demo",
      submittedAt: new Date().toISOString(),
      fields: {
        Name: "Ada Okafor",
        "Work email": "ada@samplecompany.com",
        Company: "SampleCo HR",
        "Team size": "45",
      },
    },
  ],

  followUpEmails: [
    {
      subject: "Your LocalHR demo request",
      body:
        "Thanks for requesting a demo. We’ll show you how LocalHR helps African SMEs manage payroll, leave, employee records, and compliance from one workspace.",
    },
    {
      subject: "Still managing HR across spreadsheets?",
      body:
        "When payroll, leave, and records live in different places, HR becomes harder as your team grows. LocalHR helps bring everything together.",
    },
    {
      subject: "Ready to simplify HR?",
      body:
        "If your team is still using spreadsheets and WhatsApp for HR, LocalHR can help you move to one cleaner system. Book a time that works for you.",
    },
  ],

  tasks: [
    "Confirm final product name",
    "Add proof or testimonial if available",
    "Review LinkedIn ad copy",
    "Publish landing page",
    "Connect lead form to CRM or email inbox",
    "Prepare demo calendar link",
  ],

  qaReport: {
    status: "repaired",
    issues: [
      "Original fallback headline was too generic.",
      "The campaign needed stronger pain specificity.",
      "CTA needed clearer demo-booking intent.",
    ],
  },

  claimSafety: {
    status: "passed",
    checkedClaims: 14,
    issues: [],
  },

  repairs: [
    {
      before: "Simplify HR for your business.",
      after: "Stop running HR from five spreadsheets.",
      reason:
        "The repaired version is more visual, specific, and pain-driven. It shows the exact messy workflow the buyer wants to escape instead of using generic SaaS language.",
    },
  ],
};
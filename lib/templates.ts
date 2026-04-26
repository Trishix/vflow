import { nanoid } from "nanoid";
import type { Workflow } from "./workflow-store";

type WorkflowSeed = Omit<Workflow, "id" | "createdAt" | "updatedAt">;
type WorkflowNode = Workflow["nodes"][number];
type WorkflowEdge = Workflow["edges"][number];

const point = (x: number, y: number) => ({ x, y });

const promptNode = (
  id: string,
  prompt: string,
  label: string,
  x: number,
  y: number,
  width = 480,
  height = 200
): WorkflowNode => ({
  id,
  type: "prompt",
  position: point(x, y),
  width,
  height,
  data: {
    prompt,
    label,
    dirty: false,
    loading: false,
    output: prompt,
  },
});

const aiNode = (
  id: string,
  systemPrompt: string,
  output: string,
  x: number,
  y: number,
  width = 520,
  height = 280
): WorkflowNode => ({
  id,
  type: "ai",
  position: point(x, y),
  width,
  height,
  data: {
    systemPrompt,
    modelId: "gemini-2.5-flash",
    dirty: false,
    loading: false,
    output,
  },
});

const markdownNode = (
  id: string,
  text: string,
  x: number,
  y: number,
  width = 620,
  height = 320
): WorkflowNode => ({
  id,
  type: "markdown",
  position: point(x, y),
  width,
  height,
  data: {
    text,
    dirty: false,
    loading: false,
    output: text,
  },
});

const noteNode = (id: string, text: string, x: number, y: number, width = 360, height = 150): WorkflowNode => ({
  id,
  type: "annotation",
  position: point(x, y),
  width: Math.max(width, 420),
  height: Math.max(height, 170),
  data: {
    text,
    loading: false,
  },
});

const edge = (source: string, target: string): WorkflowEdge => ({
  id: `${source}-${target}`,
  source,
  target,
  type: "default",
  animated: false,
});

const makeWorkflow = (workflow: WorkflowSeed, index: number): Workflow => {
  const stamp = new Date(Date.now() - index * 1000).toISOString();
  return {
    ...workflow,
    id: nanoid(),
    createdAt: stamp,
    updatedAt: stamp,
  };
};

const supportTriageSeed = {
  name: "Customer support triage",
  nodes: [
    promptNode(
      "support-ticket",
      `Customer message:
We upgraded to the Pro plan yesterday, but the invoice view still shows the old billing cycle. The customer says they need the invoice for procurement before Friday.`,
      "customer message",
      -640,
      -120,
      520,
      200
    ),
    promptNode(
      "support-context",
      `Account context:
- Plan: Pro
- Renewal date: 2026-05-04
- Billing cadence: quarterly
- Success manager: Priya`,
      "account context",
      -640,
      120,
      520,
      200
    ),
    promptNode(
      "support-rules",
      `Response rules:
- Tone: calm, direct, specific
- Acknowledge the issue first
- Ask for screenshots only if needed
- Escalate if billing data is stale after refresh`,
      "response rules",
      -640,
      360,
      520,
      220
    ),
    aiNode(
      "support-triage",
      `Read the ticket and supporting context. Return:
- category
- severity
- likely cause
- immediate next step
- escalation flag
Keep it short and operational.`,
      `Category: Billing data sync
Severity: High
Likely cause: invoice cache has not refreshed after the plan upgrade.
Immediate next step: verify billing sync and offer a manual invoice export.
Escalation: billing team if refresh fails.`,
      -20,
      120,
      520,
      300
    ),
    markdownNode(
      "support-triage-md",
      `### Triage summary

- Category: Billing data sync
- Severity: High
- Likely cause: invoice cache has not refreshed after the plan upgrade
- Immediate next step: verify billing sync and offer a manual invoice export
- Escalation: billing team if refresh fails`,
      520,
      120,
      620,
      320
    ),
    aiNode(
      "support-reply",
      `Write a customer-facing reply using the triage summary and the response rules.
Be empathetic, concise, and ready to send.
Do not mention internal systems or classifications.`,
      `Hi,

Thanks for the detailed report. I can see why this is blocking procurement.

We are checking the billing sync now and I can also send a manual invoice export right away so you are not waiting on the cache refresh.

I will update you as soon as the invoice view is current. If you can share a screenshot of what you see, that can help us verify the display faster.

Best,
Support`,
      -20,
      460,
      520,
      340
    ),
    markdownNode(
      "support-reply-md",
      `Hi,

Thanks for the detailed report. I can see why this is blocking procurement.

We are checking the billing sync now and I can also send a manual invoice export right away so you are not waiting on the cache refresh.

I will update you as soon as the invoice view is current. If you can share a screenshot of what you see, that can help us verify the display faster.

Best,
Support`,
      520,
      460,
      620,
      360
    ),
    noteNode(
      "support-note-1",
      "Use the first AI node for internal triage before drafting the reply.",
      -320,
      -360,
      360,
      140
    ),
    noteNode(
      "support-note-2",
      "The second AI node turns the structured triage into a customer-ready response.",
      920,
      20,
      400,
      160
    ),
  ],
  edges: [
    edge("support-ticket", "support-triage"),
    edge("support-context", "support-triage"),
    edge("support-rules", "support-triage"),
    edge("support-triage", "support-triage-md"),
    edge("support-triage", "support-reply"),
    edge("support-context", "support-reply"),
    edge("support-rules", "support-reply"),
    edge("support-reply", "support-reply-md"),
  ],
} satisfies WorkflowSeed;

const meetingRecapSeed = {
  name: "Meeting recap to action plan",
  nodes: [
    promptNode(
      "meeting-notes",
      `Transcript notes:
The team agreed to ship the onboarding redesign in two phases. Passwordless login stays behind a feature flag until analytics coverage is complete. Support training is still unscheduled.`,
      "meeting notes",
      -620,
      -130,
      500,
      200
    ),
    promptNode(
      "meeting-context",
      `Context:
- Weekly product sync
- Participants: PM, Design, Support, Engineering
- Goal: release readiness`,
      "meeting context",
      -620,
      120,
      500,
      180
    ),
    promptNode(
      "follow-up-rules",
      `Follow-up rules:
- Turn decisions into action items with owner and deadline
- Call out blockers
- Keep the wording ready for a project update`,
      "follow-up rules",
      -620,
      340,
      500,
      200
    ),
    aiNode(
      "meeting-summary",
      `Summarize the meeting into decisions, risks, and open questions.
Keep the answer concise and structured for internal review.`,
      `Decisions
- Ship onboarding redesign in two phases
- Keep passwordless login behind a feature flag

Risks
- Analytics coverage is incomplete
- Support training is not scheduled

Open questions
- Who owns the rollout checklist?`,
      -10,
      120,
      520,
      320
    ),
    markdownNode(
      "meeting-summary-md",
      `### Meeting recap

**Decisions**
- Ship onboarding redesign in two phases
- Keep passwordless login behind a feature flag

**Risks**
- Analytics coverage is incomplete
- Support training is not scheduled

**Open questions**
- Who owns the rollout checklist?`,
      520,
      120,
      620,
      340
    ),
    aiNode(
      "meeting-actions",
      `Turn the summary into an action plan with owner, deadline, dependency, and status.
Use a compact markdown table and keep it ready to paste into a project tracker.`,
      `| Action | Owner | Deadline | Dependency |
| --- | --- | --- | --- |
| Finalize rollout checklist | PM | Friday | Engineering sign-off |
| Complete event coverage audit | Analytics | Thursday | Tracking plan |
| Schedule support training | Support lead | Monday | Finalized release notes |`,
      -10,
      480,
      520,
      360
    ),
    markdownNode(
      "meeting-actions-md",
      `| Action | Owner | Deadline | Dependency |
| --- | --- | --- | --- |
| Finalize rollout checklist | PM | Friday | Engineering sign-off |
| Complete event coverage audit | Analytics | Thursday | Tracking plan |
| Schedule support training | Support lead | Monday | Finalized release notes |`,
      520,
      480,
      620,
      360
    ),
    noteNode(
      "meeting-note-1",
      "Use the context node to add attendees, meeting type, or the release deadline.",
      -320,
      -360,
      360,
      140
    ),
    noteNode(
      "meeting-note-2",
      "The second AI node converts the recap into a task list you can hand off immediately.",
      920,
      20,
      410,
      160
    ),
  ],
  edges: [
    edge("meeting-notes", "meeting-summary"),
    edge("meeting-context", "meeting-summary"),
    edge("follow-up-rules", "meeting-summary"),
    edge("meeting-summary", "meeting-summary-md"),
    edge("meeting-summary", "meeting-actions"),
    edge("meeting-context", "meeting-actions"),
    edge("follow-up-rules", "meeting-actions"),
    edge("meeting-actions", "meeting-actions-md"),
  ],
} satisfies WorkflowSeed;

const launchBriefSeed = {
  name: "Launch brief generator",
  nodes: [
    promptNode(
      "product-brief",
      `Product facts:
A B2B AI workflow tool that helps teams standardize support replies, meeting follow-up, and content briefs. It runs locally, supports custom API keys, and stores reusable templates.`,
      "product brief",
      -620,
      -120,
      500,
      200
    ),
    promptNode(
      "target-audience",
      `Audience:
Operations managers, customer success leads, and founders who need repeatable writing workflows without adding process overhead.`,
      "target audience",
      -620,
      120,
      500,
      180
    ),
    promptNode(
      "channel-constraints",
      `Channel constraints:
- LinkedIn post: professional, practical
- Email intro: short and direct
- X post: under 280 characters
- Avoid hype and vague claims`,
      "channel constraints",
      -620,
      340,
      500,
      220
    ),
    aiNode(
      "messaging-framework",
      `Create a launch brief with:
- positioning statement
- proof points
- differentiators
- objections and responses
Keep it practical and easy for a product marketer to use.`,
      `Positioning
- Standardize repetitive writing work with reusable workflows

Proof points
- Multiple connected nodes for real work
- Local data, editable outputs, reusable templates

Differentiators
- Built for internal operations, not generic chat
- Easy to adapt across support, marketing, and ops

Objections
- Too complex? Start with one workflow
- Too generic? Add source notes and labels`,
      -10,
      120,
      520,
      340
    ),
    markdownNode(
      "launch-brief-md",
      `### Launch brief

**Positioning**
Standardize repetitive writing work with reusable workflows.

**Proof points**
- Multiple connected nodes for real work
- Local data, editable outputs, reusable templates

**Differentiators**
- Built for internal operations, not generic chat
- Easy to adapt across support, marketing, and ops

**Objections**
- Too complex? Start with one workflow
- Too generic? Add source notes and labels`,
      520,
      120,
      620,
      360
    ),
    aiNode(
      "channel-copy",
      `Using the brief, draft one LinkedIn post, one email intro, and one X post.
Make each version sound realistic and specific to operations teams.`,
      `LinkedIn:
Teams do not need another blank page. They need repeatable workflows that turn support notes, meeting recaps, and rough ideas into usable output.

Email:
VFLOW helps teams turn recurring writing work into reusable workflows.

X:
Reusable workflows for support replies, meeting recaps, and launch copy. Less copying, more shipping.`,
      -10,
      480,
      520,
      360
    ),
    markdownNode(
      "channel-copy-md",
      `### Channel copy

**LinkedIn**
Teams do not need another blank page. They need repeatable workflows that turn support notes, meeting recaps, and rough ideas into usable output.

**Email**
VFLOW helps teams turn recurring writing work into reusable workflows.

**X**
Reusable workflows for support replies, meeting recaps, and launch copy. Less copying, more shipping.`,
      520,
      480,
      620,
      360
    ),
    noteNode(
      "launch-note-1",
      "Use the brief to keep the launch message grounded in workflow value, not general AI claims.",
      -300,
      -360,
      380,
      160
    ),
    noteNode(
      "launch-note-2",
      "The second AI node turns the brief into channel-specific copy without rewriting the strategy.",
      920,
      20,
      400,
      160
    ),
  ],
  edges: [
    edge("product-brief", "messaging-framework"),
    edge("target-audience", "messaging-framework"),
    edge("channel-constraints", "messaging-framework"),
    edge("messaging-framework", "launch-brief-md"),
    edge("messaging-framework", "channel-copy"),
    edge("target-audience", "channel-copy"),
    edge("channel-constraints", "channel-copy"),
    edge("channel-copy", "channel-copy-md"),
  ],
} satisfies WorkflowSeed;

const researchSynthesisSeed = {
  name: "Research synthesis",
  nodes: [
    promptNode(
      "source-notes",
      `Source notes:
Users do not know what to do after sign-up. Setup asks for too many decisions too early. Power users want flexibility later, but most people ask for one recommended path.`,
      "source notes",
      -620,
      -120,
      500,
      200
    ),
    promptNode(
      "research-question",
      `Research question:
What causes onboarding drop-off in week one?`,
      "research question",
      -620,
      120,
      500,
      160
    ),
    promptNode(
      "reader-profile",
      `Reader profile:
Product managers and customer success leads who need a decision memo, not a long research report.`,
      "reader profile",
      -620,
      320,
      500,
      180
    ),
    aiNode(
      "synthesis",
      `Extract themes, evidence, and contradictions from the source notes.
Return a structured synthesis that can feed a product decision.`,
      `Themes
- Users want a single recommended path after sign-up
- Setup asks for too many choices too early

Evidence
- Four of six interviews mentioned confusion about templates
- Three of six asked for one clear next step

Contradictions
- Power users want flexibility later in the flow`,
      -10,
      120,
      520,
      320
    ),
    markdownNode(
      "evidence-map",
      `### Evidence map

**Themes**
- Users want a single recommended path after sign-up
- Setup asks for too many choices too early

**Evidence**
- Four of six interviews mentioned confusion about templates
- Three of six asked for one clear next step

**Contradictions**
- Power users want flexibility later in the flow`,
      520,
      120,
      620,
      360
    ),
    aiNode(
      "decision-memo",
      `Turn the synthesis into a short decision memo with recommendation, rationale, risk, and next steps.
Write it for an internal product meeting.`,
      `Recommendation: Provide one guided onboarding path first and move advanced options later.

Rationale: Most users want clarity early. The current setup asks for too many decisions before they see value.

Risks: Advanced users may feel constrained.

Next steps: Test one guided path, measure completion, and surface customization after activation.`,
      -10,
      480,
      520,
      340
    ),
    markdownNode(
      "decision-memo-md",
      `### Decision memo

**Recommendation**
Provide one guided onboarding path first and move advanced options later.

**Rationale**
Most users want clarity early. The current setup asks for too many decisions before they see value.

**Risks**
Advanced users may feel constrained.

**Next steps**
Test one guided path, measure completion, and surface customization after activation.`,
      520,
      480,
      620,
      360
    ),
    noteNode(
      "research-note-1",
      "Keep the source notes raw so the synthesis step can extract signal without losing context.",
      -320,
      -360,
      360,
      160
    ),
    noteNode(
      "research-note-2",
      "The decision memo is the output most teams will actually paste into a product review.",
      920,
      20,
      400,
      150
    ),
  ],
  edges: [
    edge("source-notes", "synthesis"),
    edge("research-question", "synthesis"),
    edge("reader-profile", "synthesis"),
    edge("synthesis", "evidence-map"),
    edge("synthesis", "decision-memo"),
    edge("research-question", "decision-memo"),
    edge("reader-profile", "decision-memo"),
    edge("decision-memo", "decision-memo-md"),
  ],
} satisfies WorkflowSeed;

const salesFollowUpSeed = {
  name: "Sales follow-up builder",
  nodes: [
    promptNode(
      "call-notes",
      `Call notes:
The prospect needs reporting, multi-step approvals, and a clearer onboarding path. They already use a spreadsheet workaround and want to reduce manual follow-up.`,
      "call notes",
      -620,
      -120,
      500,
      200
    ),
    promptNode(
      "opportunity-context",
      `Opportunity context:
- Stage: post-demo
- Timeline: this quarter
- Stakeholders: operations lead, finance manager
- Goal: keep momentum without pressure`,
      "opportunity context",
      -620,
      120,
      500,
      200
    ),
    promptNode(
      "tone-rules",
      `Tone rules:
- Professional and concise
- Mention the next step clearly
- Do not overpromise
- Keep the ask low friction`,
      "tone rules",
      -620,
      340,
      500,
      200
    ),
    aiNode(
      "follow-up-email",
      `Write a tailored follow-up email based on the call notes and opportunity context.
Include a clear next step and keep the tone practical.`,
      `Hi,

Thanks again for the conversation. Based on what you shared, I think the biggest wins will come from removing the spreadsheet workaround, tightening the approval flow, and making the onboarding path clearer for your team.

If helpful, I can send a short rollout outline that shows how we would set this up for operations and finance.

Best,
Support`,
      -10,
      120,
      520,
      340
    ),
    markdownNode(
      "follow-up-email-md",
      `Hi,

Thanks again for the conversation. Based on what you shared, I think the biggest wins will come from removing the spreadsheet workaround, tightening the approval flow, and making the onboarding path clearer for your team.

If helpful, I can send a short rollout outline that shows how we would set this up for operations and finance.

Best,
Support`,
      520,
      120,
      620,
      360
    ),
    aiNode(
      "crm-update",
      `Convert the same notes into a CRM update with pain points, buying signals, objections, and next action.
Keep it compact and useful for a sales handoff.`,
      `Pain points: manual follow-up, spreadsheet workaround, unclear onboarding
Buying signals: wants reporting and multi-step approvals
Objections: no overpromising, wants low-friction rollout
Next action: send rollout outline and confirm finance stakeholder`,
      -10,
      480,
      520,
      320
    ),
    markdownNode(
      "crm-update-md",
      `### CRM update

**Pain points**
- Manual follow-up
- Spreadsheet workaround
- Unclear onboarding

**Buying signals**
- Wants reporting and multi-step approvals

**Objections**
- No overpromising
- Wants a low-friction rollout

**Next action**
- Send rollout outline and confirm finance stakeholder`,
      520,
      480,
      620,
      360
    ),
    noteNode(
      "sales-note-1",
      "Use the first output for the email, then reuse the same inputs for the CRM note.",
      -320,
      -360,
      360,
      150
    ),
    noteNode(
      "sales-note-2",
      "This workflow keeps the follow-up message and the sales record in sync.",
      920,
      20,
      360,
      150
    ),
  ],
  edges: [
    edge("call-notes", "follow-up-email"),
    edge("opportunity-context", "follow-up-email"),
    edge("tone-rules", "follow-up-email"),
    edge("follow-up-email", "follow-up-email-md"),
    edge("call-notes", "crm-update"),
    edge("opportunity-context", "crm-update"),
    edge("tone-rules", "crm-update"),
    edge("crm-update", "crm-update-md"),
  ],
} satisfies WorkflowSeed;

const hiringScreenSeed = {
  name: "Hiring screen workflow",
  nodes: [
    promptNode(
      "role-brief",
      `Role brief:
Product operations specialist for a team that runs recurring support, marketing, and enablement workflows. The role needs someone who can write clearly, organize inputs, and keep teams aligned.`,
      "role brief",
      -620,
      -120,
      500,
      200
    ),
    promptNode(
      "candidate-notes",
      `Candidate notes:
Strong at process design, but light on cross-functional stakeholder management. Has experience with automation tools, documentation, and handoffs.`,
      "candidate notes",
      -620,
      120,
      500,
      180
    ),
    promptNode(
      "evaluation-rubric",
      `Evaluation rubric:
- Communication clarity
- Workflow thinking
- Stakeholder management
- Execution reliability
- Interview risks`,
      "evaluation rubric",
      -620,
      320,
      500,
      200
    ),
    aiNode(
      "screening-memo",
      `Summarize the candidate against the rubric and call out strengths, concerns, and follow-up questions.
Write it for the hiring panel.`,
      `Strengths
- Clear process design
- Good documentation habits
- Familiar with automation tools

Concerns
- Limited evidence of stakeholder management
- Needs more examples of cross-functional execution

Follow-up questions
- How do you keep multiple teams aligned on one workflow?
- Tell us about a process you improved after rollout.`,
      -10,
      120,
      520,
      340
    ),
    markdownNode(
      "screening-memo-md",
      `### Screening memo

**Strengths**
- Clear process design
- Good documentation habits
- Familiar with automation tools

**Concerns**
- Limited evidence of stakeholder management
- Needs more examples of cross-functional execution

**Follow-up questions**
- How do you keep multiple teams aligned on one workflow?
- Tell us about a process you improved after rollout.`,
      520,
      120,
      620,
      380
    ),
    aiNode(
      "interview-plan",
      `Turn the memo into an interview plan with focus areas, scorecard prompts, and a short follow-up email.
Keep it usable by a recruiter or hiring manager.`,
      `Interview focus
- Workflow design
- Stakeholder communication
- Execution in ambiguous situations

Scorecard prompts
- Did the candidate explain process tradeoffs clearly?
- Did they show a method for aligning teams?

Follow-up email
Thanks for the conversation. We will share next steps after the panel review.`,
      -10,
      480,
      520,
      360
    ),
    markdownNode(
      "interview-kit-md",
      `### Interview kit

**Interview focus**
- Workflow design
- Stakeholder communication
- Execution in ambiguous situations

**Scorecard prompts**
- Did the candidate explain process tradeoffs clearly?
- Did they show a method for aligning teams?

**Follow-up email**
Thanks for the conversation. We will share next steps after the panel review.`,
      520,
      480,
      620,
      380
    ),
    noteNode(
      "hiring-note-1",
      "Use the memo to spot whether the candidate can operate across teams, not just document a process.",
      -320,
      -360,
      380,
      160
    ),
    noteNode(
      "hiring-note-2",
      "The final node gives you a panel-ready interview kit and a candidate-facing follow-up.",
      920,
      20,
      360,
      150
    ),
  ],
  edges: [
    edge("role-brief", "screening-memo"),
    edge("candidate-notes", "screening-memo"),
    edge("evaluation-rubric", "screening-memo"),
    edge("screening-memo", "screening-memo-md"),
    edge("screening-memo", "interview-plan"),
    edge("evaluation-rubric", "interview-plan"),
    edge("interview-plan", "interview-kit-md"),
    edge("candidate-notes", "interview-plan"),
  ],
} satisfies WorkflowSeed;

const welcomeSeed = {
  name: "Welcome",
  nodes: [
    promptNode(
      "welcome-brief",
      `Welcome to VFLOW.
Start here by describing the task you want to repeat: support reply, meeting recap, launch brief, research synthesis, or something else.`,
      "starter context",
      -620,
      -120,
      520,
      200
    ),
    promptNode(
      "welcome-inputs",
      `Helpful inputs:
- What kind of work are you standardizing?
- What source material do you already have?
- What should the final output look like?`,
      "starter inputs",
      -620,
      140,
      520,
      200
    ),
    aiNode(
      "welcome-plan",
      `Turn the starter context into a simple plan for the first workflow.
Return the key inputs, output format, and the best first node to add.`,
      `Start with one source node, one AI node, and one output node.
Use the source node for raw context, the AI node for the transformation, and the output node for the final result.`,
      -20,
      120,
      520,
      300
    ),
    markdownNode(
      "welcome-output",
      `### Suggested first workflow

1. Add a source node with the raw context.
2. Add an AI node to shape the output.
3. Add a markdown node for the final readable result.`,
      520,
      120,
      620,
      260
    ),
    noteNode(
      "welcome-note-1",
      "This template is meant to orient new users before they move into a more practical workflow.",
      -320,
      -360,
      380,
      150
    ),
    noteNode(
      "welcome-note-2",
      "You can swap the starter nodes for any of the more advanced templates after this.",
      920,
      80,
      360,
      150
    ),
  ],
  edges: [
    edge("welcome-brief", "welcome-plan"),
    edge("welcome-inputs", "welcome-plan"),
    edge("welcome-plan", "welcome-output"),
  ],
} satisfies WorkflowSeed;

export const templates: Workflow[] = [
  welcomeSeed,
  supportTriageSeed,
  meetingRecapSeed,
  launchBriefSeed,
  researchSynthesisSeed,
  salesFollowUpSeed,
  hiringScreenSeed,
].map(makeWorkflow);

export const newWorkflow: Workflow = {
  id: "support-reply-starter",
  name: "Support reply starter",
  createdAt: "2026-04-27T00:00:00.000Z",
  updatedAt: "2026-04-27T00:00:00.000Z",
  nodes: [
    promptNode(
      "customer-message",
      `Customer message:
I still cannot access the updated invoice after switching plans. The old file is blocking finance approval.`,
      "customer message",
      0,
      -80,
      500,
      200
    ),
    promptNode(
      "support-context",
      `Context:
- Current plan: Pro
- Billing mode: quarterly
- Account owner: finance team
- Goal: provide a clear next step`,
      "support context",
      0,
      180,
      500,
      180
    ),
    aiNode(
      "reply-draft",
      `Draft a concise support reply that acknowledges the issue, states the next step, and stays ready to send.
Do not mention any internal process details.`,
      `Hi,

Thanks for flagging this. I understand the invoice access issue is holding up finance approval.

We are checking the billing sync now and I will follow up with the updated invoice as soon as the refresh completes.

Best,
Support`,
      0,
      420,
      500,
      320
    ),
    markdownNode(
      "reply-preview",
      `Hi,

Thanks for flagging this. I understand the invoice access issue is holding up finance approval.

We are checking the billing sync now and I will follow up with the updated invoice as soon as the refresh completes.

Best,
Support`,
      0,
      820,
      620,
      320
    ),
    noteNode(
      "starter-note-1",
      "Add more source context here if you want the reply to be more specific.",
      -340,
      -220,
      340,
      150
    ),
    noteNode(
      "starter-note-2",
      "This starter keeps the first workflow short while still being useful on day one.",
      640,
      520,
      360,
      150
    ),
  ],
  edges: [
    edge("customer-message", "reply-draft"),
    edge("support-context", "reply-draft"),
    edge("reply-draft", "reply-preview"),
  ],
};

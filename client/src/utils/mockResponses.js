// ============================================================
//  Ethics Critic — Offline Mock Responses for Demo Mode
//  Provides instant, realistic deliberation output without API keys.
// ============================================================

const MOCK_DELIBERATIONS = [
  `## ⚖️ Utilitarian Analysis

**Verdict: CONDITIONAL SUPPORT** — with critical safeguards required.

From a consequentialist standpoint, this decision must be evaluated by its aggregate impact on overall welfare. The proposed course of action presents a net positive utility outcome for a substantial majority of affected stakeholders.

**Historical Precedent Check:**
This mirrors the 2016–2019 EU GDPR deliberation cycle, where regulators initially resisted aggressive data-sharing policies before establishing a rights-protective middle ground that ultimately served broader public good.

**5-Year Pre-Mortem:**
If implemented without oversight, the primary failure mode within 5 years is regulatory backlash triggered by documented harm to an underrepresented minority group. Early warning signs include escalating civil complaints and negative media coverage within the first 18 months.

**Reversibility Scale: 2/5 (Two-Way Door)** — The policy can be adjusted within 6–12 months if harm indicators emerge. A sunset clause and quarterly review mechanism is strongly advised.

**Required Safeguards:**
1. Mandatory quarterly impact assessments across all demographic subgroups.
2. Establish an independent ombudsman for affected-party grievances.
3. Transparent publication of aggregate outcomes metrics annually.`,

  `## 📜 Deontological Analysis

**Verdict: OPPOSE** — violates universal moral duties.

From a Kantian perspective, the proposed action cannot be universalized without generating a logical contradiction. Treating any person merely as a means to an institutional end—regardless of aggregate benefit—fails the Categorical Imperative test.

**Historical Precedent Check:**
The Nuremberg Code (1947) established the foundational precedent that consent, dignity, and individual inviolability cannot be overridden by claims of collective benefit. This principle has been repeatedly upheld in bioethics and corporate governance frameworks.

**5-Year Pre-Mortem:**
If implemented, the most dangerous failure mode is normalization of the principle that individual rights are negotiable against institutional efficiency metrics—setting a precedent exploitable by future, less scrupulous actors.

**Reversibility Scale: 1/5 (One-Way Door)** — Once trust and normative expectations are eroded, they are extremely difficult to restore. Institutional legitimacy damage compounds exponentially over time.

**Deontological Imperative:**
This decision requires explicit, informed, freely-revocable consent from all directly affected parties before any implementation can be considered ethically permissible.`,

  `## 🤝 Care Ethics Analysis

**Verdict: NUANCED — Prioritize Relational Accountability**

From a care ethics standpoint, this analysis must foreground the real human relationships, vulnerabilities, and power asymmetries at stake. Abstract cost-benefit calculations miss the most morally critical dimension: who is actually exposed to harm and who holds protective obligations toward them?

**Historical Precedent Check:**
The 2001 Enron collapse and subsequent Sarbanes-Oxley reforms illustrate what happens when institutional systems optimize for aggregate metrics while abandoning relational duty of care toward the most structurally vulnerable employees and investors.

**5-Year Pre-Mortem:**
The primary care ethics failure mode is emotional and relational exhaustion among the professionals directly responsible for implementation—a moral injury crisis that typically manifests within 2–3 years of ethically ambiguous deployment.

**Reversibility Scale: 3/5** — Some relational and trust damage can be repaired through sustained transparent engagement, but early harm to vulnerable individuals creates lasting reputational and psychological consequences.

**Care Imperative:**
Establish an ongoing, participatory engagement mechanism with the most vulnerable stakeholders throughout implementation—not just at the approval stage.`
];

const MOCK_TITLES = [
  'Deliberation Stream',
  'Multi-Framework Analysis',
  'Ethical Assessment'
];

export function getMockResponse(message = '') {
  const lower = message.toLowerCase();
  let idx = 0;
  if (lower.includes('right') || lower.includes('duty') || lower.includes('deont')) idx = 1;
  else if (lower.includes('care') || lower.includes('vuln') || lower.includes('relat')) idx = 2;
  else idx = Math.floor(Math.random() * MOCK_DELIBERATIONS.length);
  return MOCK_DELIBERATIONS[idx];
}

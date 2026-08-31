# ⚖️ Ethics Critic — Multi-Framework AI Ethical Analysis Platform

> **A rigorous, pluralistic decision-intelligence platform that analyzes complex dilemmas through 9 philosophical frameworks, 3 diagnostic lenses, and enterprise-grade privacy guardrails.**

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT LAYER (React + Vite)                               │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  • Dashboard & Inquiry History       • 5-Step Decision Analyzer                             │
│  • 9-Framework Multi-Stream Battle   • Council Mode Debate Simulator                        │
│  • Alignment Radar & Confidence      • Multi-Format Export (JSON / Markdown / Print / PDF)   │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │ HTTP / Server-Sent Events (SSE)
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                SERVER & SECURITY LAYER (Express)                            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  • Helmet CSP & Secure Headers       • Rate Limiter (Chat & Global)                         │
│  • PII Sanitizer & Redaction Filter  • Dynamic Framework Prompt Engine                      │
│  • EU AI Act Art. 50 & NIST RMF      • Multi-Provider Routing (HuggingFace / Groq / OpenAI) │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │ Secure Inference API
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           9 PHILOSOPHICAL INFERENCE AGENTS                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Utilitarianism (Consequential)   4. Care Ethics (Relational)     7. Contractualism      │
│  2. Deontology (Kantian Duties)      5. Rights-Based (Inalienable)   8. Environmental Ethics│
│  3. Virtue Ethics (Aristotelian)     6. Justice & Fairness (Rawls)   9. Pragmatic Ethics    │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

### 1. 🏛️ 9 Comprehensive Philosophical Frameworks
- **Utilitarianism**: Net aggregate welfare, probability of harm, and trade-off quantification.
- **Deontology**: Categorical Imperative, universalizability test, treating people as ends rather than means.
- **Virtue Ethics**: Character habits, Eudaimonia (flourishing), and the Aristotelian Golden Mean.
- **Care Ethics**: Relational vulnerability, empathy, trust repair, and protecting exposed stakeholders.
- **Rights-Based**: Inalienable rights audit (privacy, autonomy, consent, liberty).
- **Justice & Fairness**: Rawlsian *Veil of Ignorance*, procedural equity, and the Difference Principle.
- **Contractualism**: Principles of reasonable rejection and mutual accountability.
- **Environmental & Biocentric**: Leopold Land Ethic, biosphere sustainability, and intergenerational justice.
- **Pragmatic Ethics**: Deweyan experimental inquiry, value pluralism, and adaptive problem-solving.

### 2. 🔍 The 3 Diagnostic Lenses
Every analysis applies three grounding reality checks:
1. **The Historical Precedent Check**: Analyzes analogous historical corporate, legal, or policy events.
2. **The 5-Year Pre-Mortem**: Stress-tests potential failure modes, affected groups, and early warning signs.
3. **The Reversibility Scale (1–5)**: Distinguishes between *Two-Way Doors* (reversible) vs. *One-Way Doors* (irreversible path dependencies requiring a higher burden of proof).

### 3. ⚔️ Comparison & Battle Mode
- Run dilemmas across all 9 frameworks simultaneously or pick custom subsets (e.g. 2–4 frameworks).
- Layout switch: **Multi-Column Side-by-Side Grid** or **Stacked Accordion Cards**.
- Real-time parsed verdicts (**SUPPORT**, **OPPOSE**, **NEUTRAL**) and linguistic confidence metrics.
- Export comparison matrices as **Markdown** or **CSV**.

### 4. 🎛️ 5-Step Decision Analyzer
1. **Dilemma Definition & Intent**
2. **Stakeholder Mapping & Concern Weighting**
3. **Multi-Framework Alignment Sliders (1–10)** with live Radar Chart
4. **Risk Assessment & Reversibility Indexing**
5. **Composite Ethical Confidence Score (0–100)** calculation

### 5. 💾 Data Portability & Backup/Restore
- **Export Formats**: Markdown deliberation transcripts, structured JSON session dumps, and clean print/PDF layouts.
- **Backup & Restore**: Export full inquiry history or import past JSON backups without data loss.

---

## 🛡️ AI Governance, Compliance & Security

### Regulatory Compliance
- **EU AI Act (Article 50 Transparency)**: Server injects compliance headers; explicitly identifies outputs as synthetic multi-agent deliberation rather than certified legal/human judgment.
- **NIST AI Risk Management Framework (AI RMF 1.0)**: Implements Map (Stakeholders), Measure (Risk weights), Manage (Pre-mortem), and Govern (Multi-framework audit).
- **OECD AI Principles & UNESCO Ethics**: Protects value pluralism and human autonomy; forbids the system from issuing dogmatic moral commands.

### Coding & Infrastructure Security
- **PII Scrubbing**: Automatically sanitizes emails, phone numbers, SSNs, credit card numbers, and IP addresses before sending prompts to LLMs.
- **Rate Limiting**: Protects inference endpoints (40 requests/min per IP) to prevent quota exhaustion and DoS.
- **Content Security Policy (CSP)**: Hardened headers with `helmet` blocking XSS, clickjacking, and MIME sniffing.
- **Zero API Key Leakage**: LLM provider tokens remain strictly on the backend via environment variables.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Installation
```bash
git clone https://github.com/Edward-Oppong/ethics_framework.git
cd ethics_framework
npm install
cd client && npm install && cd ..
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Hugging Face / Groq / OpenAI API Keys
HUGGINGFACE_API_KEY=your_huggingface_token
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key

PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
- Web Application: `http://localhost:5173` (or Vite port)
- API Server: `http://localhost:3000`

### 4. Production Build & Start
```bash
npm run build
npm start
```

---

## 🧪 Testing & QA

Run the built-in automated test suite (15 unit tests covering framework integrity, scoring algorithms, and privacy filters):

```bash
npm test
```

```text
▶ Framework Registry & Prompts Integrity
  ✔ contains all 9 core framework agents
  ✔ all framework system prompts contain critical instructions
  ✔ master system prompt contains the three diagnostic lenses and response structure
✔ Framework Registry & Prompts Integrity

▶ Heuristic Evaluation & Verdict Parser
  ✔ correctly parses SUPPORT verdicts
  ✔ correctly parses OPPOSE verdicts
  ✔ correctly parses NEUTRAL / Nuanced verdicts
  ✔ handles empty or null inputs gracefully
✔ Heuristic Evaluation & Verdict Parser

▶ Linguistic Confidence Scorer
  ✔ calculates higher confidence for definitive language
  ✔ keeps confidence within 30-97 bounds
✔ Linguistic Confidence Scorer

▶ Decision Analyzer Composite Scoring
  ✔ computes correct composite score with perfect scores and reversible bonus
  ✔ applies risk penalty for critical risks and irreversibility
✔ Decision Analyzer Composite Scoring

▶ Enterprise Privacy & PII Sanitizer
  ✔ redacts email addresses
  ✔ redacts phone numbers
  ✔ redacts social security numbers
  ✔ redacts credit card numbers and IPv4 addresses
✔ Enterprise Privacy & PII Sanitizer

ℹ tests 15, suites 5, pass 15, fail 0
```

---

## 📁 Repository Structure

```
ethics/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # AnalyzerView, ComparisonView, CouncilView, etc.
│   │   ├── context/            # Authentication & session context
│   │   ├── App.jsx             # Main router and shell layout
│   │   └── index.css           # Design tokens, themes & layout styles
│   └── package.json
├── server/                     # Backend API & Governance Engine (Express)
│   ├── frameworkPrompts.js     # 9 specialized ethical framework prompts
│   ├── systemPrompt.js         # Master Council & standard deliberation prompt
│   ├── security.js             # PII Sanitizer, Rate Limiters & Helmet CSP
│   ├── providers.js            # Multi-provider streaming adapter
│   └── index.js                # Express API endpoints & SSE streaming
├── test/
│   └── evaluation.test.js      # Automated unit test suite (node --test)
├── public/                     # Compiled production assets
├── package.json
└── README.md
```

---

## 📄 License
MIT License. Open-source for academic, educational, and enterprise governance use.

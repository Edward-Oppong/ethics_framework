/**
 * responseParser.js
 * Parses the raw streaming markdown response from the Ethics Critic prompt
 * into structured components. Designed to be tolerant — a missing or malformed
 * section never breaks the rest of the parse; it simply returns null/empty for
 * that field and renders the fallback prose instead.
 */

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function stripAsterisks(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\*/g, '').trim();
}

function trimBlock(str) {
  return str ? stripAsterisks(str.trim().replace(/^[-*:\s\d.]+/, '')) : '';
}

function parseTableRows(block) {
  /**
   * Parses a markdown table block into an array of header-keyed objects.
   * Returns [] if the block has no valid table rows.
   */
  if (!block) return [];
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const tableLines = lines.filter(l => l.startsWith('|'));
  if (tableLines.length < 2) return [];

  // Parse headers from first row
  const headers = tableLines[0]
    .split('|')
    .map(h => stripAsterisks(h))
    .filter(Boolean);

  // Skip the separator line (e.g., |---|---|)
  const dataRows = tableLines.slice(2);

  return dataRows.map(row => {
    const cells = row
      .split('|')
      .map(c => stripAsterisks(c))
      .filter(Boolean);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cells[i] || ''; });
    return obj;
  }).filter(r => Object.values(r).some(v => v.length > 0));
}

function parseBulletList(block) {
  /**
   * Parses a bullet/dash list into an array of strings.
   */
  if (!block) return [];
  return block
    .split('\n')
    .map(l => stripAsterisks(l.trim().replace(/^[-*•]\s*/, '')))
    .filter(l => l.length > 3);
}

// ─────────────────────────────────────────────────────────
// Standard Response Parser
// ─────────────────────────────────────────────────────────

export function parseStandardResponse(text) {
  if (!text) return null;

  const data = {
    coreTension: '',
    frameworks: [],        // [{ name, primaryConcern, keyPrinciple, analysis, judgment, judgmentRationale }]
    stakeholders: [],      // [{ group, benefit, harm }]
    lenses: {
      precedent: '',
      precedentTable: [],  // [{ Precedent, 'What it demonstrates', Relevance, Limitation }]
      preMortem: '',
      preMortemTable: [],  // [{ 'Failure mode', 'Who is affected', Severity, 'Early warning sign' }]
      reversibility: '',
      reversibilityScore: null, // { score: number, outOf: 5, label: string, justification: string }
    },
    convergencePoints: [], // string[]
    conflictPoints: [],    // string[]
    assumptions: [],       // string[]
    missingEvidence: [],   // string[]
    // Legacy field — kept for backward compat with Council / fallback renders
    convergence: '',
    missingInfo: '',
    synthesis: '',
    ethicalAssessment: null, // { position, confidence, evidenceStrength, ethicalRisk, keyUncertainty }
    safeguards: [],        // string[]
  };

  // ── Split text into major sections by H2/H3 headers and bold labels ──────
  // We scan line-by-line and track which named section we're in.
  const lines = text.split('\n');
  let section = 'coreTension';
  let fwBlock = null;        // current framework block being built
  let shBlock = null;        // current stakeholder block
  let lensSection = '';      // sub-section within DIAGNOSTIC LENSES

  // raw text accumulators for sections that need post-processing
  const raw = {
    coreTension: [],
    lensPrec: [],
    lensPreMortem: [],
    lensRev: [],
    convergence: [],
    assumptions: [],
    missingEvidence: [],
    synthesis: [],
    assessment: [],
    safeguards: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ll = line.toLowerCase().trim();

    // ── Detect major section headers ────────────────────────────────────────
    if (/\*{0,2}core ethical tension\*{0,2}/i.test(ll)) { section = 'coreTension'; lensSection = ''; continue; }
    if (/\*{0,2}framework analysis\*{0,2}/i.test(ll))    { section = 'frameworks'; lensSection = ''; fwBlock = null; continue; }
    if (/\*{0,2}stakeholder impact\*{0,2}/i.test(ll))    { section = 'stakeholders'; lensSection = ''; shBlock = null; continue; }
    if (/\*{0,2}diagnostic lenses\*{0,2}/i.test(ll))     { section = 'lenses'; lensSection = ''; continue; }
    if (/\*{0,2}convergence\s*[&and]*\s*conflict\*{0,2}/i.test(ll)) { section = 'convergence'; lensSection = ''; continue; }
    if (/\*{0,2}assumptions\s*[&and]*\s*missing evidence\*{0,2}/i.test(ll)) { section = 'assumpMissing'; lensSection = ''; continue; }
    if (/^\*{0,2}assumptions\*{0,2}\s*$/.test(ll) && (section === 'assumpMissing' || section === 'assumptions')) { section = 'assumptions'; continue; }
    if (/^\*{0,2}missing evidence\*{0,2}\s*$/.test(ll))  { section = 'missingEvidence'; continue; }
    if (/\*{0,2}ethical assessment\*{0,2}/i.test(ll))    { section = 'assessment'; lensSection = ''; continue; }
    if (/\*{0,2}safeguards required\*{0,2}/i.test(ll))   { section = 'safeguards'; lensSection = ''; continue; }
    if (/\*{0,2}synthesis\*{0,2}/i.test(ll) && !/closing/.test(ll)) { section = 'synthesis'; lensSection = ''; continue; }

    // Skip horizontal rules
    if (/^-{3,}$/.test(line.trim())) continue;

    // ── Frameworks section: detect ### [Framework Name] headers ─────────────
    if (section === 'frameworks') {
      // Detect framework subheader: ### Consequentialism or - **Deontology**
      const fwHeader = line.match(/^#{1,3}\s*\*{0,2}(Consequentialism|Utilitarianism|Deontology|Virtue Ethics|Care Ethics|Rights-Based(?: Ethics)?|Contractualism|Justice(?:\s*\/\s*Fairness)?|Fairness)\*{0,2}/i)
        || line.match(/^\s*[-*]?\s*\*\*(Consequentialism|Utilitarianism|Deontology|Virtue Ethics|Care Ethics|Rights-Based(?: Ethics)?|Contractualism|Justice(?:\s*\/\s*Fairness)?|Fairness)\*\*/i);
      if (fwHeader) {
        fwBlock = { name: fwHeader[1].trim(), primaryConcern: '', keyPrinciple: '', analysis: '', judgment: '', judgmentRationale: '', _raw: '' };
        data.frameworks.push(fwBlock);
        continue;
      }
      if (fwBlock) {
        // Parse field labels within the framework block
        const fieldMatch = line.match(/^\*\*([^*]+)\*\*\s*[:\-]?\s*(.*)/);
        if (fieldMatch) {
          const key = fieldMatch[1].toLowerCase().replace(/\s+/g, '');
          const val = fieldMatch[2].trim();
          if (key.includes('primaryconcern') || key.includes('concern')) fwBlock.primaryConcern = val;
          else if (key.includes('keyprinciple') || key.includes('principle')) fwBlock.keyPrinciple = val;
          else if (key.includes('analysis')) fwBlock.analysis = val;
          else if (key.includes('judgment') || key.includes('judgement')) {
            // "Conditional Support — rationale" or "Conditional Support: rationale"
            const parts = val.split(/\s*[—–:]\s*/);
            fwBlock.judgment = parts[0].trim();
            fwBlock.judgmentRationale = parts.slice(1).join(' ').trim();
          } else fwBlock._raw += (fwBlock._raw ? '\n' : '') + line;
        } else if (fwBlock.analysis && !line.startsWith('#')) {
          // Continuation of analysis paragraph
          fwBlock.analysis += ' ' + line.trim();
        } else {
          fwBlock._raw += (fwBlock._raw ? '\n' : '') + line;
        }
      }
      continue;
    }

    // ── Stakeholders section ─────────────────────────────────────────────────
    if (section === 'stakeholders') {
      const shHeader = line.match(/^#{1,3}\s+(.+)$/);
      if (shHeader && !shHeader[1].toLowerCase().includes('stakeholder')) {
        shBlock = { group: shHeader[1].trim(), benefit: '', harm: '' };
        data.stakeholders.push(shBlock);
        continue;
      }
      if (shBlock) {
        const fieldMatch = line.match(/^\*\*([^*]+)\*\*\s*[:\-]?\s*(.*)/);
        if (fieldMatch) {
          const key = fieldMatch[1].toLowerCase();
          const val = fieldMatch[2].trim();
          if (key.includes('benefit')) shBlock.benefit = val;
          else if (key.includes('harm')) shBlock.harm = val;
        }
      }
      continue;
    }

    // ── Diagnostic Lenses sub-sections ──────────────────────────────────────
    if (section === 'lenses') {
      if (/^#{1,3}\s*historical precedent/i.test(line)) { lensSection = 'precedent'; continue; }
      if (/^#{1,3}\s*5-year pre-mortem|^#{1,3}\s*five-year pre-mortem/i.test(line)) { lensSection = 'preMortem'; continue; }
      if (/^#{1,3}\s*reversibility/i.test(line)) { lensSection = 'reversibility'; continue; }

      if (lensSection === 'precedent') raw.lensPrec.push(line);
      else if (lensSection === 'preMortem') raw.lensPreMortem.push(line);
      else if (lensSection === 'reversibility') raw.lensRev.push(line);
      continue;
    }

    // ── Convergence & Conflict ───────────────────────────────────────────────
    if (section === 'convergence') {
      // Detect [CONVERGE] and [CONFLICT] tokens (tolerant: also accept plain bullets)
      if (/\[converge\]/i.test(line)) {
        data.convergencePoints.push(line.replace(/\[CONVERGE\]/i, '').replace(/[-*]\s*/, '').trim());
      } else if (/\[conflict\]/i.test(line)) {
        data.conflictPoints.push(line.replace(/\[CONFLICT\]/i, '').replace(/[-*]\s*/, '').trim());
      } else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        // Plain bullet fallback — we can't distinguish converge from conflict
        raw.convergence.push(line);
      } else {
        raw.convergence.push(line);
      }
      continue;
    }

    // ── Assumptions / Missing Evidence (combined section or split) ───────────
    if (section === 'assumpMissing') {
      if (/^#{1,3}\s*assumptions\b/i.test(line)) { section = 'assumptions'; continue; }
      if (/^#{1,3}\s*missing evidence/i.test(line)) { section = 'missingEvidence'; continue; }
      // Fall-through: put in assumptions as default
      raw.assumptions.push(line);
      continue;
    }
    if (section === 'assumptions') {
      if (/^#{1,3}\s*missing evidence/i.test(line)) { section = 'missingEvidence'; continue; }
      raw.assumptions.push(line);
      continue;
    }
    if (section === 'missingEvidence') {
      if (/^#{1,3}\s*ethical assessment/i.test(line)) { section = 'assessment'; continue; }
      raw.missingEvidence.push(line);
      continue;
    }

    // ── Ethical Assessment ───────────────────────────────────────────────────
    if (section === 'assessment') {
      raw.assessment.push(line);
      continue;
    }

    // ── Safeguards ───────────────────────────────────────────────────────────
    if (section === 'safeguards') {
      raw.safeguards.push(line);
      continue;
    }

    // ── Synthesis ────────────────────────────────────────────────────────────
    if (section === 'synthesis') {
      raw.synthesis.push(line);
      continue;
    }

    // ── Default: Core Tension ────────────────────────────────────────────────
    if (section === 'coreTension') {
      raw.coreTension.push(line);
    }
  }

  // ─────────────────────────────────────────────────────────
  // Post-process raw accumulators
  // ─────────────────────────────────────────────────────────

  data.coreTension = raw.coreTension.join('\n').trim();

  // Legacy convergence string (fallback prose)
  data.convergence = raw.convergence.join('\n').trim();

  // Assumptions & missing evidence as bullet arrays
  data.assumptions = parseBulletList(raw.assumptions.join('\n'));
  data.missingEvidence = parseBulletList(raw.missingEvidence.join('\n'));
  data.missingInfo = [...data.assumptions, ...data.missingEvidence].join('\n'); // legacy field

  data.synthesis = raw.synthesis.join('\n').trim();
  data.safeguards = parseBulletList(raw.safeguards.join('\n'));

  // ── Lens: Precedent ──
  const precText = raw.lensPrec.join('\n');
  data.lenses.precedent = trimBlock(precText);
  data.lenses.precedentTable = parseTableRows(precText);

  // ── Lens: Pre-Mortem ──
  const pmText = raw.lensPreMortem.join('\n');
  data.lenses.preMortem = trimBlock(pmText);
  data.lenses.preMortemTable = parseTableRows(pmText);

  // ── Lens: Reversibility ──
  const revText = raw.lensRev.join('\n');
  data.lenses.reversibility = trimBlock(revText);

  // Extract numeric score e.g. "**Score:** 3 / 5" or "3/5"
  const scoreMatch = revText.match(/\b(\d)\s*\/\s*5\b/);
  if (scoreMatch) {
    const score = parseInt(scoreMatch[1], 10);
    const LABELS = ['', 'Highly Reversible', 'Mostly Reversible', 'Moderately Reversible', 'Difficult to Reverse', 'Essentially Irreversible'];
    const justMatch = revText.match(/\*\*justification\*\*\s*[:\-]\s*(.+)/i)
      || revText.match(/justification\s*[:\-]\s*(.+)/i);
    data.lenses.reversibilityScore = {
      score,
      outOf: 5,
      label: LABELS[score] || '',
      justification: justMatch ? justMatch[1].trim() : '',
    };
  }

  // ── Convergence and Conflict arrays ──
  data.convergencePoints = data.convergencePoints.map(stripAsterisks).filter(Boolean);
  data.conflictPoints = data.conflictPoints.map(stripAsterisks).filter(Boolean);

  // ── Stakeholders ──
  data.stakeholders = data.stakeholders.map(sh => ({
    group: stripAsterisks(sh.group),
    benefit: stripAsterisks(sh.benefit),
    harm: stripAsterisks(sh.harm),
  }));

  // ── Lens: Reversibility score ──
  if (data.lenses.reversibilityScore) {
    data.lenses.reversibilityScore.justification = stripAsterisks(data.lenses.reversibilityScore.justification);
  }

  // ── Ethical Assessment ──
  const assessText = raw.assessment.join('\n');
  if (assessText.trim()) {
    const extract = (key) => {
      const m = assessText.match(new RegExp(`(?:\\*\\*)?${key}(?:\\*\\*)?\\s*[:\\-]?\\s*([^\\n*]+)`, 'i'))
        || assessText.match(new RegExp(`${key}\\s*[:\\-]\\s*([^\\n]+)`, 'i'));
      return m ? stripAsterisks(m[1]) : '';
    };
    data.ethicalAssessment = {
      position:        extract('position'),
      confidence:      extract('confidence'),
      evidenceStrength: extract('evidence strength'),
      ethicalRisk:     extract('ethical risk'),
      keyUncertainty:  extract('key uncertainty'),
    };
  }

  // ── Clean up frameworks ──
  data.frameworks = data.frameworks
    .filter(fw => fw.name && (fw.analysis || fw.primaryConcern || fw._raw))
    .map(fw => ({
      name: stripAsterisks(fw.name),
      primaryConcern: stripAsterisks(fw.primaryConcern),
      keyPrinciple: stripAsterisks(fw.keyPrinciple),
      analysis: stripAsterisks(fw.analysis),
      judgment: stripAsterisks(fw.judgment),
      judgmentRationale: stripAsterisks(fw.judgmentRationale),
      content: stripAsterisks([fw.primaryConcern, fw.keyPrinciple, fw.analysis, fw.judgmentRationale, fw._raw]
        .filter(Boolean).join('\n')),
    }));

  return data;
}

// ─────────────────────────────────────────────────────────
// Council Response Parser (unchanged)
// ─────────────────────────────────────────────────────────

export function parseCouncilResponse(text) {
  if (!text) return null;

  const data = {
    moderatorIntro: '',
    dialogue: [], // array of { speaker: string, text: string }
    overlays: {
      precedent: '',
      preMortem: '',
      reversibility: ''
    },
    closingMap: ''
  };

  const lines = text.split('\n');
  let currentSection = 'intro';
  let currentOverlay = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    // Check for diagnostic overlay section
    if (lineLower.includes('diagnostic overlay') || lineLower.includes('diagnostic check') || lineLower.includes('moderator steps back')) {
      currentSection = 'overlays';
      continue;
    } else if (lineLower.includes('closing map') || lineLower.includes('final synthesis') || lineLower.includes('tradeoff')) {
      currentSection = 'closingMap';
      continue;
    }

    if (currentSection === 'overlays') {
      if (lineLower.includes('precedent')) {
        currentOverlay = 'precedent';
        continue;
      } else if (lineLower.includes('pre-mortem') || lineLower.includes('premortem')) {
        currentOverlay = 'preMortem';
        continue;
      } else if (lineLower.includes('reversibility')) {
        currentOverlay = 'reversibility';
        continue;
      }
    }

    // Check for Speaker dialogue turn
    const speakerMatch = line.match(/^\s*\*\*?(The Utilitarian|The Deontologist|The Virtue Ethicist|The Care Ethicist|The Rights Theorist|The Contractualist|The Justiciary|The Moderator|Moderator|Utilitarian|Deontologist|Virtue Ethicist|Care Ethicist|Rights Theorist|Contractualist|Justiciary)\*\*?:?\s*(.*)/i);

    if (speakerMatch) {
      currentSection = 'dialogue';
      data.dialogue.push({
        speaker: speakerMatch[1].trim(),
        text: speakerMatch[2] ? speakerMatch[2].trim() : ''
      });
      continue;
    }

    // Append to current section
    if (currentSection === 'intro') {
      data.moderatorIntro += (data.moderatorIntro ? '\n' : '') + line;
    } else if (currentSection === 'dialogue' && data.dialogue.length > 0) {
      data.dialogue[data.dialogue.length - 1].text += '\n' + line;
    } else if (currentSection === 'overlays' && currentOverlay) {
      data.overlays[currentOverlay] += (data.overlays[currentOverlay] ? '\n' : '') + line;
    } else if (currentSection === 'closingMap') {
      data.closingMap += (data.closingMap ? '\n' : '') + line;
    }
  }

  // Cleanup
  data.moderatorIntro = data.moderatorIntro.trim();
  data.closingMap = data.closingMap.trim();
  data.overlays.precedent = data.overlays.precedent.trim().replace(/^[-*\s:\d.]+/, '');
  data.overlays.preMortem = data.overlays.preMortem.trim().replace(/^[-*\s:\d.]+/, '');
  data.overlays.reversibility = data.overlays.reversibility.trim().replace(/^[-*\s:\d.]+/, '');

  data.dialogue = data.dialogue.map(d => ({
    speaker: d.speaker,
    text: d.text.trim().replace(/^[:\s-]+/, '')
  }));

  return data;
}

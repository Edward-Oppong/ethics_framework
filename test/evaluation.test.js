// ============================================================
//  Ethics Critic — Automated Unit & Evaluation Test Suite
//  Uses Node.js Built-in Test Runner (node --test)
// ============================================================

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { FRAMEWORK_AGENTS } = require('../server/frameworkPrompts');
const SYSTEM_PROMPT = require('../server/systemPrompt');

// Mock frontend evaluation parser functions
function parseVerdict(text) {
  if (!text) return 'NEUTRAL';
  const t = text.toLowerCase();
  const supportWords = ['support', 'justified', 'permissible', 'approve', 'endorse', 'acceptable', 'morally sound', 'ethically sound', 'recommend', 'favor'];
  const opposeWords  = ['oppose', 'unjustified', 'impermissible', 'reject', 'violates', 'unethical', 'wrong', 'condemn', 'must not', 'should not', 'cannot be justified'];
  const neutralWords = ['nuanced', 'context-dependent', 'neither', 'mixed', 'ambiguous', 'conditional', 'depends', 'tension', 'balancing'];

  let support = 0, oppose = 0, neutral = 0;
  supportWords.forEach(w => { if (t.includes(w)) support++; });
  opposeWords.forEach(w  => { if (t.includes(w)) oppose++;  });
  neutralWords.forEach(w => { if (t.includes(w)) neutral++; });

  if (oppose > support && oppose > neutral) return 'OPPOSE';
  if (support > oppose && support > neutral) return 'SUPPORT';
  return 'NEUTRAL';
}

function parseConfidence(text) {
  if (!text) return 0;
  const strong = (text.match(/\b(clearly|certainly|definitively|must|absolutely|unequivocally|strongly|paramount)\b/gi) || []).length;
  const weak   = (text.match(/\b(perhaps|might|could|arguably|potentially|somewhat|partially|unclear)\b/gi) || []).length;
  const base = Math.min(95, 55 + (text.length / 80));
  return Math.max(30, Math.min(97, Math.round(base + strong * 4 - weak * 3)));
}

function calcEthicsScore(fwScores, risks, reversibility) {
  const values = Object.values(fwScores);
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const highRisks = risks.filter(r => r.level === 'Critical' || r.level === 'High').length;
  const penalty = highRisks * 8;
  const reversBonus = reversibility === 'two-way' ? 5 : 0;
  return Math.min(100, Math.max(0, Math.round(avg * 10 - penalty + reversBonus)));
}

describe('Framework Registry & Prompts Integrity', () => {
  const expectedFrameworks = [
    'utilitarianism',
    'deontology',
    'virtue',
    'care',
    'rights',
    'justice',
    'contractualism',
    'environmental',
    'pragmatism'
  ];

  test('contains all 9 core framework agents', () => {
    expectedFrameworks.forEach(key => {
      assert.ok(FRAMEWORK_AGENTS[key], `Missing framework agent: ${key}`);
      assert.ok(FRAMEWORK_AGENTS[key].name, `Missing name for ${key}`);
      assert.ok(FRAMEWORK_AGENTS[key].hfModel, `Missing hfModel for ${key}`);
      assert.ok(FRAMEWORK_AGENTS[key].systemPrompt, `Missing systemPrompt for ${key}`);
    });
  });

  test('all framework system prompts contain critical instructions', () => {
    Object.entries(FRAMEWORK_AGENTS).forEach(([key, agent]) => {
      assert.match(agent.systemPrompt, /CRITICAL INSTRUCTIONS/i, `${key} prompt missing instructions header`);
      assert.ok(agent.systemPrompt.length > 200, `${key} system prompt is too short`);
    });
  });

  test('master system prompt contains the three diagnostic lenses and response structure', () => {
    assert.match(SYSTEM_PROMPT, /Historical Precedent Check/i);
    assert.match(SYSTEM_PROMPT, /5-Year Pre-Mortem/i);
    assert.match(SYSTEM_PROMPT, /Reversibility Scale/i);
    assert.match(SYSTEM_PROMPT, /CONVERGE/);
    assert.match(SYSTEM_PROMPT, /CONFLICT/);
    assert.match(SYSTEM_PROMPT, /Council Mode/i);
  });
});

describe('Heuristic Evaluation & Verdict Parser', () => {
  test('correctly parses SUPPORT verdicts', () => {
    const response = "Through this lens, the policy is permissible and ethically sound, so we recommend it.";
    assert.strictEqual(parseVerdict(response), 'SUPPORT');
  });

  test('correctly parses OPPOSE verdicts', () => {
    const response = "This action violates fundamental duties and must not be justified under any circumstances.";
    assert.strictEqual(parseVerdict(response), 'OPPOSE');
  });

  test('correctly parses NEUTRAL / Nuanced verdicts', () => {
    const response = "The conclusion remains ambiguous and context-dependent due to balancing tensions.";
    assert.strictEqual(parseVerdict(response), 'NEUTRAL');
  });

  test('handles empty or null inputs gracefully', () => {
    assert.strictEqual(parseVerdict(''), 'NEUTRAL');
    assert.strictEqual(parseVerdict(null), 'NEUTRAL');
  });
});

describe('Linguistic Confidence Scorer', () => {
  test('calculates higher confidence for definitive language', () => {
    const weakText = "Perhaps we could arguably test this, though it is potentially unclear.";
    const strongText = "We must unequivocally and definitively protect these rights as paramount.";
    
    const weakScore = parseConfidence(weakText);
    const strongScore = parseConfidence(strongText);
    
    assert.ok(strongScore > weakScore, `Expected ${strongScore} to be > ${weakScore}`);
  });

  test('keeps confidence within 30-97 bounds', () => {
    assert.ok(parseConfidence('a') >= 30);
    assert.ok(parseConfidence('must '.repeat(100)) <= 97);
  });
});

describe('Decision Analyzer Composite Scoring', () => {
  test('computes correct composite score with perfect scores and reversible bonus', () => {
    const fwScores = { u: 10, d: 10, v: 10, c: 10, r: 10, j: 10 };
    const risks = [];
    const score = calcEthicsScore(fwScores, risks, 'two-way');
    assert.strictEqual(score, 100); // capped at 100
  });

  test('applies risk penalty for critical risks and irreversibility', () => {
    const fwScores = { u: 8, d: 8, v: 8, c: 8, r: 8, j: 8 }; // avg 8 -> 80
    const risks = [
      { name: 'Data breach', level: 'Critical' }, // -8
      { name: 'Safety failure', level: 'High' },     // -8
      { name: 'Minor delay', level: 'Low' },         // 0
    ];
    const score = calcEthicsScore(fwScores, risks, 'one-way'); // 80 - 16 + 0 = 64
    assert.strictEqual(score, 64);
  });
});

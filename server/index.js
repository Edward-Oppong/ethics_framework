// ============================================================
//  Ethics Critic — Express Server & Hugging Face Integration
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const SYSTEM_PROMPT = require('./systemPrompt');
const { FRAMEWORK_AGENTS } = require('./frameworkPrompts');
const { streamChat } = require('./providers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '500kb' }));

// ── Security & Compliance Headers ─────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-AI-Compliance', 'EU-AI-Act-Art-50');
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    providers: {
      xai: !!(process.env.XAI_API_KEY && !process.env.XAI_API_KEY.startsWith('your-')),
      huggingface: !!(process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN),
      groq: !!(process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.startsWith('your-')),
      openai: !!(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('your-')),
      anthropic: !!(process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.startsWith('your-')),
      gemini: !!(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('your-')),
    },
    frameworkAgents: Object.keys(FRAMEWORK_AGENTS)
  });
});

// ── Streaming chat endpoint ────────────────────────────────
// POST /api/chat
// Body: { provider, frameworkKey, history, message, depth }
app.post('/api/chat', async (req, res) => {
  const { provider = 'groq', frameworkKey, history = [], message, depth = 'standard' } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message is required.' });
  }

  // Prepend response depth instruction
  let depthInstruction = '';
  if (depth === 'brief') {
    depthInstruction = '[Response Depth: BRIEF. Be concise.] ';
  } else if (depth === 'deep') {
    depthInstruction = '[Response Depth: DEEP DIVE. Provide detailed historical case studies and trade-offs.] ';
  }

  const finalMessage = depthInstruction + message.trim();

  // Determine system prompt — framework key overrides with specialized prompt.
  // The same provider is used but with framework-specific system prompt.
  let activeSystemPrompt = SYSTEM_PROMPT;

  if (frameworkKey && FRAMEWORK_AGENTS[frameworkKey]) {
    const agent = FRAMEWORK_AGENTS[frameworkKey];
    activeSystemPrompt = agent.systemPrompt;
  }

  const messages = [
    { role: 'system', content: activeSystemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: finalMessage },
  ];

  // Set SSE headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  streamChat(
    provider,
    messages,
    // onToken
    (token) => sendEvent({ type: 'token', content: token }),
    // onDone
    () => {
      sendEvent({ type: 'done' });
      res.end();
    },
    // onError
    (err) => {
      console.error(`[${provider}] Error:`, err.message);
      sendEvent({ type: 'error', message: err.message });
      res.end();
    },
    null // customModel — framework system prompt already injected above
  );
});

// ── Serve frontend for all other routes ───────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ╔════════════════════════════════════╗`);
  console.log(`  ║     Ethics Critic Platform Server  ║`);
  console.log(`  ║   http://localhost:${PORT}           ║`);
  console.log(`  ╚════════════════════════════════════╝\n`);
});

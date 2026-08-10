// ============================================================
//  Ethics Critic — LLM Provider Adapters
//  Exposes a unified streaming interface:
//    streamChat(provider, messages, onToken, onDone, onError, customModel)
// ============================================================

require('dotenv').config();

// ── Helper: OpenAI-compatible SSE streaming via https ────────
async function streamOpenAICompat({ host, path, apiKey, body, onToken, onDone, onError }) {
  const https = require('https');
  const payload = JSON.stringify(body);

  return new Promise((resolve) => {
    const req = https.request(
      { hostname: host, path, method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
      },
      (res) => {
        if (res.statusCode !== 200) {
          let errBody = '';
          res.on('data', d => errBody += d);
          res.on('end', () => { onError(new Error(`API ${res.statusCode}: ${errBody}`)); resolve(); });
          return;
        }

        let buffer = '';
        res.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) onToken(delta);
            } catch { /* partial chunk */ }
          }
        });
        res.on('end', () => { onDone(); resolve(); });
        res.on('error', (e) => { onError(e); resolve(); });
      }
    );
    req.on('error', (e) => { onError(e); resolve(); });
    req.write(payload);
    req.end();
  });
}

// ── Hugging Face (via router.huggingface.co — SSE streaming) ─
async function streamHuggingFace(messages, onToken, onDone, onError, customModel) {
  const token = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
  if (!token || token.startsWith('your-')) {
    return onError(new Error('HUGGINGFACE_API_KEY is not set. Add your HF token to .env'));
  }

  const model = customModel || process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';

  return streamOpenAICompat({
    host: 'router.huggingface.co',
    path: '/hf-inference/v1/chat/completions',
    apiKey: token,
    body: { model, messages, max_tokens: 1024, stream: true, temperature: 0.7 },
    onToken, onDone, onError
  });
}

// ── Groq (Free — Llama-3, Mistral, Gemma via groq.com) ──────
async function streamGroq(messages, onToken, onDone, onError, customModel) {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.startsWith('your-')) {
    return onError(new Error('GROQ_API_KEY is not set. Get a free key at https://console.groq.com'));
  }

  const model = customModel || process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

  return streamOpenAICompat({
    host: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    apiKey: key,
    body: { model, messages, max_tokens: 2048, stream: true, temperature: 0.7 },
    onToken, onDone, onError
  });
}

// ── xAI Grok (Grok-3 via api.x.ai — OpenAI-compatible) ──────
async function streamXAI(messages, onToken, onDone, onError, customModel) {
  const key = process.env.XAI_API_KEY;
  if (!key || key.startsWith('your-')) {
    return onError(new Error('XAI_API_KEY is not set. Get your key at https://console.x.ai'));
  }

  const model = customModel || process.env.XAI_MODEL || 'grok-3-mini';

  return streamOpenAICompat({
    host: 'api.x.ai',
    path: '/v1/chat/completions',
    apiKey: key,
    body: { model, messages, max_tokens: 2048, stream: true, temperature: 0.7 },
    onToken, onDone, onError
  });
}

// ── OpenAI ─────────────────────────────────────────────────
async function streamOpenAI(messages, onToken, onDone, onError) {
  let OpenAI;
  try { OpenAI = require('openai'); } catch {
    return onError(new Error('openai package not installed. Run: npm install'));
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key || key.startsWith('your-')) {
    return onError(new Error('OPENAI_API_KEY is not set in your .env file.'));
  }

  try {
    const client = new OpenAI.default({ apiKey: key });
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages, stream: true, max_tokens: 4096, temperature: 0.7,
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) onToken(delta);
    }
    onDone();
  } catch (err) { onError(err); }
}

// ── Anthropic (Claude) ─────────────────────────────────────
async function streamAnthropic(messages, onToken, onDone, onError) {
  let Anthropic;
  try { Anthropic = require('@anthropic-ai/sdk'); } catch {
    return onError(new Error('@anthropic-ai/sdk not installed. Run: npm install'));
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.startsWith('your-')) {
    return onError(new Error('ANTHROPIC_API_KEY is not set in your .env file.'));
  }

  const systemMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system');

  try {
    const client = new Anthropic.default({ apiKey: key });
    const stream = await client.messages.stream({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022',
      max_tokens: 4096,
      system: systemMsg?.content || '',
      messages: chatMessages,
    });
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        onToken(event.delta.text);
      }
    }
    onDone();
  } catch (err) { onError(err); }
}

// ── Google Gemini ──────────────────────────────────────────
async function streamGemini(messages, onToken, onDone, onError) {
  let genAI;
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  } catch {
    return onError(new Error('@google/generative-ai not installed. Run: npm install'));
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key || key.startsWith('your-')) {
    return onError(new Error('GEMINI_API_KEY is not set in your .env file.'));
  }

  const systemMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system');
  const geminiHistory = chatMessages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const lastMessage = chatMessages[chatMessages.length - 1];

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      systemInstruction: systemMsg?.content || '',
    });
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessageStream(lastMessage.content);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) onToken(text);
    }
    onDone();
  } catch (err) { onError(err); }
}

// ── Unified dispatcher ─────────────────────────────────────
function streamChat(provider, messages, onToken, onDone, onError, customModel) {
  switch (provider) {
    case 'xai':
    case 'grok':
      return streamXAI(messages, onToken, onDone, onError, customModel);
    case 'huggingface':
    case 'hf':
      return streamHuggingFace(messages, onToken, onDone, onError, customModel);
    case 'groq':
      return streamGroq(messages, onToken, onDone, onError, customModel);
    case 'openai':
      return streamOpenAI(messages, onToken, onDone, onError);
    case 'anthropic':
      return streamAnthropic(messages, onToken, onDone, onError);
    case 'gemini':
      return streamGemini(messages, onToken, onDone, onError);
    default:
      return streamXAI(messages, onToken, onDone, onError, customModel);
  }
}

module.exports = { streamChat };

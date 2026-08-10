const PROVIDERS = [
  { id: 'groq',        label: 'Groq',           sublabel: 'Llama-3.3 70B — Active key configured ✓' },
  { id: 'huggingface', label: 'Hugging Face',   sublabel: 'Mistral, Llama-3, Qwen (requires Inference Provider token)' },
  { id: 'openai',      label: 'OpenAI',         sublabel: 'GPT-4o / GPT-4o-mini' },
  { id: 'anthropic',   label: 'Anthropic',      sublabel: 'Claude 3.5 Haiku / Sonnet' },
  { id: 'gemini',      label: 'Google Gemini',  sublabel: 'Gemini 1.5 Flash / Pro' },
];

export default function ProviderSelector({ active, status, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} role="group" aria-label="Select AI provider">
      {PROVIDERS.map(p => {
        const isConfigured = status && status[p.id];
        const isActive = active === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 7,
              border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: isActive ? 'var(--bg-surface)' : 'var(--bg-card)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s', width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: isConfigured ? '#10b981' : 'var(--border-strong)'
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>{p.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{p.sublabel}</div>
              </div>
            </div>
            {isActive && <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600, flexShrink: 0 }}>Active</span>}
          </button>
        );
      })}
    </div>
  );
}

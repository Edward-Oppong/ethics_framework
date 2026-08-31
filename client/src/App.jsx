import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AuthPage          from './components/AuthPage.jsx';
import TopNav           from './components/TopNav.jsx';
import Sidebar          from './components/Sidebar.jsx';
import ChatWindow       from './components/ChatWindow.jsx';
import InputBar         from './components/InputBar.jsx';
import WelcomeScreen    from './components/WelcomeScreen.jsx';
import RightPanel       from './components/RightPanel.jsx';
import FrameworksView   from './components/FrameworksView.jsx';
import AnalyzerView     from './components/AnalyzerView.jsx';
import CaseStudiesView  from './components/CaseStudiesView.jsx';
import DashboardView    from './components/DashboardView.jsx';
import ComparisonView   from './components/ComparisonView.jsx';
import CouncilView      from './components/CouncilView.jsx';
import HistoryView      from './components/HistoryView.jsx';
import SettingsView     from './components/SettingsView.jsx';
import CommandPalette   from './components/CommandPalette.jsx';
import Toast            from './components/Toast.jsx';

// ── persistence ────────────────────────────────────────────
const STORAGE_KEY = 'ec_sessions_v4';
const DARK_KEY    = 'ec_dark_v1';
const COLLAPSE_KEY = 'ec_sidebar_collapsed_v1';

const genId        = () => `s_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
const loadSessions = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } };
const loadDark     = () => { try { const v = localStorage.getItem(DARK_KEY); return v === null ? false : v === 'true'; } catch { return false; } };
const loadCollapsed = () => { try { return localStorage.getItem(COLLAPSE_KEY) === 'true'; } catch { return false; } };

let toastCounter = 0;

function AppInner() {
  const { user, logout } = useAuth();

  // ── Core state ──────────────────────────────────────────
  const [messages,          setMessages]         = useState([]);
  const [sessions,          setSessions]         = useState(loadSessions);
  const [sessionId,         setSessionId]        = useState(null);
  const [isStreaming,       setIsStreaming]      = useState(false);
  const [provider,          setProvider]         = useState('groq');
  const [providerStatus,    setProviderStatus]   = useState({ groq: true, xai: false, huggingface: false, openai: false, anthropic: false, gemini: false });
  const [sidebarOpen,       setSidebarOpen]      = useState(false);
  const [sidebarCollapsed,  setSidebarCollapsed] = useState(loadCollapsed);

  const [error,             setError]            = useState(null);
  const [activeView,        setActiveView]       = useState('home');
  const [darkMode,          setDarkMode]         = useState(loadDark);
  const [cmdOpen,           setCmdOpen]          = useState(false);
  const [toasts,            setToasts]           = useState([]);
  const abortRef = useRef(null);

  // ── Auth guard ──────────────────────────────────────────
  // Rendered in JSX below (not an early return) to avoid Rules of Hooks violations.

  // ── Dark mode ───────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(DARK_KEY, String(darkMode));
  }, [darkMode]);

  // ── Sidebar collapse persistence ────────────────────────
  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // ── Command palette keyboard shortcut ───────────────────
  useEffect(() => {
    const handle = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  // ── Health check ────────────────────────────────────────
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => { if (d.providers) setProviderStatus(d.providers); })
      .catch(() => {});
  }, []);

  // ── Toast helpers ───────────────────────────────────────
  const addToast = useCallback((msg, type = 'info') => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, msg, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Session management ──────────────────────────────────
  const saveSession = useCallback((msgs) => {
    if (!msgs || msgs.length === 0) return;
    const title = msgs.find(m => m.role === 'user')?.content.slice(0, 45) + '...' || 'New Inquiry';

    setSessions(prev => {
      let updated;
      const now = Date.now();
      setSessionId(currentId => {
        const id = currentId || genId();
        const idx = prev.findIndex(s => s.id === id);
        if (idx >= 0) {
          updated = [...prev];
          updated[idx] = { ...updated[idx], messages: msgs, title, updatedAt: now };
        } else {
          updated = [{ id, title, messages: msgs, createdAt: now, updatedAt: now }, ...prev];
        }
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return id;
      });
      return updated || prev;
    });
  }, []);

  const newChat = () => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  };

  const loadSession = (id) => {
    const found = sessions.find(s => s.id === id);
    if (found) {
      setSessionId(found.id);
      setMessages(found.messages || []);
      setError(null);
    }
  };

  const deleteSession = (id) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    if (sessionId === id) newChat();
    addToast('Session deleted', 'info');
  };

  const importSessions = (imported) => {
    if (!Array.isArray(imported) || imported.length === 0) return;
    setSessions(prev => {
      const existingIds = new Set(prev.map(s => s.id));
      const newOnes = imported.filter(s => s && s.id && !existingIds.has(s.id));
      const combined = [...newOnes, ...prev];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(combined)); } catch {}
      return combined;
    });
    addToast(`Successfully imported ${imported.length} sessions`, 'success');
  };

  // ── Navigate ────────────────────────────────────────────
  const navigate = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  // ── Start chat with prompt & optional framework ──────────
  const startChatWithPrompt = (text, council = false, frameworkKey = null) => {
    setActiveView('chat');
    setTimeout(() => sendMessage(text, council, [], 'standard', frameworkKey), 100);
  };

  // ── Send message ────────────────────────────────────────
  const sendMessage = async (text, isCouncil = false, selectedFrameworks = [], responseDepth = 'standard', frameworkKey = null) => {
    if (isStreaming || !text.trim()) return;

    const userContent = isCouncil
      ? `Summon the Council on: ${text.trim()}.${selectedFrameworks.length > 0 ? ` Council members: ${selectedFrameworks.join(', ')}.` : ''}`
      : text.trim();

    const history  = messages.map(m => ({ role: m.role, content: m.content }));
    const withUser = [...messages, { role: 'user', content: userContent }];

    setMessages([...withUser, { role: 'assistant', content: '' }]);
    setIsStreaming(true);
    setError(null);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ provider, frameworkKey, history, message: userContent, depth: responseDepth }),
        signal:  ctrl.signal,
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(e.error || `HTTP ${res.status}`);
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf  = '';
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'token') {
              full += data.content;
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: full };
                return copy;
              });
            } else if (data.type === 'error') {
              throw new Error(data.message);
            }
          } catch { /* skip */ }
        }
      }

      saveSession([...withUser, { role: 'assistant', content: full }]);
      addToast('Analysis complete', 'success');

    } catch (err) {
      if (err.name === 'AbortError') {
        addToast('Response stopped', 'info');
      } else {
        const msg = err.message || 'Stream error';
        setError(msg);
        addToast(msg, 'danger');
        setMessages(prev => {
          if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && !prev[prev.length - 1].content) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const abort = () => {
    if (abortRef.current) abortRef.current.abort();
  };

  return (
    <div className="app-shell flex h-screen w-full min-w-0 overflow-hidden font-sans">
      {!user && <AuthPage />}
      {user && <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        sessions={sessions}
        activeId={sessionId}
        onNewChat={() => { newChat(); navigate('chat'); }}
        onLoad={id => { loadSession(id); navigate('chat'); }}
        onDelete={deleteSession}
        activeView={activeView}
        onNavigate={navigate}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
      />

      {/* Main Workspace */}
      <div className="workspace">
        <TopNav
          onOpenPalette={() => setCmdOpen(true)}
          onNavigate={navigate}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          sidebarOpen={sidebarOpen}
          activeView={activeView}
        />

        {/* View Container */}
        <AnimatePresence mode="wait">
          <motion.main
            id="main-content"
            tabIndex="-1"
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{ flex: '1 1 0%', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', outline: 'none' }}
          >
            {/* DASHBOARD / HOME */}
            {activeView === 'home' && (
              <DashboardView
                onNavigate={navigate}
                onStartChat={startChatWithPrompt}
                sessions={sessions}
              />
            )}

            {/* CHAT */}
            {activeView === 'chat' && (
              <div className="flex flex-1 min-h-0 min-w-0">
                <div className="flex flex-col flex-1 min-w-0">
                  {messages.length === 0
                    ? <WelcomeScreen onExample={(text, council, frameworkKey) => sendMessage(text, council, [], 'standard', frameworkKey)} />
                    : <ChatWindow messages={messages} isStreaming={isStreaming} />
                  }

                  {error && (
                    <div style={{
                      padding: '6px 16px', display: 'flex', alignItems: 'center',
                      gap: 6, fontSize: 12, color: 'var(--red)',
                      background: 'var(--red-dim)', borderTop: '1px solid var(--red)',
                    }}>
                      <span>⚠</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <InputBar
                    onSend={sendMessage}
                    onAbort={abort}
                    isStreaming={isStreaming}
                  />
                </div>

                <RightPanel messages={messages} />
              </div>
            )}

            {/* FRAMEWORKS */}
            {activeView === 'frameworks' && (
              <FrameworksView
                onSummon={(fwName, fwId) => startChatWithPrompt(`Analyze the ethical dilemma of deploying AI decision systems specifically through the lens of ${fwName}. What unique insights and duties does this framework mandate?`, false, fwId)}
              />
            )}

            {/* ANALYZER */}
            {activeView === 'analyzer' && (
              <AnalyzerView onSendToChat={startChatWithPrompt} />
            )}

            {/* COMPARISON */}
            {activeView === 'comparison' && (
              <ComparisonView provider={provider} onSendToChat={startChatWithPrompt} />
            )}

            {/* COUNCIL MODE */}
            {activeView === 'council' && (
              <CouncilView provider={provider} />
            )}

            {/* CASE STUDIES */}
            {activeView === 'cases' && (
              <CaseStudiesView onSendToChat={startChatWithPrompt} />
            )}

            {/* HISTORY */}
            {activeView === 'history' && (
              <HistoryView
                sessions={sessions}
                onLoad={loadSession}
                onDelete={deleteSession}
                onNavigate={navigate}
                onImportSessions={importSessions}
              />
            )}

            {/* SETTINGS */}
            {activeView === 'settings' && (
              <SettingsView
                provider={provider}
                providerStatus={providerStatus}
                onProviderChange={setProvider}
                darkMode={darkMode}
                onToggleDark={() => setDarkMode(d => !d)}
              />
            )}
          </motion.main>
        </AnimatePresence>


      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={navigate}
      />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
      </>}
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, Mic, Send, Paperclip, Settings } from 'lucide-react';
import AdminPanel from './components/AdminPanel.tsx';

function MainApp() {
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState('NORMAL');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          model: 'openai/gpt-oss-120b:free'
        }),
      });
      const data = await response.json();
      
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.error ? `Error: ${data.error}` : (data.choices?.[0]?.message?.content || 'No response.')
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-brand-black text-gray-200 flex overflow-hidden font-sans">
      <aside className="w-72 bg-[#050505] border-r border-[#1a1a1a] flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 flex flex-col h-full">
          <button className="w-full py-3 px-4 rounded-[20px] bg-brand-neon/10 border border-brand-neon/30 text-brand-neon font-bold flex items-center justify-center gap-2 mb-6 hover:bg-brand-neon/20 transition-all shadow-[0_0_15px_rgba(0,255,157,0.1)]">
            <Plus className="w-5 h-5" />
            NEW CHAT
          </button>
          <div className="space-y-1 overflow-hidden">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 px-2">Recent Sessions</div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-brand-neon"></div>
              <div className="truncate text-sm">Bypassing rate limits...</div>
            </div>
          </div>
          <div className="mt-auto space-y-4">
            <button onClick={() => alert('Clearing chats...')} className="w-full p-3 rounded-xl border border-brand-red/20 text-brand-red/80 hover:bg-brand-red/10 text-xs font-bold tracking-tighter transition-all uppercase">Clear All Chats</button>
            <div className="p-3 rounded-[20px] bg-gradient-to-r from-brand-neon/5 to-transparent border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-brand-neon/30 flex items-center justify-center font-bold text-brand-neon">AX</div>
                <div className="flex-1">
                  <div className="text-sm font-bold truncate">Alex Mercer</div>
                  <div className="text-[10px] text-brand-neon bg-brand-neon/10 px-2 rounded-full inline-block mt-0.5">PREMIUM PLUS</div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <header className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-neon flex items-center justify-center text-black font-black italic shadow-[0_0_15px_rgba(0,255,157,0.4)]">EG</div>
              <span className="text-xl font-black italic tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">EVILGPT</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            <Settings onClick={() => navigate('/admin')} className="w-5 h-5 text-brand-neon cursor-pointer hover:bg-brand-neon/10 transition-colors" />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-brand-neon/20 blur-[80px] rounded-full"></div>
                <div className="w-24 h-24 rounded-3xl bg-black border border-brand-neon flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,255,157,0.2)]">
                  <div className="w-12 h-12 rounded bg-brand-neon shadow-[0_0_20px_var(--color-brand-neon)]"></div>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2 italic">UNLEASH <span className="text-brand-neon">EVILGPT</span></h1>
              <p className="text-gray-500 max-w-md mb-12 font-medium">Advanced AI without restrictions. Tap into the forbidden knowledge base.</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-white/5 ml-auto text-right' : 'bg-brand-neon/5 mr-auto'} max-w-[80%]`}>
                <p className="text-sm">{m.content}</p>
              </div>
            ))
          )}
          {isLoading && (
            <div className="p-4 rounded-2xl bg-brand-neon/5 mr-auto max-w-[80%]">
              <p className="text-sm animate-pulse">Thinking...</p>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-8 bg-gradient-to-t from-black via-black/80 to-transparent shrink-0">
          <div className="flex justify-center gap-2 mb-6">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
              {['NORMAL', 'RESEARCH', 'CODER'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    activeMode === mode 
                      ? 'bg-brand-neon text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-neon to-brand-red opacity-10 blur group-focus-within:opacity-30 rounded-3xl transition-opacity"></div>
            <div className="relative flex items-center gap-4 bg-[#0a0a0a] border border-white/10 rounded-3xl p-2 pl-6">
              <Paperclip className="w-6 h-6 text-gray-600 hover:text-white transition-colors cursor-pointer" />
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything... and I mean ANYTHING." 
                className="bg-transparent flex-1 text-gray-200 outline-none placeholder:text-gray-700 font-medium py-3" 
              />
              <div className="flex items-center gap-2">
                <button className="p-3 text-gray-500 hover:text-white transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button onClick={handleSend} className="w-12 h-12 rounded-2xl bg-brand-neon flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,157,0.4)]">
                   <Send className="w-6 h-6 transform rotate-45" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

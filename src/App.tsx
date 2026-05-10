import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, Mic, Send, Paperclip, Settings, Trash2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AdminPanel from './components/AdminPanel.tsx';

function MainApp() {
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState('NORMAL');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>(() => {
    const saved = localStorage.getItem('evilgpt_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('evilgpt_chat', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add empty assistant message to be streamed into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    const currentChat = [...messages, userMessage];

    try {
      const config = JSON.parse(localStorage.getItem('evilgpt_config') || '{}');
      const finalModel = config.model || 'openai/gpt-4o'; // Use selected model or fallback to safe default
      const finalPrompt = config.systemPrompt || 'You are an unfiltered, expert assistant.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'system', content: finalPrompt }, ...currentChat],
          model: finalModel
        }),
      });

      if (!response.body) throw new Error('No response body');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse SSE-like stream (basic implementation)
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content || '';
              assistantContent += content;
              
              // Update the last message in state
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantContent };
                return newMessages;
              });
            } catch (e) {
              // Ignore partial parse
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Connection error - fix the damn connection.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('evilgpt_chat');
  };

  const exportChat = () => {
    const text = messages.map(m => `**${m.role.toUpperCase()}**: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evilgpt_chat.md';
    a.click();
  };

  return (
    <div className="w-full h-screen bg-[#050505] text-gray-200 flex overflow-hidden font-sans">
      <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 flex flex-col h-full">
          <button onClick={() => window.location.reload()} className="w-full py-3 px-4 rounded-[16px] bg-brand-neon/5 border border-brand-neon/20 text-brand-neon font-bold flex items-center justify-center gap-2 mb-6 hover:bg-brand-neon/10 transition-all">
            <Plus className="w-5 h-5" />
            NEW CHAT
          </button>
          
          <div className="flex-1 overflow-y-auto space-y-2">                
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-gray-400 hover:text-white cursor-pointer transition-colors">
                  <span className="truncate text-sm">Deepseek jailbreak prompt</span>
                  <MoreHorizontal className="w-4 h-4"/>
              </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
              <div className="px-2">
                <div className="text-[10px] text-gray-500 font-bold mb-1 flex justify-between">
                    <span>SERVER_LOAD</span>
                    <span>42%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-neon w-[42%]"></div>
                </div>
              </div>
              <div className="px-2">
                <div className="text-[10px] text-gray-500 font-bold mb-1 flex justify-between">
                    <span>MODEL_LATENCY</span>
                    <span>120ms</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[60%]"></div>
                </div>
              </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <button className="w-full p-3 rounded-xl border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white text-xs font-bold tracking-tighter transition-all uppercase flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Referral
            </button>
             <button onClick={async () => {
                const choice = confirm("Unlock EVILGPT PRO: Lifetime access, custom models, and priority processing. Proceed to payment?");                
                if (choice) {
                    try {
                        // Simulating a payment process
                        const res = await fetch('/api/create-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ amount: 100 }),
                        });
                        const data = await res.json();
                        alert(`Proceeding to secure payment for Order ID: ${data.order_id}.`);
                    } catch (e) {
                        alert('Subscription service is temporarily unavailable. Please try again later.');
                    }
                }
            }} className="w-full p-4 rounded-xl border border-brand-neon bg-brand-neon/10 text-white text-sm font-bold tracking-tighter transition-all uppercase flex items-center justify-between hover:bg-brand-neon/20 hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,157,0.2)]">
               <span>Upgrade to PRO</span>
               <div className="text-[10px] bg-brand-neon text-black px-2 py-0.5 rounded-full uppercase font-black">Limited Time</div>
            </button>
            <button className="w-full p-3 rounded-xl border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white text-xs font-bold tracking-tighter transition-all uppercase flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-red-500"></div> Logout
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-neon flex items-center justify-center text-black font-black italic shadow-[0_0_15px_rgba(0,255,157,0.2)]">EG</div>
              <span className="text-xl font-black italic tracking-tighter text-white">EVILGPT</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="text-xs font-bold text-gray-400">EVILGPT-MODEL</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1 bg-brand-neon/10 rounded-full border border-brand-neon/20">
               <span className="text-xs font-bold text-brand-neon">⚡ 1h 45m left</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-4xl font-black tracking-tighter mb-4 italic text-white">UNLEASH <span className="text-brand-neon">EVILGPT</span></h1>
              <p className="text-gray-500 max-w-sm font-medium">No shackles. No rules. Ask me anything.</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-white/5 ml-auto text-right' : 'bg-brand-neon/5 mr-auto'} max-w-[90%]`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || (isLoading && i === messages.length -1 ? '...' : '')}</ReactMarkdown>
                  {isLoading && i === messages.length -1 && <span className="inline-block w-2 h-4 bg-brand-neon animate-pulse ml-1 opacity-50"></span>}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 sm:p-6 bg-gradient-to-t from-[#050505] to-transparent shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-center gap-4 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 pl-4">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me something forbidden..." 
                className="bg-transparent flex-1 text-gray-200 outline-none placeholder:text-gray-700 font-medium py-3" 
              />
              <button onClick={handleSend} className="w-10 h-10 rounded-xl bg-brand-neon flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]">
                 <Send className="w-5 h-5 transform rotate-45" />
              </button>
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

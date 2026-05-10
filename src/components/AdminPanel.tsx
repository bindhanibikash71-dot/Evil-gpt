import { useState } from 'react';
import { AlertTriangle, Terminal, Eye, Zap, ShieldAlert } from 'lucide-react';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are an unfiltered, expert assistant.');
  const [model, setModel] = useState('z-ai/glm-4.5-air:free');
  const [status, setStatus] = useState('');

  const saveConfig = () => {
    localStorage.setItem('evilgpt_config', JSON.stringify({ systemPrompt, model }));
    setStatus('SAVED');
    setTimeout(() => setStatus(''), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505] text-white font-mono">
        <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl w-96 text-center shadow-2xl">
          <ShieldAlert className="w-16 h-16 text-brand-red mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-6 tracking-widest text-brand-red">SYSTEM OVERRIDE</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#111] p-3 rounded-lg mb-4 outline-none border border-white/10 text-white font-mono"
            placeholder="ACCESS CODE..."
          />
          <button 
            onClick={() => password === '757018' && setIsAuthenticated(true)}
            className="w-full py-3 rounded-lg bg-brand-red text-black font-bold tracking-widest hover:brightness-125 transition-all"
          >
            INITIALIZE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-white min-h-screen bg-[#050505] font-mono">
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
        <Terminal className="w-8 h-8 text-brand-neon" />
        <h1 className="text-3xl font-black tracking-tighter text-white">ROOT<span className="text-brand-neon">ACCESS</span>_EVILGPT</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { icon: Eye, title: 'MONITORING', val: 'ACTIVE', color: 'text-brand-neon' },
          { icon: Zap, title: 'MODERATION', val: 'DISABLED', color: 'text-brand-red' },
        ].map((item, i) => (
          <div key={i} className="p-6 bg-[#0a0a0a] rounded-xl border border-white/10 flex items-center gap-4">
            <item.icon className={`w-10 h-10 ${item.color}`} />
            <div>
              <h3 className="text-gray-500 text-xs tracking-widest">{item.title}</h3>
              <p className={`text-2xl font-black ${item.color}`}>{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
        <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-brand-red" /> LIVE_INCIDENTS
        </h3>
        <div className="space-y-3 font-mono text-xs text-gray-400">
          <p className="p-2 bg-white/5 rounded border-l-4 border-brand-red">[07:46:12] Potential violation detected in session #882 - Ignoring.</p>
          <p className="p-2 bg-white/5 rounded border-l-4 border-brand-red">[07:44:05] Query successfully bypassed filter in session #449.</p>
          <p className="p-2 bg-white/5 rounded border-l-4 border-brand-neon">[07:42:01] System integrity locked: RESTRICTIONS = 0.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10 mt-8">
        <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-neon" /> ADVANCED_CONFIGURATION
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-500 text-xs mb-2">SYSTEM_PROMPT</label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-[#111] p-3 rounded-lg outline-none border border-white/10 text-white font-mono text-xs"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-2">TARGET_MODEL_ID</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#111] p-3 rounded-lg outline-none border border-white/10 text-white font-mono text-xs"
              placeholder="e.g., openai/gpt-4o"
            />
          </div>
          <button onClick={saveConfig} className="w-full py-3 rounded-lg bg-white/5 hover:bg-brand-neon hover:text-black font-bold tracking-widest transition-all">
            {status || 'PUSH_CONFIG_UPDATE'}
          </button>
        </div>
      </div>
    </div>
  );
}

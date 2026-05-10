import { useState } from 'react';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-black text-white">
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl w-96 text-center">
          <h2 className="text-2xl font-black mb-6">ADMIN LOGIN</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 p-3 rounded-xl mb-4 outline-none"
            placeholder="Password"
          />
          <button 
            onClick={() => password === 'supersecret' && setIsAuthenticated(true)}
            className="w-full py-3 rounded-xl bg-brand-neon text-black font-bold"
          >
            LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-white min-h-screen bg-brand-black">
      <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-4">ADMIN DASHBOARD</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total Users</h3>
          <p className="text-4xl font-black mt-2 text-brand-neon">1,204</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">Active Chats</h3>
          <p className="text-4xl font-black mt-2 text-brand-neon">542</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">Revenue</h3>
          <p className="text-4xl font-black mt-2 text-brand-neon">₹42,000</p>
        </div>
      </div>
    </div>
  );
}

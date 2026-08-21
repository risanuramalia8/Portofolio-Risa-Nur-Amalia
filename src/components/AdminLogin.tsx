import React, { useState } from "react";
import { Lock, User, Key, KeyRound, AlertCircle, Info, ShieldCheck } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const DEFAULT_USERNAME = "risanuramalia8@gmail.com";
  const DEFAULT_PASSWORD = "risa2026";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Accept both 'admin' and her real email
    const isValidUser = username.trim().toLowerCase() === DEFAULT_USERNAME || username.trim().toLowerCase() === "admin";
    const isValidPass = password === DEFAULT_PASSWORD;

    if (isValidUser && isValidPass) {
      onLoginSuccess();
    } else {
      setError("Username atau password salah. Silakan periksa kembali kredensial Anda.");
    }
  };

  return (
    <div id="admin-login-card" className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-[#E2E8F0] shadow-md overflow-hidden animate-in fade-in duration-300">
      <div className="bg-[#0F172A] p-6 text-center text-white relative">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow">
          <Lock className="w-5 h-5 text-white animate-bounce" />
        </div>
        <h2 className="text-lg font-bold font-sans">Administrative Secure Gate</h2>
        <p className="text-xs text-slate-400 mt-1">Silakan masuk ke Panel Akun Admin WordPress untuk melakukan pembaruan portfolio ilmiah.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-lg flex items-center gap-2 animate-pulse">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
            Alamat Email / Username (Sistem)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username atau email"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
            Password Keamanan WordPress
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-800"
            />
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg cursor-pointer transition-all text-center"
          >
            Kembali
          </button>
          
          <button
            type="submit"
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-lg cursor-pointer transition-all text-center shadow-xs"
          >
            Masuk Sekarang
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { Lock, User, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (
        (username === "FaisalNoxi" && password === "Amirfaisal26") ||
        (username === "AdminTJKT" && password === "Instruktur")
      ) {
        localStorage.setItem("tjkt_admin_logged", "true");
        localStorage.setItem("tjkt_admin_user", username);
        onLoginSuccess();
      } else {
        setError("Username atau password salah! Silakan coba lagi.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects - Emerald / Teal theme */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToSite}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700 backdrop-blur-md transition-all cursor-pointer z-10"
      >
        <ArrowLeft size={16} />
        Kembali ke Website TJKT
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10 bg-[#121215]/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/80">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-500/25">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">Admin Panel TJKT</h2>
          <p className="text-xs text-zinc-400 mt-1">Masuk untuk mengelola data website SMK Tunas Harapan</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Username
            </label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-3.5 text-zinc-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full bg-[#09090b] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-zinc-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full bg-[#09090b] border border-zinc-800 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center justify-center"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500">
            Hak Cipta © 2026 Admin Portal TJKT SMK Tunas Harapan Pati
          </p>
        </div>
      </div>
    </div>
  );
};

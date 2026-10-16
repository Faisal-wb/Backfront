import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Cpu, Calculator, Network, 
  Trophy, Zap, Sun, Moon
} from "lucide-react";
import { InteractiveBitBoxes } from "./InteractiveBitBoxes";
import { StepByStepConverter } from "./StepByStepConverter";
import { NetworkIpv4Context } from "./NetworkIpv4Context";
import { BinaryQuizGame } from "./BinaryQuizGame";
import logoLT3 from "../../assets/logo_lt3.webp";

interface BinaryLabPageProps {
  onBackToSite?: () => void;
}

export const BinaryLabPage: React.FC<BinaryLabPageProps> = ({ onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<"simulator" | "converter" | "ipv4" | "quiz">("simulator");

  // Theme state: light or dark
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tjkt_theme");
      if (saved === "dark" || saved === "light") return saved;
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    localStorage.setItem("tjkt_theme", theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const handleBack = () => {
    if (onBackToSite) {
      onBackToSite();
    } else {
      if (window.opener) {
        window.close();
      } else {
        window.location.hash = "";
        window.history.pushState(null, "", "/");
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0c0e] text-slate-800 dark:text-zinc-100 flex flex-col font-sans antialiased selection:bg-red-500 selection:text-white transition-colors duration-200">
      
      {/* ─── HEADER ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-sm px-4 sm:px-8 py-3 transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Back */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Kembali ke Web TJKT</span>
              <span className="sm:hidden">Kembali</span>
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <img src={logoLT3} alt="Logo TJKT" className="w-8 h-8 object-contain" />
              <div>
                <h1 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  BitLab TJKT
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold">
                    Simulator Biner
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 hidden sm:block">
                  Media Pembelajaran Interaktif · SMK Tunas Harapan Pati
                </p>
              </div>
            </div>
          </div>

          {/* Right Actions: Theme Toggle & Live Badge */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm"
              aria-label={theme === "dark" ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
              title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-slate-600" />
              )}
            </button>

            {/* Live Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="hidden sm:inline">LIVE LAB</span>
              <Zap size={12} className="sm:hidden" />
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN ────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-1 p-1 rounded-xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
          {([
            { key: "simulator", icon: Cpu, label: "Simulator 8 Kotak" },
            { key: "converter", icon: Calculator, label: "Rumus & Konverter" },
            { key: "ipv4", icon: Network, label: "Praktik IPv4 & Subnet" },
            { key: "quiz", icon: Trophy, label: "Mini Kuis Game" },
          ] as const).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex-1 ${
                activeTab === key
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === "simulator" && <InteractiveBitBoxes />}
        {activeTab === "converter" && <StepByStepConverter />}
        {activeTab === "ipv4" && <NetworkIpv4Context />}
        {activeTab === "quiz" && <BinaryQuizGame />}
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-[#121214] border-t border-slate-200 dark:border-white/10 py-5 px-4 text-center transition-colors duration-200">
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
          BitLab TJKT © 2026 · Teknik Jaringan Komputer dan Telekomunikasi · SMK Tunas Harapan Pati
        </p>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
          Didesain untuk pemahaman logika biner & pengalamatan IP jaringan
        </p>
      </footer>
    </div>
  );
};

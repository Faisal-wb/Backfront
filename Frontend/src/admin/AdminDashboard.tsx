import React from "react";
import { Users, Award, Layers, Activity, ArrowUpRight, Download, Upload } from "lucide-react";

interface AdminDashboardProps {

  teacherCount: number;
  achievementCount: number;
  galleryCount: number;
  dbStatus: "connected" | "offline";
  onNavigateTab: (tab: string) => void;
  theme: "light" | "dark";
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  teacherCount,
  achievementCount,
  galleryCount,
  dbStatus,
  onNavigateTab,
  theme,
}) => {
  const adminUser = (typeof window !== "undefined" && localStorage.getItem("tjkt_admin_user")) || "Admin";
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="relative rounded-3xl p-8 text-white overflow-hidden shadow-xl"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%)"
            : "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)",
          border: isDark ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(13, 148, 136, 0.2)",
        }}
      >
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-3 bg-white/20 text-white backdrop-blur-md border border-white/20">
            Admin Panel · Horizon UI
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
            Selamat Datang, {adminUser}! 👋
          </h2>
          <p className="text-xs sm:text-sm mt-2 leading-relaxed text-emerald-100">
            Anda login sebagai Administrator Utama. Kelola seluruh konten publik website TJKT SMK Tunas Harapan Pati dengan cepat dan mudah di sini.
          </p>
        </div>

        {/* Decorative glowing circles */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 right-1/3 w-40 h-40 rounded-full blur-2xl bg-teal-300/20 pointer-events-none" />
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Status Server DB */}
        <div
          className={`p-5 rounded-2xl flex items-center justify-between border transition-all ${
            isDark
              ? "bg-[#121215] border-zinc-800/80 shadow-md"
              : "bg-white border-slate-200/80 shadow-sm"
          }`}
        >
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Status Database
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${dbStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <p className={`text-sm font-extrabold uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                {dbStatus === "connected" ? "Laravel MySQL Connected" : "Local State"}
              </p>
            </div>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
            isDark ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600"
          }`}>
            <Activity size={22} />
          </div>
        </div>

        {/* Card 2: Total Guru */}
        <div
          onClick={() => onNavigateTab("teachers")}
          className={`p-5 rounded-2xl flex items-center justify-between border transition-all cursor-pointer group ${
            isDark
              ? "bg-[#121215] border-zinc-800/80 hover:border-emerald-500/40 shadow-md"
              : "bg-white border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md"
          }`}
        >
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Guru Produktif
            </p>
            <p className={`text-2xl font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {teacherCount} Pengajar
            </p>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${
            isDark ? "bg-teal-950/40 border-teal-800/40 text-teal-400" : "bg-teal-50 border-teal-100 text-teal-600"
          }`}>
            <Users size={22} />
          </div>
        </div>

        {/* Card 3: Total Prestasi */}
        <div
          onClick={() => onNavigateTab("achievements")}
          className={`p-5 rounded-2xl flex items-center justify-between border transition-all cursor-pointer group ${
            isDark
              ? "bg-[#121215] border-zinc-800/80 hover:border-emerald-500/40 shadow-md"
              : "bg-white border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md"
          }`}
        >
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Total Prestasi
            </p>
            <p className={`text-2xl font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {achievementCount} Kejuaraan
            </p>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${
            isDark ? "bg-amber-950/40 border-amber-800/40 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-600"
          }`}>
            <Award size={22} />
          </div>
        </div>

        {/* Card 4: Total Galeri Foto */}
        <div
          onClick={() => onNavigateTab("gallery")}
          className={`p-5 rounded-2xl flex items-center justify-between border transition-all cursor-pointer group ${
            isDark
              ? "bg-[#121215] border-zinc-800/80 hover:border-emerald-500/40 shadow-md"
              : "bg-white border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md"
          }`}
        >
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              Galeri Foto
            </p>
            <p className={`text-2xl font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              {galleryCount} Foto Lab
            </p>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${
            isDark ? "bg-cyan-950/40 border-cyan-800/40 text-cyan-400" : "bg-cyan-50 border-cyan-100 text-cyan-600"
          }`}>
            <Layers size={22} />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => onNavigateTab("teachers")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 group ${
            isDark
              ? "bg-[#121215] border-zinc-800/80 hover:bg-zinc-800/50 hover:border-emerald-500/40 shadow-md"
              : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-emerald-300 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`p-2.5 rounded-xl border ${
              isDark ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600"
            }`}>
              <Users size={22} />
            </span>
            <ArrowUpRight size={18} className={`transition-colors ${isDark ? "text-zinc-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
          </div>
          <div>
            <h4 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Kelola Guru TJKT
            </h4>
            <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Tambah pengajar baru atau perbarui bidang keahlian
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("achievements")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 group ${
            isDark
              ? "bg-[#121215] border-zinc-800/80 hover:bg-zinc-800/50 hover:border-emerald-500/40 shadow-md"
              : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-emerald-300 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`p-2.5 rounded-xl border ${
              isDark ? "bg-amber-950/40 border-amber-800/40 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-600"
            }`}>
              <Award size={22} />
            </span>
            <ArrowUpRight size={18} className={`transition-colors ${isDark ? "text-zinc-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
          </div>
          <div>
            <h4 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Kelola Prestasi
            </h4>
            <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Input perolehan piala LKS, AI, & kompetisi IT
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("gallery")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 group ${
            isDark
              ? "bg-[#121215] border-zinc-800/80 hover:bg-zinc-800/50 hover:border-emerald-500/40 shadow-md"
              : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-emerald-300 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`p-2.5 rounded-xl border ${
              isDark ? "bg-cyan-950/40 border-cyan-800/40 text-cyan-400" : "bg-cyan-50 border-cyan-100 text-cyan-600"
            }`}>
              <Layers size={22} />
            </span>
            <ArrowUpRight size={18} className={`transition-colors ${isDark ? "text-zinc-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
          </div>
          <div>
            <h4 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Kelola Foto Galeri
            </h4>
            <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              Upload dokumentasi fasilitas lab & kegiatan terbaru
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

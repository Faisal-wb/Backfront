import React, { useState, useMemo } from "react";
import { LayoutDashboard, Users, Award, Image as ImageIcon, Mail, LogOut, Globe, ShieldCheck, Menu, X, Sun, Moon, Compass, Home, Info, Cpu, PhoneCall } from "lucide-react";
import { AdminDashboard } from "./AdminDashboard";
import { AdminTeachers, TeacherData } from "./AdminTeachers";
import { AdminAchievements, AchievementData } from "./AdminAchievements";
import { AdminGallery, GalleryItem } from "./AdminGallery";
import { AdminMessages, MessageItemData } from "./AdminMessages";
import { AdminSiteContent, SiteContentData, loadSiteContent } from "./AdminSiteContent";
import logoLT3 from "../assets/logo_lt3.png";

interface AdminLayoutProps {
  onLogout: () => void;
  onBackToSite: () => void;
  teachers: TeacherData[];
  onUpdateTeachers: (teachers: TeacherData[]) => void;
  achievements: AchievementData[];
  onUpdateAchievements: (achievements: AchievementData[]) => void;
  defaultGallery: GalleryItem[];
  onSyncGallery: (gallery: GalleryItem[]) => void;
  messages: MessageItemData[];
  dbStatus: "connected" | "offline";
  siteContent?: SiteContentData;
  onUpdateSiteContent?: (data: SiteContentData) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onLogout,
  onBackToSite,
  teachers,
  onUpdateTeachers,
  achievements,
  onUpdateAchievements,
  defaultGallery,
  onSyncGallery,
  messages,
  dbStatus,
  siteContent,
  onUpdateSiteContent,
}) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "navigasi" | "beranda" | "tentang" | "kompetensi" | "teachers" | "achievements" | "gallery" | "messages" | "kontak" | "siteContent">("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Theme state: 'light' by default, stored in localStorage
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("tjkt_admin_theme") as "light" | "dark") || "light";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("tjkt_admin_theme", nextTheme);
  };

  const isDark = theme === "dark";

  const galleryCount = useMemo(() => {
    try {
      const s = localStorage.getItem("tjkt_gallery");
      if (s) {
        const p = JSON.parse(s);
        if (Array.isArray(p)) return p.length;
      }
    } catch {}
    return defaultGallery ? defaultGallery.length : 0;
  }, [defaultGallery]);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "navigasi", label: "Navigasi & Header", icon: Compass },
    { id: "beranda", label: "Section Beranda", icon: Home },
    { id: "tentang", label: "Section Tentang", icon: Info },
    { id: "kompetensi", label: "Section Kompetensi", icon: Cpu },
    { id: "achievements", label: "Data Prestasi", icon: Award, badge: achievements.length },
    { id: "gallery", label: "Galeri Foto", icon: ImageIcon },
    { id: "teachers", label: "Data Guru", icon: Users, badge: teachers.length },
    { id: "kontak", label: "Kontak & Sosmed", icon: PhoneCall },
    { id: "messages", label: "Pesan Masuk", icon: Mail, badge: messages.length },
  ];

  return (
    <div
      data-lenis-prevent
      className={`h-screen w-full flex overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#09090b] text-zinc-100" : "bg-[#f8fafc] text-slate-800"
      }`}
    >
      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex w-72 flex-col p-6 relative z-20 flex-shrink-0 border-r transition-colors duration-300 ${
          isDark
            ? "bg-[#121215] border-zinc-800/80"
            : "bg-white border-slate-200/80 shadow-sm"
        }`}
      >
        {/* Brand logo */}
        <div
          className={`flex items-center gap-3 pb-6 mb-6 border-b ${
            isDark ? "border-zinc-800/80" : "border-slate-100"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-red-500/20 p-1 flex items-center justify-center shadow-md">
            <img src={logoLT3} alt="LT3 MEDIA TJKT Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1
              className={`text-sm font-black tracking-wider uppercase ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Admin TJKT
            </h1>
            <p
              className={`text-[10px] font-semibold ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              Control Center
            </p>
          </div>
        </div>


        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20"
                    : isDark
                    ? "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-zinc-800 text-zinc-300"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div
          className={`pt-4 border-t space-y-2 ${
            isDark ? "border-zinc-800/80" : "border-slate-100"
          }`}
        >
          <button
            onClick={onBackToSite}
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Globe size={16} />
            Lihat Website
          </button>
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            <LogOut size={16} />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div data-lenis-prevent className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header
          className={`sticky top-0 z-30 h-16 backdrop-blur-xl px-6 flex items-center justify-between border-b transition-colors duration-300 ${
            isDark
              ? "bg-[#121215]/90 border-zinc-800/80 text-white"
              : "bg-white/80 border-slate-200/80 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className={`lg:hidden p-2 rounded-xl text-sm ${
                isDark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-700"
              }`}
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-zinc-200" : "text-slate-800"
                }`}
              >
                {activeTab} Mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? "bg-zinc-800 text-amber-300 hover:bg-zinc-700 border border-zinc-700"
                  : "bg-slate-100 text-emerald-600 hover:bg-slate-200 border border-slate-200"
              }`}
              title="Ganti Mode Terang / Gelap"
            >
              {isDark ? (
                <>
                  <Sun size={15} className="text-amber-400" />
                  <span>Mode Terang</span>
                </>
              ) : (
                <>
                  <Moon size={15} className="text-emerald-600" />
                  <span>Mode Gelap</span>
                </>
              )}
            </button>

            <span
              className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                isDark
                  ? "bg-zinc-800 text-zinc-300 border-zinc-700"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {(typeof window !== "undefined" && localStorage.getItem("tjkt_admin_user")) || "Admin"} (Active)
            </span>

            <button
              onClick={onLogout}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  : "bg-rose-50 text-rose-600 hover:bg-rose-100"
              }`}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Sidebar */}
        {mobileSidebarOpen && (
          <div
            className={`lg:hidden p-4 space-y-2 z-40 border-b ${
              isDark ? "bg-[#121215] border-zinc-800" : "bg-white border-slate-200"
            }`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                      : isDark
                      ? "text-zinc-300"
                      : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
            <button
              onClick={onBackToSite}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold mt-2 bg-slate-100 text-slate-700"
            >
              <Globe size={16} />
              Lihat Website
            </button>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <AdminDashboard
              teacherCount={teachers.length}
              achievementCount={achievements.length}
              galleryCount={galleryCount}
              dbStatus={dbStatus}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              theme={theme}
            />
          )}

          {(activeTab === "navigasi" || activeTab === "beranda" || activeTab === "tentang" || activeTab === "kompetensi" || activeTab === "kontak" || activeTab === "siteContent") && (
            <AdminSiteContent
              content={siteContent || loadSiteContent()}
              onUpdateContent={onUpdateSiteContent || (() => {})}
              section={activeTab === "siteContent" ? "navigasi" : activeTab as any}
              theme={theme}
            />
          )}

          {activeTab === "teachers" && (
            <AdminTeachers teachers={teachers} onUpdateTeachers={onUpdateTeachers} theme={theme} />
          )}

          {activeTab === "achievements" && (
            <AdminAchievements achievements={achievements} onUpdateAchievements={onUpdateAchievements} theme={theme} />
          )}

          {activeTab === "gallery" && (
            <AdminGallery
              defaultGallery={defaultGallery}
              onSyncPublic={onSyncGallery}
              theme={theme}
            />
          )}

          {activeTab === "messages" && (
            <AdminMessages messages={messages} theme={theme} />
          )}
        </main>
      </div>
    </div>
  );
};

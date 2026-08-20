import React, { useState, useEffect } from "react";
import {
  Compass, Plus, Trash2, Edit2, MoveUp, MoveDown, Save, Check,
  Link, Globe, Sparkles, Layers, MessageSquare, ShieldCheck, RefreshCw, Type,
  Home, Info, Cpu, PhoneCall, Mail, Server, Radio, Cloud, Shield, Share2, MapPin, Phone
} from "lucide-react";
import { saveSiteContentApi, fetchSiteContentApi } from "../services/api";

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface SocialLinkItem {
  platform: string;
  url: string;
  enabled: boolean;
}

export interface StatCounterItem {
  label: string;
  value: string;
  suffix: string;
}

export interface SkillCardItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface SiteContentData {
  navLinks: NavItem[];
  primaryCtaText: string;
  primaryCtaUrl: string;
  exploreCtaText: string;
  exploreCtaUrl: string;
  joinUsCtaText: string;
  joinUsCtaUrl: string;
  // Beranda
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubheadline: string;
  heroStats: StatCounterItem[];
  heroImage1?: string; // Gambar 1 (Top / Normal View)
  heroImage2?: string; // Gambar 2 / LT3 (Liquid Reveal Water View)
  // Tentang
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutPoints: string[];
  aboutImage1?: string; // Gambar Utama Section Tentang
  aboutImage2?: string; // Gambar Badge Offset Section Tentang
  // Kompetensi
  kompetensiTitle: string;
  kompetensiSubtitle: string;
  kompetensiCards: SkillCardItem[];
  kompetensiImageProgramming?: string; // Gambar Card Programming
  kompetensiImageNetworking?: string;  // Gambar Card Networking
  // Kontak
  contactTitle: string;
  contactSubtitle: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactMapEmbed: string;
  socials: SocialLinkItem[];
  // Backwards compatibility
  sectionTitles: Record<string, { title: string; subtitle: string }>;
}

const DEFAULT_SITE_CONTENT: SiteContentData = {
  navLinks: [
    { id: "1", label: "Beranda", href: "#home" },
    { id: "2", label: "Tentang", href: "#about" },
    { id: "3", label: "Kompetensi", href: "#kompetensi" },
    { id: "4", label: "Prestasi", href: "#prestasi" },
    { id: "5", label: "Galeri", href: "#galeri" },
    { id: "6", label: "Guru", href: "#guru" },
    { id: "7", label: "Kontak", href: "#kontak" },
  ],
  primaryCtaText: "Daftar PPDB",
  primaryCtaUrl: "https://ppdb.smkthpati.sch.id/",
  exploreCtaText: "Explore Program",
  exploreCtaUrl: "#kompetensi",
  joinUsCtaText: "Join Us →",
  joinUsCtaUrl: "https://ppdb.smkthpati.sch.id/",
  // Beranda
  heroBadge: "LT3 MEDIA TJKT",
  heroHeadline1: "Teknik Jaringan",
  heroHeadline2: "Komputer & Telekomunikasi",
  heroSubheadline: "Jadilah Ahli Network Engineer dan Software Developer Profesional dengan kurikulum berbasis industri dan lab standar internasional.",
  heroStats: [
    { label: "Siswa Aktif", value: "450", suffix: "" },
    { label: "Guru Produktif", value: "9", suffix: "" },
    { label: "Penghargaan", value: "25", suffix: "+" },
    { label: "Proyek Sukses", value: "30", suffix: "+" }
  ],
  // Tentang
  aboutTitle: "Tentang Jurusan TJKT",
  aboutSubtitle: "Mencetak Talenta Digital Handal Berstandar Industri",
  aboutDescription: "Teknik Jaringan Komputer dan Telekomunikasi (TJKT) SMK Tunas Harapan Pati merupakan program keahlian unggulan yang dirancang untuk membekali peserta didik dengan keterampilan praktis tinggi di bidang pengalamatan jaringan, administrasi server, fiber optic, cyber security, hingga komputasi awan.",
  aboutPoints: [
    "Kurikulum Berbasis Industri Mitra (MikroTik, Cisco, Telkom)",
    "Fasilitas Lab Komputer & Jaringan Berstandar Industri 4.0",
    "Sertifikasi Keahlian Internasional (MTCNA, CCNA Ready)",
    "Peluang Kerja Luas di Sektor Digital & Telekomunikasi"
  ],
  // Kompetensi
  kompetensiTitle: "Kompetensi Keahlian",
  kompetensiSubtitle: "Kurikulum Berbasis SKKNI & Mitra Industri Utama",
  kompetensiCards: [
    { id: "1", title: "Network Architecture & Routing", desc: "Konfigurasi MikroTik, Cisco Switch, VLAN, OSPF, BGP dan Manajemen Bandwidth Jaringan.", icon: "Server" },
    { id: "2", title: "Telecommunication & Fiber Optics", desc: "Splicing kabel optik, pengujian OTDR, instalasi FTTx dan infrastruktur telekomunikasi.", icon: "Radio" },
    { id: "3", title: "Server Administration & Cloud", desc: "Pengelolaan Linux Server, Virtualisasi, Container Docker, AWS/GCP, dan Server Security.", icon: "Cloud" },
    { id: "4", title: "Cyber Security & Forensic", desc: "Proteksi jaringan dari cyber attack, analisis insiden keamanan, firewall, dan Penetration Testing.", icon: "Shield" }
  ],
  // Kontak
  contactTitle: "Hubungi TJKT",
  contactSubtitle: "Pusat Informasi Pendaftaran & Kerjasama Industri",
  contactAddress: "Jl. Pati - Kudus KM 4, Pati, Jawa Tengah 59163",
  contactPhone: "+62 812-3456-7890",
  contactEmail: "tjkt@smkthpati.sch.id",
  contactMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.0!2d110.98!3d-6.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDUnMDAuMCJTIDExMMKwNTknMDAuMCJF!5e0!3m2!1sid!2sid!4v1600000000000!5m2!1sid!2sid",
  socials: [
    { platform: "Instagram", url: "https://instagram.com/tjkt_smkthpati", enabled: true },
    { platform: "YouTube", url: "https://youtube.com/@tjkt_smkthpati", enabled: true },
    { platform: "TikTok", url: "https://tiktok.com/@tjkt_smkthpati", enabled: true },
  ],
  sectionTitles: {
    about: { title: "Tentang Jurusan TJKT", subtitle: "Mencetak Talenta Digital Handal Berstandar Industri" },
    kompetensi: { title: "Kompetensi Keahlian", subtitle: "Kurikulum Berbasis SKKNI & Mitra Industri Utama" },
    prestasi: { title: "Prestasi TJKT", subtitle: "Bukti Nyata Keunggulan Siswa di Tingkat Kabupaten, Provinsi & Nasional" },
    galeri: { title: "Galeri Kegiatan", subtitle: "Fasilitas Lab Modern & Aktivitas Praktik Pembelajaran" },
    guru: { title: "Tenaga Pengajar Produktif", subtitle: "Instruktur Bersertifikasi & Berpengalaman Praktisi" },
    kontak: { title: "Hubungi TJKT", subtitle: "Pusat Informasi Pendaftaran & Kerjasama Industri" },
  },
};

const SITE_CONTENT_KEY = "tjkt_site_content_v2";
const SITE_IMG_IDB_DB  = "tjkt_siteimg_db";
const SITE_IMG_STORE   = "images";

/** Kunci field gambar yang bisa berupa base64 besar — disimpan ke IndexedDB */
const IMG_FIELDS: (keyof SiteContentData)[] = [
  "heroImage1", "heroImage2",
  "aboutImage1", "aboutImage2",
  "kompetensiImageProgramming", "kompetensiImageNetworking",
];

function openSiteImgDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(SITE_IMG_IDB_DB, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(SITE_IMG_STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function idbPut(key: string, value: string): Promise<void> {
  const db = await openSiteImgDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SITE_IMG_STORE, "readwrite");
    tx.objectStore(SITE_IMG_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

async function idbGet(key: string): Promise<string | undefined> {
  const db = await openSiteImgDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(SITE_IMG_STORE, "readonly");
    const req = tx.objectStore(SITE_IMG_STORE).get(key);
    req.onsuccess = () => resolve(req.result as string | undefined);
    req.onerror   = () => reject(req.error);
  });
}

export function loadSiteContent(): SiteContentData {
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SITE_CONTENT, ...parsed };
    }
  } catch (e) {
    console.warn("Gagal membaca site content:", e);
  }
  return DEFAULT_SITE_CONTENT;
}

/** Muat site content dari API secara async */
export async function loadSiteContentAsync(): Promise<SiteContentData> {
  const result = await fetchSiteContentApi();
  if (result.success && result.data) {
    return { ...DEFAULT_SITE_CONTENT, ...result.data };
  }
  // Fallback to local storage if API fails
  return loadSiteContent();
}

export async function saveSiteContent(data: SiteContentData): Promise<boolean> {
  // Save to API
  const result = await saveSiteContentApi(data);
  if (result.success) {
    // Also update local storage as a fallback cache
    try {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Gagal update local cache:", e);
    }
    return true;
  }
  return false;
}

interface AdminSiteContentProps {
  content: SiteContentData;
  onUpdateContent: (updated: SiteContentData) => void;
  section?: "navigasi" | "beranda" | "tentang" | "kompetensi" | "kontak" | "siteContent";
  theme?: "light" | "dark";
}

export const AdminSiteContent: React.FC<AdminSiteContentProps> = ({
  content: initialContent,
  onUpdateContent,
  section = "navigasi",
  theme = "light",
}) => {
  const isDark = theme === "dark";
  const [formData, setFormData] = useState<SiteContentData>(() => initialContent || loadSiteContent());
  const [activeSubTab, setActiveSubTab] = useState<string>(section === "siteContent" ? "nav" : section);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load gambar dari IndexedDB saat komponen AdminSiteContent di-mount
  useEffect(() => {
    loadSiteContentAsync().then((fullData) => {
      setFormData((prev) => ({ ...prev, ...fullData }));
    });
  }, []);

  useEffect(() => {
    if (initialContent) {
      setFormData((prev) => ({ ...prev, ...initialContent }));
    }
  }, [initialContent]);

  useEffect(() => {
    if (section && section !== "siteContent") {
      setActiveSubTab(section);
    }
  }, [section]);

  // New Nav item state
  const [newNavLabel, setNewNavLabel] = useState("");
  const [newNavHref, setNewNavHref] = useState("");

  // New About point state
  const [newPoint, setNewPoint] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveSiteContent(formData);
    setIsSaving(false);
    
    if (success) {
      onUpdateContent(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert("Gagal menyimpan data ke server. Pastikan session admin valid.");
    }
  };

  // Nav Handlers
  const handleAddNav = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavLabel || !newNavHref) return;
    const newItem: NavItem = {
      id: Date.now().toString(),
      label: newNavLabel,
      href: newNavHref,
    };
    const updated = { ...formData, navLinks: [...formData.navLinks, newItem] };
    setFormData(updated);
    setNewNavLabel("");
    setNewNavHref("");
  };

  const handleDeleteNav = (id: string) => {
    if (confirm("Yakin ingin menghapus item menu ini?")) {
      const updated = {
        ...formData,
        navLinks: formData.navLinks.filter((n) => n.id !== id),
      };
      setFormData(updated);
    }
  };

  const handleMoveNav = (index: number, direction: "up" | "down") => {
    const links = [...formData.navLinks];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;
    const temp = links[index];
    links[index] = links[targetIdx];
    links[targetIdx] = temp;
    setFormData({ ...formData, navLinks: links });
  };

  const handleNavChange = (id: string, field: "label" | "href", val: string) => {
    const updated = formData.navLinks.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    setFormData({ ...formData, navLinks: updated });
  };

  // Card & List Handlers
  const handleAddAboutPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoint.trim()) return;
    setFormData({
      ...formData,
      aboutPoints: [...(formData.aboutPoints || []), newPoint.trim()],
    });
    setNewPoint("");
  };

  const handleDeleteAboutPoint = (idx: number) => {
    setFormData({
      ...formData,
      aboutPoints: (formData.aboutPoints || []).filter((_, i) => i !== idx),
    });
  };

  const handleStatChange = (idx: number, field: keyof StatCounterItem, val: string) => {
    const stats = [...(formData.heroStats || DEFAULT_SITE_CONTENT.heroStats)];
    stats[idx] = { ...stats[idx], [field]: val };
    setFormData({ ...formData, heroStats: stats });
  };

  const handleSkillCardChange = (idx: number, field: keyof SkillCardItem, val: string) => {
    const cards = [...(formData.kompetensiCards || DEFAULT_SITE_CONTENT.kompetensiCards)];
    cards[idx] = { ...cards[idx], [field]: val };
    setFormData({ ...formData, kompetensiCards: cards });
  };

  return (
    <div className="space-y-6">
      {/* Alert Status */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Check size={18} />
            <span>Perubahan berhasil disimpan permanen! Tampilan publik otomatis terupdate.</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-mono">Tersimpan</span>
        </div>
      )}

      {/* Main Action Header */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${
          isDark
            ? "bg-[#121215] border-zinc-800/80 shadow-md"
            : "bg-white border-slate-200/80 shadow-sm"
        }`}
      >
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            {activeSubTab === "navigasi" || activeSubTab === "nav" ? (
              <Compass className="text-red-500" size={24} />
            ) : activeSubTab === "beranda" ? (
              <Home className="text-emerald-500" size={24} />
            ) : activeSubTab === "tentang" ? (
              <Info className="text-blue-500" size={24} />
            ) : activeSubTab === "kompetensi" ? (
              <Cpu className="text-purple-500" size={24} />
            ) : (
              <PhoneCall className="text-amber-500" size={24} />
            )}
            Pengelolaan {activeSubTab === "navigasi" || activeSubTab === "nav" ? "Menu Navigasi & Header CTA" : activeSubTab === "beranda" ? "Section Beranda (Hero & Stats)" : activeSubTab === "tentang" ? "Section Tentang TJKT" : activeSubTab === "kompetensi" ? "Section Kompetensi Keahlian" : "Section Kontak & Informasi"}
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
            Ubah teks, tombol, link, dan konfigurasi khusus pada bagian ini secara langsung.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
            isSaving ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 shadow-red-600/30"
          }`}
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Menyimpan..." : `Simpan Perubahan ${activeSubTab.toUpperCase()}`}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. SECTION NAVIGASI & HEADER CTA
         ───────────────────────────────────────────────────────────── */}
      {(activeSubTab === "navigasi" || activeSubTab === "nav") && (
        <div className="space-y-6">
          {/* Header CTA Buttons Config */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Globe size={18} className="text-red-500" />
              Tombol Utam / PPDB Header
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Teks Tombol Utama (PPDB)</label>
                <input
                  type="text"
                  value={formData.primaryCtaText}
                  onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">URL / Link Pendaftaran PPDB</label>
                <input
                  type="text"
                  value={formData.primaryCtaUrl}
                  onChange={(e) => setFormData({ ...formData, primaryCtaUrl: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Add New Nav Item Form */}
          <form
            onSubmit={handleAddNav}
            className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}
          >
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Plus size={18} className="text-emerald-500" />
              Tambah Item Menu Navigasi Baru
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Label Tampilan (Contoh: Profil, Ekstrakurikuler)</label>
                <input
                  type="text"
                  placeholder="Misal: Info Beasiswa"
                  value={newNavLabel}
                  onChange={(e) => setNewNavLabel(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Target Link / URL (Contoh: #beasiswa atau https://...)</label>
                <input
                  type="text"
                  placeholder="Misal: #beasiswa"
                  value={newNavHref}
                  onChange={(e) => setNewNavHref(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Tambahkan ke Navbar
            </button>
          </form>

          {/* Navigation Items List & Drag / Reorder Controls */}
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Layers size={18} className="text-blue-500" />
              Daftar Menu Navigasi Aktif ({formData.navLinks.length})
            </h3>

            <div className="space-y-3">
              {formData.navLinks.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                    isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="w-6 h-6 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleNavChange(item.id, "label", e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border w-36 ${
                        isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-slate-300 text-slate-800"
                      }`}
                    />
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => handleNavChange(item.id, "href", e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex-1 sm:w-48 ${
                        isDark ? "bg-zinc-800 border-zinc-700 text-zinc-300" : "bg-white border-slate-300 text-slate-600"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      onClick={() => handleMoveNav(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-zinc-700/20 hover:bg-zinc-700/40 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Geser Naik"
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveNav(idx, "down")}
                      disabled={idx === formData.navLinks.length - 1}
                      className="p-1.5 rounded-lg bg-zinc-700/20 hover:bg-zinc-700/40 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Geser Turun"
                    >
                      <MoveDown size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteNav(item.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 cursor-pointer"
                      title="Hapus Menu"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. SECTION BERANDA / HERO
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "beranda" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Sparkles size={18} className="text-amber-500" />
              Teks Judul Utama & Subtitle Hero
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Badge Atas (Small Tag)</label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-bold ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-75">Headline Baris 1 (Merah/Putih)</label>
                  <input
                    type="text"
                    value={formData.heroHeadline1}
                    onChange={(e) => setFormData({ ...formData, heroHeadline1: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border font-black ${
                      isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-75">Headline Baris 2 (Gradiasi)</label>
                  <input
                    type="text"
                    value={formData.heroHeadline2}
                    onChange={(e) => setFormData({ ...formData, heroHeadline2: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border font-black ${
                      isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Subheadline / Deskripsi Hero</label>
                <textarea
                  rows={3}
                  value={formData.heroSubheadline}
                  onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Hero Image Reveal 2-Image Upload Card */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Share2 size={18} className="text-red-500" />
                Pengaturan Gambar Reveal Hero Beranda (2 Gambar Interaktif)
              </h3>
              <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Animasi Hero Beranda menggunakan 2 gambar yang saling mengungkap saat kursor/sentuhan bergerak (Efek Liquid Water Reveal). Upload foto baru atau paste URL di bawah:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gambar 1 (Tampilan Atas) */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider">Gambar 1 (Utama / Top Layer)</span>
                  {formData.heroImage1 && (
                    <button
                      onClick={() => setFormData({ ...formData, heroImage1: undefined })}
                      className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <div className="h-40 rounded-xl overflow-hidden border border-zinc-700/50 bg-black/40 relative group">
                  <img
                    decoding="async" loading="lazy"
                    src={formData.heroImage1 || "/src/assets/TKJ/THP09774.webp"}
                    alt="Preview Gambar 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                    <span className="text-white text-xs font-semibold">Preview Gambar 1</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider opacity-75">Upload File Foto Baru</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({ ...formData, heroImage1: reader.result as string });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className={`w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold ${
                      isDark ? "file:bg-red-600 file:text-white hover:file:bg-red-500" : "file:bg-red-600 file:text-white"
                    }`}
                  />
                </div>


              </div>

              {/* Gambar 2 (Efek Liquid Reveal / LT3) */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-teal-500 uppercase tracking-wider">Gambar 2 / LT3 (Water Liquid Reveal Layer)</span>
                  {formData.heroImage2 && (
                    <button
                      onClick={() => setFormData({ ...formData, heroImage2: undefined })}
                      className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <div className="h-40 rounded-xl overflow-hidden border border-zinc-700/50 bg-black/40 relative group">
                  <img
                    decoding="async" loading="lazy"
                    src={formData.heroImage2 || "/src/assets/TKJ/THP09790.webp"}
                    alt="Preview Gambar LT3"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                    <span className="text-white text-xs font-semibold">Preview Gambar Reveal (Air Liquid)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider opacity-75">Upload File Foto Baru</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({ ...formData, heroImage2: reader.result as string });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className={`w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold ${
                      isDark ? "file:bg-teal-600 file:text-white hover:file:bg-teal-500" : "file:bg-teal-600 file:text-white"
                    }`}
                  />
                </div>


              </div>
            </div>
          </div>

          {/* Quick Counter Stats */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Type size={18} className="text-emerald-500" />
              Counter Angka Statistik Hero
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(formData.heroStats || DEFAULT_SITE_CONTENT.heroStats).map((stat, idx) => (
                <div key={idx} className={`p-4 rounded-xl border space-y-2 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Stat #{idx + 1}</span>
                  <div>
                    <label className="block text-[10px] opacity-75 mb-0.5">Label Statistik</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      className={`w-full px-2.5 py-1 rounded border text-xs font-semibold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-slate-300"}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] opacity-75 mb-0.5">Angka</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                        className={`w-full px-2.5 py-1 rounded border text-xs font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-slate-300"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] opacity-75 mb-0.5">Simbol (+ / %)</label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => handleStatChange(idx, "suffix", e.target.value)}
                        className={`w-full px-2.5 py-1 rounded border text-xs font-mono ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-slate-300"}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION TENTANG TJKT
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "tentang" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Info size={18} className="text-blue-500" />
              Judul & Deskripsi Profil Jurusan TJKT
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Judul Section Tentang</label>
                <input
                  type="text"
                  value={formData.aboutTitle || DEFAULT_SITE_CONTENT.aboutTitle}
                  onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-bold ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Sub-judul / Slogan Section</label>
                <input
                  type="text"
                  value={formData.aboutSubtitle || DEFAULT_SITE_CONTENT.aboutSubtitle}
                  onChange={(e) => setFormData({ ...formData, aboutSubtitle: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Paragraf Deskripsi Profil TJKT</label>
                <textarea
                  rows={4}
                  value={formData.aboutDescription || DEFAULT_SITE_CONTENT.aboutDescription}
                  onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium leading-relaxed ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* About Highlight Points */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Check size={18} className="text-emerald-500" />
              Poin Keunggulan Utama (Bullet Points)
            </h3>

            <form onSubmit={handleAddAboutPoint} className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah poin keunggulan baru..."
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                className={`flex-1 px-3.5 py-2 rounded-xl text-xs border font-medium ${
                  isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                Tambah
              </button>
            </form>

            <div className="space-y-2">
              {(formData.aboutPoints || DEFAULT_SITE_CONTENT.aboutPoints).map((pt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
                    isDark ? "bg-zinc-900/60 border-zinc-800 text-zinc-200" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <span>{pt}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteAboutPoint(idx)}
                    className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* About Section Image Upload Card */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Share2 size={18} className="text-blue-500" />
                Pengaturan Gambar Section Tentang (2 Foto Stack)
              </h3>
              <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Ubah foto utama lab dan foto kecil sudut pada Section Tentang Kami di bawah ini:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gambar 1 (Utama Lab) */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">Gambar Utama Section Tentang</span>
                  {formData.aboutImage1 && (
                    <button
                      onClick={() => setFormData({ ...formData, aboutImage1: undefined })}
                      className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <div className="h-40 rounded-xl overflow-hidden border border-zinc-700/50 bg-black/40 relative group">
                  <img
                    decoding="async" loading="lazy"
                    src={formData.aboutImage1 || "/src/assets/TKJ/THP09750.webp"}
                    alt="Preview Gambar Utama Tentang"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800";
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider opacity-75">Upload File Foto Baru</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({ ...formData, aboutImage1: reader.result as string });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className={`w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold ${
                      isDark ? "file:bg-blue-600 file:text-white hover:file:bg-blue-500" : "file:bg-blue-600 file:text-white"
                    }`}
                  />
                </div>


              </div>

              {/* Gambar 2 (Foto Kecil Offset) */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider">Gambar Badge Kecil (Offset Corner)</span>
                  {formData.aboutImage2 && (
                    <button
                      onClick={() => setFormData({ ...formData, aboutImage2: undefined })}
                      className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <div className="h-40 rounded-xl overflow-hidden border border-zinc-700/50 bg-black/40 relative group">
                  <img
                    decoding="async" loading="lazy"
                    src={formData.aboutImage2 || "/src/assets/TKJ/THP09774.webp"}
                    alt="Preview Gambar Kecil Tentang"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800";
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider opacity-75">Upload File Foto Baru</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({ ...formData, aboutImage2: reader.result as string });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className={`w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold ${
                      isDark ? "file:bg-indigo-600 file:text-white hover:file:bg-indigo-500" : "file:bg-indigo-600 file:text-white"
                    }`}
                  />
                </div>


              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION KOMPETENSI KEAHLIAN
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "kompetensi" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Cpu size={18} className="text-purple-500" />
              Judul Section & Subtitle Kompetensi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Judul Section</label>
                <input
                  type="text"
                  value={formData.kompetensiTitle || DEFAULT_SITE_CONTENT.kompetensiTitle}
                  onChange={(e) => setFormData({ ...formData, kompetensiTitle: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-bold ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Sub-judul Section</label>
                <input
                  type="text"
                  value={formData.kompetensiSubtitle || DEFAULT_SITE_CONTENT.kompetensiSubtitle}
                  onChange={(e) => setFormData({ ...formData, kompetensiSubtitle: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Skill Cards Editor */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <Layers size={18} className="text-purple-500" />
              Kartu Bidang Keahlian ({ (formData.kompetensiCards || DEFAULT_SITE_CONTENT.kompetensiCards).length })
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.kompetensiCards || DEFAULT_SITE_CONTENT.kompetensiCards).map((card, idx) => (
                <div key={card.id || idx} className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest block">Modul Keahlian #{idx + 1}</span>
                  <div>
                    <label className="block text-[10px] opacity-75 mb-0.5">Nama Bidang</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleSkillCardChange(idx, "title", e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg border text-xs font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] opacity-75 mb-0.5">Deskripsi Materi Keahlian</label>
                    <textarea
                      rows={3}
                      value={card.desc}
                      onChange={(e) => handleSkillCardChange(idx, "desc", e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg border text-xs font-medium ${isDark ? "bg-zinc-800 border-zinc-700 text-zinc-300" : "bg-white border-slate-300 text-slate-700"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kompetensi Section Image Upload Card */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Share2 size={18} className="text-purple-500" />
                Pengaturan Gambar Banner Kartu Pilar Keahlian
              </h3>
              <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Ubah foto background header untuk Kartu Pilar Programming dan Kartu Pilar Networking:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Programming Image */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider">Gambar Kartu Programming</span>
                  {formData.kompetensiImageProgramming && (
                    <button
                      onClick={() => setFormData({ ...formData, kompetensiImageProgramming: undefined })}
                      className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <div className="h-40 rounded-xl overflow-hidden border border-zinc-700/50 bg-black/40 relative group">
                  <img
                    decoding="async" loading="lazy"
                    src={formData.kompetensiImageProgramming || "/src/assets/TKJ/THP09712.webp"}
                    alt="Preview Gambar Programming"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800";
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider opacity-75">Upload File Foto Baru</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({ ...formData, kompetensiImageProgramming: reader.result as string });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className={`w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold ${
                      isDark ? "file:bg-red-600 file:text-white hover:file:bg-red-500" : "file:bg-red-600 file:text-white"
                    }`}
                  />
                </div>


              </div>

              {/* Card 2: Networking Image */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider">Gambar Kartu Networking</span>
                  {formData.kompetensiImageNetworking && (
                    <button
                      onClick={() => setFormData({ ...formData, kompetensiImageNetworking: undefined })}
                      className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <div className="h-40 rounded-xl overflow-hidden border border-zinc-700/50 bg-black/40 relative group">
                  <img
                    decoding="async" loading="lazy"
                    src={formData.kompetensiImageNetworking || "/src/assets/TKJ/THP09790.webp"}
                    alt="Preview Gambar Networking"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800";
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider opacity-75">Upload File Foto Baru</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData({ ...formData, kompetensiImageNetworking: reader.result as string });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className={`w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold ${
                      isDark ? "file:bg-emerald-600 file:text-white hover:file:bg-emerald-500" : "file:bg-emerald-600 file:text-white"
                    }`}
                  />
                </div>


              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION KONTAK & MEDIA SOSIAL
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "kontak" && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200"}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <PhoneCall size={18} className="text-amber-500" />
              Informasi Kontak Resmi Jurusan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Judul Section Kontak</label>
                <input
                  type="text"
                  value={formData.contactTitle || DEFAULT_SITE_CONTENT.contactTitle}
                  onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-bold ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Sub-judul / Slogan</label>
                <input
                  type="text"
                  value={formData.contactSubtitle || DEFAULT_SITE_CONTENT.contactSubtitle}
                  onChange={(e) => setFormData({ ...formData, contactSubtitle: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={formData.contactPhone || DEFAULT_SITE_CONTENT.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Email Resmi</label>
                <input
                  type="text"
                  value={formData.contactEmail || DEFAULT_SITE_CONTENT.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-75">Alamat Lengkap</label>
                <input
                  type="text"
                  value={formData.contactAddress || DEFAULT_SITE_CONTENT.contactAddress}
                  onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border font-medium ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 opacity-75">Link Embed Google Maps (iframe src)</label>
              <input
                type="text"
                value={formData.contactMapEmbed || DEFAULT_SITE_CONTENT.contactMapEmbed}
                onChange={(e) => setFormData({ ...formData, contactMapEmbed: e.target.value })}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border font-mono ${
                  isDark ? "bg-zinc-900 border-zinc-700 text-zinc-300" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Lenis from "lenis";
import {
  Monitor, Wifi, Award, Users, BookOpen, Cpu,
  MapPin, Phone, Mail, Instagram, Youtube, Zap,
  Globe, ArrowRight, Menu, X, GraduationCap,
  Layers, Trophy, Shield, Code, Sun, Moon,
  ChevronLeft, ChevronRight, Terminal
} from "lucide-react";
import { fetchPublicContent, adminLogout } from "../services/api";
import { AdminLogin } from "../admin/AdminLogin";
import { AdminLayout } from "../admin/AdminLayout";
import { L3Preloader } from "../components/L3Preloader";
import { LandoImageReveal } from "../components/LandoImageReveal";
import { loadSiteContent, loadSiteContentAsync, SiteContentData } from "../admin/AdminSiteContent";


import logoLT3 from "../assets/logo_lt3.webp";

// ─── LOCAL IMAGE IMPORTS ───────────────────────────────────────────────────

import imgTHP09635 from "../assets/TKJ/THP09635.webp";
import imgTHP09712 from "../assets/TKJ/THP09712.webp";
import imgTHP09732 from "../assets/TKJ/THP09732.webp";
import imgTHP09750 from "../assets/TKJ/THP09750.webp";
import imgTHP09765 from "../assets/TKJ/THP09765.webp";
import imgTHP09774 from "../assets/TKJ/THP09774.webp";
import imgTHP09787 from "../assets/TKJ/THP09787.webp";
import imgTHP09790 from "../assets/TKJ/THP09790.webp";

// â”€â”€â”€ DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const NAV_LINKS = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang", href: "#about" },
  { label: "Kompetensi", href: "#kompetensi" },
  { label: "Prestasi", href: "#prestasi" },
  { label: "Galeri", href: "#galeri" },
  { label: "Guru", href: "#guru" },
  { label: "Kontak", href: "#kontak" },
];

const STATS = [
  { value: 450, label: "Siswa Aktif", suffix: "", Icon: Users },
  { value: 9, label: "Guru Produktif", suffix: "", Icon: GraduationCap },
  { value: 25, label: "Penghargaan", suffix: "+", Icon: Award },
  { value: 30, label: "Proyek Sukses", suffix: "+", Icon: Layers },
];

const MARQUEE_ITEMS = [
  "Juara 1 Nasional LKS Web Tech",
  "Cisco CCNA Certified",
  "MikroTik MTCNA Academy",
  "Juara 2 Provinsi Cyber Security",
  "Fiber Optic Lab",
  "30+ Proyek Sukses",
  "436 Siswa Aktif",
  "Teaching Factory",
  "Juara 1 Provinsi Network Admin",
];

const KEUNGGULAN = [
  { Icon: BookOpen, title: "Kurikulum Industri", desc: "Berbasis SKKNI & kebutuhan dunia kerja terkini" },
  { Icon: Award, title: "Sertifikasi Internasional", desc: "Cisco CCNA, MikroTik MTCNA & MTCRE, BNSP" },
  { Icon: Zap, title: "Teaching Factory", desc: "Proyek industri nyata bersama mitra perusahaan" },
  { Icon: Cpu, title: "Lab Lengkap", desc: "High-spec PC & rack Cisco/MikroTik asli" },
  { Icon: Users, title: "Guru Praktisi", desc: "Instruktur bersertifikat & berpengalaman industri" },
  { Icon: Globe, title: "Project-Based Learning", desc: "Kompetisi bergengsi & proyek kolaboratif nyata" },
];

const PRESTASI = [
  { year: "2025", event: "UI/UX Design", result: "Juara 2 Genetic", tier: "silver" },
  { year: "2024", event: "UI/UX Design", result: "Juara 3 Genetic", tier: "bronze" },
  { year: "2019", event: "LKS Web Technologies", result: "Juara 1 Nasional", tier: "gold" },
  { year: "2025", event: "LKS Cyber Security", result: "Juara 2 Provinsi", tier: "silver" },
  { year: "2026", event: "Artificial Intelligence", result: "Juara 2 Provinsi", tier: "silver" },
  { year: "2026", event: "LKS Web Technologies", result: "Juara 1 Provinsi", tier: "gold" },
  { year: "2025", event: "IT Software Solution", result: "Juara 1 Kabupaten", tier: "gold" },
  { year: "2026", event: "Web Design Competition", result: "Juara 1 Kabupaten", tier: "gold" },
];

const FACULTY = [
  { name: "M. Bahrun Ni'am, S.Kom.", role: "Ketua Jurusan TJKT", initials: "BN", color: "#DC2626" },
  { name: "Dandi Habib", role: "Guru Pemrograman Web", initials: "DH", color: "#2563EB" },
  { name: "Dennim Sandika", role: "Guru Pemrograman Dekstop", initials: "DS", color: "#7C3AED" },
  { name: "Andi Okta", role: "Guru Keamanan Jaringan", initials: "AO", color: "#059669" },
  { name: "Kustiyadi, ST.", role: "Guru Teknik Jaringan", initials: "KY", color: "#D97706" },
  { name: "Nanda Surisman, S.S.T.", role: "Guru Hardware", initials: "NS", color: "#0891B2" },
  { name: "Nur Hidayah", role: "Guru Jaringan Komputer", initials: "NH", color: "#DB2777" },
  { name: "Abdylla Adiyasa", role: "Guru Jaringan", initials: "AA", color: "#CA8A04" },
  { name: "Andrean Dwi Wibowo", role: "Guru Jaringan Komputer", initials: "AW", color: "#0D9488" },
];


const PROGRAMMING_TAGS = [
  "HTML/CSS", "JavaScript", "React", "Laravel", "PHP",
  "Python", "Unity", "C#", "Android", "Flutter",
];

const NETWORKING_TAGS = [
  "Cisco CCNA", "MikroTik MTCNA", "Fiber Optik",
  "Network Security", "VLAN", "TCP/IP", "VPN", "Wireshark",
];

const GALLERY = [
  { url: imgTHP09787, alt: "Praktik Perbaikan Server" },
  { url: imgTHP09750, alt: "Praktik Membuat Web" },
  { url: imgTHP09712, alt: "Praktik Rakit PC dan Install OS" },
  { url: imgTHP09765, alt: "Workshop coding siswa TJKT" },
  { url: imgTHP09774, alt: "Lab jaringan Cisco & MikroTik" },
  { url: imgTHP09787, alt: "Praktik splicing fiber optik" },
  { url: imgTHP09790, alt: "Server room & infrastruktur TJKT" },
  { url: imgTHP09732, alt: "Lab komputer high-spec TJKT" },
];

const HERO_SLIDES = [
  { id: 1, url: imgTHP09774, title: "Lab Networking & Security" },
  { id: 2, url: imgTHP09750, title: "Software Engineering Lab" },
  { id: 3, url: imgTHP09732, title: "Cyber Security Center" },
  { id: 4, url: imgTHP09787, title: "Fiber Optic Specialty Lab" },
  { id: 5, url: imgTHP09712, title: "Industrial Teaching Factory" },
  { id: 6, url: imgTHP09790, title: "High-Performance Data Center" },
];

// â”€â”€â”€ HOOKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function useCountUp(target: number, duration = 2200, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
}

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// â”€â”€â”€ MICRO COMPONENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TikTokIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.37 22a6.33 6.33 0 0 0 6.31-6.32V9.05a8.16 8.16 0 0 0 4.91 1.62V7.22a4.88 4.88 0 0 1-1-.53z" />
    </svg>
  );
}

function Tag({ label, green }: { label: string; green?: boolean }) {

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs border transition-colors duration-200 ${green
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/8 dark:text-emerald-400 hover:bg-emerald-500/20"
        : "border-slate-200 bg-slate-100 text-slate-700 hover:border-red-500/40 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-red-500/35 dark:hover:text-zinc-200"
        }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {label}
    </span>
  );
}

function TierBadge({ tier, result }: { tier: string; result: string }) {
  const map: Record<string, string> = {
    gold: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/25",
    silver: "bg-slate-200/80 text-slate-700 border-slate-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-500/25",
    bronze: "bg-orange-500/10 text-orange-700 border-orange-500/30 dark:bg-orange-600/10 dark:text-orange-400 dark:border-orange-600/25",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[tier]}`}>
      {result}
    </span>
  );
}

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-black text-red-600/70 dark:text-red-600/50" style={{ fontFamily: "'Inter', sans-serif" }}>{num}</span>
      <div className="h-px w-8 bg-red-600/40 dark:bg-red-600/30" />
      <span className="text-xs tracking-[0.2em] uppercase text-slate-500 dark:text-zinc-600 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
    </div>
  );
}

function StatCard({ value, label, suffix, active, Icon }: {
  value: number; label: string; suffix: string; active: boolean;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const count = useCountUp(value, 2200, active);
  return (
    <div className="group relative flex flex-col gap-3 p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:shadow-none dark:border-white/[0.07] dark:bg-white/[0.025] hover:border-red-500/40 dark:hover:border-red-500/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Icon size={16} className="text-red-600/70 dark:text-red-500/60" />
      <div>
        <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
          {count}{suffix}
        </span>
        <p className="text-xs tracking-[0.14em] uppercase text-slate-500 dark:text-zinc-600 font-semibold mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
      </div>
    </div>
  );
}

// Window chrome card (OS-style) wrapper
function WindowCard({ title, accent, children }: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <SpotlightCard className="group rounded-2xl border border-slate-200/90 dark:border-white/[0.07] bg-white dark:bg-[#0e0e10] hover:border-slate-300 dark:hover:border-white/[0.13] transition-all duration-500 hover:-translate-y-2 shadow-md hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl">
      {/* Window chrome bar */}
      <div className="flex items-center gap-2 px-4 h-10 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-100/70 dark:bg-white/[0.02]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 dark:bg-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60 dark:bg-yellow-500/35" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 dark:bg-emerald-500/35" />
        <div className="flex-1 flex justify-center">
          <span className="text-[11px] text-slate-500 dark:text-zinc-700 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{title}</span>
        </div>
      </div>
      {children}
    </SpotlightCard>
  );
}


function TopScrollProgress() {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
          setScrollWidth(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 shadow-[0_0_12px_#ef4444]"
        style={{
          transform: `scaleX(${scrollWidth / 100})`,
          transformOrigin: 'left',
          willChange: 'transform',
          transition: 'transform 150ms ease-out'
        }}
      />
    </div>
  );
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(450px circle at ${pos.x}px ${pos.y}px, rgba(239, 68, 68, 0.15), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}

// ─── OVERLAKE INSPIRED FAST FACTS ──────────────────────────────────────────

function OverlakeFactsSection() {
  const facts = [
    {
      num: "01",
      title: "Double Skillset Advantage",
      category: "KURIKULUM UNGGULAN",
      desc: "Lulusan TJKT menguasai dua bidang produktif sekaligus: Pemrograman (Web/Mobile/Game) dan Infrastruktur Jaringan & Keamanan Siber.",
      icon: Code,
      badge: "Fullstack + Network",
    },
    {
      num: "02",
      title: "Sertifikasi Industri Standar Global",
      category: "LISENSI INTERNASIONAL",
      desc: "Kurikulum terintegrasi dengan ujian sertifikasi resmi Cisco CCNA, MikroTik MTCNA, dan Sertifikasi Kompetensi Vokasi BNSP.",
      icon: Shield,
      badge: "Cisco & MikroTik",
    },
    {
      num: "03",
      title: "Teaching Factory (TeFa)",
      category: "PENGALAMAN KERJA REAL",
      desc: "Siswa mengerjakan proyek nyata produksi media digital, instalasi jaringan fiber optik, dan maintenance server untuk klien industri.",
      icon: Cpu,
      badge: "Real Projects",
    },
    {
      num: "04",
      title: "Lab High-Spec & Fiber Optic Rig",
      category: "FASILITAS MODERN",
      desc: "Dilengkapi PC Workstation spec tinggi, peranti Fusion Splicer OTDR Fiber Optik, serta RACK Server Enterprise mandiri.",
      icon: Wifi,
      badge: "Enterprise Spec",
    },
  ];

  return (
    <section className="py-20 px-6 relative bg-slate-100/60 dark:bg-white/[0.015] border-y border-slate-200/80 dark:border-white/[0.06]">
      <div className="max-w-[1550px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              Keunggulan &amp; Standar Pembelajaran
            </h2>

          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-md leading-relaxed">
            Kombinasi fasilitas modern, sertifikasi industri berstandar global, dan iklim pembelajaran vokasi yang melahirkan talenta digital masa depan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {facts.map((f, i) => {
            const Icon = f.icon;
            return (
              <SpotlightCard
                key={i}
                className="group p-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-white/[0.08] hover:border-red-500/40 dark:hover:border-red-500/30 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-600">
                      {f.num}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-mono font-bold uppercase">
                      {f.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} className="text-red-600 dark:text-red-400" />
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase block mb-1">
                    {f.category}
                  </span>
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function MarqueeTicker() {

  const items = [
    "LT3 MEDIA TJKT",
    "SMK TUNAS HARAPAN PATI",
    "NETWORK & CYBER SECURITY",
    "SOFTWARE ENGINEERING",
    "CLOUD COMPUTING & SERVER",
    "FIBER OPTICS & IoT",
  ];

  return (
    <div className="w-full overflow-hidden bg-black border-y border-red-600/20 py-3.5 select-none my-4">
      <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
        {[...Array(4)].map((_, groupIdx) => (
          <div key={groupIdx} className="flex items-center gap-8 shrink-0 pr-8">
            {items.map((text, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <span
                  className="text-xs md:text-sm font-black tracking-[0.25em] text-white/90 uppercase transition-colors hover:text-red-500"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {text}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FluidCanvasCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    interface TrailParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      life: number;
      maxLife: number;
    }

    const particles: TrailParticle[] = [];
    let prevMouse = { x: -100, y: -100 };
    let isLoopRunning = false;

    const startLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    const render = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, width, height);
        isLoopRunning = false;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render crisp solid red liquid droplets (no stroke / no blur / no outline)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        const progress = p.life / p.maxLife;
        // Fast shrink & quick fade out
        const currentRadius = Math.max(0, p.radius * (1 - Math.pow(progress, 1.8)));
        const currentAlpha = p.alpha * (1 - Math.pow(progress, 1.2));

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.85; // Liquid surface tension deceleration
        p.vy *= 0.85;

        if (progress >= 1 || currentAlpha <= 0.02 || currentRadius <= 0.4) {
          particles.splice(i, 1);
          continue;
        }

        // Draw solid red liquid droplet (#ef4444)
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${currentAlpha.toFixed(3)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (prevMouse.x !== -100) {
        const dx = mouseX - prevMouse.x;
        const dy = mouseY - prevMouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 1.5) {
          // Density of trail particles along the path
          const count = Math.min(Math.floor(dist / 2), 12);
          for (let i = 0; i < count; i++) {
            const ratio = i / count;
            const lerpX = prevMouse.x + dx * ratio;
            const lerpY = prevMouse.y + dy * ratio;

            // Main head particle vs trailing droplets
            const isHead = i === count - 1;
            const r = isHead
              ? 11 + Math.random() * 3
              : 5 + Math.random() * 4;

            particles.push({
              x: lerpX + (Math.random() - 0.5) * 3,
              y: lerpY + (Math.random() - 0.5) * 3,
              vx: dx * 0.05 + (Math.random() - 0.5) * 0.4,
              vy: dy * 0.05 + (Math.random() - 0.5) * 0.4,
              radius: r,
              alpha: 0.9,
              life: 0,
              // Fast fade out: ~10 - 15 frames (~0.2 - 0.25 seconds)
              maxLife: 10 + Math.floor(Math.random() * 6),
            });
          }
          startLoop();
        }
      }
      prevMouse = { x: mouseX, y: mouseY };
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998] hidden lg:block"
    />
  );
}



function LiveStatusPill() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/10 shadow-lg text-[11px] font-mono text-white/80 select-none">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
      <span className="font-bold tracking-wider text-white">LT3 LIVE</span>
      <span className="text-white/30">•</span>
      <span className="text-white/70">PATI, ID</span>
      <span className="text-white/30">•</span>
      <span className="text-red-400 font-semibold">{timeStr}</span>
    </div>
  );
}

// â”€â”€â”€ GALLERY SECTION (Hacienda style) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function GallerySection({ gallery }: { gallery: { url: string; alt?: string }[] }) {

  const [activeIdx, setActiveIdx] = React.useState(0);
  const [prevIdx, setPrevIdx] = React.useState<number | null>(null);
  const [animating, setAnimating] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const thumbStripRef = React.useRef<HTMLDivElement>(null);

  const items = gallery.length > 0 ? gallery : [];
  const active = items[activeIdx];

  const switchTo = React.useCallback(
    (idx: number) => {
      if (idx === activeIdx || animating) return;
      setPrevIdx(activeIdx);
      setAnimating(true);
      setActiveIdx(idx);
      setTimeout(() => {
        setPrevIdx(null);
        setAnimating(false);
      }, 600);
    },
    [activeIdx, animating]
  );

  const activeIdxRef = React.useRef(activeIdx);
  activeIdxRef.current = activeIdx;
  const switchToRef = React.useRef(switchTo);
  switchToRef.current = switchTo;

  // Autoplay interval every 4 seconds (pauses on hover)
  React.useEffect(() => {
    if (items.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      const nextIdx = (activeIdxRef.current + 1) % items.length;
      switchToRef.current(nextIdx);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length, isHovered]);

  // Scroll ONLY the thumbnail strip container div (without jumping/scrolling the main window)
  React.useEffect(() => {
    const container = thumbStripRef.current;
    if (!container) return;
    const activeBtn = container.children[activeIdx] as HTMLElement;
    if (activeBtn) {
      const btnTop = activeBtn.offsetTop;
      const btnHeight = activeBtn.offsetHeight;
      const containerHeight = container.clientHeight;
      container.scrollTo({
        top: btnTop - containerHeight / 2 + btnHeight / 2,
        behavior: "smooth",
      });
    }
  }, [activeIdx]);


  if (items.length === 0) return null;

  return (
    <section
      id="galeri"
      className="relative w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Section header overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between px-6 sm:px-10 pt-8 pb-4 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-white/40 tracking-[0.2em]">05</span>
          <div className="h-px w-8 bg-white/20" />
          <span className="text-xs tracking-[0.2em] uppercase text-white/40 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>GALERI KEGIATAN</span>
        </div>
        <p className="text-white/30 text-xs max-w-[200px] text-right leading-relaxed hidden md:block" style={{ fontFamily: "'Inter', sans-serif" }}>
          Momen &amp; Aktivitas TJKT
        </p>
      </div>

      <div className="flex h-[85vh] min-h-[480px] max-h-[820px]">
        {/* â”€â”€ LEFT: Big Main Image â”€â”€ */}
        <div className="relative flex-1 overflow-hidden">
          {/* Previous image (fading out) */}
          {prevIdx !== null && items[prevIdx] && (
            <img
              key={`prev-${prevIdx}`}
              src={items[prevIdx].url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transform-gpu"
              style={{
                zIndex: 1,
                opacity: 1,
                transition: "opacity 0.6s ease",
                imageRendering: "-webkit-optimize-contrast",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
              }}
            />
          )}
          {/* Active image */}
          <img
            key={`active-${activeIdx}`}
            src={active.url}
            alt={active.alt || "Galeri TJKT"}
            className="absolute inset-0 w-full h-full object-cover transform-gpu"
            style={{
              zIndex: 2,
              opacity: animating ? 0 : 1,
              transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
              imageRendering: "-webkit-optimize-contrast",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          />


          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

          {/* Title text at bottom-left */}
          <div className="absolute bottom-0 left-0 z-20 p-6 sm:p-10 md:p-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]" />
              <p
                className="text-white/70 text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </p>
            </div>
            <h2
              className="text-white font-extrabold leading-tight tracking-tight drop-shadow-lg"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 3.25rem)",
                lineHeight: "1.15",
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(15px)" : "translateY(0)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              {active.alt || `TJKT #${activeIdx + 1}`}
            </h2>
          </div>

        </div>

        {/* â”€â”€ RIGHT: Vertical Thumbnail Strip â”€â”€ */}
        <div ref={thumbStripRef} className="w-[72px] sm:w-[88px] md:w-[108px] flex flex-col overflow-y-auto bg-black/80 backdrop-blur-sm border-l border-white/10 scrollbar-none">

          {items.map((img, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              className="relative flex-none w-full aspect-square overflow-hidden border-b border-white/10 cursor-pointer transition-all duration-300 group"
              style={{
                outline: "none",
                opacity: i === activeIdx ? 1 : 0.55,
              }}
            >
              <img
                src={img.url}
                alt={img.alt || `Foto ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Active indicator */}
              {i === activeIdx && (
                <div className="absolute inset-0 ring-2 ring-inset ring-white/70 pointer-events-none" />
              )}
              {/* Hover dim */}
              {i !== activeIdx && (
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const statsRef = useRef<HTMLDivElement>(null);


  // Dynamic API state loaded from Laravel MySQL & Admin Panel
  const [dbStatus, setDbStatus] = useState<"connected" | "offline">("offline");
  const [dynamicTeachers, setDynamicTeachers] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("tjkt_teachers");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 1) {
            return parsed.map((t: any) => ({
              ...t,
              image: t.image && t.image.length > 150_000 ? "" : t.image
            }));
          }
        }
      } catch (e) {
        console.warn("[Teachers] Failed to parse localStorage:", e);
      }
    }
    return FACULTY;
  });

  const [dynamicAchievements, setDynamicAchievements] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tjkt_achievements");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= PRESTASI.length) return parsed;
        } catch (e) { }
      }
    }
    return PRESTASI;
  });

  // Gallery state: dikelola sepenuhnya oleh AdminGallery via IndexedDB.
  // Inisialisasi dengan foto HD bawaan; setelah AdminGallery mount, onSyncGallery akan dipanggil
  // dengan foto-foto yang sudah diresolved dari IndexedDB (termasuk upload user).
  const [dynamicGallery, setDynamicGallery] = useState<any[]>(GALLERY);



  const [dynamicMessages, setDynamicMessages] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tjkt_messages");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return [
      { name: "Siti Rahma", email: "siti@gmail.com", message: "Apakah ada informasi pendaftaran gelombang 2 PPDB TJKT?" }
    ];
  });

  // Admin view state
  const [isAdminView, setIsAdminView] = useState(() =>
    typeof window !== "undefined" && (window.location.pathname.startsWith("/admin") || window.location.hash === "#admin")
  );
  const [isAdminLogged, setIsAdminLogged] = useState(() => typeof window !== "undefined" && localStorage.getItem("tjkt_admin_logged") === "true");

  // Site Content & Navigation state (editable from Admin CMS)
  // Inisialisasi sinkron dari localStorage (teks), lalu hydrate gambar dari IndexedDB secara async
  const [siteContent, setSiteContent] = useState<SiteContentData>(() => loadSiteContent());

  // Load gambar yang tersimpan di IndexedDB saat app pertama mount
  useEffect(() => {
    loadSiteContentAsync().then(full => {
      setSiteContent(full);
    }).catch(err => {
      console.warn("[App] Gagal load site content async:", err);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tjkt_achievements", JSON.stringify(dynamicAchievements));
    }
  }, [dynamicAchievements]);

  // NOTE: Teachers & Gallery localStorage dikelola sepenuhnya oleh AdminTeachers & AdminGallery

  useEffect(() => {
    // Fade out HTML fallback preloader
    const initEl = document.getElementById("l3-initial-preloader");
    if (initEl) {
      initEl.classList.add("fade-out");
      setTimeout(() => {
        if (initEl.parentNode) initEl.parentNode.removeChild(initEl);
      }, 600);
    }

    // Keep preloader visible for one full animation cycle (2.6 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const isAdmin = window.location.pathname.startsWith("/admin") || window.location.hash === "#admin";
      setIsAdminView(isAdmin);
    };
    handleLocationChange();
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);


  // Fetch dynamic content from Laravel API on mount
  useEffect(() => {
    fetchPublicContent()
      .then(res => {
        if (res && res.success && res.data) {
          setDbStatus("connected");
          if (Array.isArray(res.data.teachers) && res.data.teachers.length > 0) {
            setDynamicTeachers(res.data.teachers);
          }
          if (Array.isArray(res.data.achievements) && res.data.achievements.length > 0) {
            setDynamicAchievements(res.data.achievements);
          }
          if (Array.isArray(res.data.gallery) && res.data.gallery.length > 0) {
            const mappedGallery = res.data.gallery.map((g: any) => ({
              id: g.id,
              url: g.url,
              alt: g.alt || "Gallery Image"
            }));
            setDynamicGallery(mappedGallery);
          }
        }
      })
      .catch(err => {
        console.warn("[App] API fetch error:", err);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx(i => (i + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentHeroSlide = HERO_SLIDES[heroIdx];

  // Theme state: light or dark
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tjkt_theme");
      if (saved === "dark" || saved === "light") return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    }
    return "dark";
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

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (isAdminView) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isAdminView]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled((prev) => {
            const isScrolled = window.scrollY > 60;
            return prev !== isScrolled ? isScrolled : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.href.substring(1));
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 180;
          let current = "home";
          for (const id of sectionIds) {
            if (id === "home") continue;
            const el = document.getElementById(id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPos >= top && scrollPos < top + height) {
                current = id;
                break;
              }
            }
          }
          setActiveSection((prev) => (prev !== current ? current : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Render Admin View if #admin or isAdminView is true
  if (isAdminView) {
    if (!isAdminLogged) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminLogged(true)}
          onBackToSite={() => {
            window.history.pushState(null, "", "/");
            window.location.hash = "";
            setIsAdminView(false);
          }}
        />
      );
    }
    return (
      <AdminLayout
        onLogout={() => {
          adminLogout();
          localStorage.removeItem("tjkt_admin_logged");
          setIsAdminLogged(false);
          window.history.pushState(null, "", "/admin");
        }}
        onBackToSite={() => {
          window.history.pushState(null, "", "/");
          window.location.hash = "";
          setIsAdminView(false);
        }}
        teachers={dynamicTeachers}
        onUpdateTeachers={(t) => {
          setDynamicTeachers(t);
          try {
            localStorage.setItem("tjkt_teachers", JSON.stringify(t));
          } catch (e) {
            console.warn("[Teachers] Failed to update localStorage:", e);
          }
        }}
        achievements={dynamicAchievements}
        onUpdateAchievements={(a) => {
          setDynamicAchievements(a);
        }}
        defaultGallery={dynamicGallery}
        onSyncGallery={(g) => setDynamicGallery(g)}
        dbStatus={dbStatus}
        siteContent={siteContent}
        onUpdateSiteContent={setSiteContent}
      />
    );
  }

  return (
    <>
      <FluidCanvasCursor />
      <LiveStatusPill />



      <L3Preloader isLoading={isLoading} />
      <div className="min-h-screen bg-slate-50 dark:bg-[#0c0c0e] text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">



        {/* â”€â”€ NAVBAR (Floating Pill) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 sm:px-6">
          {/* Pill container */}
          <div className={`w-full max-w-6xl flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 rounded-full transition-all duration-300 ${scrolled
            ? "bg-white/85 dark:bg-[#1a1a1c]/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-200/70 dark:border-white/[0.08]"
            : "bg-white/75 dark:bg-[#1a1a1c]/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-slate-200/50 dark:border-white/[0.06]"
            }`}>

            {/* Logo */}
            <a href="#home" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white border border-red-500/20 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
                <img
                  src={logoLT3}
                  alt="LT3 MEDIA TJKT Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase font-mono">
                TJKT
              </span>
            </a>

            {/* Nav Links — centered */}
            <div className="hidden md:flex items-center gap-0.5 xl:gap-1">
              {(siteContent.navLinks || NAV_LINKS).map(l => {
                const isActive = activeSection === l.href.substring(1);
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    className={`relative px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-medium transition-all duration-200 ${isActive
                      ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06]"
                      }`}
                  >
                    {l.label}
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 rounded-full bg-slate-100 dark:bg-white/10 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Social Icons */}
              <a
                href="https://www.instagram.com/media.tjkt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram TJKT"
                className="hidden sm:flex p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.05] text-slate-600 dark:text-zinc-400 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-400/40 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all duration-200 items-center justify-center cursor-pointer"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://www.tiktok.com/@media.tjkt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok TJKT"
                className="hidden sm:flex p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.05] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-white/20 hover:bg-slate-200/80 dark:hover:bg-white/10 transition-all duration-200 items-center justify-center cursor-pointer"
              >
                <TikTokIcon size={14} />
              </a>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.05] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/10 transition-all duration-200 flex items-center justify-center cursor-pointer"
                aria-label={theme === "dark" ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
              >
                {theme === "dark" ? (
                  <Sun size={15} className="text-amber-400" />
                ) : (
                  <Moon size={15} className="text-slate-600" />
                )}
              </button>

              {/* PPDB Button */}
              <a
                href={siteContent.primaryCtaUrl || "https://ppdb.smkthpati.sch.id/"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-[12px] font-semibold transition-all duration-200 shadow-sm hover:shadow-red-600/40"
              >
                {siteContent.primaryCtaText || "Daftar PPDB"}
              </a>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="md:hidden p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.05] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Menu"
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl bg-white/95 dark:bg-[#1a1a1c]/95 backdrop-blur-2xl border border-slate-200/70 dark:border-white/[0.08] shadow-xl px-5 py-4 flex flex-col gap-3">
              {(siteContent.navLinks || NAV_LINKS).map(l => {
                const isActive = activeSection === l.href.substring(1);
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`font-medium py-1 text-sm transition-colors flex items-center justify-between ${isActive
                      ? "text-slate-900 dark:text-white font-semibold pl-3 border-l-2 border-red-500"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <span>{l.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  </a>
                );
              })}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/[0.06]">
                <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">Mode Tampilan</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.05] text-xs font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer"
                >
                  {theme === "dark" ? (
                    <><Sun size={14} className="text-amber-400" /><span>Mode Terang</span></>
                  ) : (
                    <><Moon size={14} className="text-slate-700" /><span>Mode Gelap</span></>
                  )}
                </button>
              </div>
              <a
                href={siteContent.primaryCtaUrl || "https://ppdb.smkthpati.sch.id/"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-1 text-center px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
              >
                {siteContent.primaryCtaText || "Daftar PPDB"}
              </a>
            </div>
          )}
        </nav>

        {/* â”€â”€ HERO SECTION (Billboard Split Layout) â”€â”€ */}
        <section id="home" className="relative flex flex-col min-h-screen pt-[68px]">

          {/* Subtle background glow & dots */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-red-500/10 dark:bg-red-700/12 rounded-full blur-[140px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-red-600/8 dark:bg-red-900/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.12]" style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }} />
          </div>

          {/* Main Outer Billboard Frame */}
          <div className="relative z-10 flex-1 flex flex-col w-full p-3 sm:p-4 bg-slate-50 dark:bg-[#0c0c0e]">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch flex-1 min-h-[calc(100vh-80px)]">

              {/* LEFT COLUMN: Top Card (Text & Welcome) + Bottom Card (Stats Box) */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-3.5 sm:gap-4.5 lg:gap-5">

                {/* TOP CARD: Welcome Text */}
                <div className="flex-1 p-7 sm:p-9 md:p-11 lg:p-12 rounded-[1.9rem] sm:rounded-[2.4rem] bg-[#f1f3f5] dark:bg-[#151518] border border-slate-200/80 dark:border-white/[0.08] flex flex-col justify-between relative overflow-hidden group min-h-[420px]">

                  {/* Background shine */}
                  <div className="absolute -top-10 -right-10 w-60 h-60 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                  <span className="absolute bottom-3 right-6 text-7xl sm:text-8xl font-black text-slate-300/30 dark:text-white/[0.03] select-none pointer-events-none tracking-tighter">TJKT</span>

                  <div>
                    {/* Clean Text Label (No Background Container) */}

                    {/* Main Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.04] mb-6">
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-rose-500">
                        {siteContent.heroHeadline1 || "Teknik Jaringan"}
                      </span>
                      <span className="block text-slate-800 dark:text-zinc-200 font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl mt-1">
                        {siteContent.heroHeadline2 || "Komputer & Telekomunikasi"}
                      </span>
                    </h1>

                    <p className="text-slate-600 dark:text-zinc-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                      {siteContent.heroSubheadline || ""}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <a href={siteContent.exploreCtaUrl || "#kompetensi"} className="px-6.5 py-3 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200 flex items-center gap-2 shadow-sm">
                      {siteContent.exploreCtaText || "Explore Program"}
                      <ArrowRight size={15} />
                    </a>
                    <a href={siteContent.joinUsCtaUrl || "https://ppdb.smkthpati.sch.id/"} target="_blank" rel="noopener noreferrer" className="px-6.5 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 cursor-pointer">
                      {siteContent.joinUsCtaText || "Join Us →"}
                    </a>
                  </div>

                </div>

                {/* BOTTOM CARD: Stats Box Container */}
                <div ref={statsRef} className="p-5 sm:p-6 lg:p-6.5 rounded-[1.8rem] sm:rounded-[2.2rem] bg-red-600 text-white shadow-xl relative overflow-hidden group">

                  {/* Subtle shine effect */}
                  <div className="absolute -inset-x-20 top-0 bottom-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4.5 items-center">

                    {(siteContent.heroStats || STATS).map((s, idx, arr) => (
                      <div key={idx} className={`flex flex-col p-3 sm:p-3.5 ${idx !== arr.length - 1 ? "sm:border-r border-white/20" : ""}`}>
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight tabular-nums drop-shadow-sm">
                          {s.value}{s.suffix}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-red-100 uppercase tracking-wider mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {s.label}
                        </span>
                      </div>
                    ))}

                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: Lando Norris Style Interactive Image Reveal Card */}
              <div className="lg:col-span-6 xl:col-span-5 h-full min-h-[480px]">
                <LandoImageReveal
                  img1={siteContent.heroImage1 || imgTHP09774}
                  imgLT3={siteContent.heroImage2 || imgTHP09790}
                  logoLT3={logoLT3}
                  alt1="Lab TJKT Utama (Gambar 1)"
                  altLT3="LT3 Media TJKT (Gambar LT3)"
                />
              </div>


            </div>

          </div>

        </section>

        {/* â”€â”€ ABOUT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}


        <section id="about" className="pt-16 pb-24 px-6">
          <div className="max-w-[1550px] mx-auto">
            <SectionLabel num="01" label="Tentang Kami" />
            <div className="grid md:grid-cols-2 gap-14 items-center">

              {/* Image stack */}
              <div className="relative pt-6 sm:pt-8">
                <div className="relative z-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.07] bg-slate-200 dark:bg-zinc-900 shadow-md dark:shadow-none">
                  <img
                    src={siteContent.aboutImage1 || imgTHP09750}
                    alt="Siswa TJKT sesi coding workshop"
                    loading="lazy"
                    className="w-full object-cover"
                    style={{ height: "420px" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {/* Image caption overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-end gap-3">
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">Lab Pemrograman & Jaringan</p>
                      <p className="text-zinc-300 dark:text-zinc-400 text-xs mt-0.5">Fasilitas modern siap industri</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                      TJKT SMK TH
                    </div>
                  </div>
                </div>
                {/* Second smaller image offset */}
                <div className="absolute -bottom-6 -right-6 z-20 w-40 h-28 rounded-xl overflow-hidden border-2 border-white dark:border-[#0c0c0e] bg-slate-200 dark:bg-zinc-900 shadow-2xl">
                  <img
                    src={siteContent.aboutImage2 || imgTHP09774}
                    alt="Kabel jaringan fiber optik"
                    loading="lazy"
                    className="w-full h-full object-cover opacity-90 dark:opacity-80"
                  />
                  <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-white text-[10px] font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>Fiber Optik Lab</span>
                  </div>
                </div>
                {/* Floating icon */}
                <div className="absolute top-1 sm:top-2 -left-4 sm:-left-5 z-20 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 dark:bg-[#0c0c0e] dark:border-white/[0.08] flex items-center justify-center shadow-xl">
                  <Terminal className="text-red-600 dark:text-red-500" size={22} />
                </div>
              </div>

              {/* Text */}
              <div>
                <h2 className="text-3xl md:text-[2.6rem] font-black text-slate-900 dark:text-white mb-5 leading-[1.1] tracking-tight">
                  Mencetak Talenta
                  <br />
                  <span className="text-slate-500 dark:text-zinc-500">Digital Siap Industri</span>
                </h2>
                <p className="text-slate-600 dark:text-zinc-500 text-sm leading-relaxed mb-4">
                  Jurusan Teknik Jaringan Komputer dan Telekomunikasi (TJKT) SMK Tunas Harapan Pati adalah pusat pendidikan vokasi unggulan yang mempersiapkan generasi teknologi Indonesia melalui dua pilar utama:
                </p>
                <p className="text-slate-700 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                  <strong className="text-slate-900 dark:text-white">Programming</strong> - pengembangan software, web, mobile, dan game. Dan <strong className="text-slate-900 dark:text-white">Networking</strong> - infrastruktur jaringan, keamanan siber, dan telekomunikasi fiber optik.
                </p>

                {/* Highlight grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { label: "Kurikulum Industri", dot: "red" },
                    { label: "Sertifikasi Cisco & MikroTik", dot: "red" },
                    { label: "Lab Fiber Optik Lengkap", dot: "emerald" },
                    { label: "Teaching Factory TeFa", dot: "emerald" },
                  ].map(({ label, dot }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-400 font-medium dark:font-normal">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot === "red" ? "bg-red-500" : "bg-emerald-500"}`} />
                      {label}
                    </div>
                  ))}
                </div>

                <a href="#kompetensi" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white text-slate-900 hover:border-red-500/50 hover:bg-red-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:border-red-500/35 dark:hover:bg-red-500/[0.04] transition-all duration-200 group shadow-sm dark:shadow-none">
                  Selengkapnya
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── OVERLAKE INSPIRED FAST FACTS SECTION ──────────────────── */}
        <OverlakeFactsSection />

        {/* ── COMPETENCY ────────────────────────────────────────── */}

        <section id="kompetensi" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] dark:via-red-950/[0.04] to-transparent pointer-events-none" />
          <div className="max-w-[1550px] mx-auto relative z-10">
            <SectionLabel num="02" label="Kompetensi Keahlian" />
            <div className="flex flex-col md:flex-row gap-4 items-start mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight flex-1">
                Dua Pilar Utama Jurusan
              </h2>
              <p className="text-slate-600 dark:text-zinc-500 text-sm leading-relaxed max-w-xs">
                Kuasai dua bidang yang paling dibutuhkan industri teknologi saat ini dan masa depan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Programming - OS window */}
              <WindowCard title="programming.tjkt - ACTIVE" accent="rgba(220,38,38,0.2)">
                <div className="relative">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={siteContent.kompetensiImageProgramming || imgTHP09712}
                      alt="Lab komputer pemrograman"
                      loading="lazy"
                      className="w-full h-full object-cover opacity-60 dark:opacity-30 group-hover:opacity-75 dark:group-hover:opacity-40 transition-opacity duration-500 scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0e0e10]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center backdrop-blur-sm">
                        <Monitor className="text-red-600 dark:text-red-400" size={28} />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">💻 Programming</h3>
                    <p className="text-slate-600 dark:text-zinc-500 text-sm leading-relaxed mb-6">
                      Kuasai pengembangan web, mobile, dan game dengan teknologi terkini. Dari backend Laravel hingga game Unity, kami siapkan kamu menjadi developer profesional.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-7">
                      {PROGRAMMING_TAGS.map(tag => <Tag key={tag} label={tag} />)}
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-200 dark:border-white/[0.06]">
                      {[["Web Dev", "Laravel/PHP"], ["Mobile", "Android/iOS"], ["Game Dev", "Unity/C#"]].map(([t, s]) => (
                        <div key={t} className="text-center">
                          <div className="text-slate-900 dark:text-white font-bold text-sm">{t}</div>
                          <div className="text-slate-500 dark:text-zinc-700 text-[10px] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </WindowCard>

              {/* Networking - OS window */}
              <WindowCard title="networking.tjkt - ACTIVE" accent="rgba(16,185,129,0.15)">

                <div className="relative">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={siteContent.kompetensiImageNetworking || imgTHP09790}
                      alt="Lab jaringan Cisco MikroTik"
                      loading="lazy"
                      className="w-full h-full object-cover opacity-60 dark:opacity-30 group-hover:opacity-75 dark:group-hover:opacity-40 transition-opacity duration-500 scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0e0e10]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
                        <Wifi className="text-emerald-600 dark:text-emerald-400" size={28} />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">🌐 Networking</h3>
                    <p className="text-slate-600 dark:text-zinc-500 text-sm leading-relaxed mb-6">
                      Infrastruktur jaringan dari nol hingga enterprise. Konfigurasi router, switch, fiber optik, dan keamanan jaringan dengan perangkat Cisco dan MikroTik asli.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-7">
                      {NETWORKING_TAGS.map(tag => <Tag key={tag} label={tag} green />)}
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-200 dark:border-white/[0.06]">
                      {[["Routing", "Cisco/MikroTik"], ["Fiber Optic", "Splicing OTDR"], ["Security", "Network Sec"]].map(([t, s]) => (
                        <div key={t} className="text-center">
                          <div className="text-slate-900 dark:text-white font-bold text-sm">{t}</div>
                          <div className="text-slate-500 dark:text-zinc-700 text-[10px] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </WindowCard>
            </div>
          </div>
        </section>

        {/* â”€â”€ KEUNGGULAN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="py-24 px-6">
          <div className="max-w-[1550px] mx-auto">
            <SectionLabel num="03" label="Keunggulan Jurusan" />
            <div className="flex flex-col md:flex-row gap-4 items-start mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight flex-1">
                Kenapa Pilih TJKT?
              </h2>
              <p className="text-slate-600 dark:text-zinc-500 text-sm leading-relaxed max-w-sm">
                Enam alasan kuat mengapa TJKT menjadi pilihan terbaik untuk masa depanmu di dunia teknologi.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-white/[0.05] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none">
              {KEUNGGULAN.map(({ Icon, title, desc }, i) => (
                <div
                  key={title}
                  className="group p-7 bg-white dark:bg-[#0c0c0e] hover:bg-slate-50 dark:hover:bg-[#131315] transition-colors duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-12 h-[1px] bg-red-600/0 group-hover:bg-red-600/50 group-hover:w-full transition-all duration-500" />
                  <div className="absolute top-4 right-4 text-[10px] text-slate-300 dark:text-zinc-800 font-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                    0{i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-all duration-300">
                    <Icon className="text-red-600 dark:text-red-400" size={18} />
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-2">{title}</h3>
                  <p className="text-slate-600 dark:text-zinc-600 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* â”€â”€ PRESTASI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section id="prestasi" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/80 dark:via-[#111113] to-transparent pointer-events-none" />
          <div className="max-w-[1550px] mx-auto relative z-10">
            <SectionLabel num="04" label="Prestasi & Penghargaan" />
            <div className="flex flex-col md:flex-row gap-4 items-start mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight flex-1">
                Rekam Jejak Kebanggaan
              </h2>
              <p className="text-slate-600 dark:text-zinc-500 text-sm leading-relaxed max-w-xs">
                Prestasi nyata siswa TJKT dari tingkat kabupaten hingga nasional.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dynamicAchievements.map((p, i) => {
                const Icon = p.tier === "gold" ? Code : p.tier === "silver" ? Shield : Monitor;
                return (
                  <div
                    key={i}
                    className="group relative p-6 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden shadow-sm dark:shadow-none"
                  >
                    {p.tier === "gold" && (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] dark:from-yellow-500/[0.03] to-transparent" />
                    )}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-600 bg-slate-100 dark:bg-zinc-900"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {p.year}
                        </span>
                        <TierBadge tier={p.tier} result={p.result} />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:border-red-500/30 group-hover:bg-red-500/10 dark:group-hover:border-red-500/20 dark:group-hover:bg-red-500/[0.04] transition-all duration-300">
                          <Icon size={16} className="text-slate-500 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="text-slate-900 dark:text-white font-bold text-sm leading-snug">{p.event}</h4>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Trophy size={11} className="text-slate-400 dark:text-zinc-700" />
                            <span className="text-xs text-slate-500 dark:text-zinc-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                              SMK Tunas Harapan Pati
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* â”€â”€ GALLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <GallerySection gallery={dynamicGallery} />


        {/* â”€â”€ FACULTY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section id="guru" className="py-24 px-6 relative">
          <div className="max-w-[1550px] mx-auto">
            <SectionLabel num="06" label="Tim Pengajar" />
            <div className="flex flex-col md:flex-row gap-4 items-start mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight flex-1">
                Guru &amp; Instruktur TJKT
              </h2>
              <p className="text-slate-600 dark:text-zinc-500 text-sm leading-relaxed max-w-xs">
                Diampu oleh instruktur bersertifikat industri dengan pengalaman nyata di bidangnya.
              </p>
            </div>

            {(() => {
              const headTeacher = dynamicTeachers.find(
                (t) => t.role?.toLowerCase().includes("ketua") || t.role?.toLowerCase().includes("kepala")
              ) || dynamicTeachers[0];

              const otherTeachers = dynamicTeachers.filter((t) => t !== headTeacher);

              return (
                <div className="space-y-12">
                  {/* Ketua Jurusan (Top Centered Featured Card) */}
                  {headTeacher && (
                    <div className="flex flex-col items-center">
                      <div className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-white/\[0.08\] bg-white dark:bg-[#121215] shadow-md hover:shadow-xl dark:shadow-none transition-all duration-300 hover:-translate-y-1 w-full max-w-xs flex flex-col justify-between">
                        {/* Photo / Avatar Header */}
                        <div className="h-52 sm:h-60 w-full relative overflow-hidden bg-slate-100 dark:bg-zinc-900/60 flex-shrink-0">
                          {headTeacher.image ? (
                            <img
                              src={headTeacher.image}
                              alt={headTeacher.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (

                            <div
                              className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
                              style={{ background: `linear-gradient(135deg, ${headTeacher.color || "#DC2626"}ee, ${headTeacher.color || "#DC2626"}44)` }}
                            >
                              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl">
                                <span className="text-white font-black text-xl tracking-wider">{headTeacher.initials || "BN"}</span>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex flex-col justify-between flex-1 bg-white dark:bg-[#121215]">
                          <div>
                            <h3 className="text-slate-900 dark:text-white font-black text-base leading-snug mb-0.5 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                              {headTeacher.name}
                            </h3>
                            <p className="text-red-600 dark:text-red-400 text-xs font-bold leading-relaxed uppercase tracking-wider">
                              {headTeacher.role}
                            </p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                              SMK TH PATI
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-mono font-bold">
                              KAPROG
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subtitle Divider for Other Teachers */}
                  {otherTeachers.length > 0 && (
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
                        <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">
                          Tim Pengajar &amp; Instruktur Produktif
                        </span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
                      </div>

                      {/* Responsive Compact Grid for Other Teachers */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
                        {otherTeachers.map((f, idx) => (
                          <div
                            key={f.name || idx}
                            className="group overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121215] shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between w-full"
                          >
                            {/* Photo / Avatar Header (Compact) */}
                            <div className="h-44 sm:h-48 md:h-52 w-full relative overflow-hidden bg-slate-100 dark:bg-zinc-900/60 flex-shrink-0">
                              {f.image ? (
                                <img
                                  src={f.image}
                                  alt={f.name}
                                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (

                                <div
                                  className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
                                  style={{ background: `linear-gradient(135deg, ${f.color || "#059669"}ee, ${f.color || "#059669"}44)` }}
                                >
                                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white font-black text-lg tracking-wider">{f.initials || "TK"}</span>
                                  </div>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Card Content */}
                            <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 bg-white dark:bg-[#121215]">
                              <div>
                                <h3 className="text-slate-900 dark:text-white font-bold text-xs sm:text-sm leading-snug mb-0.5 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                                  {f.name}
                                </h3>
                                <p className="text-slate-500 dark:text-zinc-400 text-[11px] font-medium leading-tight line-clamp-2">
                                  {f.role}
                                </p>
                              </div>
                              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  SMK TH PATI
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-mono">
                                  TJKT
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}
          </div>
        </section>



        {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section id="kontak" className="py-16 px-6">
          <div className="max-w-[1550px] mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-red-900/30 shadow-xl">
              {/* BG */}
              <div className="absolute inset-0 bg-[#0e0304]" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-700/50 via-red-900/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Circuit image */}
              <div className="absolute inset-0">
                <img
                  src={imgTHP09635}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover opacity-[0.08]"
                />
              </div>
              {/* Grid */}
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
              }} />
              {/* Glow orbs */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/15 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-red-800/20 rounded-full blur-[80px]" />

              <div className="relative z-10 text-center py-20 md:py-24 px-8">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase text-red-300 border border-red-400/20 bg-red-400/8 mb-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  PPDB 2027 / 2028
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-5 leading-[1.0] tracking-tight">
                  Join TJKT:
                  <br />
                  <span className="text-red-300">Bangun Masa Depan</span>
                  <br />
                  Digitalmu Bersama Kami
                </h2>
                <p className="text-red-200/50 text-base max-w-lg mx-auto mb-10 leading-relaxed">
                  Pendaftaran Penerimaan Peserta Didik Baru SMK Tunas Harapan Pati sudah dibuka. Daftarkan dirimu sebelum kuota penuh!
                </p>
                <a
                  href="https://ppdb.smkthpati.sch.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-red-700 font-black text-base hover:bg-red-50 hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all duration-200 group"
                >
                  Daftar PPDB Sekarang
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </a>

                <div className="mt-12 flex flex-wrap justify-center gap-8 text-red-300/30 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} />
                    <span>{siteContent.contactAddress || "Pati, Jawa Tengah"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} />
                    <span>{siteContent.contactPhone || "(0295) 385XXX"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} />
                    <span>{siteContent.contactEmail || "tjkt@smkth.sch.id"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <footer className="border-t border-slate-800 dark:border-white/[0.08] bg-[#0c0c0e] dark:bg-black text-slate-200 dark:text-zinc-300 py-16 px-6 mt-12 transition-colors duration-300">
          <div className="max-w-[1550px] mx-auto">
            <div className="grid md:grid-cols-12 gap-10 mb-14">
              {/* Brand — 4 cols */}
              <div className="md:col-span-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center flex-shrink-0 shadow-md border border-red-500/20">
                    <img src={logoLT3} alt="LT3 MEDIA TJKT Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white leading-none font-mono tracking-wider">LT3 MEDIA TJKT</div>
                    <div className="text-[10px] text-zinc-400 leading-none mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      SMK Tunas Harapan Pati · Teknik Jaringan Komputer &amp; Telekomunikasi
                    </div>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-[280px]">
                  Pusat pendidikan vokasi teknologi informasi terbaik di Kabupaten Pati. Mencetak generasi digital siap bersaing di era Industri  .
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/media.tjkt"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram TJKT"
                    className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center hover:border-pink-500/50 hover:bg-pink-600/15 transition-all text-zinc-300 hover:text-pink-400"
                  >
                    <Instagram size={15} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@media.tjkt"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok TJKT"
                    className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center hover:border-white/30 hover:bg-white/10 transition-all text-zinc-300 hover:text-white"
                  >
                    <TikTokIcon size={15} />
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube TJKT"
                    className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center hover:border-red-500/50 hover:bg-red-600/15 transition-all text-zinc-300 hover:text-white"
                  >
                    <Youtube size={15} />
                  </a>
                </div>
              </div>

              {/* Navigation — 2 cols */}
              <div className="md:col-span-2">
                <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>Navigasi</h4>
                <ul className="space-y-3">
                  {[...NAV_LINKS, { label: "PPDB 2027 ", href: "https://ppdb.smkthpati.sch.id/" }].map(l => (
                    <li key={l.href}>
                      <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-zinc-400 text-sm hover:text-white transition-colors">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact — 3 cols */}
              <div className="md:col-span-3">
                <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>Kontak</h4>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-2.5 text-zinc-400 text-sm">
                    <MapPin size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    Jl. Raya Pati - Tayu, Kinyan, Ngepungrojo, Kec. Pati, Kabupaten Pati, Jawa Tengah 59119
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-400 text-sm">
                    <Phone size={14} className="text-red-500 flex-shrink-0" />
                    (0295) 385XXX
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-400 text-sm">
                    <Mail size={14} className="text-red-500 flex-shrink-0" />
                    tjkt@smkth.sch.id
                  </li>
                </ul>
              </div>

              {/* Map placeholder — 3 cols */}
              <div className="md:col-span-3">
                <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>Lokasi</h4>
                <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] relative shadow-md">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <MapPin size={20} className="text-red-500" />
                    <span className="text-zinc-300 text-xs text-center font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      SMK Tunas Harapan Pati
                      <br />
                      <span className="text-zinc-400">Jl. P. Sudirman No.1</span>
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage: "linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-zinc-400 text-[11px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                © 2026 TJKT SMK Tunas Harapan Pati · All rights reserved
              </p>
              <div className="flex items-center gap-4 text-zinc-400 text-[11px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, "", "/admin");
                    setIsAdminView(true);
                  }}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Admin Portal
                </a>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Teknik Jaringan Komputer dan Telekomunikasi</span>
              </div>
            </div>
          </div>
        </footer>

        {/* â”€â”€ PPDB: Redirect to external registration site â”€â”€ */}

        {/* â”€â”€ KEYFRAMES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(10px); }
          to { transform: translateY(0); }
        }
      `}</style>
      </div>
    </>
  );
}


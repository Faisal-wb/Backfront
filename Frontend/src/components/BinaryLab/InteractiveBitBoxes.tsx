import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  RotateCcw, CheckCircle2,
  Copy, Check,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  BIT_WEIGHTS, BIT_POWERS, bitsToDecimal, 
  decimalToBits, SUBNET_PRESETS 
} from "./binaryLabUtils";

interface InteractiveBitBoxesProps {
  initialDecimal?: number;
  onDecimalChange?: (decimal: number) => void;
}

export const InteractiveBitBoxes: React.FC<InteractiveBitBoxesProps> = ({
  initialDecimal = 0,
  onDecimalChange,
}) => {
  const [bits, setBits] = useState<number[]>(() => decimalToBits(initialDecimal));
  const [decimalInput, setDecimalInput] = useState<string>(initialDecimal.toString());
  const [copied, setCopied] = useState(false);

  const currentDecimal = bitsToDecimal(bits);

  const toggleBit = (index: number) => {
    const updated = [...bits];
    updated[index] = updated[index] === 1 ? 0 : 1;
    setBits(updated);
    const newDec = bitsToDecimal(updated);
    setDecimalInput(newDec.toString());
    onDecimalChange?.(newDec);
  };

  const handleDecimalChange = (valueStr: string) => {
    setDecimalInput(valueStr);
    const num = parseInt(valueStr, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(0, Math.min(255, num));
      setBits(decimalToBits(clamped));
      onDecimalChange?.(clamped);
    } else if (valueStr === "") {
      setBits([0, 0, 0, 0, 0, 0, 0, 0]);
      onDecimalChange?.(0);
    }
  };

  const handleResetZero = () => {
    setBits([0, 0, 0, 0, 0, 0, 0, 0]);
    setDecimalInput("0");
    onDecimalChange?.(0);
  };

  const handleSetAllOn = () => {
    setBits([1, 1, 1, 1, 1, 1, 1, 1]);
    setDecimalInput("255");
    onDecimalChange?.(255);
  };

  // State khusus Urutan Biner Step-by-Step di bawah (hanya navigasi panah kiri & kanan)
  const [stepDecimal, setStepDecimal] = useState<number>(0);
  const stepBits = decimalToBits(stepDecimal);

  const handleStepPrev = () => {
    setStepDecimal((prev) => Math.max(0, prev - 1));
  };

  const handleStepNext = () => {
    setStepDecimal((prev) => Math.min(255, prev + 1));
  };

  const handleApplyPreset = (decValue: number) => {
    setBits(decimalToBits(decValue));
    setDecimalInput(decValue.toString());
    onDecimalChange?.(decValue);
  };

  const handleCopyBinary = () => {
    const binaryStr = bits.slice(0, 4).join("") + " " + bits.slice(4).join("");
    navigator.clipboard.writeText(binaryStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeWeights = bits
    .map((b, i) => (b === 1 ? BIT_WEIGHTS[i] : null))
    .filter((w): w is number => w !== null);

  const activeCount = bits.filter(b => b === 1).length;

  return (
    <div className="w-full flex flex-col gap-5">

      {/* ── Banner ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Simulator 8 Kotak Bit
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold">Interaktif</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Klik kotak untuk toggle <span className="font-mono font-bold text-red-600 dark:text-red-400">0</span> dan <span className="font-mono font-bold text-red-600 dark:text-red-400">1</span> — amati hasil desimal berubah secara live!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetZero}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-600 dark:text-zinc-300 transition-all border border-slate-200 dark:border-white/10 cursor-pointer"
          >
            <RotateCcw size={13} />Reset
          </button>
          <button
            onClick={handleSetAllOn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 transition-all border border-red-200 dark:border-red-900/40 cursor-pointer"
          >
            <CheckCircle2 size={13} />Semua (255)
          </button>
        </div>
      </div>

      {/* ── 8 Kotak Utama ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden transition-colors duration-200">
        {/* Subtle red glow top */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-32 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

        {/* 8 Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap sm:flex-nowrap">
          {/* Nibble 1 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <BitBoxCard
                key={idx}
                index={idx}
                weight={BIT_WEIGHTS[idx]}
                power={BIT_POWERS[idx]}
                isOn={bits[idx] === 1}
                onToggle={() => toggleBit(idx)}
              />
            ))}
          </div>

          {/* Nibble separator */}
          <div className="hidden sm:flex flex-col items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
          </div>

          {/* Nibble 2 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {[4, 5, 6, 7].map((idx) => (
              <BitBoxCard
                key={idx}
                index={idx}
                weight={BIT_WEIGHTS[idx]}
                power={BIT_POWERS[idx]}
                isOn={bits[idx] === 1}
                onToggle={() => toggleBit(idx)}
              />
            ))}
          </div>
        </div>

        {/* Live Result Row */}
        <div className="mt-7 pt-5 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-stretch gap-4">
          {/* Formula */}
          <div className="flex-1 bg-slate-50 dark:bg-[#141416] rounded-xl p-4 border border-slate-200 dark:border-white/10 transition-colors">
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 mb-1.5">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" /> Penjumlahan Bobot</span>
              <span>{activeCount} / 8 bit aktif</span>
            </div>
            <div className="text-sm font-bold font-mono break-all">
              {activeWeights.length > 0 ? (
                <>
                  <span className="text-red-600 dark:text-red-400">{activeWeights.join(" + ")}</span>
                  <span className="text-slate-400 dark:text-zinc-600 mx-2">=</span>
                  <span className="text-slate-900 dark:text-white text-base">{currentDecimal}</span>
                </>
              ) : (
                <span className="text-slate-400 dark:text-zinc-600 italic text-xs font-sans">Semua bit 0 — belum ada bobot aktif</span>
              )}
            </div>
          </div>

          {/* Result Card */}
          <div className="flex items-center gap-3 bg-red-600 text-white rounded-xl p-4 px-6 shadow-md shadow-red-600/20">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-red-200 mb-0.5">Hasil Desimal</div>
              <motion.div
                key={currentDecimal}
                initial={{ scale: 0.85, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl sm:text-4xl font-extrabold font-mono"
              >
                {currentDecimal}
              </motion.div>
            </div>
            <button
              onClick={handleCopyBinary}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all cursor-pointer"
              title="Copy string biner"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
            </button>
          </div>
        </div>

        {/* Decimal Input */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-[#141416] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-200">Ketik Desimal → Biner Otomatis</div>
              <div className="text-[11px] text-slate-400 dark:text-zinc-500">Ketik 0–255, kotak bit akan menyala sendiri</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">Desimal:</span>
            <input
              type="number" min={0} max={255}
              value={decimalInput}
              onChange={(e) => handleDecimalChange(e.target.value)}
              placeholder="0–255"
              className="w-24 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1e1e22] border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-white font-mono text-sm font-bold text-center focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Urutan Biner Step-by-Step (Khusus Tombol Kiri & Kanan) ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden transition-colors duration-200">
        {/* Subtle red glow top */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-32 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Urutan Biner Step-by-Step
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold">Tombol Panah</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Gunakan tombol panah di kanan dan kiri untuk mengamati urutan pertambahan biner dari kanan ke kiri.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStepDecimal(0)}
              disabled={stepDecimal === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-600 dark:text-zinc-300 transition-all border border-slate-200 dark:border-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Reset ke semula (0)"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-white/10">
              <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">Desimal:</span>
              <span className="px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-mono text-sm font-bold min-w-[44px] text-center">
                {stepDecimal}
              </span>
            </div>
          </div>
        </div>

        {/* ── Baris Biner dengan Tombol < di Pas Sebelah Kiri dan > di Pas Sebelah Kanan ── */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 py-2 overflow-x-auto">
          {/* Tombol Kiri (<) pas di sebelah kiri biner */}
          <button
            type="button"
            onClick={handleStepPrev}
            disabled={stepDecimal <= 0}
            className="w-10 h-16 sm:w-12 sm:h-20 md:w-14 md:h-24 rounded-2xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-700 dark:text-zinc-200 transition-all border border-slate-200 dark:border-white/10 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed shadow-sm active:scale-95 shrink-0 self-center"
            title="Kembali ke semula (<)"
            aria-label="Langkah sebelumnya (<)"
          >
            <ChevronLeft size={24} />
          </button>

          {/* 8 Kotak Utama */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap sm:flex-nowrap">
            {/* Nibble 1 */}
            <div className="flex items-center gap-2 sm:gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <BitBoxCard
                  key={idx}
                  index={idx}
                  weight={BIT_WEIGHTS[idx]}
                  power={BIT_POWERS[idx]}
                  isOn={stepBits[idx] === 1}
                  interactive={false}
                />
              ))}
            </div>

            {/* Nibble separator */}
            <div className="hidden sm:flex flex-col items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
            </div>

            {/* Nibble 2 */}
            <div className="flex items-center gap-2 sm:gap-3">
              {[4, 5, 6, 7].map((idx) => (
                <BitBoxCard
                  key={idx}
                  index={idx}
                  weight={BIT_WEIGHTS[idx]}
                  power={BIT_POWERS[idx]}
                  isOn={stepBits[idx] === 1}
                  interactive={false}
                />
              ))}
            </div>
          </div>

          {/* Tombol Kanan (>) pas di sebelah kanan biner */}
          <button
            type="button"
            onClick={handleStepNext}
            disabled={stepDecimal >= 255}
            className="w-10 h-16 sm:w-12 sm:h-20 md:w-14 md:h-24 rounded-2xl flex items-center justify-center bg-red-600 hover:bg-red-500 text-white transition-all disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-red-600/20 active:scale-95 shrink-0 self-center"
            title="Urutkan ke kanan (>)"
            aria-label="Langkah berikutnya (>)"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* ── Preset Subnet ── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            Preset Subnet Mask TJKT Populer — klik untuk dicoba:
          </h4>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">Standar Cisco & MikroTik</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {SUBNET_PRESETS.map((preset) => {
            const isCurrent = currentDecimal === preset.decimal;
            return (
              <button
                key={preset.prefix}
                onClick={() => handleApplyPreset(preset.decimal)}
                className={`flex flex-col items-center p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-red-600 border-red-600 text-white shadow-md"
                    : "bg-slate-50 dark:bg-[#141416] hover:bg-red-50 dark:hover:bg-red-950/30 border-slate-200 dark:border-white/10 hover:border-red-300 dark:hover:border-red-800/40 text-slate-600 dark:text-zinc-300"
                }`}
              >
                <span className={`text-xs font-bold font-mono ${isCurrent ? "text-red-100" : "text-red-600 dark:text-red-400"}`}>
                  {preset.prefix}
                </span>
                <span className="text-sm font-extrabold font-mono">{preset.decimal}</span>
                <span className={`text-[9px] mt-0.5 ${isCurrent ? "text-red-100" : "text-slate-400 dark:text-zinc-500"}`}>
                  {preset.hostCount} Host
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── BIT BOX CARD ─────────────────────────────────────────────────────────────

interface BitBoxCardProps {
  index: number;
  weight: number;
  power: number;
  isOn: boolean;
  onToggle?: () => void;
  interactive?: boolean;
}

const BitBoxCard: React.FC<BitBoxCardProps> = ({
  weight,
  power,
  isOn,
  onToggle,
  interactive = true,
}) => {
  return (
    <div className="flex flex-col items-center gap-1.5 group">
      {/* Weight label */}
      <div className="flex flex-col items-center">
        <span className={`text-[9px] font-mono ${isOn ? "text-red-500 font-bold" : "text-slate-400 dark:text-zinc-500"}`}>
          2<sup>{power}</sup>
        </span>
        <span className={`text-xs sm:text-sm font-extrabold font-mono transition-all ${
          isOn ? "text-red-600 dark:text-red-400 scale-105" : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
        }`}>
          {weight}
        </span>
      </div>

      {/* The Box */}
      <motion.button
        type="button"
        onClick={interactive ? onToggle : undefined}
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.92 } : undefined}
        className={`w-11 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 rounded-2xl flex flex-col items-center justify-center relative select-none transition-all duration-200 ${
          interactive ? "cursor-pointer" : "cursor-default"
        } ${
          isOn
            ? "bg-red-600 border-2 border-red-700 shadow-lg shadow-red-500/30 text-white"
            : "bg-white dark:bg-[#141416] border-2 border-slate-200 dark:border-white/10 hover:border-red-300 dark:hover:border-red-700/50 hover:shadow-sm text-slate-400 dark:text-zinc-500"
        }`}
      >
        {/* LED dot */}
        <span className={`w-2 h-2 rounded-full absolute top-2 transition-all ${
          isOn ? "bg-white/80" : "bg-slate-200 dark:bg-zinc-700"
        }`} />

        {/* Digit */}
        <span className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-mono tracking-tight ${
          isOn ? "text-white" : "text-slate-300 dark:text-zinc-600"
        }`}>
          {isOn ? "1" : "0"}
        </span>

        {/* ON / OFF */}
        <span className={`text-[9px] font-mono uppercase absolute bottom-1.5 font-bold ${
          isOn ? "text-red-100" : "text-slate-300 dark:text-zinc-600"
        }`}>
          {isOn ? "ON" : "OFF"}
        </span>
      </motion.button>

      {/* +weight below */}
      <span className={`text-[10px] font-mono h-4 font-bold transition-opacity ${
        isOn ? "text-red-600 dark:text-red-400 opacity-100" : "opacity-0"
      }`}>
        +{weight}
      </span>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import {
  Trophy, CheckCircle2, XCircle,
  Sparkles, ArrowRight, Flame, CalendarDays, Star
} from "lucide-react";
import {
  decimalToBits,
  generateBinaryToDecimalBreakdown
} from "./binaryLabUtils";

type QuizMode = "binToDec" | "decToBin";
type Difficulty = "easy" | "normal";

// ─── localStorage helpers ───────────────────────────────────────────
const STORAGE_KEY = "bitlab_quiz_data";

interface QuizPersist {
  totalScore: number;       // skor kumulatif sepanjang masa
  dailyStreak: number;      // streak harian (berapa hari berturut-turut main)
  lastPlayedDate: string;   // tanggal terakhir main: "YYYY-MM-DD"
  playedToday: boolean;     // sudah main hari ini?
}

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const loadPersist = (): QuizPersist => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { totalScore: 0, dailyStreak: 0, lastPlayedDate: "", playedToday: false };
    const data: QuizPersist = JSON.parse(raw);
    const today = getTodayStr();
    const yesterday = getYesterdayStr();
    // Sudah main hari ini
    if (data.lastPlayedDate === today) return { ...data, playedToday: true };
    // Main kemarin, streak tetap
    if (data.lastPlayedDate === yesterday) return { ...data, playedToday: false };
    // Skip lebih dari 1 hari, streak reset
    return { ...data, dailyStreak: 0, playedToday: false };
  } catch {
    return { totalScore: 0, dailyStreak: 0, lastPlayedDate: "", playedToday: false };
  }
};

const savePersist = (data: QuizPersist) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
// ────────────────────────────────────────────────────────────────────

export const BinaryQuizGame: React.FC = () => {
  const [mode, setMode] = useState<QuizMode>("binToDec");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Sesi ini — reset saat refresh
  const [sessionStreak, setSessionStreak] = useState<number>(0);

  // Persisten — disimpan di localStorage
  const [persist, setPersist] = useState<QuizPersist>(loadPersist);

  // Notifikasi daily streak naik
  const [showStreakBump, setShowStreakBump] = useState(false);
  const [bumpValue, setBumpValue] = useState(0);

  const generateQuestion = () => {
    const max = difficulty === "easy" ? 15 : 255;
    const rand = Math.floor(Math.random() * max) + 1;
    setCurrentNumber(rand);
    setUserAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setShowExplanation(false);
  };

  useEffect(() => { generateQuestion(); }, [mode, difficulty]);

  const bitLength = difficulty === "easy" ? 4 : 8;
  const targetBits = decimalToBits(currentNumber, bitLength);
  const targetBinaryStr = targetBits.join("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !userAnswer.trim()) return;

    let correct = false;
    if (mode === "binToDec") {
      correct = parseInt(userAnswer.trim(), 10) === currentNumber;
    } else {
      const cleanAns = userAnswer.replace(/[^01]/g, "").padStart(bitLength, "0");
      correct = cleanAns === targetBinaryStr;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const earned = difficulty === "easy" ? 10 : 25;
      const today = getTodayStr();

      setPersist(prev => {
        let newStreak = prev.dailyStreak;
        let newPlayedToday = prev.playedToday;

        // Jika belum main hari ini, tambah daily streak
        if (!prev.playedToday) {
          newStreak = prev.dailyStreak + 1;
          newPlayedToday = true;
          setBumpValue(newStreak);
          setShowStreakBump(true);
          setTimeout(() => setShowStreakBump(false), 2500);
        }

        const updated: QuizPersist = {
          totalScore: prev.totalScore + earned,
          dailyStreak: newStreak,
          lastPlayedDate: today,
          playedToday: newPlayedToday,
        };
        savePersist(updated);
        return updated;
      });

      setSessionStreak(st => st + 1);
    } else {
      setSessionStreak(0);
      setShowExplanation(true);
    }
  };

  const breakdown = generateBinaryToDecimalBreakdown(decimalToBits(currentNumber, 8));

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Daily streak bump notification */}
      {showStreakBump && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 text-white font-bold shadow-xl text-sm animate-bounce pointer-events-none">
          <Flame size={18} /> Streak Harian +1! {bumpValue} hari berturut-turut! 🔥
        </div>
      )}

      {/* Controls + Stats */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10">
            <button onClick={() => setMode("binToDec")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "binToDec" ? "bg-red-600 text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >Tebak Desimal</button>
            <button onClick={() => setMode("decToBin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "decToBin" ? "bg-red-600 text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >Tebak Biner</button>
          </div>

          {/* Difficulty */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10">
            <button onClick={() => setDifficulty("easy")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                difficulty === "easy" ? "bg-amber-500 text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >4-Bit (0–15)</button>
            <button onClick={() => setDifficulty("normal")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                difficulty === "normal" ? "bg-red-600 text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >8-Bit (0–255)</button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Session combo */}
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
            sessionStreak >= 3
              ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800/40"
              : "text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10"
          }`}>
            <Star size={13} /> Combo: {sessionStreak}
          </div>

          {/* Daily streak */}
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
            persist.dailyStreak >= 3
              ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40"
              : "text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10"
          }`}>
            <Flame size={13} />
            {persist.dailyStreak} Hari
            {persist.playedToday && (
              <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">Hari ini ✓</span>
            )}
          </div>

          {/* Total skor */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 px-3 py-1.5 rounded-xl">
            <Trophy size={13} /> {persist.totalScore} Poin
          </div>

          {/* Tanggal terakhir main */}
          {persist.lastPlayedDate && (
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] px-2.5 py-1.5 rounded-xl">
              <CalendarDays size={11} /> {persist.lastPlayedDate}
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm text-center flex flex-col items-center gap-6 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />

        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
          {mode === "binToDec" ? "Berapa nilai desimal dari biner berikut?" : "Berapa susunan biner dari angka desimal berikut?"}
        </div>

        <div className="py-5 px-8 rounded-2xl bg-slate-50 dark:bg-[#141416] border-2 border-slate-200 dark:border-white/10 shadow-inner">
          <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-mono tracking-widest text-slate-800 dark:text-white">
            {mode === "binToDec" ? (
              difficulty === "easy"
                ? targetBinaryStr
                : `${targetBinaryStr.slice(0, 4)} ${targetBinaryStr.slice(4)}`
            ) : currentNumber}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="w-full flex gap-2">
            <input
              type={mode === "binToDec" ? "number" : "text"}
              disabled={isAnswered}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={mode === "binToDec" ? "Ketik desimal (misal 192)…" : "Ketik biner (misal 11000000)…"}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#141416] border-2 border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-white font-mono text-center text-lg font-bold focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/50 transition-all disabled:opacity-50"
              autoFocus
            />
            <button
              type="submit"
              disabled={isAnswered || !userAnswer.trim()}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
            >Jawab</button>
          </div>
        </form>

        {/* Result Banner */}
        {isAnswered && (
          <div className={`w-full max-w-md p-4 rounded-2xl flex items-center justify-between gap-4 border-2 ${
            isCorrect
              ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800/40 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800/40 text-red-700 dark:text-red-300"
          }`}>
            <div className="flex items-center gap-3">
              {isCorrect
                ? <CheckCircle2 size={22} className="text-green-500 shrink-0" />
                : <XCircle size={22} className="text-red-500 shrink-0" />}
              <div className="text-left">
                <div className="font-bold text-sm">
                  {isCorrect
                    ? `Jawaban Benar! +${difficulty === "easy" ? 10 : 25} poin 🎉`
                    : "Kurang Tepat!"}
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-zinc-400">
                  Jawaban: <span className="font-bold text-slate-800 dark:text-white">{mode === "binToDec" ? currentNumber : targetBinaryStr}</span>
                </div>
              </div>
            </div>
            <button
              onClick={generateQuestion}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              Soal Baru <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="w-full max-w-xl p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-left font-mono text-xs">
            <h5 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5 text-sm">
              <Sparkles size={14} /> Pembahasan:
            </h5>
            <div className="text-slate-600 dark:text-zinc-400 mb-2">
              Angka <span className="text-slate-900 dark:text-white font-bold">{currentNumber}</span> didapat dari penjumlahan bobot bit aktif:
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#141416] border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 font-bold mb-2">
              {breakdown.formulaString}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400">
              💡 Ingat bobot 8 bit dari kiri ke kanan: <span className="font-bold text-slate-700 dark:text-zinc-200">128, 64, 32, 16, 8, 4, 2, 1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

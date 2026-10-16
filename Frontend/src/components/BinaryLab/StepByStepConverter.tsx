import React, { useState } from "react";
import { 
  Calculator, BookOpen, Sparkles, Layers, ListOrdered
} from "lucide-react";
import { 
  generateBinaryToDecimalBreakdown,
  generateSubtractionBreakdown, generateDivisionBreakdown,
  decimalToBits
} from "./binaryLabUtils";

export const StepByStepConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"binToDec" | "decToBin">("binToDec");
  const [binaryInput, setBinaryInput] = useState("11000000");
  const [decimalInput, setDecimalInput] = useState("192");
  const [decMethod, setDecMethod] = useState<"subtraction" | "division">("subtraction");

  const handleBinaryChange = (val: string) => {
    setBinaryInput(val.replace(/[^01]/g, "").slice(0, 8));
  };

  const parsedBits = binaryInput.padStart(8, "0").split("").map(b => (b === "1" ? 1 : 0));
  const binBreakdown = generateBinaryToDecimalBreakdown(parsedBits);

  const parsedDecimal = Math.max(0, Math.min(255, parseInt(decimalInput, 10) || 0));
  const subtractionBreakdown = generateSubtractionBreakdown(parsedDecimal);
  const divisionBreakdown = generateDivisionBreakdown(parsedDecimal);
  const resultBinary = decimalToBits(parsedDecimal).join("");

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Tab Switcher */}
      <div className="flex p-1 rounded-xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm self-start transition-colors">
        <button
          onClick={() => setActiveTab("binToDec")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "binToDec" ? "bg-red-600 text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white"
          }`}
        >
          <Calculator size={14} /> Biner ➔ Desimal
        </button>
        <button
          onClick={() => setActiveTab("decToBin")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "decToBin" ? "bg-red-600 text-white shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white"
          }`}
        >
          <BookOpen size={14} /> Desimal ➔ Biner
        </button>
      </div>

      {/* ── TAB 1: BINER KE DESIMAL ── */}
      {activeTab === "binToDec" && (
        <div className="flex flex-col gap-5">
          {/* Input & Result */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 transition-colors">
            <div className="w-full md:w-auto flex-1">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 block">Masukkan Digit Biner (Maks 8 Bit):</label>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text" maxLength={8}
                  value={binaryInput}
                  onChange={(e) => handleBinaryChange(e.target.value)}
                  placeholder="Contoh: 11000000"
                  className="w-full sm:w-56 px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#141416] border border-slate-300 dark:border-zinc-700 text-red-600 dark:text-red-400 font-mono text-xl font-bold tracking-widest focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/50 transition-all"
                />
                {["11111111","11000000","10000000","11111100"].map((p) => (
                  <button key={p} onClick={() => setBinaryInput(p)}
                    className="px-3 py-2 rounded-lg text-xs font-mono bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:bg-white/[0.06] dark:hover:bg-red-950/30 dark:hover:text-red-400 text-slate-600 dark:text-zinc-300 transition-all cursor-pointer border border-slate-200 dark:border-white/10"
                  >{parseInt(p,2)}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 bg-red-600 text-white rounded-2xl p-5 self-stretch md:self-auto min-w-[140px] shadow-md shadow-red-600/20">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-red-200">Hasil Desimal</div>
                <div className="text-4xl font-extrabold font-mono mt-1">{binBreakdown.total}</div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-mono font-bold text-sm">(10)</div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
            <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-2 mb-4">
              <ListOrdered size={16} className="text-red-600 dark:text-red-400" />
              Langkah Perhitungan (Bobot Pangkat 2):
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100 dark:border-white/10 text-slate-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Bit ke-</th>
                    <th className="py-2.5 px-3">Pangkat</th>
                    <th className="py-2.5 px-3">Bobot</th>
                    <th className="py-2.5 px-3">Nilai Bit</th>
                    <th className="py-2.5 px-3">Perhitungan</th>
                    <th className="py-2.5 px-3 text-right">Kontribusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                  {binBreakdown.steps.map((st) => (
                    <tr key={st.position} className={st.bit === 1 ? "bg-red-50/70 dark:bg-red-950/20" : "text-slate-400 dark:text-zinc-500"}>
                      <td className="py-2.5 px-3 font-bold text-slate-500 dark:text-zinc-400">Bit {st.position}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-zinc-300">2<sup>{st.power}</sup></td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-zinc-200">{st.weight}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                          st.bit === 1 ? "bg-red-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500"
                        }`}>{st.bit}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-zinc-400">{st.calculation}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-red-600 dark:text-red-400">
                        {st.result > 0 ? `+${st.result}` : "0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 font-bold text-red-700 dark:text-red-300">
                    <td colSpan={4} className="py-3 px-3">Total Penjumlahan:</td>
                    <td colSpan={2} className="py-3 px-3 text-right text-sm">{binBreakdown.formulaString}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: DESIMAL KE BINER ── */}
      {activeTab === "decToBin" && (
        <div className="flex flex-col gap-5">
          {/* Input & Result */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 transition-colors">
            <div className="w-full md:w-auto flex-1">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 block">Masukkan Angka Desimal (0 – 255):</label>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="number" min={0} max={255}
                  value={decimalInput}
                  onChange={(e) => setDecimalInput(e.target.value)}
                  placeholder="0–255"
                  className="w-full sm:w-56 px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#141416] border border-slate-300 dark:border-zinc-700 text-red-600 dark:text-red-400 font-mono text-xl font-bold tracking-widest focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/50 transition-all"
                />
                {[192,224,240,255].map((p) => (
                  <button key={p} onClick={() => setDecimalInput(String(p))}
                    className="px-3 py-2 rounded-lg text-xs font-mono bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:bg-white/[0.06] dark:hover:bg-red-950/30 dark:hover:text-red-400 text-slate-600 dark:text-zinc-300 transition-all cursor-pointer border border-slate-200 dark:border-white/10"
                  >{p}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 bg-red-600 text-white rounded-2xl p-5 self-stretch md:self-auto min-w-[180px] shadow-md shadow-red-600/20">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-red-200">Hasil Biner (8-bit)</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono mt-1 tracking-widest">
                  {resultBinary.slice(0,4)} {resultBinary.slice(4)}
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-mono font-bold text-sm">(2)</div>
            </div>
          </div>

          {/* Method Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Pilih Metode:</span>
            <button onClick={() => setDecMethod("subtraction")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                decMethod === "subtraction" ? "bg-red-600 text-white border-red-600 shadow-sm" : "bg-white dark:bg-[#1a1a1c] text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-white/10 hover:border-red-300"
              }`}
            >⭐ Pengurangan Bobot (TJKT)</button>
            <button onClick={() => setDecMethod("division")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                decMethod === "division" ? "bg-red-600 text-white border-red-600 shadow-sm" : "bg-white dark:bg-[#1a1a1c] text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-white/10 hover:border-red-300"
              }`}
            >Pembagian 2 Berulang</button>
          </div>

          {/* METODE PENGURANGAN */}
          {decMethod === "subtraction" && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-2">
                  <Sparkles size={15} className="text-red-600 dark:text-red-400" />
                  Metode Pengurangan Bobot (Cara Cepat Teknisi Jaringan)
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Uji dari bit terbesar (128) ke terkecil (1): Sisa ≥ bobot? → beri <strong>1</strong> dan kurangi. Jika tidak → beri <strong>0</strong>.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-100 dark:border-white/10 text-slate-400 dark:text-zinc-500 text-[11px] uppercase">
                      <th className="py-2.5 px-3">Bobot</th>
                      <th className="py-2.5 px-3">Sisa Angka</th>
                      <th className="py-2.5 px-3">Uji (≥)</th>
                      <th className="py-2.5 px-3">Bit</th>
                      <th className="py-2.5 px-3">Sisa Baru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {subtractionBreakdown.steps.map((st) => (
                      <tr key={st.weight} className={st.bitValue === 1 ? "bg-red-50/70 dark:bg-red-950/20" : ""}>
                        <td className="py-2.5 px-3 font-bold text-red-600 dark:text-red-400">{st.weight}</td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-zinc-200">{st.remainingBefore}</td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-zinc-400">
                          {st.remainingBefore} ≥ {st.weight}?{" "}
                          <span className={st.comparison ? "text-red-600 dark:text-red-400 font-bold" : "text-slate-400 dark:text-zinc-500"}>
                            {st.comparison ? "YA" : "TIDAK"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                            st.bitValue === 1 ? "bg-red-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500"
                          }`}>{st.bitValue}</span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-zinc-300">{st.remainingAfter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* METODE PEMBAGIAN */}
          {decMethod === "division" && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-2">
                  <Layers size={15} className="text-red-600 dark:text-red-400" />
                  Metode Pembagian 2 Berulang (Modulo)
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Bagi angka dengan 2 terus-menerus, catat sisa (0/1), lalu <span className="text-red-600 dark:text-red-400 font-bold">baca dari bawah ke atas</span>!
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-100 dark:border-white/10 text-slate-400 dark:text-zinc-500 text-[11px] uppercase">
                      <th className="py-2.5 px-3">Langkah</th>
                      <th className="py-2.5 px-3">Operasi</th>
                      <th className="py-2.5 px-3">Hasil Bagi</th>
                      <th className="py-2.5 px-3 text-red-600 dark:text-red-400 font-bold">Sisa (Bit)</th>
                      <th className="py-2.5 px-3">Arah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {divisionBreakdown.map((st, i) => (
                      <tr key={st.stepNumber} className="text-slate-700 dark:text-zinc-200">
                        <td className="py-2.5 px-3 text-slate-400 dark:text-zinc-500">#{st.stepNumber}</td>
                        <td className="py-2.5 px-3 font-semibold">{st.dividend} ÷ 2</td>
                        <td className="py-2.5 px-3">{st.quotient}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2.5 py-1 rounded bg-red-600 text-white font-bold text-xs">{st.remainder}</span>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-400 dark:text-zinc-500">
                          {i === divisionBreakdown.length - 1 ? "▲ MSB" : i === 0 ? "▲ LSB" : "▲"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

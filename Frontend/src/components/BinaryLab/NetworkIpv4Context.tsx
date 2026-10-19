import React, { useState } from "react";
import { decimalToBits } from "./binaryLabUtils";

export const NetworkIpv4Context: React.FC = () => {
  const [octets, setOctets] = useState<[number, number, number, number]>([192, 168, 10, 1]);
  const [cidr, setCidr] = useState<number>(24);

  const handleOctetChange = (index: number, valStr: string) => {
    const val = parseInt(valStr, 10);
    const clamped = isNaN(val) ? 0 : Math.max(0, Math.min(255, val));
    const next = [...octets] as [number, number, number, number];
    next[index] = clamped;
    setOctets(next);
  };

  const hostBits = 32 - cidr;
  const hostCount = Math.max(0, Math.pow(2, hostBits) - 2);
  const subnetBits = Array.from({ length: 32 }, (_, i) => (i < cidr ? 1 : 0));
  const subnetOctets: number[] = [
    parseInt(subnetBits.slice(0, 8).join(""), 2),
    parseInt(subnetBits.slice(8, 16).join(""), 2),
    parseInt(subnetBits.slice(16, 24).join(""), 2),
    parseInt(subnetBits.slice(24, 32).join(""), 2),
  ];

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-3 transition-colors">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Mengapa Siswa TJKT Wajib Paham Biner?</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Setiap alamat IP (IPv4) dan Subnet Mask di router Cisco/MikroTik tersusun dari{" "}
            <span className="text-red-600 dark:text-red-400 font-bold">32 Bit Biner</span> yang dipecah menjadi{" "}
            <span className="text-red-600 dark:text-red-400 font-bold">4 Blok Oktet (masing-masing 8 Bit)</span>.
          </p>
        </div>
      </div>

      {/* ── VISUALIZER 4 OKTET ── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              Simulator 4 Oktet IPv4 Address
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Ketik angka desimal, lihat representasi 32-bit binernya secara langsung:</p>
          </div>
          <div className="flex gap-2">
            {([[192,168,1,1],[10,20,0,1],[172,16,0,1]] as [number,number,number,number][]).map((preset) => (
              <button key={preset.join(".")} onClick={() => setOctets(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:bg-white/[0.06] dark:hover:bg-red-950/30 dark:hover:text-red-400 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-white/10 cursor-pointer transition-all"
              >{preset.join(".")}</button>
            ))}
          </div>
        </div>

        {/* 4 Oktet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {octets.map((octVal, octIdx) => {
            const octBits = decimalToBits(octVal);
            return (
              <div key={octIdx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#141416] border border-slate-200 dark:border-white/10 flex flex-col gap-3 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 font-bold">Oktet #{octIdx + 1}</span>
                  <input
                    type="number" min={0} max={255}
                    value={octVal}
                    onChange={(e) => handleOctetChange(octIdx, e.target.value)}
                    className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-[#1e1e22] border border-slate-300 dark:border-zinc-700 text-red-600 dark:text-red-400 font-mono font-bold text-center text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/50"
                  />
                </div>

                {/* 8 mini bits */}
                <div className="flex items-center justify-between gap-0.5 py-1 px-1 rounded-lg bg-white dark:bg-[#1e1e22] border border-slate-200 dark:border-white/10">
                  {octBits.map((b, bIdx) => (
                    <span
                      key={bIdx}
                      className={`w-5 h-7 rounded flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        b === 1 ? "bg-red-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500"
                      }`}
                    >{b}</span>
                  ))}
                </div>

                <div className="text-[11px] font-mono text-center text-slate-400 dark:text-zinc-500">
                  {octBits.slice(0, 4).join("")} {octBits.slice(4).join("")}
                </div>
              </div>
            );
          })}
        </div>

        {/* 32-bit full view */}
        <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs">
          <span className="text-red-700 dark:text-red-300 font-bold">32-Bit IPv4 Lengkap:</span>
          <span className="text-red-600 dark:text-red-400 font-bold text-sm tracking-widest break-all">
            {octets.map(o => decimalToBits(o).join("")).join(" . ")}
          </span>
        </div>
      </div>

      {/* ── CIDR VISUALIZER ── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1c] border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              Visualisasi Subnet Mask CIDR (/8 s/d /30)
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Geser slider untuk lihat bit <span className="text-red-600 dark:text-red-400 font-bold">Network (1)</span> vs bit <span className="text-slate-500 dark:text-zinc-400 font-bold">Host (0)</span>:
            </p>
          </div>
          <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-xl font-mono shadow-sm">
            <span className="text-xs text-red-200">Prefix:</span>
            <span className="text-lg font-extrabold">/{cidr}</span>
          </div>
        </div>

        {/* Slider */}
        <div className="flex flex-col gap-1 mb-5">
          <input
            type="range" min={8} max={30} value={cidr}
            onChange={(e) => setCidr(parseInt(e.target.value, 10))}
            className="w-full accent-red-600 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-zinc-700"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500">
            <span>/8 (Class A)</span>
            <span>/16 (Class B)</span>
            <span>/24 (Class C)</span>
            <span>/30 (P2P)</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs font-mono mb-3">
          <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-600 inline-block" /> {cidr} Bit Network (1)
          </span>
          <span className="text-slate-400 dark:text-zinc-500 font-bold flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-zinc-700 border border-slate-300 dark:border-zinc-600 inline-block" /> {32 - cidr} Bit Host (0)
          </span>
        </div>

        {/* 32 Boxes */}
        <div className="grid grid-cols-8 sm:grid-cols-16 lg:grid-cols-32 gap-1">
          {subnetBits.map((b, i) => (
            <div
              key={i}
              title={`Bit ke-${i + 1}: ${b === 1 ? "Network" : "Host"}`}
              className={`h-7 rounded flex items-center justify-center font-mono text-xs font-bold transition-all ${
                b === 1
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 border border-slate-200 dark:border-white/10"
              }`}
            >{b}</div>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#141416] border border-slate-200 dark:border-white/10 font-mono transition-colors">
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-bold">Subnet Mask Desimal</div>
            <div className="text-base font-extrabold text-slate-800 dark:text-white mt-1">{subnetOctets.join(".")}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#141416] border border-slate-200 dark:border-white/10 font-mono transition-colors">
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-bold">Wildcard Mask (Cisco)</div>
            <div className="text-base font-extrabold text-red-600 dark:text-red-400 mt-1">{subnetOctets.map(o => 255 - o).join(".")}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 font-mono transition-colors">
            <div className="text-[10px] text-red-500 uppercase font-bold">Jumlah Usable Host</div>
            <div className="text-base font-extrabold text-red-700 dark:text-red-300 mt-1">{hostCount.toLocaleString()} Host</div>
          </div>
        </div>
      </div>
    </div>
  );
};

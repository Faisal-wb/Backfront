import React, { useState } from "react";
import { Award, Plus, Trash2, X, Check, Search, Pencil } from "lucide-react";

export interface AchievementData {
  year: string;
  event: string;
  result: string;
  tier: "gold" | "silver" | "bronze";
}

interface AdminAchievementsProps {
  achievements: AchievementData[];
  onUpdateAchievements: (achievements: AchievementData[]) => void;
  theme?: "light" | "dark";
}

const EMPTY_FORM: AchievementData = { year: "2026", event: "", result: "", tier: "gold" };

export const AdminAchievements: React.FC<AdminAchievementsProps> = ({ achievements, onUpdateAchievements, theme = "light" }) => {
  const isDark = theme === "dark";

  // modalMode: null = tutup, "add" = tambah baru, number = index yang diedit
  const [modalMode, setModalMode] = useState<null | "add" | number>(null);
  const [formData, setFormData] = useState<AchievementData>(EMPTY_FORM);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAchievements = achievements.filter(
    (a) =>
      a.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.result.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.year.includes(searchQuery)
  );

  /* ── Handlers ── */
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setModalMode("add");
  };

  const openEdit = (idx: number) => {
    setFormData({ ...achievements[idx] });
    setModalMode(idx);
  };

  const closeModal = () => {
    setModalMode(null);
    setFormData(EMPTY_FORM);
  };

  const handleDelete = (index: number) => {
    if (window.confirm(`Yakin menghapus prestasi "${achievements[index].event}"?`)) {
      onUpdateAchievements(achievements.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.event || !formData.result) return;

    if (modalMode === "add") {
      onUpdateAchievements([formData, ...achievements]);
    } else if (typeof modalMode === "number") {
      const updated = achievements.map((item, i) => (i === modalMode ? { ...formData } : item));
      onUpdateAchievements(updated);
    }
    closeModal();
  };

  const isEditing = typeof modalMode === "number";
  const isModalOpen = modalMode !== null;

  const inputCls = `w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors ${
    isDark ? "bg-[#09090b] border-zinc-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
  }`;

  return (
    <div className="space-y-6">
      {/* ── Header bar ── */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${
          isDark ? "bg-[#121215] border-zinc-800/80 shadow-md" : "bg-white border-slate-200/80 shadow-sm"
        }`}
      >
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <Award className="text-amber-500" size={22} />
            Kelola Prestasi &amp; Kejuaraan TJKT
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
            Daftar juara LKS, AI, Web Tech, dan IT Competition
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <Plus size={16} />
          Tambah Prestasi Baru
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200/80"
      }`}>
        <Search size={16} className={isDark ? "text-zinc-500" : "text-slate-400"} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama lomba, hasil, atau tahun..."
          className={`flex-1 text-sm bg-transparent outline-none ${
            isDark ? "text-white placeholder-zinc-600" : "text-slate-900 placeholder-slate-400"
          }`}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-red-500 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className={`border rounded-2xl overflow-hidden ${
        isDark ? "bg-[#121215] border-zinc-800/80 shadow-md" : "bg-white border-slate-200/80 shadow-sm"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`uppercase text-[11px] font-extrabold border-b ${
              isDark ? "bg-zinc-900/90 text-zinc-400 border-zinc-800" : "bg-slate-50 text-slate-600 border-slate-200"
            }`}>
              <tr>
                <th className="py-3.5 px-4">Tahun</th>
                <th className="py-3.5 px-4">Nama Lomba / Event</th>
                <th className="py-3.5 px-4">Hasil / Gelar Juara</th>
                <th className="py-3.5 px-4 text-center">Tingkat / Tier</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-zinc-800/80 text-zinc-300" : "divide-slate-100 text-slate-700"}`}>
              {filteredAchievements.length === 0 ? (
                <tr><td colSpan={5} className={`py-10 text-center text-sm ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                  {searchQuery ? `Tidak ada prestasi dengan kata kunci "${searchQuery}"` : "Belum ada data prestasi."}
                </td></tr>
              ) : filteredAchievements.map((item) => {
                const idx = achievements.indexOf(item);
                return (
                  <tr key={idx} className={isDark ? "hover:bg-zinc-800/40" : "hover:bg-slate-50/80"}>
                    <td className={`py-3.5 px-4 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item.year}</td>
                    <td className={`py-3.5 px-4 font-semibold ${isDark ? "text-zinc-200" : "text-slate-800"}`}>{item.event}</td>
                    <td className="py-3.5 px-4 text-emerald-500 font-bold">{item.result}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        item.tier === "gold"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : item.tier === "silver"
                          ? "bg-slate-100 text-slate-800 border border-slate-300"
                          : "bg-amber-50 text-amber-900 border border-amber-200"
                      }`}>
                        {item.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* Edit + Delete buttons */}
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(idx)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isDark
                              ? "bg-blue-900/40 hover:bg-blue-800/60 text-blue-400"
                              : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                          }`}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isDark
                              ? "bg-rose-900/40 hover:bg-rose-800/60 text-rose-400"
                              : "bg-rose-50 hover:bg-rose-100 text-rose-600"
                          }`}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Tambah / Edit ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl space-y-4 ${
            isDark ? "bg-[#18181b] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {/* Modal header */}
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Pencil size={16} className="text-blue-500" />
                ) : (
                  <Plus size={16} className="text-emerald-500" />
                )}
                <h3 className="text-base font-bold">
                  {isEditing ? "Edit Prestasi" : "Tambah Prestasi Baru"}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className={`p-1 rounded-lg transition-colors ${isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>Tahun</label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>Tier Medali</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as AchievementData["tier"] })}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="gold">Gold (Juara 1)</option>
                    <option value="silver">Silver (Juara 2)</option>
                    <option value="bronze">Bronze (Juara 3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>Nama Lomba / Event</label>
                <input
                  type="text"
                  required
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  placeholder="Contoh: LKS Cyber Security"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>Hasil Perolehan</label>
                <input
                  type="text"
                  required
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  placeholder="Contoh: Juara 1 Provinsi"
                  className={inputCls}
                />
              </div>

              {/* Preview badge */}
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border ${isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                <span className={`text-xs ${isDark ? "text-zinc-400" : "text-slate-500"}`}>Preview tier:</span>
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  formData.tier === "gold"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : formData.tier === "silver"
                    ? "bg-slate-100 text-slate-800 border border-slate-300"
                    : "bg-amber-50 text-amber-900 border border-amber-200"
                }`}>
                  {formData.tier}
                </span>
              </div>

              {/* Footer buttons */}
              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                    isEditing
                      ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                  }`}
                >
                  <Check size={15} />
                  {isEditing ? "Simpan Perubahan" : "Simpan Prestasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

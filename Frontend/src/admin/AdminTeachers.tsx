import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, UserCheck, X, Upload, AlertTriangle, Check, Search, Database } from "lucide-react";
import { adminTeachersApi } from "../services/api";

function compressImage(file: File, maxPx = 800, quality = 0.75): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, "image/webp", quality);
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = dataUrl;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export interface TeacherData {
  id?: number;
  name: string;
  role: string;
  initials: string;
  color: string;
  image?: string;
  order?: number;
}

interface AdminTeachersProps {
  teachers: TeacherData[];
  onUpdateTeachers: (teachers: TeacherData[]) => void;
  theme?: "light" | "dark";
}

export const AdminTeachers: React.FC<AdminTeachersProps> = ({ teachers: propTeachers, onUpdateTeachers, theme = "light" }) => {
  const isDark = theme === "dark";

  const [teachers, setTeachers] = useState<TeacherData[]>(propTeachers || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{ file: File | null; data: TeacherData }>({
    file: null,
    data: { name: "", role: "", initials: "", color: "#059669", image: "" }
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    onUpdateTeachers(teachers);
  }, [teachers, onUpdateTeachers]);

  useEffect(() => {
    if (!formData.file) {
      const url = formData.data.image || "";
      setPreviewUrl(url.startsWith('/') ? `https://lt3tjkt.smkthpati.sch.id${url}` : url);
      return;
    }
    const objUrl = URL.createObjectURL(formData.file);
    setPreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [formData.file, formData.data.image]);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({ 
      file: null, 
      data: { name: "", role: "", initials: "", color: "#059669", image: "" } 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ 
      file: null, 
      data: { ...teachers[index] } 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    const item = teachers[index];
    if (window.confirm(`Yakin ingin menghapus guru ${item.name}?`)) {
      if (item.id) {
        try {
          await adminTeachersApi('DELETE', item.id, {});
        } catch (e) {
          console.error("Failed to delete from server", e);
        }
      }
      const updated = teachers.filter((_, i) => i !== index);
      setTeachers(updated);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const compressed = await compressImage(file, 800, 0.75);
    setFormData(prev => ({ ...prev, file: compressed }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.data.name || !formData.data.role || uploading) return;

    setUploading(true);
    setSaveError(null);

    const initials = formData.data.initials || formData.data.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    
    const payload = new FormData();
    payload.append('name', formData.data.name);
    payload.append('role', formData.data.role);
    payload.append('initials', initials);
    payload.append('color', formData.data.color || "#059669");
    if (formData.file) {
      payload.append('image', formData.file);
    }

    try {
      const isEdit = editingIndex !== null;
      const id = isEdit ? teachers[editingIndex].id! : null;
      
      const res = await adminTeachersApi('POST', id, payload);
      
      if (res.status === 'success') {
        let updated: TeacherData[];
        if (isEdit) {
          updated = [...teachers];
          updated[editingIndex] = res.data;
        } else {
          updated = [...teachers, res.data];
        }

        setTeachers(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setIsModalOpen(false);
      } else {
        setSaveError(res.message || "Gagal menyimpan data guru.");
      }
    } catch (err: any) {
      setSaveError(err.message || "Terjadi kesalahan server saat menyimpan data.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-[100] p-4 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
          <Check size={16} />
          <span>Data Guru & Foto berhasil tersimpan permanen di Server!</span>
        </div>
      )}

      {saveError && (
        <div className="fixed top-4 right-4 z-[100] p-4 rounded-xl bg-amber-50 border border-amber-500/30 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
          <AlertTriangle size={16} />
          <span>{saveError}</span>
        </div>
      )}

      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${isDark
            ? "bg-[#121215] border-zinc-800/80 shadow-md"
            : "bg-white border-slate-200/80 shadow-sm"
          }`}
      >
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <UserCheck className="text-emerald-500" size={22} />
            Kelola Data Guru Produktif TJKT
          </h2>
          <p className={`text-xs mt-1 flex items-center gap-2 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
            <Database size={11} className="text-emerald-500" />
            Terhubung ke Database MySQL — Tampil Publik di Web
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <Plus size={16} />
          Tambah Guru Baru
        </button>
      </div>

      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        isDark ? "bg-[#121215] border-zinc-800/80" : "bg-white border-slate-200/80"
      }`}>
        <Search size={16} className={isDark ? "text-zinc-500" : "text-slate-400"} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama guru atau jabatan..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.length === 0 ? (
          <div className={`col-span-3 text-center py-12 text-sm ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
            {searchQuery ? `Tidak ada guru dengan kata kunci "${searchQuery}"` : "Belum ada data guru."}
          </div>
        ) : filteredTeachers.map((t) => {
          const idx = teachers.indexOf(t);
          const imgSrc = t.image?.startsWith('/') ? `https://lt3tjkt.smkthpati.sch.id${t.image}` : t.image;
          return (
          <div
            key={idx}
            className={`rounded-2xl border overflow-hidden relative group transition-all flex flex-col justify-between ${isDark
                ? "bg-[#121215] border-zinc-800/80 hover:border-zinc-700 shadow-md"
                : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md"
              }`}
          >
            <div className="h-48 w-full relative overflow-hidden bg-slate-100 dark:bg-zinc-900 flex-shrink-0">
              {t.image ? (
                <img
                  src={imgSrc}
                  alt={t.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: t.color || "#059669" }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-xl">{t.initials}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>{t.name}</h4>
                <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{t.role}</p>
              </div>
              <div className={`flex items-center justify-end gap-2 mt-4 pt-3 border-t ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
                <button
                  onClick={() => handleOpenEdit(idx)}
                  className={`p-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 font-semibold ${isDark
                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs transition-colors cursor-pointer flex items-center gap-1.5 font-semibold"
                >
                  <Trash2 size={14} />
                  Hapus
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl space-y-4 ${isDark ? "bg-[#18181b] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
              <h3 className="text-base font-bold">
                {editingIndex !== null ? "Edit Data Guru" : "Tambah Guru Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className={isDark ? "text-zinc-400 hover:text-white" : "text-slate-400 hover:text-slate-700"}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={formData.data.name}
                  onChange={e => setFormData({ ...formData, data: { ...formData.data, name: e.target.value } })}
                  placeholder="Contoh: M. Bahrun Ni'am, S.Kom."
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 ${isDark ? "bg-[#09090b] border-zinc-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Jabatan / Pengampu Mapel
                </label>
                <input
                  type="text"
                  required
                  value={formData.data.role}
                  onChange={e => setFormData({ ...formData, data: { ...formData.data, role: e.target.value } })}
                  placeholder="Contoh: Guru Pemrograman Web"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 ${isDark ? "bg-[#09090b] border-zinc-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Pilih File Foto Baru
                </label>
                <div className="flex items-center gap-3">
                  <label className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${uploading
                      ? "opacity-50 cursor-not-allowed bg-amber-500/10 text-amber-500 border-amber-500/30"
                      : isDark
                        ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                        : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                    }`}>
                    <Upload size={16} />
                    <span>{uploading ? "Mengupload..." : formData.file ? "File Dipilih ✓" : "Upload Foto Server..."}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                  )}
                </div>
              </div>

              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-700"
                    }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${uploading
                      ? "bg-zinc-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 cursor-pointer"
                    }`}
                >
                  {uploading ? "Menyimpan..." : "Simpan Data Guru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

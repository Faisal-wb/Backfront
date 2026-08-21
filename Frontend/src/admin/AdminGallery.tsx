import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, Trash2, Edit2, X, Check, Upload, AlertTriangle, Database } from "lucide-react";
import { adminGalleryApi } from "../services/api";

function compressImage(file: File, maxPx = 1600, quality = 0.75): Promise<File> {
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

const MAX_GALLERY = 12;

export interface GalleryItem {
  id?: number;
  url: string;
  alt: string;
  tall?: boolean;
}

interface AdminGalleryProps {
  defaultGallery: GalleryItem[];
  onSyncPublic: (gallery: GalleryItem[]) => void;
  theme?: "light" | "dark";
}

export const AdminGallery: React.FC<AdminGalleryProps> = ({
  defaultGallery,
  onSyncPublic,
  theme = "light",
}) => {
  const isDark = theme === "dark";

  const [resolved, setResolved] = useState<GalleryItem[]>(defaultGallery || []);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ file: File | null; url: string; alt: string }>({ file: null, url: "", alt: "" });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    onSyncPublic(resolved);
  }, [resolved, onSyncPublic]);

  useEffect(() => {
    if (!formData.file) {
      setPreviewUrl(formData.url || "");
      return;
    }
    const objUrl = URL.createObjectURL(formData.file);
    setPreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [formData.file, formData.url]);

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{ file: File | null; url: string; alt: string }>({ file: null, url: "", alt: "" });
  const [editPreviewUrl, setEditPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (editingIdx === null) return;
    if (!editFormData.file) {
      const currentUrl = editFormData.url || resolved[editingIdx]?.url || "";
      // If it's a relative storage path, prepend the base url if needed, but here we assume URL handles it or it's full
      setEditPreviewUrl(currentUrl.startsWith('/') ? `https://lt3tjkt.smkthpati.sch.id${currentUrl}` : currentUrl);
      return;
    }
    const objUrl = URL.createObjectURL(editFormData.file);
    setEditPreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [editFormData.file, editFormData.url, editingIdx, resolved]);

  const handleOpenEdit = (idx: number) => {
    const itemResolved = resolved[idx];
    setEditingIdx(idx);
    setEditFormData({
      file: null,
      url: itemResolved?.url || "",
      alt: itemResolved?.alt || "",
    });
    const imgUrl = itemResolved?.url || "";
    setEditPreviewUrl(imgUrl.startsWith('/') ? `https://lt3tjkt.smkthpati.sch.id${imgUrl}` : imgUrl);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdx === null) return;

    setUploading(true);
    setSaveError(null);

    const oldItem = resolved[editingIdx];
    const data = new FormData();
    if (editFormData.file) {
      data.append('image', editFormData.file);
    } else if (editFormData.url) {
      data.append('url', editFormData.url);
    }
    
    if (editFormData.alt) data.append('alt', editFormData.alt);

    try {
      const res = await adminGalleryApi('POST', oldItem.id || null, data);
      if (res.status === 'success') {
        const nextResolved = [...resolved];
        nextResolved[editingIdx] = res.data;
        setResolved(nextResolved);
        setEditingIdx(null);
        setEditFormData({ file: null, url: "", alt: "" });
      } else {
        setSaveError(res.message || "Gagal menyimpan perubahan.");
      }
    } catch (err: any) {
      setSaveError(err.message || "Terjadi kesalahan server.");
    }

    setUploading(false);
  };

  const handleDelete = async (idx: number) => {
    if (!window.confirm("Yakin ingin menghapus foto ini dari galeri?")) return;
    const item = resolved[idx];
    
    if (item.id) {
      try {
        await adminGalleryApi('DELETE', item.id, {});
      } catch (e) {
        console.error("Failed to delete from server", e);
      }
    }
    
    setResolved((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file && !formData.url) return;
    if (resolved.length >= MAX_GALLERY) {
      setSaveError(`Galeri sudah penuh (maks. ${MAX_GALLERY} foto). Hapus dulu salah satu.`);
      return;
    }

    setUploading(true);
    setSaveError(null);

    const data = new FormData();
    if (formData.file) {
      data.append('image', formData.file);
    } else {
      data.append('url', formData.url);
    }
    if (formData.alt) data.append('alt', formData.alt);
    data.append('order', resolved.length.toString());

    try {
      const res = await adminGalleryApi('POST', null, data);
      if (res.status === 'success') {
        setResolved((prev) => [...prev, res.data].slice(0, MAX_GALLERY));
        setIsModalOpen(false);
        setFormData({ file: null, url: "", alt: "" });
      } else {
        setSaveError(res.message || "Gagal menyimpan foto.");
      }
    } catch (err: any) {
      setSaveError(err.message || "Terjadi kesalahan server.");
    }

    setUploading(false);
  };

  const card = isDark
    ? "bg-[#121215] border-zinc-800/80 shadow-md"
    : "bg-white border-slate-200/80 shadow-sm";

  const inputCls = isDark
    ? "bg-[#09090b] border-zinc-800 text-white focus:border-emerald-500"
    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${card}`}>
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <ImageIcon className="text-emerald-500" size={22} />
            Kelola Galeri Foto &amp; Fasilitas TJKT
          </h2>
          <p className={`text-xs mt-1 flex items-center gap-2 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
            <Database size={11} className="text-emerald-500" />
            Foto tersimpan di Backend Laravel — <strong>Tampil di Web Publik</strong> &mdash;
            <span className={`font-semibold ml-1 ${resolved.length >= MAX_GALLERY ? "text-rose-500" : "text-emerald-500"}`}>
              {resolved.length}/{MAX_GALLERY} foto
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            if (resolved.length >= MAX_GALLERY) {
              setSaveError(`Galeri sudah penuh (maks. ${MAX_GALLERY} foto). Hapus dulu salah satu.`);
              return;
            }
            setSaveError(null);
            setFormData({ file: null, url: "", alt: "" });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <Plus size={16} />
          Tambah Foto Baru
        </button>
      </div>

      {saveError && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm font-medium">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>{saveError}</span>
          <button onClick={() => setSaveError(null)} className="ml-auto text-rose-400 hover:text-rose-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* GRID */}
      {resolved.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed ${isDark ? "border-zinc-800 text-zinc-600" : "border-slate-200 text-slate-400"}`}>
          <ImageIcon size={40} className="mb-3 opacity-40" />
          <p className="text-sm font-semibold">Belum ada foto galeri</p>
          <p className="text-xs mt-1 opacity-60">Klik "Tambah Foto Baru" untuk mulai upload</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {resolved.map((item, idx) => (
            <div
              key={idx}
              className={`border rounded-2xl overflow-hidden group relative transition-all ${card} ${isDark ? "" : "hover:shadow-md"}`}
            >
              <div className="h-44 overflow-hidden relative">
                {item.url ? (
                  <img
                    src={item.url.startsWith('/') ? `https://lt3tjkt.smkthpati.sch.id${item.url}` : item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' fill='%236B7280' font-size='14' text-anchor='middle' dominant-baseline='middle'%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-zinc-900" : "bg-slate-100"}`}>
                    <ImageIcon size={32} className="opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <p className="text-white text-xs font-semibold truncate">{item.alt || "Foto Galeri TJKT"}</p>
                </div>
              </div>
              <div className={`p-3 flex items-center justify-between border-t ${isDark ? "bg-[#09090b] border-zinc-800/80" : "bg-slate-50 border-slate-100"}`}>
                <span className={`text-[11px] font-mono truncate max-w-[140px] ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                  {item.alt || `Foto #${idx + 1}`}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(idx)}
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                    title="Edit Foto"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Hapus Foto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TAMBAH FOTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl space-y-4 ${isDark ? "bg-[#18181b] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                <ImageIcon size={18} className="text-emerald-500" />
                Tambah Foto Galeri Baru
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setFormData({ file: null, url: "", alt: "" }); }}
                className={`cursor-pointer ${isDark ? "text-zinc-400 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Upload Foto ke Server
                </label>
                <div className="flex items-center gap-3">
                  <label className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${isDark ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"}`}>
                    <Upload size={15} />
                    <span>{formData.file ? `${formData.file.name} ✓` : "Pilih File..."}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0] || null;
                        if (f) {
                          setUploading(true);
                          const compressed = await compressImage(f, 1600, 0.75);
                          setFormData((prev) => ({ ...prev, file: compressed, url: "" }));
                          setUploading(false);
                        } else {
                          setFormData((prev) => ({ ...prev, file: null }));
                        }
                      }}
                      disabled={uploading}
                    />
                  </label>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-zinc-700 flex-shrink-0"
                    />
                  )}
                </div>
              </div>
              {!formData.file && (
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                    Atau URL/Link Gambar Baru
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    disabled={uploading}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none ${inputCls}`}
                  />
                </div>
              )}
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Keterangan Foto
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="Contoh: Praktik konfigurasi router"
                  disabled={uploading}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none ${inputCls}`}
                />
              </div>
              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setFormData({ file: null, url: "", alt: "" }); }}
                  disabled={uploading}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer ${isDark ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading || (!formData.file && !formData.url)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <Check size={15} />
                  {uploading ? "Menyimpan..." : "Simpan Foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT FOTO */}
      {editingIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl space-y-4 ${isDark ? "bg-[#18181b] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit2 size={18} className="text-blue-500" />
                Edit Foto #{(editingIdx ?? 0) + 1}
              </h3>
              <button
                onClick={() => { setEditingIdx(null); setEditFormData({ file: null, url: "", alt: "" }); }}
                className={`cursor-pointer ${isDark ? "text-zinc-400 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              {editPreviewUrl && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700">
                  <img src={editPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Ganti Foto
                </label>
                <div className="flex items-center gap-3">
                  <label className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${isDark ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"}`}>
                    <Upload size={15} />
                    <span>{editFormData.file ? `${editFormData.file.name} ✓` : "Pilih File Baru..."}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0] || null;
                        if (f) {
                          setUploading(true);
                          const compressed = await compressImage(f, 1600, 0.75);
                          setEditFormData((prev) => ({ ...prev, file: compressed, url: "" }));
                          setUploading(false);
                        } else {
                          setEditFormData((prev) => ({ ...prev, file: null }));
                        }
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
              {!editFormData.file && (
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                    Atau URL/Link Gambar Baru
                  </label>
                  <input
                    type="text"
                    value={editFormData.url}
                    onChange={(e) => setEditFormData({ ...editFormData, url: e.target.value })}
                    placeholder="https://..."
                    disabled={uploading}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none ${inputCls}`}
                  />
                </div>
              )}
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Keterangan Foto
                </label>
                <input
                  type="text"
                  value={editFormData.alt}
                  onChange={(e) => setEditFormData({ ...editFormData, alt: e.target.value })}
                  placeholder="Contoh: Praktik konfigurasi router"
                  disabled={uploading}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none ${inputCls}`}
                />
              </div>
              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
                <button
                  type="button"
                  onClick={() => { setEditingIdx(null); setEditFormData({ file: null, url: "", alt: "" }); }}
                  disabled={uploading}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer ${isDark ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
                >
                  <Check size={15} />
                  {uploading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

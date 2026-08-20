import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, Trash2, Edit2, X, Check, Upload, AlertTriangle, Database } from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GALLERY_META_KEY = "tjkt_gallery_meta";   // localStorage: hanya simpan meta (alt, id)
const IDB_DB_NAME      = "tjkt_gallery_db";
const IDB_STORE        = "images";
const MAX_GALLERY      = 9;

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface GalleryItem {
  url: string;   // data URL / http URL
  alt: string;
}

interface GalleryMeta {
  id: string;      // "idb:<uuid>" = stored in IndexedDB, otherwise = the URL itself
  alt: string;
  isBuiltin?: boolean; // true = foto bawaan (asset), id = url asset-nya
}

interface AdminGalleryProps {
  defaultGallery: GalleryItem[];
  onSyncPublic: (gallery: GalleryItem[]) => void;
  theme?: "light" | "dark";
}

// ─── INDEXEDDB HELPERS ────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function idbPut(id: string, dataUrl: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(IDB_STORE, "readwrite");
    const store = tx.objectStore(IDB_STORE);
    const req   = store.put(dataUrl, id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

async function idbGet(id: string): Promise<string | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(IDB_STORE, "readonly");
    const store = tx.objectStore(IDB_STORE);
    const req   = store.get(id);
    req.onsuccess = () => resolve(req.result as string | undefined);
    req.onerror   = () => reject(req.error);
  });
}

async function idbDelete(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx    = db.transaction(IDB_STORE, "readwrite");
    const store = tx.objectStore(IDB_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve();
  });
}

function genId() {
  return "idb:" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── LOAD / SAVE META ─────────────────────────────────────────────────────────

function loadMeta(defaultGallery: GalleryItem[]): GalleryMeta[] {
  try {
    const raw = localStorage.getItem(GALLERY_META_KEY);
    if (raw) {
      const parsed: GalleryMeta[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, MAX_GALLERY);
      }
    }
  } catch (e) {
    console.warn("[AdminGallery] meta read error:", e);
  }
  // Fallback: jadikan foto default sebagai built-in
  return defaultGallery.slice(0, MAX_GALLERY).map((item) => ({
    id: item.url,
    alt: item.alt,
    isBuiltin: true,
  }));
}

function saveMeta(meta: GalleryMeta[]) {
  try {
    localStorage.setItem(GALLERY_META_KEY, JSON.stringify(meta));
  } catch (e) {
    console.warn("[AdminGallery] meta save error:", e);
  }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export const AdminGallery: React.FC<AdminGalleryProps> = ({
  defaultGallery,
  onSyncPublic,
  theme = "light",
}) => {
  const isDark = theme === "dark";

  const [meta, setMeta]         = useState<GalleryMeta[]>(() => loadMeta(defaultGallery));
  const [resolved, setResolved] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);  // skeleton loading flag
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [saveError, setSaveError]     = useState<string | null>(null);
  const [formData, setFormData]       = useState<{ file: File | null; url: string; alt: string }>({ file: null, url: "", alt: "" });
  const [previewUrl, setPreviewUrl]   = useState<string>("");

  // Resolve meta → GalleryItem[] — load images sequentially to avoid UI freeze
  useEffect(() => {
    let cancelled = false;
    setLoadingGallery(true);

    (async () => {
      const items: GalleryItem[] = [];
      for (const m of meta) {
        if (cancelled) return;
        if (m.isBuiltin || !m.id.startsWith("idb:")) {
          items.push({ url: m.id, alt: m.alt });
        } else {
          try {
            const data = await idbGet(m.id);
            items.push({ url: data || "", alt: m.alt });
          } catch {
            items.push({ url: "", alt: m.alt });
          }
        }
      }
      if (!cancelled) {
        setResolved(items);
        setLoadingGallery(false);
        onSyncPublic(items.filter((i) => !!i.url));
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

  // Simpan meta setiap berubah
  useEffect(() => {
    saveMeta(meta);
  }, [meta]);

  // Preview file saat dipilih (Tambah)
  useEffect(() => {
    if (!formData.file) {
      setPreviewUrl(formData.url || "");
      return;
    }
    const objUrl = URL.createObjectURL(formData.file);
    setPreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [formData.file, formData.url]);

  // Edit State
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{ file: File | null; url: string; alt: string }>({ file: null, url: "", alt: "" });
  const [editPreviewUrl, setEditPreviewUrl] = useState<string>("");

  // Preview file saat dipilih (Edit)
  useEffect(() => {
    if (editingIdx === null) return;
    if (!editFormData.file) {
      setEditPreviewUrl(editFormData.url || resolved[editingIdx]?.url || "");
      return;
    }
    const objUrl = URL.createObjectURL(editFormData.file);
    setEditPreviewUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [editFormData.file, editFormData.url, editingIdx, resolved]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────

  const handleOpenEdit = (idx: number) => {
    const itemMeta = meta[idx];
    const itemResolved = resolved[idx];
    setEditingIdx(idx);
    setEditFormData({
      file: null,
      url: itemMeta.isBuiltin || !itemMeta.id.startsWith("idb:") ? itemMeta.id : "",
      alt: itemMeta.alt,
    });
    setEditPreviewUrl(itemResolved?.url || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdx === null) return;

    setUploading(true);
    setSaveError(null);

    const oldItemMeta = meta[editingIdx];
    let updatedMetaItem: GalleryMeta = { ...oldItemMeta, alt: editFormData.alt.trim() || oldItemMeta.alt };

    if (editFormData.file) {
      // Baca file sebagai base64 & simpan di IndexedDB
      const dataUrl = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result as string);
        reader.onerror = () => rej(reader.error);
        reader.readAsDataURL(editFormData.file!);
      });
      // Hapus data lama dari IndexedDB jika idb:
      if (oldItemMeta.id.startsWith("idb:")) {
        await idbDelete(oldItemMeta.id).catch(() => {});
      }
      const newId = genId();
      await idbPut(newId, dataUrl);
      updatedMetaItem = { id: newId, alt: editFormData.alt.trim() || editFormData.file.name, isBuiltin: false };
    } else if (editFormData.url && editFormData.url !== oldItemMeta.id) {
      // Ganti dengan URL baru
      if (oldItemMeta.id.startsWith("idb:")) {
        await idbDelete(oldItemMeta.id).catch(() => {});
      }
      updatedMetaItem = { id: editFormData.url.trim(), alt: editFormData.alt.trim() || "Foto Galeri TJKT", isBuiltin: true };
    }

    const nextMeta = [...meta];
    nextMeta[editingIdx] = updatedMetaItem;
    setMeta(nextMeta);

    setEditingIdx(null);
    setEditFormData({ file: null, url: "", alt: "" });
    setUploading(false);
  };

  const handleDelete = async (idx: number) => {
    if (!window.confirm("Yakin ingin menghapus foto ini dari galeri?")) return;
    const item = meta[idx];
    if (item.id.startsWith("idb:")) {
      await idbDelete(item.id).catch(() => {});
    }
    setMeta((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file && !formData.url) return;
    if (meta.length >= MAX_GALLERY) {
      setSaveError(`Galeri sudah penuh (maks. ${MAX_GALLERY} foto). Hapus dulu salah satu.`);
      return;
    }

    setUploading(true);
    setSaveError(null);

    let newMeta: GalleryMeta;

    if (formData.file) {
      // Baca sebagai Data URL asli (tanpa kompresi!) → simpan di IndexedDB
      const dataUrl = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result as string);
        reader.onerror = () => rej(reader.error);
        reader.readAsDataURL(formData.file!);
      });
      const id = genId();
      await idbPut(id, dataUrl);
      newMeta = { id, alt: formData.alt.trim() || formData.file.name, isBuiltin: false };
    } else {
      // URL eksternal
      newMeta = { id: formData.url.trim(), alt: formData.alt.trim() || "Foto Galeri TJKT", isBuiltin: true };
    }

    setMeta((prev) => [newMeta, ...prev].slice(0, MAX_GALLERY));
    setIsModalOpen(false);
    setFormData({ file: null, url: "", alt: "" });
    setUploading(false);
  };

  // ── UI helpers ─────────────────────────────────────────────────────────────

  const card = isDark
    ? "bg-[#121215] border-zinc-800/80 shadow-md"
    : "bg-white border-slate-200/80 shadow-sm";

  const inputCls = isDark
    ? "bg-[#09090b] border-zinc-800 text-white focus:border-emerald-500"
    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500";

  return (
    <div className="space-y-6">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${card}`}>
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <ImageIcon className="text-emerald-500" size={22} />
            Kelola Galeri Foto &amp; Fasilitas TJKT
          </h2>
          <p className={`text-xs mt-1 flex items-center gap-2 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
            <Database size={11} className="text-emerald-500" />
            Foto disimpan di IndexedDB — <strong>kualitas asli, tanpa kompresi</strong> &mdash;
            <span className={`font-semibold ml-1 ${meta.length >= MAX_GALLERY ? "text-rose-500" : "text-emerald-500"}`}>
              {meta.length}/{MAX_GALLERY} foto
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            if (meta.length >= MAX_GALLERY) {
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

      {/* ── ERROR BANNER ───────────────────────────────────────────── */}
      {saveError && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm font-medium">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>{saveError}</span>
          <button onClick={() => setSaveError(null)} className="ml-auto text-rose-400 hover:text-rose-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── GRID FOTO ──────────────────────────────────────────────── */}
      {loadingGallery && resolved.length === 0 ? (
        // Skeleton placeholders while loading
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: meta.length || 3 }).map((_, i) => (
            <div key={i} className={`border rounded-2xl overflow-hidden ${isDark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-slate-50"}`}>
              <div className={`h-44 animate-pulse ${isDark ? "bg-zinc-800" : "bg-slate-200"}`} />
              <div className={`p-3 border-t ${isDark ? "border-zinc-800" : "border-slate-100"}`}>
                <div className={`h-3 rounded-full w-2/3 animate-pulse ${isDark ? "bg-zinc-700" : "bg-slate-200"}`} />
              </div>
            </div>
          ))}
        </div>
      ) : resolved.length === 0 ? (
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
                    src={item.url}
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
                {/* HD badge */}
                {!meta[idx]?.isBuiltin && meta[idx]?.id.startsWith("idb:") && (
                  <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider backdrop-blur-sm">
                    HD ORIGINAL
                  </span>
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

      {/* ── MODAL TAMBAH FOTO ──────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl space-y-4 ${isDark ? "bg-[#18181b] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>

            {/* Modal Header */}
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

              {/* Upload File */}
              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Upload Foto dari Perangkat
                  <span className="ml-1 font-normal text-emerald-500">(kualitas asli, tanpa kompresi)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${isDark ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"}`}>
                    <Upload size={15} />
                    <span>{formData.file ? `${formData.file.name} ✓` : "Pilih File..."}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFormData((prev) => ({ ...prev, file: f, url: f ? "" : prev.url }));
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
                {formData.file && (
                  <p className="text-[10px] mt-1.5 text-emerald-500 font-semibold">
                    ✓ {(formData.file.size / 1024 / 1024).toFixed(2)} MB — disimpan HD di IndexedDB
                  </p>
                )}
              </div>

              {/* URL Input */}
              {!formData.file && (
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                    Atau URL/Link Gambar <span className="font-normal opacity-60">(opsional)</span>
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

              {/* Keterangan */}
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

              {/* Actions */}
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

      {/* ── MODAL EDIT FOTO ──────────────────────────────────────── */}
      {editingIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl space-y-4 ${isDark ? "bg-[#18181b] border-zinc-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>

            {/* Modal Header */}
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

              {/* Preview Foto Saat Ini */}
              {editPreviewUrl && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700">
                  <img
                    src={editPreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-md font-bold ${isDark ? "bg-zinc-900/80 text-zinc-300" : "bg-white/80 text-slate-600"}`}>
                    {editFormData.file ? "Preview Foto Baru" : "Foto Saat Ini"}
                  </span>
                </div>
              )}

              {/* Upload File Baru */}
              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                  Ganti Foto
                  <span className="ml-1 font-normal text-blue-500">(upload file baru atau isi URL)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${isDark ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"}`}>
                    <Upload size={15} />
                    <span>{editFormData.file ? `${editFormData.file.name} ✓` : "Pilih File Baru..."}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setEditFormData((prev) => ({ ...prev, file: f, url: f ? "" : prev.url }));
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {editFormData.file && (
                  <p className="text-[10px] mt-1.5 text-blue-500 font-semibold">
                    ✓ {(editFormData.file.size / 1024 / 1024).toFixed(2)} MB — akan disimpan HD di IndexedDB
                  </p>
                )}
              </div>

              {/* URL Baru */}
              {!editFormData.file && (
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}>
                    Atau URL/Link Gambar Baru <span className="font-normal opacity-60">(opsional)</span>
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

              {/* Keterangan */}
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

              {/* Actions */}
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

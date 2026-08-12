import React from "react";
import { Mail, MessageSquare, Trash2, User } from "lucide-react";

export interface MessageItemData {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  created_at?: string;
}

interface AdminMessagesProps {
  messages: MessageItemData[];
  onDeleteMessage?: (index: number) => void;
  theme?: "light" | "dark";
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ messages, onDeleteMessage, theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
          isDark
            ? "bg-[#121215] border-zinc-800/80 shadow-md"
            : "bg-white border-slate-200/80 shadow-sm"
        }`}
      >
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <Mail className="text-emerald-500" size={22} />
            Kotak Masuk Pesan & Pertanyaan PPDB
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
            Daftar pertanyaan dan pendaftaran dari pengunjung website
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          isDark
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : "bg-emerald-50 text-emerald-600 border-emerald-200"
        }`}>
          {messages.length} Pesan Masuk
        </span>
      </div>

      {messages.length === 0 ? (
        <div className={`p-12 rounded-2xl border text-center space-y-3 ${
          isDark ? "bg-[#121215] border-zinc-800/80 text-zinc-400" : "bg-white border-slate-200/80 text-slate-500"
        }`}>
          <MessageSquare size={36} className="mx-auto text-emerald-500/50" />
          <h4 className={`text-base font-bold ${isDark ? "text-zinc-200" : "text-slate-800"}`}>Belum Ada Pesan Masuk</h4>
          <p className="text-xs max-w-sm mx-auto">
            Pesan yang dikirimkan oleh pengunjung melalui formulir kontak di website akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border space-y-3 relative transition-all ${
                isDark
                  ? "bg-[#121215] border-zinc-800/80 shadow-md"
                  : "bg-white border-slate-200/80 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{item.name}</h4>
                    <p className={`text-xs ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{item.email || item.phone || "Pengunjung Web"}</p>
                  </div>
                </div>
                {onDeleteMessage && (
                  <button
                    onClick={() => onDeleteMessage(idx)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Hapus Pesan"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isDark
                  ? "bg-[#09090b] border-zinc-800/80 text-zinc-300"
                  : "bg-slate-50 border-slate-200/80 text-slate-800"
              }`}>
                "{item.message}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

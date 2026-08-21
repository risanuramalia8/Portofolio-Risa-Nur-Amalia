import React from "react";
import { X, Calendar, BookOpen, User, Award } from "lucide-react";
import { Article } from "../types";

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleDetailModal({ article, onClose }: ArticleDetailModalProps) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="detail-modal-container"
        className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 border border-[#E2E8F0]"
      >
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 border border-blue-500 text-white tracking-wider uppercase font-sans">
              Analisis Jurnal Risa Nur Amalia
            </span>
            <h3 className="font-sans text-lg font-bold text-white mt-1">
              Detail Artikel Ilmiah
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Article Identity Card */}
          <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <h1 className="text-base md:text-lg font-bold font-sans text-[#0F172A] leading-snug">
              {article.judul}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3.5 text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                {article.jurnal}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                Tahun {article.tahun}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#2563EB]" />
                {article.penulis}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Accreditation Badge */}
            <div className="border border-[#E2E8F0] rounded-lg p-4 bg-white shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1 font-sans">Status Kredibilitas</span>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm font-bold text-[#0F172A] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
                  {article.statusAkreditasi}
                </span>
              </div>
            </div>

            {/* Public Health Field */}
            <div className="border border-[#E2E8F0] rounded-lg p-4 bg-white shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1 font-sans">Fokus Bidang Keahlian</span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse"></div>
                <span className="text-sm font-bold text-[#2563EB]">
                  {article.fokusKeahlian}
                </span>
              </div>
            </div>
          </div>

          {/* Popular Abstract Summary */}
          <div className="border-l-4 border-[#2563EB] bg-[#F8FAFC] rounded-r-lg p-5">
            <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-2 font-sans">
              Ringkasan Populer (Untuk Pengunjung Web)
            </h4>
            <p className="text-slate-600 text-sm italic leading-relaxed">
              &ldquo;{article.abstrakSederhana}&rdquo;
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {article.kataKunci.map((t, i) => (
                <span key={i} className="text-[11px] font-semibold bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-2.5 py-0.5 rounded-full">
                  #{t.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-6 py-4 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-medium">Dieskstrak pada {new Date(article.extractedAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded transition-all cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
}

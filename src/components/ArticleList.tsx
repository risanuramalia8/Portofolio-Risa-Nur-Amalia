import React, { useState } from "react";
import { Search, Filter, BookOpen, Clock, AlertCircle, Trash2, ExternalLink, Calendar, Key, Award } from "lucide-react";
import { Article } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ArticleListProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
}

export default function ArticleList({ articles, onSelectArticle, onDeleteArticle }: ArticleListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<string>("All");
  const [selectedAccreditation, setSelectedAccreditation] = useState<string>("All");

  // Extract list of unique disciplines/focus fields and accreditations
  const foci = ["All", ...Array.from(new Set(articles.map(a => a.fokusKeahlian)))];
  const accreditations = ["All", "Scopus", "Sinta", "Lainnya"];

  // Perform client side search and filtering
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.jurnal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.penulis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.kataKunci.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFocus = selectedFocus === "All" || article.fokusKeahlian === selectedFocus;

    let matchesAccred = true;
    if (selectedAccreditation !== "All") {
      if (selectedAccreditation === "Scopus") {
        matchesAccred = article.statusAkreditasi.toLowerCase().includes("scopus");
      } else if (selectedAccreditation === "Sinta") {
        matchesAccred = article.statusAkreditasi.toLowerCase().includes("sinta");
      } else {
        matchesAccred = !article.statusAkreditasi.toLowerCase().includes("scopus") && 
                       !article.statusAkreditasi.toLowerCase().includes("sinta");
      }
    }

    return matchesSearch && matchesFocus && matchesAccred;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bento Card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
        <h3 className="font-sans text-base font-bold text-[#0F172A] border-b-2 border-[#E2E8F0] pb-2 uppercase tracking-wide text-xs">
          Telusuri & Filter Portofolio Publikasi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Field */}
          <div className="relative md:col-span-2">
            <input
              id="search-article-input"
              type="text"
              placeholder="Cari judul, jurnal, nama penulis, atau kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white transition-all text-slate-800"
            />
            <div className="absolute left-3.5 top-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Accreditations filter */}
          <div className="relative">
            <select
              id="select-accreditation-filter"
              value={selectedAccreditation}
              onChange={(e) => setSelectedAccreditation(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-slate-700 cursor-pointer"
            >
              <option value="All">Semua Akreditasi</option>
              <option value="Scopus">Hanya Terindeks Scopus</option>
              <option value="Sinta">Hanya Terakreditasi Sinta</option>
              <option value="Lainnya">Prosiding / Jurnal Nasional</option>
            </select>
          </div>
        </div>

        {/* Focus Areas Filter Tags */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-sans">Bidang Keahlian:</span>
          <div className="flex flex-wrap gap-1.5">
            {foci.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedFocus(f)}
                className={`text-xs px-3 py-1.5 rounded border font-semibold transition-all cursor-pointer ${
                  selectedFocus === f
                    ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                    : "bg-[#F1F5F9] border-[#CBD5E1] hover:border-slate-300 text-slate-600"
                }`}
              >
                {f === "All" ? "Semua Bidang" : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Title Count */}
      <div className="flex items-center justify-between">
        <h4 className="font-sans text-xs font-bold text-[#0F172A] uppercase tracking-wider">
          Koleksi Analisis ({filteredArticles.length} Jurnal Ditemukan)
        </h4>
        {filteredArticles.length < articles.length && (
          <button
            onClick={() => { setSearchTerm(""); setSelectedFocus("All"); setSelectedAccreditation("All"); }}
            className="text-xs text-[#2563EB] hover:underline font-bold"
          >
            Bersihkan filter
          </button>
        )}
      </div>

      {/* Article List Grid as bento cards */}
      <AnimatePresence mode="popLayout">
        {filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center bg-white rounded-xl border border-[#E2E8F0] text-slate-500 text-sm space-y-2"
          >
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">Tidak ada artikel yang cocok</p>
            <p className="text-xs text-slate-400">Silakan ubah kata kunci penelusuran Anda atau bersihkan filter di atas.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredArticles.map((article) => (
              <motion.div
                layout
                key={article.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#E2E8F0] hover:border-[#2563EB] rounded-xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-4 relative"
              >
                <div>
                  {/* Card Header metadata */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] uppercase tracking-wider font-sans">
                      {article.statusAkreditasi}
                    </span>
                    <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      {article.fokusKeahlian}
                    </span>
                  </div>

                  {/* Title & info */}
                  <h3 className="font-sans font-bold text-[#0F172A] leading-snug group-hover:text-[#2563EB] transition-colors mt-3 text-sm md:text-base line-clamp-2">
                    {article.url ? (
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline hover:text-[#2563EB] inline-flex items-center gap-1"
                        title="Buka publikasi ilmiah asli"
                      >
                        {article.judul}
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-blue-500 inline inline-block" />
                      </a>
                    ) : (
                      article.judul
                    )}
                  </h3>

                  <p className="text-xs text-slate-500 font-sans mt-2">
                    {article.penulis} &bull; <span className="italic">{article.jurnal}</span> ({article.tahun})
                  </p>

                  {/* Snippet of Popular summary */}
                  <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed border-l-4 border-[#2563EB] bg-[#F8FAFC] p-3 rounded-r-lg italic">
                    {article.abstrakSederhana.substring(0, 150)}...
                  </p>

                  {/* Keywords tag bubble */}
                  <div className="flex flex-wrap gap-1 mt-3.5">
                    {article.kataKunci.slice(0, 3).map((keyword, idx) => (
                      <span key={idx} className="text-[9px] font-semibold bg-[#F1F5F9] border border-[#E2E8F0] text-slate-600 px-1.5 py-0.5 rounded-full">
                        #{keyword.trim()}
                      </span>
                    ))}
                    {article.kataKunci.length > 3 && (
                      <span className="text-[9px] font-semibold bg-[#F1F5F9] border border-[#E2E8F0] text-slate-500 px-1 py-0.5 rounded-full">
                        +{article.kataKunci.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer interactive buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] mt-4 text-xs font-semibold gap-2">
                  <span className="text-[10px] text-slate-400 font-normal font-sans">
                    {new Date(article.extractedAt).toLocaleDateString('id-ID', {month: 'short', day: 'numeric'})}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteArticle(article.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                      title="Hapus Jurnal dari Portofolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectArticle(article)}
                      className="flex items-center gap-1 bg-[#0F172A] hover:bg-[#1E293B] text-white px-3.5 py-2.5 rounded text-xs transition-all cursor-pointer font-bold"
                    >
                      Detail Artikel Ilmiah
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

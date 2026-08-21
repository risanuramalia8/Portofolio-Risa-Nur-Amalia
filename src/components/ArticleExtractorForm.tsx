import React, { useState } from "react";
import { Link, ClipboardCopy, ArrowRight, Sparkles, Loader2, Info } from "lucide-react";

interface ArticleExtractorFormProps {
  onExtract: (payload: { url?: string; text?: string }) => Promise<void>;
  isExtracting: boolean;
}

export default function ArticleExtractorForm({ onExtract, isExtracting }: ArticleExtractorFormProps) {
  const [activeTab, setActiveTab] = useState<"url" | "text">("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [errorLocal, setErrorLocal] = useState("");

  const sampleUrls = [
    { name: "Sinta/Neliti: Gizi Balita", url: "https://www.neliti.com/publications/354182/hubungan-literasi-kesehatan-ibu-dengan-status-gizi-balita" },
    { name: "PubMed: Maternal Care", url: "https://pubmed.ncbi.nlm.nih.gov/34291845/" }
  ];

  const sampleAbstrak = `Abstrak: Masa balita merupakan masa kritis tumbuh kembang di mana stunting menjadi isu prioritas kesehatan nasional di Indonesia. Penelitian kuantitatif asosiatif ini bertujuan menganalisis korelasi langsung antara tingkat literasi kesehatan gizi ibu asuh dengan status stunting anak di wilayah kerja Puskesmas Gandus, Palembang. Sampel terdiri dari 120 pasang ibu-balita yang diambil menggunakan teknik stratifikasi acak. Tingkat literasi ibu diukur memakai kuesioner terstandar HLS-EU-Q47 versi adaptasi gizi balita, sementara tinggi badan anak diukur berkala sebagai nilai Z-score TB/U. Analisis statistik regresi logistik ganda mengungkapkan ibu dengan literasi kesehatan kategori 'Sangat Kurang' berisiko 3.8 kali lipat memiliki balita dengan status stunting dibandingkan ibu berliterasi sedang/tinggi (p = 0.003, CI 95% = 1.6 - 9.2). Ditambah lagi, kepatuhan pemberian Air Susu Ibu (ASI) eksklusif 6 bulan pertama bertindak sebagai variabel mediator kuat. Disimpulkan bahwa peningkatan indeks literasi nutrisi maternal secara signifikan mencegah keterlambatan tinggi badan anak, yang mengindikasikan pentingnya program intervensi terstruktur dan edukasi promotif gizi tingkat desa secara kolaboratif.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal("");

    if (activeTab === "url") {
      if (!urlInput.trim()) {
        setErrorLocal("Mohon masukkan URL artikel jurnal ilmiah terlebih dahulu.");
        return;
      }
      if (!urlInput.startsWith("http://") && !urlInput.startsWith("https://")) {
        setErrorLocal("Format URL harus dimulai dengan http:// atau https://");
        return;
      }
      onExtract({ url: urlInput.trim() });
    } else {
      if (!textInput.trim() || textInput.length < 50) {
        setErrorLocal("Mohon masukkan teks abstrak lengkap (minimal 50 karakter) untuk dianalisis.");
        return;
      }
      onExtract({ text: textInput.trim() });
    }
  };

  const loadSampleUrl = (url: string) => {
    setUrlInput(url);
    setErrorLocal("");
  };

  const loadSampleAbstract = () => {
    setTextInput(sampleAbstrak);
    setErrorLocal("");
  };

  return (
    <div id="extraction-input-card" className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 mb-8 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#2563EB]" />
          <h2 className="font-sans text-lg font-bold text-[#0F172A]">
            Ekstraksi Jurnal Baru via AI
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-sans">Didukung Gemini 3.5-Flash</span>
      </div>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Masukkan tautan artikel atau salin langsung teks abstrak jurnal (layanan paywall). AI akan merangkum dengan bahasa populer untuk pengunjung website Anda serta memformat data mentah siap dimasukkan ke database WordPress.
      </p>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-[#E2E8F0] mb-6">
        <button
          id="btn-tab-url"
          type="button"
          onClick={() => { setActiveTab("url"); setErrorLocal(""); }}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold transition-all relative ${
            activeTab === "url" 
              ? "text-[#2563EB] border-b-2 border-[#2563EB]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Link className="w-4 h-4" />
          Tautan URL Artikel Jurnal
        </button>
        <button
          id="btn-tab-text"
          type="button"
          onClick={() => { setActiveTab("text"); setErrorLocal(""); }}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold transition-all relative ${
            activeTab === "text" 
              ? "text-[#2563EB] border-b-2 border-[#2563EB]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ClipboardCopy className="w-4 h-4" />
          Teks Abstrak Kasus Paywall
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "url" ? (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider font-sans">
              Tautan URL Jurnal (Garuda/Sinta/Neliti/PubMed/dsb)
            </label>
            <div className="relative">
              <input
                id="input-url-field"
                type="text"
                placeholder="https://example-journal.org/article/view/1234..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isExtracting}
                className="w-full pl-4 pr-12 py-3 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              <div className="absolute right-3.5 top-3.5 text-slate-400">
                <Link className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Helper Samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <span className="text-xs text-slate-400">Gunakan Contoh:</span>
              {sampleUrls.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSampleUrl(s.url)}
                  disabled={isExtracting}
                  className="text-xs px-2.5 py-1 rounded bg-[#F1F5F9] hover:bg-[#E2E8F0] text-slate-700 border border-[#CBD5E1] hover:border-slate-300 transition-colors cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider font-sans">
              Salin Teks Abstrak Asli (Bahasa Indonesia / Inggris)
            </label>
            <textarea
              id="input-abstract-field"
              rows={5}
              placeholder="Sematkan teks abstrak jurnal yang bermasalah paywall di sini..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isExtracting}
              className="w-full p-4 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-sans"
            />
            {/* Quick Helper Default Abstract */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-slate-400">Punya jurnal terkunci paywall? Gunakan teks tiruan</span>
              <button
                type="button"
                onClick={loadSampleAbstract}
                disabled={isExtracting}
                className="text-xs px-3 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-slate-700 border border-[#CBD5E1] hover:border-slate-300 transition-colors cursor-pointer rounded"
              >
                Muat Contoh Abstrak (Kasus Stunting)
              </button>
            </div>
          </div>
        )}

        {errorLocal && (
          <div className="flex items-start gap-2 text-rose-600 bg-rose-50 border border-rose-100 p-3.5 rounded-lg text-xs">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorLocal}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            id="btn-submit-extract"
            type="submit"
            disabled={isExtracting}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm px-5 py-3 rounded-lg active:scale-[0.98] transition-all duration-150 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mencari & Menganalisis Paper...
              </>
            ) : (
              <>
                Analisis Kredibilitas Jurnal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { Article } from "../types";
import { 
  FileText, Plus, Edit2, Check, X, RefreshCw, Trash2, 
  ExternalLink, Save, BookOpen, AlertCircle, Info, ToggleLeft
} from "lucide-react";

interface ScientificCollectionManagerProps {
  articles: Article[];
  onSaveArticles: (updatedList: Article[]) => void;
  onResetArticles: () => void;
}

export default function ScientificCollectionManager({ 
  articles, 
  onSaveArticles, 
  onResetArticles 
}: ScientificCollectionManagerProps) {
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form States
  const [formJudul, setFormJudul] = useState("");
  const [formJurnal, setFormJurnal] = useState("");
  const [formTahun, setFormTahun] = useState("");
  const [formPenulis, setFormPenulis] = useState("");
  const [formStatusAkreditasi, setFormStatusAkreditasi] = useState("");
  const [formFokusKeahlian, setFormFokusKeahlian] = useState("");
  const [formAbstrakSederhana, setFormAbstrakSederhana] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formKataKunci, setFormKataKunci] = useState("");

  const [notification, setNotification] = useState("");

  // Start Editing
  const handleStartEdit = (article: Article) => {
    setEditingArticleId(article.id);
    setIsAddingNew(false);

    setFormJudul(article.judul);
    setFormJurnal(article.jurnal);
    setFormTahun(article.tahun);
    setFormPenulis(article.penulis);
    setFormStatusAkreditasi(article.statusAkreditasi);
    setFormFokusKeahlian(article.fokusKeahlian);
    setFormAbstrakSederhana(article.abstrakSederhana);
    setFormUrl(article.url || "");
    setFormKataKunci(article.kataKunci.join(", "));
  };

  // Start Adding New
  const handleStartAdd = () => {
    setEditingArticleId(null);
    setIsAddingNew(true);

    setFormJudul("");
    setFormJurnal("");
    setFormTahun(new Date().getFullYear().toString());
    setFormPenulis("Risa Nur Amalia");
    setFormStatusAkreditasi("SINTA 3");
    setFormFokusKeahlian("Intervensi Stunting & Gizi Anak");
    setFormAbstrakSederhana("");
    setFormUrl("");
    setFormKataKunci("Ketahanan Pangan, Stunting");
  };

  // Save changes
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    const commaKeywords = formKataKunci
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (isAddingNew) {
      // Create new article
      const newArticle: Article = {
        id: `manual-art-${Date.now()}`,
        judul: formJudul,
        jurnal: formJurnal,
        tahun: formTahun,
        penulis: formPenulis,
        statusAkreditasi: formStatusAkreditasi,
        fokusKeahlian: formFokusKeahlian,
        abstrakSederhana: formAbstrakSederhana,
        url: formUrl || undefined,
        kataKunci: commaKeywords,
        extractedAt: new Date().toISOString(),
        markdownOutput: `### DATA MANUAL ARTIKEL
* **Judul Artikel:** ${formJudul}
* **Nama Jurnal:** ${formJurnal}
* **Tahun Terbit:** ${formTahun}
* **Penulis:** ${formPenulis}
* **Status Akreditasi:** ${formStatusAkreditasi}
* **Link:** ${formUrl || "Tidak dicantumkan"}

### RINGKASAN POPULER
* **Abstrak Singkat:** ${formAbstrakSederhana}
* **Kata Kunci:** ${commaKeywords.join(", ")}`
      };

      const updated = [newArticle, ...articles];
      onSaveArticles(updated);
      setIsAddingNew(false);
      showNotification("Berhasil menambahkan artikel ilmiah baru");
    } else if (editingArticleId) {
      // Update existing article
      const updated = articles.map((article) => {
        if (article.id === editingArticleId) {
          return {
            ...article,
            judul: formJudul,
            jurnal: formJurnal,
            tahun: formTahun,
            penulis: formPenulis,
            statusAkreditasi: formStatusAkreditasi,
            fokusKeahlian: formFokusKeahlian,
            abstrakSederhana: formAbstrakSederhana,
            url: formUrl || undefined,
            kataKunci: commaKeywords,
            markdownOutput: `### DATA EDIT ARTIKEL
* **Judul Artikel:** ${formJudul}
* **Nama Jurnal:** ${formJurnal}
* **Tahun Terbit:** ${formTahun}
* **Penulis:** ${formPenulis}
* **Status Akreditasi:** ${formStatusAkreditasi}
* **Link:** ${formUrl || "Tidak dicantumkan"}

### RINGKASAN POPULER
* **Abstrak Singkat:** ${formAbstrakSederhana}
* **Kata Kunci:** ${commaKeywords.join(", ")}`
          };
        }
        return article;
      });

      onSaveArticles(updated);
      setEditingArticleId(null);
      showNotification("Berhasil menyimpan perubahan artikel ilmiah");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini dari koleksi ilmiah?")) {
      const updated = articles.filter(a => a.id !== id);
      onSaveArticles(updated);
      showNotification("Artikel berhasil dihapus dari daftar");
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleCancel = () => {
    setEditingArticleId(null);
    setIsAddingNew(false);
  };

  return (
    <div id="scientific-collection-workspace" className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-8">
      {/* Container Header */}
      <div className="bg-[#0F172A] text-white p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h2 className="font-sans text-sm font-extrabold uppercase tracking-wider text-white">
            Kelola Daftar / Koleksi Publikasi Ilmiah Anda
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStartAdd}
            disabled={isAddingNew}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Artikel ManuaL
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (confirm("Apakah Anda ingin mengatur ulang database tulisan ilmiah ke artikel default bawaan? Tindakan ini akan menghapus entri kustom atau hasil ekstraksi baru Anda.")) {
                onResetArticles();
                showNotification("Seluruh koleksi di-reset ke artikel standar");
              }
            }}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded border border-slate-750 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Koleksi
          </button>
        </div>
      </div>

      <div className="p-6">
        {notification && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-bold rounded flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-600" />
            {notification}
          </div>
        )}

        {/* Input/Edit Form Panel */}
        {(isAddingNew || editingArticleId) && (
          <form onSubmit={handleSaveForm} className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5 font-sans">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                {isAddingNew ? "Form Tambah Artikel Ilmiah Baru" : "Form Ubah/Edit Rincian Artikel Ilmiah"}
              </span>
              <button 
                type="button" 
                onClick={handleCancel}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Judul */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Judul Artikel Jurnal</label>
                <input 
                  type="text" 
                  value={formJudul} 
                  onChange={e => setFormJudul(e.target.value)} 
                  required 
                  placeholder="Ketikkan judul lengkap artikel ilmiah" 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>

              {/* Jurnal */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nama Jurnal Penerbit</label>
                <input 
                  type="text" 
                  value={formJurnal} 
                  onChange={e => setFormJurnal(e.target.value)} 
                  required 
                  placeholder="cth: Syntax Literate : Jurnal Ilmiah Indonesia" 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>

              {/* Penulis */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Penulis (Author)</label>
                <input 
                  type="text" 
                  value={formPenulis} 
                  onChange={e => setFormPenulis(e.target.value)} 
                  required 
                  placeholder="cth: Risa Nur Amalia" 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>

              {/* Tahun */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tahun Publikasi</label>
                <input 
                  type="text" 
                  value={formTahun} 
                  onChange={e => setFormTahun(e.target.value)} 
                  required 
                  placeholder="cth: 2025" 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>

              {/* Status Akreditasi */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Akreditasi / Indeks</label>
                <input 
                  type="text" 
                  value={formStatusAkreditasi} 
                  onChange={e => setFormStatusAkreditasi(e.target.value)} 
                  required 
                  placeholder="cth: SINTA 3, Scopus Q4, atau Prosiding" 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>

              {/* Fokus Keahlian */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fokus Bidang Keahlian</label>
                <input 
                  type="text" 
                  value={formFokusKeahlian} 
                  onChange={e => setFormFokusKeahlian(e.target.value)} 
                  required 
                  placeholder="cth: Intervensi Stunting & Gizi Anak" 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Link Akses Artikel (URL)</label>
                <input 
                  type="url" 
                  value={formUrl} 
                  onChange={e => setFormUrl(e.target.value)} 
                  placeholder="https://..." 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>

              {/* Kata Kunci */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kata Kunci (Pisahkan dengan koma)</label>
                <input 
                  type="text" 
                  value={formKataKunci} 
                  onChange={e => setFormKataKunci(e.target.value)} 
                  required 
                  placeholder="cth: Stunting, Ketahanan Pangan, Gizi Anak, Daun Kelor" 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>

              {/* Abstrak Sederhana */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ringkasan Populer / Abstrak Sederhana</label>
                <textarea 
                  value={formAbstrakSederhana} 
                  onChange={e => setFormAbstrakSederhana(e.target.value)} 
                  required 
                  rows={3}
                  placeholder="Uraikan ringkasan sederhana dalam bahasa populer yang mudah dipahami pengunjung umum." 
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-sans text-slate-800"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold uppercase rounded cursor-pointer transition-all"
              >
                Batal
              </button>
              
              <button 
                type="submit"
                className="flex items-center gap-1 px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase rounded cursor-pointer transition-all shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Koleksi Artikel
              </button>
            </div>
          </form>
        )}

        {/* Existing Articles Table Listing */}
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="p-3.5">Judul & Identitas Jurnal</th>
                <th className="p-3.5 w-[140px]">Akreditasi</th>
                <th className="p-3.5 w-[180px]">Bidang Kepakaran</th>
                <th className="p-3.5 w-[120px] text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {articles.map((article) => (
                <tr 
                  key={article.id} 
                  className={`hover:bg-slate-50 transition-all ${
                    editingArticleId === article.id ? "bg-blue-50/50" : ""
                  }`}
                >
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 text-xs font-sans line-clamp-1">
                        {article.judul}
                      </div>
                      
                      <div className="text-[11px] text-slate-400 font-medium">
                        Penulis: <span className="text-slate-600">{article.penulis}</span> &bull; 
                        Jurnal: <span className="text-slate-600 italic">{article.jurnal}</span> ({article.tahun})
                      </div>
                      
                      {article.url && (
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] text-[#2563EB] hover:underline font-semibold inline-flex items-center gap-0.5"
                        >
                          Link Akses: {article.url.substring(0, 45)}...
                          <ExternalLink className="w-2.5 h-2.5 inline" />
                        </a>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 border border-green-150 text-green-700">
                      {article.statusAkreditasi}
                    </span>
                  </td>
                  
                  <td className="p-3.5">
                    <span className="text-slate-600 font-semibold text-[11px]">
                      {article.fokusKeahlian}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex justify-end gap-1.5Packed">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(article)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                        title="Edit rincian data ilmiah"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-all cursor-pointer"
                        title="Hapus artikel ilmiah"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {articles.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                    Belum ada artikel ilmiah yang diunggah ke koleksi. Silakan tambah manual atau pakai Ekstraktor AI di bawah!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-[11px] text-slate-400 flex items-start gap-1.5 leading-normal bg-slate-50 p-3 rounded-lg border border-slate-100">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Setiap perubahan, penambahan, atau pengeditan publikasi di atas tersimpan langsung ke database lokal portofolio. Anda dapat melihat hasil perubahan secara dinamis tanpa melupakan status sinkronisasi WordPress.
          </span>
        </div>
      </div>
    </div>
  );
}

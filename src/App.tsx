/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DEFAULT_ARTICLES } from "./data/defaultArticles";
import { Article } from "./types";
import ResearcherProfile, { ProfileData } from "./components/ResearcherProfile";
import ArticleExtractorForm from "./components/ArticleExtractorForm";
import BackendAdminForm from "./components/BackendAdminForm";
import ArticleList from "./components/ArticleList";
import ArticleDetailModal from "./components/ArticleDetailModal";
import ScientificCollectionManager from "./components/ScientificCollectionManager";
import PublicationChart from "./components/PublicationChart";
import AdminLogin from "./components/AdminLogin";
import { Sparkles, GraduationCap, AlertCircle, RefreshCw, Eye, Settings, LogOut, Lock } from "lucide-react";

const DEFAULT_PROFILE: ProfileData = {
  name: "Risa Nur Amalia, S.KM., M.K.M",
  title: "Akademisi",
  bio: "Bidang Keahlian: Promosi Kesehatan",
  email: "risanuramalia8@gmail.com",
  unit: "Poltekkes Kemenkes Palembang",
  sintaUrl: "https://sinta.kemdiktisaintek.go.id/authors/profile/6973719",
  scopusUrl: "https://www.scopus.com/pages/authors/59417230600",
  orcidUrl: "https://orcid.org/0009-0003-2208-6984"
};

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("risa_research_portfolio_logged_in") === "true";
  });
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [activeMode, setActiveMode] = useState<"public" | "backend">("public");
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // Initialize and load articles list from localStorage, default back to hydrated dataset
  useEffect(() => {
    const savedArticles = localStorage.getItem("risa_research_portfolio_articles");
    if (savedArticles) {
      try {
        const parsed = JSON.parse(savedArticles);
        if (Array.isArray(parsed) && parsed.length < 9) {
          // Force reset to new DEFAULT_ARTICLES from PDF
          setArticles(DEFAULT_ARTICLES);
          localStorage.setItem("risa_research_portfolio_articles", JSON.stringify(DEFAULT_ARTICLES));
        } else {
          setArticles(parsed);
        }
      } catch (e) {
        setArticles(DEFAULT_ARTICLES);
      }
    } else {
      setArticles(DEFAULT_ARTICLES);
      localStorage.setItem("risa_research_portfolio_articles", JSON.stringify(DEFAULT_ARTICLES));
    }

    const savedProfile = localStorage.getItem("risa_research_portfolio_profile");
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (e) {
        setProfileData(DEFAULT_PROFILE);
      }
    } else {
      setProfileData(DEFAULT_PROFILE);
      localStorage.setItem("risa_research_portfolio_profile", JSON.stringify(DEFAULT_PROFILE));
    }
  }, []);

  // Save changes block to localStorage when updated
  const saveArticles = (updatedList: Article[]) => {
    setArticles(updatedList);
    localStorage.setItem("risa_research_portfolio_articles", JSON.stringify(updatedList));
  };

  const handleSaveProfile = (updatedProfile: ProfileData) => {
    setProfileData(updatedProfile);
    localStorage.setItem("risa_research_portfolio_profile", JSON.stringify(updatedProfile));
    setSuccessToast("Profil peneliti berhasil diperbarui secara permanen.");
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleResetProfileToDefault = () => {
    setProfileData(DEFAULT_PROFILE);
    localStorage.setItem("risa_research_portfolio_profile", JSON.stringify(DEFAULT_PROFILE));
    setSuccessToast("Profil berhasil di-reset ke data bawaan CV.");
    setTimeout(() => setSuccessToast(""), 3000);
  };

  // Perform Gemini AI Extraction via backend proxy
  const handleExtract = async (payload: { url?: string; text?: string }) => {
    setIsExtracting(true);
    setErrorMessage("");
    setSuccessToast("");

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mengomunikasikan permintaan ekstraksi ke server AI.");
      }

      const newArticle: Article = {
        ...result.article,
        id: `art-${Date.now()}`,
        extractedAt: new Date().toISOString(),
      };

      const updatedArticles = [newArticle, ...articles];
      saveArticles(updatedArticles);
      setSelectedArticle(newArticle); // Auto-open the WordPress exporter for instant copy
      setSuccessToast(`Berhasil mengekstrak artikel baru: "${newArticle.judul.substring(0, 40)}..."`);
      
      // Clear success toast after 4s
      setTimeout(() => setSuccessToast(""), 4000);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Terdapat kendala jaringan atau kesalahan sistem kueri.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel jurnal ini dari portofolio Anda?")) {
      const updated = articles.filter((a) => a.id !== id);
      saveArticles(updated);
      setSuccessToast("Artikel berhasil dihapus dari portofolio.");
      setTimeout(() => setSuccessToast(""), 3000);
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Apakah Anda ingin mereset portofolio ke data bawaan? Tindakan ini akan menghapus entri kustom baru.")) {
      saveArticles(DEFAULT_ARTICLES);
      setSuccessToast("Pangkalan data berhasil di-reset ke data bawaan CV.");
      setTimeout(() => setSuccessToast(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-12">
      {/* Professional top line */}
      <div className="h-1 w-full bg-[#2563EB]"></div>

      {/* Main navigation / brand header matching "Professional Polish" */}
      <nav className="bg-[#0F172A] text-white py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-blue-600 text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block -mb-0.5">Academic Web Portal</span>
            <span className="text-base font-extrabold tracking-tight text-white">{profileData.name}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Quick Stats Summary Badge on Header */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded border border-slate-700">
            <span className="font-bold text-white">{articles.length}</span> Publikasi
            <span className="text-slate-500">|</span> 
            <span className="font-bold text-white">{articles.filter(a => a.statusAkreditasi.toLowerCase().includes("scopus")).length}</span> Scopus
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-300">
            <div className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center font-bold text-xs text-white border border-slate-600">
              RNA
            </div>
          </div>
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                setActiveMode("backend");
                setErrorMessage("");
              }}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold px-2.5 py-1.5 hover:bg-slate-800 rounded border border-slate-700 transition-all cursor-pointer"
              title="Masuk ke Panel Admin"
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Login Admin
            </button>
          ) : (
            <>
              {activeMode === "backend" && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1 text-xs text-rose-300 hover:text-white font-semibold px-2.5 py-1.5 hover:bg-slate-800 rounded border border-rose-950 transition-all cursor-pointer"
                  title="Kembalikan data ke artikel bawaan Risa"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
                  Reset Data Bawaan
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsLoggedIn(false);
                  localStorage.removeItem("risa_research_portfolio_logged_in");
                  setActiveMode("public");
                  setSuccessToast("Berhasil keluar dari panel administrator.");
                  setTimeout(() => setSuccessToast(""), 3000);
                }}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-rose-400 font-semibold px-2.5 py-1.5 hover:bg-slate-800 rounded border border-slate-700 transition-all cursor-pointer"
                title="Keluar dari sesi administrator"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                Keluar Admin
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mode Switch Panel Tab Block - Highly Interactive & Distinctive */}
      {isLoggedIn && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6">
          <div className="bg-white border border-[#E2E8F0] p-1.5 rounded-xl flex items-center gap-1 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveMode("public")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeMode === "public"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-50"
              }`}
            >
              <Eye className="w-4 h-4" />
              Tampilan Portofolio Publik
            </button>
            
            <button
              type="button"
              onClick={() => {
                setActiveMode("backend");
                setErrorMessage("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeMode === "backend"
                  ? "bg-[#0F172A] text-white shadow-xs"
                  : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-50"
              }`}
            >
              <Settings className="w-4 h-4 text-blue-500" />
              Panel Admin WordPress (Backend)
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 font-sans">
        
        {/* Alerts and success popups */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-250 rounded-lg text-xs text-rose-750 flex items-start gap-2.5 animate-in slide-in-from-top-4 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-800">Gagal Melakukan Ekstraksi Jurnal</p>
              <p className="leading-relaxed">{errorMessage}</p>
              <p className="text-[10px] text-rose-600 pt-1 font-mono">Pastikan GEMINI_API_KEY Anda sudah terkonfigurasi pada opsi 'Settings &gt; Secrets'. Jika jurnal paywalled, salin teks abstraknya langsung di tab kedua.</p>
            </div>
          </div>
        )}

        {successToast && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-250 rounded-lg text-xs text-emerald-800 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-150 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="font-bold">{successToast}</p>
          </div>
        )}

        {/* Admin Dashboard Workspace Mode */}
        {activeMode === "backend" ? (
          !isLoggedIn ? (
            <AdminLogin
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                localStorage.setItem("risa_research_portfolio_logged_in", "true");
                setSuccessToast("Berhasil masuk. Sesi administrator aktif.");
                setTimeout(() => setSuccessToast(""), 3500);
              }}
              onCancel={() => {
                setActiveMode("public");
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg text-sm text-slate-705">
                <span className="font-bold block text-blue-900 mb-0.5">Sesi Admin Aktif</span>
                Gunakan panel ini untuk mengedit biografi peneliti, mengonfigurasi tautan SINTA dan Scopus Anda, serta melakukan ekstraksi publikasi ilmiah baru langsung ke pangkalan data Anda.
              </div>

              {/* A. Profile Bio Editor Form */}
              <BackendAdminForm 
                profileData={profileData}
                onSaveProfile={handleSaveProfile}
                onResetToDefaultProfile={handleResetProfileToDefault}
              />

              {/* B. Scientific Publications Manager (Add, Edit, Reset, Save, Delete) */}
              <ScientificCollectionManager
                articles={articles}
                onSaveArticles={saveArticles}
                onResetArticles={() => {
                  saveArticles(DEFAULT_ARTICLES);
                }}
              />

              {/* D. Paper Extraction UI */}
              <ArticleExtractorForm onExtract={handleExtract} isExtracting={isExtracting} />
              
              {/* Live Preview Indicator for ease of use */}
              <div className="pt-4 text-center flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveMode("public")}
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  &larr; Kembali ke Tampilan Publik untuk melihat perubahan
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(false);
                    localStorage.removeItem("risa_research_portfolio_logged_in");
                    setActiveMode("public");
                    setSuccessToast("Berhasil keluar dari panel administrator.");
                    setTimeout(() => setSuccessToast(""), 3000);
                  }}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Keluar Admin &larr;
                </button>
              </div>
            </div>
          )
        ) : (
          /* Public Portfolio View Mode */
          <div className="space-y-6">
            {/* 1. Profile Header Statistics */}
            <ResearcherProfile articles={articles} profileData={profileData} />

            {/* 2. Publication-by-year Chart Graphic */}
            <PublicationChart articles={articles} />

            {/* 3. Direct warning highlighting extraction is tucked in Backend */}
            {isLoggedIn && (
              <div className="bg-slate-100/70 p-3 rounded-lg text-xs text-slate-500 border border-slate-200/50 flex justify-between items-center gap-4">
                <span>Ingin menambahkan publikasi baru atau mengedit artikel ilmiah? Silakan klik tombol Admin.</span>
                <button
                  type="button"
                  onClick={() => setActiveMode("backend")}
                  className="text-xs font-bold text-[#2563EB] whitespace-nowrap hover:underline"
                >
                  Ke Menu Admin &rarr;
                </button>
              </div>
            )}

            {/* 4. Search and Portfolio lists */}
            <ArticleList 
              articles={articles} 
              onSelectArticle={setSelectedArticle}
              onDeleteArticle={handleDeleteArticle}
            />
          </div>
        )}

      </main>

      {/* Floating Detail and Custom Exporter Modal */}
      {selectedArticle && (
        <ArticleDetailModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {/* Clean elegant public footer with no telemetry clutter */}
      <footer className="mt-16 text-center text-xs text-slate-500 font-sans border-t border-slate-200 pt-8 max-w-6xl mx-auto px-6">
        <p>© 2026 Portofolio Akademisi {profileData.name} (Poltekkes Kemenkes Palembang). Hubungi via email di {profileData.email}</p>
      </footer>
    </div>
  );
}

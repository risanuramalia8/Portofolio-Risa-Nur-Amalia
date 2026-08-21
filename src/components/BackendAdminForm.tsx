import React, { useState } from "react";
import { ProfileData } from "./ResearcherProfile";
import { User, Settings, Link as LinkIcon, RefreshCw, Save, Mail, Award, BookOpen, Camera, Upload, Trash2 } from "lucide-react";

interface BackendAdminFormProps {
  profileData: ProfileData;
  onSaveProfile: (data: ProfileData) => void;
  onResetToDefaultProfile: () => void;
}

export default function BackendAdminForm({ profileData, onSaveProfile, onResetToDefaultProfile }: BackendAdminFormProps) {
  const [name, setName] = useState(profileData.name);
  const [title, setTitle] = useState(profileData.title);
  const [unit, setUnit] = useState(profileData.unit);
  const [email, setEmail] = useState(profileData.email);
  const [bio, setBio] = useState(profileData.bio);
  const [sintaUrl, setSintaUrl] = useState(profileData.sintaUrl);
  const [scopusUrl, setScopusUrl] = useState(profileData.scopusUrl);
  const [orcidUrl, setOrcidUrl] = useState(profileData.orcidUrl);
  const [avatarUrl, setAvatarUrl] = useState(profileData.avatarUrl || "");
  
  const [isSaved, setIsSaved] = useState(false);

  // Keep state matching whenever props change
  React.useEffect(() => {
    setName(profileData.name);
    setTitle(profileData.title);
    setUnit(profileData.unit);
    setEmail(profileData.email);
    setBio(profileData.bio);
    setSintaUrl(profileData.sintaUrl);
    setScopusUrl(profileData.scopusUrl);
    setOrcidUrl(profileData.orcidUrl);
    setAvatarUrl(profileData.avatarUrl || "");
  }, [profileData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      title,
      bio,
      email,
      unit,
      sintaUrl,
      scopusUrl,
      orcidUrl,
      avatarUrl: avatarUrl || undefined
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-8">
      {/* Admin Panel Header */}
      <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500 animate-spin-slow" />
          <h2 className="font-sans text-sm font-extrabold uppercase tracking-wider text-white">
            Konfigurasi Profil Peneliti & Link Akun Ilmiah
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Apakah Anda yakin ingin mengatur ulang profil ke data bawaan Risa Nur Amalia yang terunduh dari CV?")) {
              onResetToDefaultProfile();
            }
          }}
          className="flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Profil CV
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Profile Info Sub-Header */}
        <div>
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-4">
            <User className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wide text-[#0F172A]">
              1. Identitas & Informasi Akademisi
            </h3>
          </div>

          {/* Foto Profil Selector & Uploader */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 relative">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Review Foto Profil" 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-blue-500 shadow-sm bg-white"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-500 font-bold font-sans text-xl">
                  {name ? name.substring(0, 2).toUpperCase() : "RN"}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border border-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="grow space-y-3 w-full text-center md:text-left">
              <span className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider font-sans">
                Unggah Foto Profil Akademisi Baru
              </span>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {/* File input button wrapper */}
                <label className="flex items-center gap-1.5 justify-center bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-[#BFDBFE] text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  Unggah File Gambar
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl("")}
                    className="flex items-center gap-1.5 justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Gambar
                  </button>
                )}
              </div>

              {/* Direct image link option */}
              <div className="space-y-1 text-left">
                <span className="block text-[10px] text-slate-400 font-medium font-sans">Atau tempel tautan/link URL gambar langsung:</span>
                <input 
                  type="url" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="cth: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2 atau link gambar Anda"
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-700 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                Nama Lengkap & Gelar
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Risa Nur Amalia, S.KM., M.K.M"
                required
                className="w-full px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white text-slate-800 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                Status / Peran Utama
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="cth: Akademisi & Peneliti Utama"
                required
                className="w-full px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white text-slate-800 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                Unit / Satuan Kerja / Departemen
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="cth: Poltekkes Kemenkes Palembang"
                required
                className="w-full px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white text-slate-800 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                Alamat Email Aktif
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cth: risanuramalia8@gmail.com"
                required
                className="w-full px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white text-slate-800 font-sans"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                Ringkasan Biografi / Kepakaran Riset
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tuliskan biografi singkat Anda di sini..."
                required
                className="w-full px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white text-slate-800 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Links Sub-Section */}
        <div>
          <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2 mb-4">
            <LinkIcon className="w-4 h-4 text-[#2563EB]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wide text-[#0F172A]">
              2. Google, SINTA, SCOPUS & ORCID Short Links (Tampilkan Gambar/Badge)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Sinta URL */}
            <div className="space-y-1.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block"></span>
                <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider font-sans">
                  SINTA Kemdikbud Link
                </label>
              </div>
              <input
                type="url"
                value={sintaUrl}
                onChange={(e) => setSintaUrl(e.target.value)}
                placeholder="https://sinta.kemdikbud.go.id/authors/profile/..."
                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white text-slate-800 font-mono"
              />
              <span className="text-[10px] text-slate-400 block font-normal">Akan menampilkan lencana verifikasi SINTA pada portofolio publik.</span>
            </div>

            {/* Scopus URL */}
            <div className="space-y-1.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 block"></span>
                <label className="block text-xs font-bold text-[#E17000] uppercase tracking-wider font-sans">
                  SCOPUS Author Link
                </label>
              </div>
              <input
                type="url"
                value={scopusUrl}
                onChange={(e) => setScopusUrl(e.target.value)}
                placeholder="https://www.scopus.com/authid/detail.uri?..."
                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white text-slate-800 font-mono"
              />
              <span className="text-[10px] text-slate-400 block font-normal">Akan menampilkan lencana oranye bertuliskan SCOPUS Profile.</span>
            </div>

            {/* ORCID ID URL */}
            <div className="space-y-1.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-600 block"></span>
                <label className="block text-xs font-bold text-lime-700 uppercase tracking-wider font-sans">
                  ORCID iD Link
                </label>
              </div>
              <input
                type="url"
                value={orcidUrl}
                onChange={(e) => setOrcidUrl(e.target.value)}
                placeholder="https://orcid.org/0000-..."
                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:bg-white text-slate-800 font-mono"
              />
              <span className="text-[10px] text-slate-400 block font-normal">Akan menampilkan lambang iD hijau resmi organisasi ORCID Internasional.</span>
            </div>

          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition-all saturate-105 active:scale-98 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Biografi & URL
          </button>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-bold text-center animate-pulse">
            Pengaturan Profil berhasil disimpan ke dalam WordPress database (Metode Sinkronisasi Local)!
          </div>
        )}
      </form>
    </div>
  );
}

import React from "react";
import { Mail, BookOpen, GraduationCap, MapPin, ExternalLink } from "lucide-react";
import { Article } from "../types";

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  email: string;
  unit: string;
  scopusUrl: string;
  sintaUrl: string;
  orcidUrl: string;
  avatarUrl?: string;
}

interface ResearcherProfileProps {
  articles: Article[];
  profileData: ProfileData;
}

export default function ResearcherProfile({ articles, profileData }: ResearcherProfileProps) {
  // Compute nice metrics
  const totalArticles = articles.length;
  
  // Count Scopus vs Sinta from the list
  const scopusCount = articles.filter(a => a.statusAkreditasi.toLowerCase().includes("scopus")).length;
  const sintaCount = articles.filter(a => a.statusAkreditasi.toLowerCase().includes("sinta")).length;
  
  // Determine dominant focus
  const focusCounts: Record<string, number> = {};
  articles.forEach(a => {
    if (a.fokusKeahlian) {
      focusCounts[a.fokusKeahlian] = (focusCounts[a.fokusKeahlian] || 0) + 1;
    }
  });
  
  let dominantFocus = "Belum teridentifikasi";
  let maxCount = 0;
  Object.entries(focusCounts).forEach(([focus, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantFocus = focus;
    }
  });

  // Get initials for profile badge
  const getInitials = (nameStr: string) => {
    if (!nameStr) return "RN";
    const parts = nameStr.split(",")[0].trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div id="researcher-profile-card" className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm mb-8 transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
        
        {/* Left side: Avatar + Bio details */}
        <div className="flex flex-col md:flex-row items-start gap-6 grow">
          {/* Profile Avatar with high visual craft */}
          <div className="relative shrink-0 mx-auto md:mx-0">
            {profileData.avatarUrl ? (
              <img 
                src={profileData.avatarUrl} 
                alt={profileData.name} 
                referrerPolicy="no-referrer"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-slate-200 shadow-sm bg-slate-50"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#0F172A] flex items-center justify-center text-white font-sans text-2xl font-bold border-2 border-slate-200 shadow-sm">
                {getInitials(profileData.name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-[#2563EB] text-white p-1.5 rounded-full border-2 border-white shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>

          {/* Researcher Meta */}
          <div className="grow space-y-2.5 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-x-3 gap-y-2 justify-center md:justify-start">
              <h1 className="font-sans text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {profileData.name}
              </h1>
              <span className="inline-block self-center md:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                {profileData.title}
              </span>
            </div>

            <p className="text-slate-600 font-sans text-sm max-w-2xl leading-relaxed whitespace-pre-line">
              {profileData.bio}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs font-medium text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Poltekkes Kemenkes Palembang
              </span>
              <a href={`mailto:${profileData.email}`} className="flex items-center gap-1 hover:text-[#2563EB] transition-colors font-semibold">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profileData.email}
              </a>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {profileData.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Clickable Short Link Badges for ORCID, SINTA, SCOPUS */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[210px] bg-slate-50/50 p-4 rounded-lg border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center lg:text-left">
            Tautan Profil Ilmiah
          </span>
          
          {/* SINTA BADGE */}
          {profileData.sintaUrl ? (
            <a 
              href={profileData.sintaUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded hover:opacity-90 transition-all font-sans text-xs font-bold leading-none shadow-xs group"
              title="Kunjungi Profil SINTA Kemdikbud"
            >
              {/* Sinta Icon Badge representation */}
              <div className="w-6 h-6 rounded bg-amber-400 text-teal-950 font-black flex items-center justify-center font-serif text-[10px] shrink-0">
                S
              </div>
              <div className="grow">
                <span className="block text-[8px] uppercase tracking-wider text-slate-300 font-normal">SINTA ID</span>
                <span className="text-xs">SINTA Kemdikbud</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-white transition-colors" />
            </a>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-400 rounded text-xs select-none">
              SINTA Belum Diatur
            </div>
          )}

          {/* SCOPUS BADGE */}
          {profileData.scopusUrl ? (
            <a 
              href={profileData.scopusUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-3 py-2 bg-[#E17000] text-white rounded hover:bg-[#C26000] transition-all font-sans text-xs font-bold leading-none shadow-xs group"
              title="Kunjungi Profil Scopus"
            >
              <div className="w-6 h-6 rounded bg-white text-[#E17000] font-extrabold flex items-center justify-center font-sans text-xs shrink-0">
                Sc
              </div>
              <div className="grow">
                <span className="block text-[8px] uppercase tracking-wider text-orange-200 font-normal">Scopus Author ID</span>
                <span className="text-xs">SCOPUS Profile</span>
              </div>
              <ExternalLink className="w-3 h-3 text-orange-200 group-hover:text-white transition-colors" />
            </a>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-400 rounded text-xs select-none">
              Scopus Belum Diatur
            </div>
          )}

          {/* ORCID BADGE */}
          {profileData.orcidUrl ? (
            <a 
              href={profileData.orcidUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-3 py-2 bg-[#A6CE39] text-white rounded hover:bg-[#8FB72B] transition-all font-sans text-xs font-bold leading-none shadow-xs group"
              title="Kunjungi Profil ORCID iD"
            >
              {/* Official Green ORCID iD mini vector indicator */}
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg viewBox="0 0 256 256" className="w-[14px] h-[14px] fill-[#A6CE39]">
                  <path d="M256,128c0,70.7-57.3,128-128,128S0,198.7,0,128S57.3,0,128,0S256,57.3,256,128z M107,77.5h-15v101h15V77.5z M99.5,52c6,0,10.8-4.8,10.8-10.8c0-6-4.8-10.8-10.8-10.8c-6,0-10.8,4.8-10.8,10.8C88.7,47.2,93.5,52,99.5,52z M176,128 c0-15.5-5.5-28.5-16.5-39s-25-15.8-41.9-15.8h-23.7v101h23.7C150,174.2,165.1,158.8,176,128z M157.9,128c0,11.5-3.5,21.1-10.5,28.8 s-16.5,11.5-28.5,11.5h-10.4v-80.6H119c11.9,0,21.5,3.8,28.5,11.5S157.9,116.5,157.9,128z" />
                </svg>
              </div>
              <div className="grow">
                <span className="block text-[8px] uppercase tracking-wider text-lime-100 font-normal">ORCID Auth ID</span>
                <span className="text-xs">ORCID Registry ID</span>
              </div>
              <ExternalLink className="w-3 h-3 text-lime-100 group-hover:text-white transition-colors" />
            </a>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-400 rounded text-xs select-none">
              ORCID Belum Diatur
            </div>
          )}
        </div>

      </div>

      {/* Metrics Section styled with gorgeous modern borders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E2E8F0]">
        <div id="stat-total-articles" className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Total Publikasi</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#0F172A]">{totalArticles}</span>
            <span className="text-xs text-slate-400 font-sans">Artikel</span>
          </div>
        </div>

        <div id="stat-scopus" className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Terindeks Scopus</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#0F172A]">{scopusCount}</span>
            <span className="text-xs text-emerald-800 font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0] text-[10px]">Internasional</span>
          </div>
        </div>

        <div id="stat-sinta" className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <p className="text-xs text-slate-500 font-bold tracking-wide uppercase font-sans">Terakreditasi Sinta</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-[#0F172A]">{sintaCount}</span>
            <span className="text-xs text-[#2563EB] font-semibold bg-[#DBEAFE] px-2 py-0.5 rounded border border-[#BFDBFE] text-[10px]">Sinta 1-6</span>
          </div>
        </div>

        <div id="stat-dominant-focus" className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] col-span-2 md:col-span-1">
          <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">Fokus Utama Saat Ini</p>
          <div className="mt-1.5 flex items-center gap-1.5 font-sans">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0"></div>
            <span className="text-xs font-semibold text-[#2563EB] truncate block max-w-full" title={dominantFocus}>
              {dominantFocus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

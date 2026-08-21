import React, { useState } from "react";
import { Article } from "../types";
import { BarChart3, TrendingUp, Award, CheckCircle2 } from "lucide-react";

interface PublicationChartProps {
  articles: Article[];
}

export default function PublicationChart({ articles }: PublicationChartProps) {
  // Extract all years dynamically to ensure accurate synchronization
  const yearCounts: Record<string, number> = {};
  
  // Fill years as a standard default baseline range (2023 - 2026), and read from articles
  const defaultYears = ["2023", "2024", "2025", "2026"];
  defaultYears.forEach(y => { yearCounts[y] = 0; });

  articles.forEach(art => {
    if (art.tahun) {
      const yr = art.tahun.trim();
      yearCounts[yr] = (yearCounts[yr] || 0) + 1;
    }
  });

  // Sort years so they display chronologically
  const sortedYears = Object.keys(yearCounts)
    .filter(y => /^\d{4}$/.test(y)) // only valid 4-digit years
    .sort((a, b) => parseInt(a) - parseInt(b));

  const chartData = sortedYears.map(year => ({
    year,
    count: yearCounts[year]
  }));

  const maxCountValue = Math.max(...chartData.map(d => d.count), 1);
  // Round up to nearest even number if possible/appropriate for nice grid lines, at least 4
  const maxCount = Math.max(maxCountValue, 4);

  const totalPublications = articles.length;

  // Active hover year to show detail popup
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  // Generate ticks for Y-axis (from maxCount down to 0)
  const yTicks: number[] = [];
  // For readability, let's create a reasonable number of ticks. If maxCount <= 6, we show every integer.
  for (let i = maxCount; i >= 0; i--) {
    yTicks.push(i);
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm mb-6">
      
      {/* Title & Stats Meta panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-sans text-base font-bold text-[#0F172A]">
              Grafik Produktivitas Publikasi Ilmiah Berdasarkan Tahun
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium font-sans">
            Sebaran dokumentasi publikasi jurnal ilmiah nasional terakreditasi SINTA & indeks global Scopus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#EFF6FF] text-[#2563EB] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#BFDBFE]">
            <TrendingUp className="w-3.5 h-3.5" />
            Produktivitas Meningkat
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        
        {/* Left Side: Summary metrics */}
        <div className="space-y-4 col-span-1 border-r border-slate-100 pr-0 md:pr-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
              Total Publikasi Aktif
            </span>
            <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {totalPublications} <span className="text-sm font-semibold text-slate-400">Paper</span>
            </span>
          </div>

          <div className="space-y-2 pt-2 text-xs text-slate-600 font-sans">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Sinkronisasi Data Otomatis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-550" />
              <span>Termasuk Scopus Q4 & Sinta 3-4</span>
            </div>
          </div>
        </div>

        {/* Right Side: Handsomely designed vector bar chart with visible guidelines */}
        <div className="col-span-3 space-y-4">
          {chartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-400 italic text-sm">
              Belum ada data artikel untuk ditampilkan di grafik.
            </div>
          ) : (
            <div className="relative pt-6">
              
              {/* Outer wrapper combining Y-Axis and Chart Area */}
              <div className="flex h-56">
                
                {/* Y-Axis labels (Numeric Ticks) */}
                <div className="w-8 flex flex-col justify-between text-right pr-2 text-[10px] font-bold font-mono text-slate-400 pointer-events-none pb-8 select-none">
                  {yTicks.map((tick, idx) => (
                    <span key={idx}>{tick}</span>
                  ))}
                </div>

                {/* Chart Area with Guideline Grid and Bars */}
                <div className="flex-1 relative pb-8">
                  
                  {/* Grid Lines Group */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                    {yTicks.map((_, idx) => (
                      <div 
                        key={idx} 
                        className="w-full border-b border-dashed border-slate-200"
                        style={{ height: "0px" }}
                      ></div>
                    ))}
                  </div>

                  {/* Bars layer */}
                  <div className="absolute inset-0 flex items-end justify-between gap-3 md:gap-8 px-4 pb-8 z-10 h-full">
                    {chartData.map((d) => {
                      // Calculate dynamic percentage height
                      const percentHeight = (d.count / maxCount) * 100;
                      const hasItems = d.count > 0;
                      
                      return (
                        <div 
                          key={d.year} 
                          className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                          onMouseEnter={() => setHoveredYear(d.year)}
                          onMouseLeave={() => setHoveredYear(null)}
                        >
                          {/* Interacting floating bubble popup layout */}
                          <div className={`absolute -top-10 bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded-md transition-all duration-150 z-20 ${
                            hoveredYear === d.year 
                              ? "opacity-100 scale-100 -translate-y-1 shadow-md" 
                              : "opacity-0 scale-95 pointer-events-none"
                          }`}>
                            {d.count} Jurnal ({Math.round((d.count / (totalPublications || 1)) * 100)}%)
                          </div>

                          {/* Bold solid colored Bar indicator - 100% visible and responsive */}
                          <div 
                            className={`w-full rounded-t-md transition-all duration-300 relative shadow-sm border border-blue-700/25 ${
                              hoveredYear === d.year 
                                ? "saturate-125 brightness-110" 
                                : ""
                            }`}
                            style={{ 
                              height: hasItems ? `${percentHeight}%` : "4px",
                              backgroundColor: hasItems 
                                ? (hoveredYear === d.year ? "#1D4ED8" : "#2563EB") 
                                : "#E2E8F0",
                              transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease"
                            }}
                          >
                            {/* Accent highlight bar */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-white/30 rounded-t-sm"></div>

                            {/* Value helper label directly inside/above the bar */}
                            {hasItems && (
                              <span className="absolute -top-5 inset-x-0 text-center text-[10px] font-extrabold text-[#2563EB] font-mono">
                                {d.count}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>

              {/* X-Axis labels matching position of bars */}
              <div className="flex border-t border-slate-200 pt-2.5">
                <div className="w-8"></div> {/* align placeholder matching Y-axis spacing */}
                <div className="flex-1 flex justify-between gap-3 md:gap-8 px-4">
                  {chartData.map((d) => (
                    <span 
                      key={d.year} 
                      className={`flex-1 text-center text-xs font-bold font-mono transition-colors ${
                        hoveredYear === d.year ? "text-[#2563EB]" : "text-slate-550"
                      }`}
                    >
                      {d.year}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Article {
  id: string;
  url?: string;
  originalText?: string;
  judul: string;
  jurnal: string;
  tahun: string;
  penulis: string;
  statusAkreditasi: string; // Scopus / Sinta / Prosiding / Lainnya
  abstrakSederhana: string;
  kataKunci: string[];
  fokusKeahlian: string;
  markdownOutput: string;
  extractedAt: string;
}

export interface OngoingResearch {
  id: string;
  judul: string;
  pendanaan: string; // e.g., Mandiri, Hibah Internal Poltekkes, Hibah Risbinakes
  tahun: string;
  peran: string; // e.g., Ketua Peneliti, Anggota Peneliti
  progres: number; // percentage 0-100
  status: string; // e.g., Pengumpulan Data, Analisis Data, Penyusunan Draft Jurnal
  keterangan: string;
}

export interface PortfolioStats {
  totalArticles: number;
  fokusDominan: string;
  fokusBreakdown: Array<{ name: string; count: number }>;
  akreditasiBreakdown: Array<{ name: string; count: number }>;
}

export interface ExtractionResponse {
  success: boolean;
  article?: Omit<Article, 'id' | 'extractedAt'>;
  error?: string;
  sourceType?: 'url' | 'text';
}

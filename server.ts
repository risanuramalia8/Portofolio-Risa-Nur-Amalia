import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of the Gemini SDK client
let aiInstance: GoogleGenAI | null = null;
function getAi() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Helper to crawl/fetch public HTML content from a URL via backend proxy
async function crawlUrlContent(targetUrl: string): Promise<string> {
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/ *;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      signal: AbortSignal.timeout(8000) // 8 seconds timeout
    });
    
    if (!response.ok) {
      return `[Failed HTTP fetch: status ${response.status}]`;
    }
    
    const html = await response.text();
    // Simple sanitization to keep text paragraphs and headings
    const sanitizedText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    return sanitizedText.substring(0, 12000); // Send first 12k chars as context
  } catch (err: any) {
    return `[Could not fetch URL directly: ${err.message || err}]`;
  }
}

// API endpoint to analyze a scientific journal URL or abstract text
app.post("/api/extract", async (req, res) => {
  const { url, text } = req.body;
  
  if (!url && !text) {
    return res.status(400).json({ 
      success: false, 
      error: "Anda harus memasukkan URL artikel atau teks abstrak untuk diekstraksi." 
    });
  }

  try {
    const ai = getAi();
    
    let crawledText = "";
    if (url) {
      crawledText = await crawlUrlContent(url);
    }

    const payloadPrompt = `
Anda adalah asisten AI khusus Peneliti & Akademisi Kesehatan Masyarakat untuk Risa Nur Amalia, S.KM., M.PH.
Tugas Anda adalah mengekstrak metadata, membuat ringkasan populer, dan menentukan bidang keahlian dari sebuah paper ilmiah / artikel jurnal terkait kesehatan masyarakat.

Informasi Input dari Pengguna:
${url ? `- URL Artikel: ${url}` : ''}
${text ? `- Teks/Abstrak Masukan: ${text}` : ''}

${url && crawledText ? `Hasil Isian Crawling Halaman Web (Membantu Anda menganalisis jika teks asli tidak paywalled):
---
${crawledText}
---` : ''}

Petunjuk Analisis & Aturan Ekstraksi:
1. Jika URL disediakan, analisis domain dan isinya. Gunakan Google Search grounding jika data tidak lengkap di halaman crawl untuk memverifikasi nama jurnal atau tahun rilis.
2. Prediksi Status Akreditasi:
   - Analisis apakah jurnal ini terindeks Scopus (sebutkan Q1/Q2/Q3/Q4 jika terdeteksi, atau Scopus saja), terakreditasi Sinta (Sinta 1 s.d 6), Jurnal Nasional Terakreditasi, Prosiding Seminar, atau Jurnal Internasional Lainnya. Berikan penjelasan singkat pemicunya (misal: "Berdasarkan nama penerbit Elsevier/IJM...").
3. Ringkasan Populer (Untuk Pengunjung Web):
   - Tulis "Abstrak Singkat (2-3 Kalimat)" dalam Bahasa Indonesia yang sangat cair, ramah pembaca awam, profesional, mengalir, dan mudah dimengerti tetapi tidak menghilangkan substansi ilmiah (seperti pencegahan stunting, metode intervensi, dsb).
4. Saring dan kumpulkan 3 sampai 5 kata kunci utama (Kata Kunci Utama).
5. Fokus Bidang Keahlian:
   - Tentukan satu topik keahlian kesehatan masyarakat yang spesifik (contoh: "Intervensi Stunting & Gizi Anak", "Literasi Kesehatan Ibu & Anak", "Promosi Kesehatan Masyarakat", "Epidemiologi Penyakit Menular", "Kebijakan & Sistem Kesehatan", atau "Kesehatan Lingkungan").
6. Buat output teks format Markdown secara presisi (HARUS bersesuaian persis dengan skema di bawah ini):

### DATA EKSTRAKSI ARTIKEL
* **Judul Artikel:** [Judul asli artikel ilmiah]
* **Nama Jurnal:** [Nama jurnal penerbit resmi]
* **Tahun Terbit:** [Tahun terbit artikel, misalnya: 2024]
* **Penulis:** [Nama lengkap penulis-penulis artikel]
* **Status Akreditasi (Prediksi):** [Hasil analisis akreditasi]

### RINGKASAN POPULER (Untuk Pengunjung Web)
* **Abstrak Singkat (2-3 Kalimat):** [Uraian abstrak populer dalam bahasa Indonesia yang cair]
* **Kata Kunci Utama:** [3-5 kata kunci dipisahkan tanda koma]

### REKAP TREN PROFIL (Kombinasikan dengan artikel-artikel sebelumnya jika ada)
* **Fokus Bidang Keahlian saat ini:** [Kategori bidang keahlian spesifik]

Kembalikan jawaban lengkap dalam format JSON yang valid mengikuti skema respon di bawah ini.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: payloadPrompt,
      config: {
        tools: url ? [{ googleSearch: {} }] : [],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            judul: { type: Type.STRING, description: "Judul asli artikel jurnal ilmiah" },
            jurnal: { type: Type.STRING, description: "Nama jurnal penerbit artikel" },
            tahun: { type: Type.STRING, description: "Tahun terbit jurnal (angka saja, misal: 2024)" },
            penulis: { type: Type.STRING, description: "Nama-nama penulis dipisahkan koma" },
            statusAkreditasi: { type: Type.STRING, description: "Status akreditasi jurnal (misalnya: Scopus Q1, Sinta 2, Sinta 3, Prosiding, atau Jurnal Nasional)" },
            abstrakSederhana: { type: Type.STRING, description: "Ringkasan abstrak singkat 2-3 kalimat dalam bahasa Indonesia populer" },
            kataKunci: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "3 sampai 5 kata kunci utama dari artikel" 
            },
            fokusKeahlian: { type: Type.STRING, description: "Kategori topik spesifik kesehatan masyarakat paper ini, misal: Literasi Kesehatan Ibu, Promosi Kesehatan, Gizi Masyarakat, dll" },
            markdownOutput: { type: Type.STRING, description: "Teks output Markdown lengkap sesuai format persis yang diminta user" }
          },
          required: ["judul", "jurnal", "tahun", "penulis", "statusAkreditasi", "abstrakSederhana", "kataKunci", "fokusKeahlian", "markdownOutput"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Gemini tidak mengembalikan teks respon.");
    }

    const data = JSON.parse(textOutput.trim());
    
    return res.json({
      success: true,
      article: {
        judul: data.judul,
        jurnal: data.jurnal,
        tahun: data.tahun,
        penulis: data.penulis,
        statusAkreditasi: data.statusAkreditasi,
        abstrakSederhana: data.abstrakSederhana,
        kataKunci: data.kataKunci,
        fokusKeahlian: data.fokusKeahlian,
        markdownOutput: data.markdownOutput
      },
      sourceType: url ? 'url' : 'text'
    });

  } catch (err: any) {
    console.error("Extraction error:", err);
    return res.status(500).json({ 
      success: false, 
      error: `Gagal menganalisis paper: ${err.message || err}` 
    });
  }
});

// Serve static assets or mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

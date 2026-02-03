
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Enhanced exponential backoff retry mechanism to handle rate limits (Error 429)
 * Increased maxRetries and baseDelay for better stability on free tier keys.
 */
const retryWithBackoff = async <T>(fn: () => Promise<T>, maxRetries = 5, baseDelay = 3500): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // Detect 429 errors from various property formats
      const isQuotaError = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.code === 429 ||
        (typeof error === 'string' && error.includes('429'));
      
      if (isQuotaError && i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.warn(`Quota limit hit (429). Retrying in ${delay}ms (Attempt ${i + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

const generateIllustration = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await retryWithBackoff(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A clean, professional, educational illustration for a school worksheet for students/pupils about: ${prompt}. Minimalist style, suitable for black and white printing.` }],
        },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      })
    );

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return '';
  } catch (e) {
    console.error("Image generation failed:", e);
    return '';
  }
};

export const generateEducationalContent = async (params: {
  school: string;
  subject: string;
  topic: string;
  grade: string;
  duration: string;
  pilar: string;
  model: string;
  method: string;
  specialInstructions?: string;
  referenceFiles?: { name: string, mimeType: string, data: string }[];
}, onProgress?: (msg: string) => void): Promise<GeneratedContent> => {
  
  if (onProgress) onProgress("Menganalisis referensi & merancang strategi Deep Learning...");

  const userPrompt = `Buatlah Modul Ajar, Lembar Kerja Murid, dan Lampiran lengkap berdasarkan Kurikulum Merdeka versi terbaru 2026.
  
  ATURAN BAHASA (SANGAT PENTING):
  - Dilarang keras menggunakan kata "Siswa" atau "Peserta Didik".
  - Gunakan istilah "Murid" untuk merujuk pada subjek didik.
  - Gunakan istilah "Lembar Kerja Murid" atau "Lembar Kerja" untuk menggantikan istilah "LKPD".
  
  PENDEKATAN DEEP LEARNING:
  - Pilar: ${params.pilar}
  - Model: ${params.model}
  - Metode: ${params.method}

  IDENTITAS UTAMA (HARUS DIGUNAKAN):
  - Nama Sekolah: ${params.school}
  - Mata Pelajaran: ${params.subject}
  - Topik: ${params.topic}
  - Kelas: ${params.grade}
  - Durasi: ${params.duration}

  ${params.specialInstructions ? `INSTRUKSI KHUSUS GURU: ${params.specialInstructions}` : ''}
  ${params.referenceFiles && params.referenceFiles.length > 0 ? `PRIORITASKAN INFORMASI DARI FILE REFERENSI YANG DIUNGGAH.` : ''}

  STRUKTUR OUTPUT:
  1. Modul Ajar: Fokus pada kedalaman pemahaman (Understanding), aplikasi (Applying), dan refleksi (Reflecting).
  2. Lembar Kerja: Aktivitas yang memancing pemikiran mendalam.
  3. Lampiran: Materi Ajar lengkap, instrumen asesmen, rubrik, glosarium, dan daftar pustaka.

  Gunakan format JSON sesuai schema. Pastikan field modulAjar.identitas.sekolah berisi "${params.school}".`;

  const contentParts: any[] = [{ text: userPrompt }];
  
  if (params.referenceFiles) {
    params.referenceFiles.forEach(file => {
      contentParts.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType
        }
      });
    });
  }

  const response: GenerateContentResponse = await retryWithBackoff(() => 
    ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: contentParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            modulAjar: { 
              type: Type.OBJECT,
              properties: {
                identitas: {
                  type: Type.OBJECT,
                  properties: {
                    sekolah: { type: Type.STRING },
                    mataPelajaran: { type: Type.STRING },
                    kelas: { type: Type.STRING },
                    fase: { type: Type.STRING },
                    alokasiWaktu: { type: Type.STRING },
                    penyusun: { type: Type.STRING },
                  },
                  required: ["sekolah", "mataPelajaran", "kelas", "fase", "alokasiWaktu", "penyusun"]
                },
                kompetensiAwal: { type: Type.ARRAY, items: { type: Type.STRING } },
                profilPelajarPancasila: { type: Type.ARRAY, items: { type: Type.STRING } },
                saranaPrasarana: { type: Type.ARRAY, items: { type: Type.STRING } },
                targetMurid: { type: Type.STRING },
                tujuanPembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
                pemahamanBermakna: { type: Type.STRING },
                pertanyaanPemantik: { type: Type.ARRAY, items: { type: Type.STRING } },
                kegiatanPembelajaran: {
                  type: Type.OBJECT,
                  properties: {
                    pendahuluan: { type: Type.ARRAY, items: { type: Type.STRING } },
                    inti: { type: Type.ARRAY, items: { type: Type.STRING } },
                    penutup: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["pendahuluan", "inti", "penutup"]
                },
                asesmen: {
                  type: Type.OBJECT,
                  properties: {
                    diagnostik: { type: Type.STRING },
                    formatif: { type: Type.STRING },
                    sumatif: { type: Type.STRING },
                  },
                  required: ["diagnostik", "formatif", "sumatif"]
                },
                refleksi: { type: Type.STRING },
              },
              required: ["identitas", "kompetensiAwal", "profilPelajarPancasila", "tujuanPembelajaran", "kegiatanPembelajaran", "asesmen", "refleksi", "targetMurid"]
            },
            lembarKerja: { 
              type: Type.OBJECT,
              properties: {
                judul: { type: Type.STRING },
                petunjukBelajar: { type: Type.ARRAY, items: { type: Type.STRING } },
                materiSingkat: { type: Type.STRING },
                visuals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      prompt: { type: Type.STRING },
                      caption: { type: Type.STRING }
                    },
                    required: ["prompt", "caption"]
                  }
                },
                tugasMandiri: {
                  type: Type.OBJECT,
                  properties: {
                    instruksi: { type: Type.STRING },
                    pertanyaan: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["instruksi", "pertanyaan"]
                },
                tugasKelompok: {
                  type: Type.OBJECT,
                  properties: {
                    instruksi: { type: Type.STRING },
                    tabelData: {
                      type: Type.OBJECT,
                      properties: {
                        headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                        rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } },
                      },
                      required: ["headers", "rows"]
                    },
                  },
                  required: ["instruksi"]
                },
                refleksiMurid: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["judul", "petunjukBelajar", "materiSingkat", "tugasMandiri", "tugasKelompok", "refleksiMurid"]
            },
            lampiran: {
              type: Type.OBJECT,
              properties: {
                materiAjar: {
                  type: Type.OBJECT,
                  properties: {
                    judul: { type: Type.STRING },
                    konten: { type: Type.STRING }
                  },
                  required: ["judul", "konten"]
                },
                lembarObservasi: { type: Type.ARRAY, items: { type: Type.STRING } },
                instrumenAsesmen: {
                  type: Type.OBJECT,
                  properties: {
                    jenis: { type: Type.STRING },
                    soal: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["jenis", "soal"]
                },
                rubrikPenilaian: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      kriteria: { type: Type.STRING },
                      level: {
                        type: Type.OBJECT,
                        properties: {
                          perluBimbingan: { type: Type.STRING },
                          cukup: { type: Type.STRING },
                          baik: { type: Type.STRING },
                          sangatBaik: { type: Type.STRING }
                        },
                        required: ["perluBimbingan", "cukup", "baik", "sangatBaik"]
                      }
                    },
                    required: ["kriteria", "level"]
                  }
                },
                pengayaanRemedial: {
                  type: Type.OBJECT,
                  properties: {
                    pengayaan: { type: Type.STRING },
                    remedial: { type: Type.STRING }
                  },
                  required: ["pengayaan", "remedial"]
                },
                glosarium: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      istilah: { type: Type.STRING },
                      arti: { type: Type.STRING }
                    },
                    required: ["istilah", "arti"]
                  }
                },
                daftarPustaka: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["materiAjar", "lembarObservasi", "instrumenAsesmen", "rubrikPenilaian", "pengayaanRemedial", "glosarium", "daftarPustaka"]
            }
          },
          required: ["modulAjar", "lembarKerja", "lampiran"]
        }
      }
    })
  );

  const content: GeneratedContent = JSON.parse(response.text || '{}');

  if (content.lembarKerja.visuals && content.lembarKerja.visuals.length > 0) {
    if (onProgress) onProgress("Melukis ilustrasi visual untuk Lembar Kerja Murid...");
    for (const visual of content.lembarKerja.visuals) {
      visual.url = await generateIllustration(visual.prompt);
    }
  }

  return content;
};

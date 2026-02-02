
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const generateIllustration = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A clean, professional, educational illustration for a school worksheet about: ${prompt}. Minimalist style, clear focus, suitable for printing on a white background.` }],
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return '';
  } catch (e) {
    console.error("Image generation failed", e);
    return '';
  }
};

export const generateEducationalContent = async (params: {
  subject: string;
  topic: string;
  grade: string;
  duration: string;
  focus: string;
}, onProgress?: (msg: string) => void): Promise<GeneratedContent> => {
  
  if (onProgress) onProgress("Menyusun struktur kurikulum & lampiran...");

  const prompt = `Buatlah Modul Ajar, Lembar Kerja (sebelumnya LKPD), dan Lampiran lengkap berdasarkan Kurikulum Merdeka versi terbaru 2026 dengan prinsip Deep Learning.
  Mata Pelajaran: ${params.subject}
  Topik: ${params.topic}
  Kelas: ${params.grade}
  Durasi: ${params.duration}
  Fokus Tambahan: ${params.focus}

  PENTING: 
  1. Gunakan istilah "Murid" untuk menggantikan istilah "Siswa" atau "Peserta Didik" di seluruh dokumen.
  2. Gunakan istilah "Lembar Kerja" untuk menggantikan istilah "LKPD" atau "Lembar Kerja Peserta Didik".
  3. Buat Lampiran yang mencakup: Lembar Observasi Guru, Instrumen Asesmen (soal-soal), Rubrik Penilaian mendetail (4 level), panduan Pengayaan & Remedial, Glosarium, dan Daftar Pustaka.
  4. Pada bagian Lembar Kerja, buatlah 2 prompt deskripsi gambar (visuals) yang bisa diilustrasikan oleh AI.
  
  Gunakan format JSON sesuai schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
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
          lkpd: { 
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
            required: ["lembarObservasi", "instrumenAsesmen", "rubrikPenilaian", "pengayaanRemedial", "glosarium", "daftarPustaka"]
          }
        },
        required: ["modulAjar", "lkpd", "lampiran"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Gagal mendapatkan respon dari AI.");
  
  const content: GeneratedContent = JSON.parse(text);

  if (content.lkpd.visuals && content.lkpd.visuals.length > 0) {
    if (onProgress) onProgress("Melukis ilustrasi visual untuk Lembar Kerja...");
    for (const visual of content.lkpd.visuals) {
      visual.url = await generateIllustration(visual.prompt);
    }
  }

  return content;
};

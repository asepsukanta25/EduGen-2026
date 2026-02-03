
export interface SignatureData {
  city: string;
  date: string;
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
}

export interface ModulAjar {
  identitas: {
    sekolah: string;
    mataPelajaran: string;
    kelas: string;
    fase: string;
    alokasiWaktu: string;
    penyusun: string;
  };
  kompetensiAwal: string[];
  profilPelajarPancasila: string[];
  saranaPrasarana: string[];
  targetMurid: string;
  tujuanPembelajaran: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  kegiatanPembelajaran: {
    pendahuluan: string[];
    inti: string[];
    penutup: string[];
  };
  asesmen: {
    diagnostik: string;
    formatif: string;
    sumatif: string;
  };
  refleksi: string;
}

export interface VisualElement {
  prompt: string;
  caption: string;
  url?: string;
}

export interface LembarKerja {
  judul: string;
  petunjukBelajar: string[];
  materiSingkat: string;
  visuals?: VisualElement[];
  tugasMandiri: {
    instruksi: string;
    pertanyaan: string[];
  };
  tugasKelompok: {
    instruksi: string;
    tabelData?: {
      headers: string[];
      rows: string[][];
    };
  };
  refleksiMurid: string[];
}

export interface Rubrik {
  kriteria: string;
  level: {
    perluBimbingan: string;
    cukup: string;
    baik: string;
    sangatBaik: string;
  };
}

export interface Lampiran {
  materiAjar: {
    judul: string;
    konten: string;
  };
  lembarObservasi: string[];
  instrumenAsesmen: {
    jenis: string;
    soal: string[];
  };
  rubrikPenilaian: Rubrik[];
  pengayaanRemedial: {
    pengayaan: string;
    remedial: string;
  };
  glosarium: { istilah: string; arti: string }[];
  daftarPustaka: string[];
}

export interface GeneratedContent {
  modulAjar: ModulAjar;
  lembarKerja: LembarKerja;
  lampiran: Lampiran;
}

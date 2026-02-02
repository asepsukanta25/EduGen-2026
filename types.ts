
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

export interface LKPD {
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
  lkpd: LKPD;
  lampiran: Lampiran;
}

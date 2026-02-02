
import React from 'react';
import { ModulAjar } from '../types';

interface Props {
  data: ModulAjar;
}

const ModulAjarView: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-8 md:p-12 shadow-lg border border-slate-200 rounded-xl mb-8">
      <div className="border-b-4 border-blue-600 pb-4 mb-8">
        <h1 className="text-3xl font-bold font-heading text-slate-800 uppercase">Modul Ajar</h1>
        <p className="text-blue-600 font-semibold uppercase tracking-wider">Kurikulum Merdeka 2026 - Deep Learning</p>
      </div>

      {/* Identity Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-lg page-break-avoid">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">Mata Pelajaran</p>
          <p className="text-lg font-semibold text-slate-800">{data.identitas.mataPelajaran}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">Kelas / Fase</p>
          <p className="text-lg font-semibold text-slate-800">{data.identitas.kelas} / {data.identitas.fase}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">Alokasi Waktu</p>
          <p className="text-lg font-semibold text-slate-800">{data.identitas.alokasiWaktu}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase">Penyusun</p>
          <p className="text-lg font-semibold text-slate-800">{data.identitas.penyusun}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="space-y-8">
        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-3 border-l-4 border-blue-600 pl-3">A. KOMPETENSI AWAL</h2>
          <ul className="list-disc ml-5 space-y-1 text-slate-700">
            {data.kompetensiAwal.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-3 border-l-4 border-blue-600 pl-3">B. PROFIL PELAJAR PANCASILA</h2>
          <div className="flex flex-wrap gap-2">
            {data.profilPelajarPancasila.map((item, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{item}</span>
            ))}
          </div>
        </section>

        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-3 border-l-4 border-blue-600 pl-3 uppercase">C. Target Murid</h2>
          <p className="ml-5 text-slate-700">{data.targetMurid}</p>
        </section>

        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-3 border-l-4 border-blue-600 pl-3">D. TUJUAN PEMBELAJARAN</h2>
          <ul className="list-decimal ml-5 space-y-2 text-slate-700">
            {data.tujuanPembelajaran.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        <section className="bg-amber-50 p-6 rounded-lg border border-amber-100 page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-amber-800 mb-2">💡 Pemahaman Bermakna</h2>
          <p className="text-amber-900 leading-relaxed italic">"{data.pemahamanBermakna}"</p>
          <div className="mt-4">
            <p className="font-bold text-amber-800 mb-1">Pertanyaan Pemantik:</p>
            <ul className="list-disc ml-5 text-amber-900">
              {data.pertanyaanPemantik.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 border-l-4 border-blue-600 pl-3 uppercase">Kegiatan Pembelajaran</h2>
          
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-slate-200 page-break-avoid">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">1. Pendahuluan</h3>
              <ul className="list-disc ml-5 space-y-1 text-slate-600">
                {data.kegiatanPembelajaran.pendahuluan.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200 page-break-avoid">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-600"></div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">2. Kegiatan Inti (Deep Learning Process)</h3>
              <ul className="list-disc ml-5 space-y-1 text-slate-600">
                {data.kegiatanPembelajaran.inti.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200 page-break-avoid">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-600"></div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">3. Penutup</h3>
              <ul className="list-disc ml-5 space-y-1 text-slate-600">
                {data.kegiatanPembelajaran.penutup.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-lg page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-3 uppercase">Asesmen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded border border-slate-200">
              <p className="font-bold text-sm text-slate-500 mb-1">DIAGNOSTIK</p>
              <p className="text-slate-700">{data.asesmen.diagnostik}</p>
            </div>
            <div className="p-4 bg-white rounded border border-slate-200">
              <p className="font-bold text-sm text-slate-500 mb-1">FORMATIF</p>
              <p className="text-slate-700">{data.asesmen.formatif}</p>
            </div>
            <div className="p-4 bg-white rounded border border-slate-200">
              <p className="font-bold text-sm text-slate-500 mb-1">SUMATIF</p>
              <p className="text-slate-700">{data.asesmen.sumatif}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModulAjarView;

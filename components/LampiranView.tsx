
import React from 'react';
import { Lampiran, SignatureData } from '../types';

interface Props {
  data: Lampiran;
  signature: SignatureData;
}

const LampiranView: React.FC<Props> = ({ data, signature }) => {
  return (
    <div className="bg-white p-8 md:p-12 border border-slate-200 rounded-xl">
      <div className="border-b-4 border-slate-800 pb-4 mb-8">
        <h1 className="text-3xl font-bold font-heading text-slate-800 uppercase">Lampiran</h1>
        <p className="text-slate-500 font-semibold uppercase tracking-wider">Materi, Asesmen, Rubrik, & Pendukung</p>
      </div>

      <div className="space-y-12">
        {/* Seksi Materi Ajar Lengkap */}
        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
            1. Materi Ajar: {data.materiAjar.judul}
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {data.materiAjar.konten}
            </div>
          </div>
        </section>

        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
            2. Lembar Observasi Guru
          </h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left font-bold border-r">No</th>
                  <th className="p-3 text-left font-bold border-r">Aspek yang Diamati</th>
                  <th className="p-3 text-left font-bold">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {data.lembarObservasi.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="p-3 border-r text-center">{i + 1}</td>
                    <td className="p-3 border-r">{item}</td>
                    <td className="p-3 h-12"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 uppercase tracking-wide">3. Instrumen Asesmen ({data.instrumenAsesmen.jenis})</h2>
          <div className="space-y-4 ml-8">
            {data.instrumenAsesmen.soal.map((soal, i) => (
              <div key={i} className="text-slate-700">
                <p className="font-medium">{i + 1}. {soal}</p>
                <div className="h-1 bg-slate-100 w-full mt-2 opacity-50"></div>
              </div>
            ))}
          </div>
        </section>

        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 uppercase tracking-wide">4. Rubrik Penilaian</h2>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-3 text-left border-r border-slate-700 w-1/4">Kriteria</th>
                  <th className="p-3 text-center border-r border-slate-700">Perlu Bimbingan (1)</th>
                  <th className="p-3 text-center border-r border-slate-700">Cukup (2)</th>
                  <th className="p-3 text-center border-r border-slate-700">Baik (3)</th>
                  <th className="p-3 text-center">Sangat Baik (4)</th>
                </tr>
              </thead>
              <tbody>
                {data.rubrikPenilaian.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="p-3 font-bold bg-slate-50 border-r">{item.kriteria}</td>
                    <td className="p-3 border-r text-slate-600">{item.level.perluBimbingan}</td>
                    <td className="p-3 border-r text-slate-600">{item.level.cukup}</td>
                    <td className="p-3 border-r text-slate-600">{item.level.baik}</td>
                    <td className="p-3 text-slate-600">{item.level.sangatBaik}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 uppercase tracking-wide">Glosarium</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.glosarium.map((item, i) => (
              <div key={i} className="p-3 border-l-4 border-indigo-200 bg-slate-50 rounded-r">
                <dt className="font-bold text-slate-800">{item.istilah}</dt>
                <dd className="text-sm text-slate-600 mt-1">{item.arti}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="page-break-avoid border-t border-slate-100 pt-8">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 uppercase tracking-wide">Daftar Pustaka</h2>
          <ul className="list-disc ml-8 text-slate-600 space-y-2">
            {data.daftarPustaka.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LampiranView;

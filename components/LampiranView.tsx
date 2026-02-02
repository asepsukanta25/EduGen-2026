
import React from 'react';
import { Lampiran } from '../types';

interface Props {
  data: Lampiran;
}

const LampiranView: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-8 md:p-12 shadow-lg border border-slate-200 rounded-xl mt-8 print-break">
      <div className="border-b-4 border-slate-800 pb-4 mb-8">
        <h1 className="text-3xl font-bold font-heading text-slate-800 uppercase">Lampiran</h1>
        <p className="text-slate-500 font-semibold uppercase tracking-wider">Asesmen, Rubrik, & Materi Pendukung</p>
      </div>

      <div className="space-y-12">
        {/* Lembar Observasi */}
        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            1. Lembar Observasi Guru (Sikap/Profil Pancasila)
          </h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left font-bold border-r">No</th>
                  <th className="p-3 text-left font-bold border-r">Aspek yang Diamati</th>
                  <th className="p-3 text-left font-bold">Catatan Observasi</th>
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

        {/* Instrumen Asesmen */}
        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            2. Instrumen Asesmen ({data.instrumenAsesmen.jenis})
          </h2>
          <div className="space-y-4 ml-8">
            {data.instrumenAsesmen.soal.map((soal, i) => (
              <div key={i} className="text-slate-700">
                <p className="font-medium">{i + 1}. {soal}</p>
                <div className="h-1 bg-slate-100 w-full mt-2 opacity-50"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Rubrik Penilaian */}
        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            3. Rubrik Penilaian Tindakan/Kinerja
          </h2>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-2 border border-slate-700 w-1/5">Kriteria</th>
                  <th className="p-2 border border-slate-700">Perlu Bimbingan (1)</th>
                  <th className="p-2 border border-slate-700">Cukup (2)</th>
                  <th className="p-2 border border-slate-700">Baik (3)</th>
                  <th className="p-2 border border-slate-700">Sangat Baik (4)</th>
                </tr>
              </thead>
              <tbody>
                {data.rubrikPenilaian.map((rubrik, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 font-bold border-r bg-slate-50">{rubrik.kriteria}</td>
                    <td className="p-2 border-r italic text-slate-500">{rubrik.level.perluBimbingan}</td>
                    <td className="p-2 border-r text-slate-600">{rubrik.level.cukup}</td>
                    <td className="p-2 border-r text-slate-700 font-medium">{rubrik.level.baik}</td>
                    <td className="p-2 text-indigo-700 font-bold bg-indigo-50">{rubrik.level.sangatBaik}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Glosarium */}
        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-4 uppercase">Glosarium</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.glosarium.map((item, i) => (
              <div key={i} className="p-3 border-l-4 border-indigo-200 bg-slate-50 rounded-r">
                <dt className="font-bold text-slate-800">{item.istilah}</dt>
                <dd className="text-sm text-slate-600 mt-1">{item.arti}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Pengayaan & Remedial */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 page-break-avoid">
          <div className="p-5 bg-green-50 rounded-xl border border-green-100">
            <h3 className="font-bold text-green-800 mb-2 uppercase text-sm tracking-widest">Pengayaan</h3>
            <p className="text-sm text-green-700">{data.pengayaanRemedial.pengayaan}</p>
          </div>
          <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
            <h3 className="font-bold text-orange-800 mb-2 uppercase text-sm tracking-widest">Remedial</h3>
            <p className="text-sm text-orange-700">{data.pengayaanRemedial.remedial}</p>
          </div>
        </section>

        {/* Daftar Pustaka */}
        <section className="page-break-avoid">
          <h2 className="text-xl font-bold font-heading text-slate-800 mb-2 uppercase">Daftar Pustaka</h2>
          <ul className="list-disc ml-5 text-sm text-slate-600 italic">
            {data.daftarPustaka.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LampiranView;

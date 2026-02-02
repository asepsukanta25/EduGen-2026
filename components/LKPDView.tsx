
import React from 'react';
import { LKPD } from '../types';

interface Props {
  data: LKPD;
}

const LKPDView: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-8 md:p-12 shadow-lg border-2 border-dashed border-indigo-200 rounded-2xl print-break">
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold mb-2 uppercase tracking-widest">
          Lembar Kerja
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-indigo-900 leading-tight">{data.judul}</h1>
      </div>

      {/* Identity Placeholder for Student */}
      <div className="grid grid-cols-2 gap-4 mb-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <div>
          <label className="text-xs font-bold text-indigo-400 uppercase">Nama Lengkap Murid</label>
          <div className="h-8 border-b border-indigo-300"></div>
        </div>
        <div>
          <label className="text-xs font-bold text-indigo-400 uppercase">Kelas / No. Absen</label>
          <div className="h-8 border-b border-indigo-300"></div>
        </div>
      </div>

      <div className="space-y-10">
        {/* Study Guide */}
        <section className="page-break-avoid">
          <h2 className="flex items-center text-xl font-bold text-indigo-800 mb-4">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3 text-sm">1</span>
            Petunjuk Belajar
          </h2>
          <ul className="list-disc ml-11 space-y-2 text-slate-700">
            {data.petunjukBelajar.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        {/* Short Material & Visuals */}
        <section className="bg-slate-50 p-6 rounded-xl border-l-8 border-indigo-500 page-break-avoid">
          <h2 className="text-xl font-bold text-indigo-800 mb-3">Ayo Mengingat!</h2>
          <p className="text-slate-700 leading-relaxed mb-6">{data.materiSingkat}</p>
          
          {data.visuals && data.visuals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {data.visuals.map((vis, i) => (
                <div key={i} className="bg-white p-2 rounded-lg border border-indigo-100 shadow-sm overflow-hidden">
                  {vis.url ? (
                    <img 
                      src={vis.url} 
                      alt={vis.caption} 
                      className="w-full h-48 object-cover rounded shadow-inner" 
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400 text-xs text-center px-4">
                      Gambar tidak tersedia: {vis.caption}
                    </div>
                  )}
                  <p className="text-[10px] mt-2 text-center text-indigo-500 font-medium italic">
                    Gambar {i+1}: {vis.caption}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Individual Task */}
        <section>
          <h2 className="flex items-center text-xl font-bold text-indigo-800 mb-4">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3 text-sm">2</span>
            Aktivitas Mandiri
          </h2>
          <div className="ml-11">
            <p className="text-slate-800 font-medium mb-4">{data.tugasMandiri.instruksi}</p>
            <div className="space-y-6">
              {data.tugasMandiri.pertanyaan.map((q, i) => (
                <div key={i} className="space-y-2 page-break-avoid">
                  <p className="text-slate-700 font-semibold">{i + 1}. {q}</p>
                  <div className="h-24 border border-indigo-100 bg-indigo-50/30 rounded-lg p-2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Group Task & Table */}
        <section>
          <h2 className="flex items-center text-xl font-bold text-indigo-800 mb-4">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3 text-sm">3</span>
            Aktivitas Kelompok (Kolaborasi)
          </h2>
          <div className="ml-11">
            <p className="text-slate-800 font-medium mb-4">{data.tugasKelompok.instruksi}</p>
            
            {data.tugasKelompok.tabelData && (
              <div className="overflow-x-auto my-6 border border-slate-200 rounded-lg page-break-avoid">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      {data.tugasKelompok.tabelData.headers.map((h, i) => (
                        <th key={i} className="p-3 border border-indigo-700 text-sm uppercase font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.tugasKelompok.tabelData.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        {row.map((cell, j) => (
                          <td key={j} className="p-3 border border-slate-200 text-slate-700 min-h-[40px] h-12">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {[1, 2].map(extra => (
                       <tr key={`extra-${extra}`}>
                         {data.tugasKelompok.tabelData!.headers.map((_, j) => (
                           <td key={j} className="p-3 border border-slate-200 h-12"></td>
                         ))}
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Reflection */}
        <section className="bg-indigo-900 text-white p-8 rounded-2xl page-break-avoid">
          <h2 className="text-xl font-bold mb-4">Refleksi Belajarku (Murid)</h2>
          <div className="space-y-4">
            {data.refleksiMurid.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded border-2 border-indigo-400 mt-1 flex-shrink-0"></div>
                <p className="text-indigo-100">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <div className="mt-12 text-center text-xs text-slate-400 italic">
        "Deep Learning: Berpikir Mendalam, Bermakna, dan Menyenangkan" - EduGen 2026
      </div>
    </div>
  );
};

export default LKPDView;

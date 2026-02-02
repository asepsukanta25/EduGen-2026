
import React, { useState } from 'react';
import { generateEducationalContent } from './services/geminiService';
import { GeneratedContent } from './types';
import ModulAjarView from './components/ModulAjarView';
import LKPDView from './components/LKPDView';
import LampiranView from './components/LampiranView';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [formData, setFormData] = useState({
    subject: 'Pendidikan Pancasila',
    topic: 'Norma',
    grade: 'Kelas 6',
    duration: '2 x 35 Menit',
    focus: 'Pendekatan Inquiry Based Learning'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMsg('Menyiapkan ide pembelajaran...');
    try {
      const result = await generateEducationalContent(formData, (msg) => setLoadingMsg(msg));
      setContent(result);
    } catch (error) {
      console.error(error);
      alert('Gagal menghasilkan modul. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('print-content');
    if (!element) return;
    
    setDownloading(true);
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Modul_Ajar_${formData.topic.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save().then(() => {
      setDownloading(false);
    });
  };

  const handleExportToDoc = () => {
    const element = document.getElementById('print-content');
    if (!element) return;

    // Create a special HTML structure that Word/Google Docs understands well
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export</title>
      <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        .bg-indigo-600 { background-color: #4f46e5 !important; color: white; }
        h1 { font-size: 24pt; }
        h2 { font-size: 18pt; margin-top: 20pt; }
        .page-break-avoid { page-break-inside: avoid; }
      </style>
      </head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + element.innerHTML + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Modul_Ajar_${formData.topic.replace(/\s+/g, '_')}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
    
    alert("File .doc telah diunduh. Silakan upload ke Google Drive dan buka dengan Google Docs untuk mengedit.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-indigo-700 text-white py-12 px-6 no-print">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading mb-4 tracking-tight">EduGen 2026</h1>
          <p className="text-indigo-100 text-lg md:text-xl">
            Satu Aplikasi, Solusi Lengkap Modul Ajar, Lembar Kerja, & Asesmen Deep Learning
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 -mt-10">
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 no-print mb-12 border border-slate-100">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600 uppercase">Mata Pelajaran</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600 uppercase">Topik / Materi</label>
              <input 
                type="text" 
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600 uppercase">Kelas</label>
              <input 
                type="text" 
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600 uppercase">Alokasi Waktu</label>
              <input 
                type="text" 
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50"
                required
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-bold text-slate-600 uppercase">Fokus / Metode Tambahan</label>
              <textarea 
                name="focus"
                value={formData.focus}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50"
              />
            </div>
            <div className="md:col-span-2 mt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-indigo-300"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingMsg || 'Merancang Pembelajaran...'}
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    Generate Paket Modul & Lembar Kerja
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {content ? (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <h2 className="text-2xl font-bold font-heading text-slate-800">Paket Pembelajaran Siap</h2>
              <div className="flex flex-wrap justify-center gap-3">
                <button 
                  onClick={handleExportToDoc}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 transition shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                  Simpan ke Google Doc
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-2 transition disabled:bg-emerald-300 shadow-md"
                >
                  {downloading ? 'Mengunduh...' : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Simpan PDF
                    </>
                  )}
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl flex items-center gap-2 transition shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  Cetak
                </button>
              </div>
            </div>
            
            <div id="print-content" className="space-y-12">
              <ModulAjarView data={content.modulAjar} />
              <div className="print-break"></div>
              <LKPDView data={content.lkpd} />
              <div className="print-break"></div>
              <LampiranView data={content.lampiran} />
            </div>
          </div>
        ) : !loading && (
          <div className="text-center py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200 no-print">
             <div className="mb-4 flex justify-center">
              <div className="p-5 bg-indigo-50 text-indigo-500 rounded-full">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-700">Mulai Desain Pembelajaran</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">Input detail di form atas untuk mendapatkan paket lengkap Modul Ajar, Lembar Kerja, Asesmen, dan Rubrik sesuai Kurikulum 2026.</p>
          </div>
        )}

        {loading && (
          <div className="space-y-12 animate-pulse no-print">
            <div className="bg-white h-96 rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                 <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="text-lg font-bold text-slate-700 tracking-wide">{loadingMsg}</div>
              <p className="text-sm text-slate-400">Menyusun materi berkualitas tinggi membutuhkan waktu sejenak...</p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200 no-print bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p className="font-semibold text-slate-500 mb-2">EduGen Platform 2026</p>
          <p>Didesain untuk guru profesional yang menjunjung tinggi kualitas Deep Learning untuk para Murid.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

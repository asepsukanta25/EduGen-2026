
import React, { useState } from 'react';
import { generateEducationalContent } from './services/geminiService';
import { GeneratedContent, SignatureData } from './types';
import ModulAjarView from './components/ModulAjarView';
import LembarKerjaView from './components/LembarKerjaView';
import LampiranView from './components/LampiranView';

interface UploadedFile {
  name: string;
  mimeType: string;
  data: string; // Base64
  size: number;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  
  const [formData, setFormData] = useState({
    school: 'isi nama sekolah',
    subject: 'Pendidikan Pancasila',
    topic: 'Peran daerah dalam NKRI',
    grade: 'Kelas 6',
    duration: '2 x 35 Menit',
    pilar: ['Mindful Learning', 'Meaningful Learning', 'Joyful Learning'] as string[],
    model: 'Problem-Based Learning (PBL)',
    customModel: '',
    method: 'Diskusi Kelompok & Debat',
    customMethod: '',
    specialInstructions: ''
  });

  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);

  const [sigData, setSigData] = useState<SignatureData>({
    city: 'Cimahi',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    principalName: '',
    principalNip: '',
    teacherName: '',
    teacherNip: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePilarChange = (pilarValue: string) => {
    setFormData(prev => {
      const currentPilars = [...prev.pilar];
      if (currentPilars.includes(pilarValue)) {
        return { ...prev, pilar: currentPilars.filter(p => p !== pilarValue) };
      } else {
        return { ...prev, pilar: [...currentPilars, pilarValue] };
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const processedFiles = await Promise.all(files.map(async (file: File) => {
      return new Promise<UploadedFile>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve({
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            data: base64String,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      });
    }));

    setSelectedFiles(prev => [...prev, ...processedFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSigData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pilar.length === 0) {
      alert('Pilih setidaknya satu Pilar Deep Learning.');
      return;
    }

    const finalModel = formData.model === 'Lainnya' ? formData.customModel : formData.model;
    const finalMethod = formData.method === 'Lainnya' ? formData.customMethod : formData.method;

    if (formData.model === 'Lainnya' && !formData.customModel.trim()) {
      alert('Silakan isi nama model pembelajaran manual Anda.');
      return;
    }
    if (formData.method === 'Lainnya' && !formData.customMethod.trim()) {
      alert('Silakan isi metode praktis manual Anda.');
      return;
    }

    setLoading(true);
    setLoadingMsg('Menganalisis referensi & menyusun strategi Deep Learning untuk Murid...');
    setIsEditing(false);
    try {
      const result = await generateEducationalContent({
        ...formData,
        model: finalModel,
        method: finalMethod,
        pilar: formData.pilar.join(', '),
        referenceFiles: selectedFiles
      }, (msg) => setLoadingMsg(msg));
      setContent(result);
    } catch (error: any) {
      console.error("Generation error:", error);
      const isQuotaError = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.code === 429 ||
        (typeof error === 'string' && error.includes('429'));

      if (isQuotaError) {
        alert("Oops! Kuota harian API Gemini (Free Tier) sedang penuh atau limit tercapai. Silakan tunggu 1-2 menit lalu coba klik 'Generate' lagi.");
      } else {
        alert('Gagal menghasilkan modul. Pastikan file referensi tidak terlalu besar atau coba kurangi jumlah instruksi khusus.');
      }
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('print-content');
    if (!element) return;
    setDownloading(true);
    const wasEditing = isEditing;
    setIsEditing(false);
    
    setTimeout(() => {
      const opt = {
        margin: [5, 5, 5, 5],
        filename: `Modul_Murid_${formData.topic.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          scrollY: 0,
          scrollX: 0,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.force-page-break' }
      };
      
      // @ts-ignore
      html2pdf().set(opt).from(element).save().then(() => {
        setDownloading(false);
        setIsEditing(wasEditing);
      }).catch((err: any) => {
        console.error("PDF generation failed", err);
        setDownloading(false);
        setIsEditing(wasEditing);
        alert("Gagal mengunduh PDF. Silakan coba lagi.");
      });
    }, 500);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-indigo-700 text-white py-12 px-6 no-print shadow-inner text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading mb-4 tracking-tight">EduGen 2026</h1>
          <p className="text-indigo-100 text-lg md:text-xl italic">Personalisasi Modul Ajar & Lembar Kerja Khusus untuk Murid Anda</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 -mt-10">
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 no-print mb-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Data Pembelajaran Murid
          </h2>
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nama Sekolah</label>
              <input type="text" name="school" value={formData.school} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold" placeholder="isi nama sekolah" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Mata Pelajaran</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Topik Utama</label>
              <input type="text" name="topic" value={formData.topic} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Kelas</label>
              <input type="text" name="grade" value={formData.grade} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Durasi Belajar</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Pilar Deep Learning untuk Murid</label>
              <div className="flex flex-wrap gap-3">
                {['Mindful Learning', 'Meaningful Learning', 'Joyful Learning'].map(p => (
                  <label key={p} className={`flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-xl border transition-all ${formData.pilar.includes(p) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                    <input type="checkbox" checked={formData.pilar.includes(p)} onChange={() => handlePilarChange(p)} className="hidden" />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.pilar.includes(p) ? 'bg-white border-white' : 'bg-white border-slate-300'}`}>
                      {formData.pilar.includes(p) && <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-600 uppercase">Model Pembelajaran</label>
              <select name="model" value={formData.model} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-indigo-100 rounded-xl bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Project-Based Learning (PjBL)</option>
                <option>Problem-Based Learning (PBL)</option>
                <option>Inquiry-Based Learning</option>
                <option>Discovery Learning</option>
                <option value="Lainnya">Lainnya (Ketik Manual...)</option>
              </select>
              {formData.model === 'Lainnya' && (
                <input 
                  type="text" 
                  name="customModel" 
                  value={formData.customModel} 
                  onChange={handleInputChange} 
                  placeholder="Ketik model pembelajaran..." 
                  className="mt-2 w-full px-4 py-2 border border-indigo-200 rounded-lg bg-indigo-50/50 text-sm outline-none focus:ring-1 focus:ring-indigo-400"
                />
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-600 uppercase">Metode Praktis</label>
              <select name="method" value={formData.method} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-indigo-100 rounded-xl bg-indigo-50/30 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>Diskusi Kelompok & Debat</option>
                <option>Studi Kasus Kontekstual</option>
                <option>Refleksi Terpimpin</option>
                <option>Gamifikasi & Simulasi</option>
                <option value="Lainnya">Lainnya (Ketik Manual...)</option>
              </select>
              {formData.method === 'Lainnya' && (
                <input 
                  type="text" 
                  name="customMethod" 
                  value={formData.customMethod} 
                  onChange={handleInputChange} 
                  placeholder="Ketik metode praktis..." 
                  className="mt-2 w-full px-4 py-2 border border-indigo-200 rounded-lg bg-indigo-50/50 text-sm outline-none focus:ring-1 focus:ring-indigo-400"
                />
              )}
            </div>

            <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-indigo-600 uppercase flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                Unggah Sumber Materi (Acuan Referensi)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 hover:border-indigo-400 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
                  <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  <p className="text-sm font-bold text-slate-600">Unggah Buku Teks/Catatan</p>
                  <p className="text-xs text-slate-400">Word, PDF, JPG, PNG, TXT</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Instruksi Khusus untuk Murid</label>
                  <textarea 
                    name="specialInstructions" 
                    value={formData.specialInstructions} 
                    onChange={handleInputChange}
                    placeholder="Contoh: Fokuskan pada kearifan lokal Cimahi, gunakan bahasa yang mudah dipahami murid SD."
                    className="w-full h-[110px] px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-medium">
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button type="button" onClick={() => removeFile(idx)} className="text-indigo-400 hover:text-red-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="md:col-span-2 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-indigo-600 uppercase mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Tanda Tangan Pengesahan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="city" value={sigData.city} onChange={handleSigChange} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="Kota" />
                <input type="text" name="date" value={sigData.date} onChange={handleSigChange} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="Tanggal" />
                <input type="text" name="principalName" value={sigData.principalName} onChange={handleSigChange} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="Kepala Sekolah" />
                <input type="text" name="principalNip" value={sigData.principalNip} onChange={handleSigChange} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="NIP Kepala Sekolah" />
                <input type="text" name="teacherName" value={sigData.teacherName} onChange={handleSigChange} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="Nama Guru Kelas" />
                <input type="text" name="teacherNip" value={sigData.teacherNip} onChange={handleSigChange} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="NIP Guru Kelas" />
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {loadingMsg}
                  </>
                ) : 'Generate Dokumen Murid'}
              </button>
            </div>
          </form>
        </section>

        {content && (
          <div className="space-y-10">
            <div className="sticky top-4 z-50 flex flex-col md:flex-row justify-between items-center gap-4 no-print bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                  {isEditing ? 'Mode Edit Aktif' : 'Pratinjau Murid'}
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${isEditing ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {isEditing ? 'Selesai Mengedit' : 'Edit Hasil AI'}
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={handleDownloadPDF} disabled={downloading} className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition text-sm">
                  {downloading ? 'Sedang Menyimpan...' : 'Unduh PDF'}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto overflow-y-hidden">
              <div id="print-content" className={`bg-white mx-auto space-y-0 max-w-4xl px-4 py-4 ${isEditing ? 'ring-2 ring-indigo-200 ring-offset-4 rounded-lg bg-white/50' : ''}`} contentEditable={isEditing} suppressContentEditableWarning={true}>
                <div className="print-section"><ModulAjarView data={content.modulAjar} signature={sigData} /></div>
                <div className="force-page-break"><div className="print-section pt-8"><LembarKerjaView data={content.lembarKerja} signature={sigData} /></div></div>
                <div className="force-page-break"><div className="print-section pt-8"><LampiranView data={content.lampiran} signature={sigData} /></div></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

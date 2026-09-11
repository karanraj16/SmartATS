import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, AlertCircle, Loader2, File, Sparkles } from 'lucide-react';
import type { AiResult } from '../types';

interface UploadSectionProps { 
  jobDescription: string; setJobDescription: (val: string) => void;
  files: File[]; setFiles: (val: File[]) => void;
  onAnalyzeSuccess: (data: AiResult[]) => void; 
}

export default function UploadSection({ jobDescription, setJobDescription, files, setFiles, onAnalyzeSuccess }: UploadSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (files.length === 0 && fileInputRef.current) fileInputRef.current.value = ''; }, [files]);

  const handleAnalyze = async () => {
    if (files.length === 0 || !jobDescription) return setError('⚠️ Please upload at least one resume and paste the job description.');
    setLoading(true); setError('');
    
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    files.forEach(file => formData.append('resumes', file)); // Puthu Backend format

    try {
      const response = await axios.post('https://smartats-7axu.onrender.com/api/resume/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onAnalyzeSuccess(response.data.data);
    } catch (err: any) { setError(err.response?.data?.error || 'Server connection failed!'); } 
    finally { setLoading(false); }
  };

  return (
    <div id="analyze-section" className="space-y-8 scroll-mt-24 animate-fade-in pt-8 border-t border-slate-200 dark:border-white/5">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-[#131823] p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col h-[320px] shadow-sm dark:shadow-none">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-md"><FileText size={18} className="text-indigo-600 dark:text-indigo-400"/></div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Your resume(s)</h3>
          </div>
          {/* MULTIPLE UPLOAD ALLOWED */}
          <div onClick={() => fileInputRef.current?.click()} className="flex-1 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-xl bg-white dark:bg-indigo-500/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all flex flex-col items-center justify-center cursor-pointer group p-4 overflow-y-auto custom-scrollbar">
          <input 
              type="file" 
              multiple 
              accept=".pdf, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              onChange={(e) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  
                  // Namma mela prop-la irunthu varra 'files'-aiye direct-a use pandrom
                  const existingFileNames = files.map(f => f.name);
                  
                  // Puthusa vantha files-la ethellam pazhasula illaiyo atha mattum filter pandrom
                  const uniqueNewFiles = newFiles.filter(f => !existingFileNames.includes(f.name));
                  
                  // Rendaum serthu array-a anuppurom! (TypeScript Happy 🥳)
                  setFiles([...files, ...uniqueNewFiles]);
                }
              }} 
              ref={fileInputRef} 
              className="hidden" 
            />
            {files.length > 0 ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex -space-x-4">
                   {[...Array(Math.min(files.length, 3))].map((_, i) => <div key={i} className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-[#131823] border-2 border-white dark:border-[#0B0E14] flex items-center justify-center z-10"><File size={20} className="text-indigo-500" /></div>)}
                   {files.length > 3 && <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-[#0B0E14] flex items-center justify-center z-20 text-xs font-bold text-slate-600 dark:text-slate-300">+{files.length - 3}</div>}
                </div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{files.length} File(s) Selected</span>
                <span className="text-xs text-slate-500">Click to change</span>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full group-hover:scale-110 transition-transform"><UploadCloud size={24} className="text-indigo-600 dark:text-indigo-400" /></div>
                <div><p className="text-slate-900 dark:text-white font-medium">Drop files <span className="text-indigo-600 dark:text-indigo-400">or browse</span></p><p className="text-xs text-slate-500 mt-1">PDF or DOCX (Bulk allowed)</p></div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#131823] p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col h-[320px] shadow-sm dark:shadow-none">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-teal-100 dark:bg-teal-500/20 p-2 rounded-md"><FileText size={18} className="text-teal-600 dark:text-teal-400"/></div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Job description</h3>
          </div>
          <textarea className="flex-1 w-full bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-xl p-4 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:border-indigo-500 resize-none custom-scrollbar" placeholder="Paste the JD text here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
        </div>
      </div>

      {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex justify-center space-x-2 max-w-2xl mx-auto"><AlertCircle size={18} /><p className="text-sm font-medium">{error}</p></div>}

      <div className="flex justify-center pt-2">
        <button onClick={handleAnalyze} disabled={loading} className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 flex space-x-3 items-center">
          {loading ? <><Loader2 className="animate-spin" size={20} /><span>Analyzing Match...</span></> : <><span>Analyze match</span><Sparkles size={18} className="group-hover:rotate-12 transition-transform" /></>}
        </button>
      </div>
    </div>
  );
}
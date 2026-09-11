import { useState, useEffect, useRef } from 'react';
import { Download, CheckCircle2, XCircle, Target, X, FileText, Copy, ShieldAlert, Trophy, Check } from 'lucide-react';import { useReactToPrint } from 'react-to-print';
import type { AiResult } from '../types';

export default function MatchReport({ data, onReset }: { data: AiResult[], onReset: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState(0); // Which candidate is currently viewed
  const [activeTab, setActiveTab] = useState<'matched' | 'missing' | 'important'>('matched');
  const [copiedLetter, setCopiedLetter] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const activeData = data[selectedIndex]; // Dynamic data

  useEffect(() => { reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, []);
  const getScoreColor = (score: number) => score >= 75 ? 'text-teal-500 dark:text-teal-400' : score >= 50 ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400';

  const handleExportPDF = useReactToPrint({ contentRef: reportRef, documentTitle: `SmartATS_${activeData.filename}` });
  const handleCopyLetter = () => { navigator.clipboard.writeText(activeData.cover_letter); setCopiedLetter(true); setTimeout(() => setCopiedLetter(false), 2000); };

  const missingTop = activeData.missing_keywords?.length > 0 ? activeData.missing_keywords.slice(0,2).join(' and ') : 'key requirements';
  const matchedTop = activeData.matched_keywords?.length > 0 ? activeData.matched_keywords[0] : 'your core skills';
  const suggestions = [
    { title: "Address top gaps", desc: `The JD weights ${missingTop} heavily. Add concrete projects or certifications to bridge this gap.` },
    { title: "Promote related experience", desc: `You list ${matchedTop}, which is closely related. Reframe a bullet to highlight transferable concepts.` },
    { title: "Quantify impact", desc: "Recruiters skim for numbers. Add a metric — % improvement, latency cut, etc." }
  ];

  return (
    <div ref={reportRef} className="space-y-8 animate-fade-in pt-12 border-t border-slate-200 dark:border-white/5">
      
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase mb-1">Results</p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Complete</h2>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExportPDF} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg">
            <Download size={16} /><span>Export PDF</span>
          </button>
          <button onClick={onReset} className="flex items-center space-x-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all">
            <X size={16} /><span>Clear All</span>
          </button>
        </div>
      </div>

      {/* 🏆 LEADERBOARD DASHBOARD */}
      {data.length > 1 && (
        <div className="bg-white dark:bg-[#131823] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none mb-12">
          <div className="p-5 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0B0E14]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <Trophy className="text-yellow-500 mr-2" size={20} /> Candidate Leaderboard
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Candidate File</th>
                  <th className="px-6 py-4">Match Score</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((candidate, idx) => (
                  <tr key={idx} className={`border-b border-slate-200 dark:border-white/5 transition-colors ${idx === selectedIndex ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{candidate.filename}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${candidate.match_percentage >= 75 ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' : candidate.match_percentage >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                        {candidate.match_percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedIndex(idx)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${idx === selectedIndex ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20'}`}>
                        {idx === selectedIndex ? 'Viewing' : 'View Report'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📊 DEEP DIVE REPORT (Currently Selected Candidate) */}
      <div className="space-y-8 bg-white dark:bg-[#0B0E14] p-4 rounded-2xl relative">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 absolute -top-4 left-4 bg-white dark:bg-[#0B0E14] px-4 py-1 border border-slate-200 dark:border-white/5 rounded-full shadow-sm">
          Report: {activeData.filename}
        </h3>
        
        <div className="grid md:grid-cols-4 gap-6 pt-6">
          <div className="bg-slate-50 dark:bg-[#131823] p-8 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center shadow-sm dark:shadow-none">
            <span className={`text-6xl font-black ${getScoreColor(activeData.match_percentage)}`}>{activeData.match_percentage}%</span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">Match Score</span>
          </div>
          
          <div className="bg-slate-50 dark:bg-[#131823] p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center shadow-sm dark:shadow-none space-y-2">
            <ShieldAlert size={28} className={activeData.ats_readability?.score > 80 ? 'text-teal-500' : 'text-yellow-500'} />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{activeData.ats_readability?.score}/100</span>
            <span className="text-xs font-medium text-slate-500 text-center">ATS Format Score</span>
            <p className="text-[10px] text-slate-400 text-center leading-tight mt-2">{activeData.ats_readability?.feedback}</p>
          </div>

          <div className="md:col-span-2 bg-slate-50 dark:bg-[#131823] p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3 shadow-sm dark:shadow-none flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Executive summary</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{activeData.short_summary}</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#131823] p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <div className="flex space-x-2 border-b border-slate-200 dark:border-white/10 pb-4 mb-6 overflow-x-auto custom-scrollbar">
            <button onClick={() => setActiveTab('matched')} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 transition-colors ${activeTab === 'matched' ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}><CheckCircle2 size={16} /><span>Matched ({activeData.matched_keywords?.length || 0})</span></button>
            <button onClick={() => setActiveTab('missing')} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 transition-colors ${activeTab === 'missing' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'text-slate-500'}`}><XCircle size={16} /><span>Missing ({activeData.missing_keywords?.length || 0})</span></button>
            <button onClick={() => setActiveTab('important')} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 transition-colors ${activeTab === 'important' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'text-slate-500'}`}><Target size={16} /><span>High Priority ({activeData.important_jd_keywords?.length || 0})</span></button>
          </div>
          <div className="min-h-[80px]">
            {activeTab === 'matched' && <div className="flex flex-wrap gap-2">{activeData.matched_keywords?.map((s, i) => <span key={i} className="bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">{s}</span>)}</div>}
            {activeTab === 'missing' && <div className="flex flex-wrap gap-2">{activeData.missing_keywords?.map((s, i) => <span key={i} className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">{s}</span>)}</div>}
            {activeTab === 'important' && <div className="flex flex-wrap gap-2">{activeData.important_jd_keywords?.map((s, i) => <span key={i} className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">{s}</span>)}</div>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-[#131823] p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Suggestions</h3>
            <div className="space-y-4">
              {suggestions.map((s, index) => (
                <div key={index} className="flex items-start space-x-4 bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 p-4 rounded-xl">
                  <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-medium mb-1">{s.title}</h4>
                    <p className="text-slate-600 dark:text-slate-500 text-[13px] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#131823] p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center"><FileText size={20} className="mr-2 text-indigo-500" /> AI Cover Letter</h3>
              <button onClick={handleCopyLetter} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-indigo-500 transition-colors">
                {copiedLetter ? <Check size={14} className="text-teal-500" /> : <Copy size={14} />} <span>{copiedLetter ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex-1 overflow-y-auto custom-scrollbar">
              <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">
                {activeData.cover_letter || "AI couldn't generate a cover letter."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
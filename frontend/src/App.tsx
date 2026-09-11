import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import MatchReport from './components/MatchReport';
import type { AiResult } from './types';

function App() {
  const [result, setResult] = useState<AiResult[] | null>(null); // Ippo ithu array!
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]); // Ippo multiple files
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleClear = () => { setResult(null); setJobDescription(''); setFiles([]); };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500/30 transition-colors duration-300 pb-20">
      <Navbar isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
      
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* HERO SECTION EPPODHUM THERIYUM FIX! 🔥 */}
        <HeroSection />
        
        <UploadSection 
          jobDescription={jobDescription} setJobDescription={setJobDescription}
          files={files} setFiles={setFiles}
          onAnalyzeSuccess={(data) => setResult(data)} 
        />
        
        {result && result.length > 0 && <MatchReport data={result} onReset={handleClear} />}
      </main>
    </div>
  );
}
export default App;
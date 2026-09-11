import { Sparkles, Sun, Moon } from 'lucide-react';

interface NavbarProps { 
  isDark: boolean; 
  toggleDark: () => void; 
}

export default function Navbar({ isDark, toggleDark }: NavbarProps) {
  const scrollToHowItWorks = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToAnalyze = () => document.getElementById('analyze-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className="border-b border-slate-200 dark:border-white/5 p-4 flex justify-between items-center bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
        <div className="bg-indigo-600 p-1.5 rounded-lg"><Sparkles size={20} className="text-white" /></div>
        <span className="font-bold text-lg tracking-wide text-slate-900 dark:text-white">SmartATS <span className="text-indigo-500 dark:text-indigo-400 text-sm font-medium">AI</span></span>
      </div>
      <div className="flex items-center space-x-6">
        <button onClick={scrollToAnalyze} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Analyze</button>
        <button onClick={scrollToHowItWorks} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">How it works</button>
        <button onClick={toggleDark} className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-yellow-400 hover:scale-110 transition-all">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
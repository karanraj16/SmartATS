export default function HeroSection() {
  return (
    <div className="space-y-24 mb-12 animate-fade-in">
      {/* Top Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-500/20 mb-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
          <span>Semantic matching & gap analysis</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Check how well your <br />
          resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600 dark:from-teal-400 dark:to-indigo-500">matches any job</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed pt-2">
          Upload your resume and paste a job description. Our AI analyzes both with semantic understanding and shows you exactly what to fix.
        </p>
      </div>

      {/* How it works (Scroll Target) */}
      <div id="how-it-works" className="scroll-mt-24 space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">How it works</p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Built like a tool you'd actually pay for.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-[#131823] p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors shadow-sm dark:shadow-none">
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">01</span>
            <h3 className="text-slate-900 dark:text-white font-semibold">Semantic, not literal</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Synonym graphs map "React" to "Frontend Framework" so you don't lose points on phrasing.</p>
          </div>
          <div className="bg-slate-50 dark:bg-[#131823] p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors shadow-sm dark:shadow-none">
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">02</span>
            <h3 className="text-slate-900 dark:text-white font-semibold">Importance-weighted</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Skills tagged "required" or "must-have" in the JD count more than nice-to-haves.</p>
          </div>
          <div className="bg-slate-50 dark:bg-[#131823] p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors shadow-sm dark:shadow-none">
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">03</span>
            <h3 className="text-slate-900 dark:text-white font-semibold">Private by default</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">All parsing runs securely. Your resume is immediately discarded after analysis.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
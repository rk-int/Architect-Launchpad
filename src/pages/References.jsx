import { FileText, ExternalLink, ShieldCheck, Link2 } from 'lucide-react'

const OFFICIAL_LINKS = [
  {
    title: 'Claude Certified Architect – Foundations Certification Exam Guide',
    url: 'https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F8lsy243ftffjjy1cx9lm3o2bw%2Fpublic%2F1773274827%2FClaude+Certified+Architect+%E2%80%93+Foundations+Certification+Exam+Guide.pdf',
    description: 'Official certification guide including exam blueprint, topic weightings, and practice scenarios.',
    badge: 'Official Guide'
  },
  {
    title: 'The Complete Guide to Building Skills for Claude',
    url: 'https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf',
    description: 'Anthropic playbook on designing structured prompts, tool definitions, and system integration workflows.',
    badge: 'System Playbook'
  },
  {
    title: 'A practical deployment guide (Claude for the financial industry)',
    url: 'https://www-cdn.anthropic.com/files/4zrzovbb/website/34783bca828d7fa331f515ced26f1c9232151b2c.pdf',
    description: 'Architecture details, security postures, and risk mitigation strategies for high-compliance financial use cases.',
    badge: 'Finance Case Study'
  },
  {
    title: 'A practical deployment guide (Claude for the legal industry)',
    url: 'https://www-cdn.anthropic.com/files/4zrzovbb/website/4b29cc317c727542642b5056e412cf8e779e13d8.pdf',
    description: 'Deploying agentic systems for discovery, analysis, and processing within legal constraints.',
    badge: 'Legal Case Study'
  }
]

export default function References() {
  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 max-w-3xl mx-auto space-y-6 relative z-10">
      
      {/* Header Banner */}
      <div className="border-b border-white/5 pb-4">
        <p className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-1">Resource Repository</p>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          References
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-1">Official Anthropic guidelines, blueprints, and industry deployment manuals</p>
      </div>

      {/* Main Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck size={14} className="text-orange-400" />
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Official Certification Documents
          </h3>
        </div>

        <div className="grid gap-4">
          {OFFICIAL_LINKS.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-glass rounded-2xl p-5 block border border-white/5 hover:border-orange-500/35 hover:shadow-[0_0_20px_rgba(255,107,0,0.06)] transition-all duration-300 relative group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <FileText size={18} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-orange-400/90 bg-orange-950/20 border border-orange-500/20 px-2 py-0.5 rounded-md">
                      {link.badge}
                    </span>
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-200 leading-snug group-hover:text-orange-400 transition-colors">
                    {link.title}
                  </h4>
                  
                  <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
                    {link.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Traps link callout */}
      <div className="neo-glass rounded-3xl p-5 border border-white/5 bg-slate-950/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
            Looking for Cheatsheet & Traps?
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            The 8 canonical traps and anti-patterns cheatsheet has moved to its own reference console.
          </p>
        </div>
        <a
          href="/reference"
          className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase bg-orange-600 hover:bg-orange-500 text-slate-950 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-[0_0_10px_rgba(255,107,0,0.15)] shrink-0"
        >
          <Link2 size={12} /> Traps Cheatsheet
        </a>
      </div>
      
    </div>
  )
}

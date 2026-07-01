import { Outlet, NavLink } from 'react-router-dom'
import { 
  Compass, 
  Target, 
  Trophy, 
  BookMarked, 
  Pointer, 
  Workflow, 
  BadgeCheck, 
  Activity, 
  Sliders, 
  Flame, 
  Sun, 
  Moon 
} from 'lucide-react'
import { getUser, computeStreak } from '../lib/storage'
import { getDefaultExamDate } from '../lib/constants'
import { useTheme } from '../lib/ThemeContext'

const NAV = [
  { to:'/', icon:Compass, label:'Dashboard', end:true, badge: { text: 'LIVE', type: 'live' } },
  { to:'/plan', icon:Target, label:'Learning Plan', badge: { text: 'PLAN', type: 'plan' } },
  { to:'/quiz', icon:Trophy, label:'Mock Tests', badge: { text: 'EXAM', type: 'exam' } },
  { to:'/references', icon:BookMarked, label:'References', badge: { text: 'DOCS', type: 'docs' } },
  { to:'/digest', icon:Pointer, label:'Architect Digest', badge: { text: 'GUIDES', type: 'guides' } },
  { to:'/roadmap', icon:Workflow, label:'Learning flow', badge: { text: 'FLOW', type: 'flow' } },
  { to:'/progress', icon:Activity, label:'Insights', badge: { text: 'STATS', type: 'stats' } },
  { to:'/settings', icon:Sliders, label:'Settings', badge: { text: 'CONFIG', type: 'config' } },
]

const BADGE_STYLES = {
  live: 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_6px_rgba(34,197,94,0.15)] animate-pulse',
  plan: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  exam: 'bg-red-500/10 text-red-400 border border-red-500/20',
  docs: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  guides: 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 border-none font-black animate-bounce',
  flow: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  bio: 'bg-stone-500/10 text-slate-400 border border-white/5',
  stats: 'bg-lime-500/10 text-lime-400 border border-lime-500/20',
  config: 'bg-slate-500/10 text-slate-400 border border-white/5',
}

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
    isActive 
      ? 'bg-gradient-to-r from-orange-600/20 to-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(255,107,0,0.06)]' 
      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
  }`

const bottomClass = ({ isActive }) =>
  `flex flex-col items-center gap-1 py-2 flex-shrink-0 min-w-[56px] text-[10px] font-medium transition-all duration-300 relative ${
    isActive ? 'text-orange-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
  }`

export default function Layout() {
  const user = getUser()
  const streak = computeStreak()
  const examDate = user?.examDate ? new Date(user.examDate) : new Date(getDefaultExamDate())
  const daysLeft = Math.max(0, Math.ceil((examDate - new Date()) / 86400000))
  const { theme, toggle } = useTheme()

  return (
    <div className="flex min-h-screen bg-animated text-stone-100 grid-matrix">
      
      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-4 left-4 bg-slate-950/80 backdrop-blur-xl border border-white/5 rounded-3xl z-30 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.15)] animate-pulse">
              <Target size={18} className="text-orange-400" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wide text-slate-100 leading-tight">Claude Certification</div>
              <div className="text-[11px] font-bold text-orange-400/90 leading-tight tracking-wider uppercase font-mono mt-0.5">Launchpad</div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label, end, badge }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-slate-200 transition-colors'} />
                  <span className="flex items-center gap-1.5 w-full min-w-0">
                    <span className="truncate">{label}</span>
                    {badge && (
                      <span className={`flex-shrink-0 text-[8px] tracking-wider px-1.5 py-0.5 rounded-md font-bold ml-auto uppercase ${BADGE_STYLES[badge.type]}`}>
                        {badge.type === 'guides' ? `👉 ${badge.text}` : badge.text}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_var(--orange-accent)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card & Settings toggle at Sidebar Bottom */}
        <div className="p-4 border-t border-white/5 bg-slate-950/40 rounded-b-3xl">
          <div className="flex items-center justify-between gap-3 bg-slate-900/40 border border-white/5 p-3 rounded-2xl">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Learner'}</div>
              <div className="flex items-center gap-2 mt-1">
                {streak > 0 ? (
                  <span className="flex items-center gap-0.5 text-[10px] text-orange-400 font-mono font-semibold">
                    <Flame size={10} className="fill-orange-400/20" /> {streak}d streak
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">No streak</span>
                )}
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded-md">{daysLeft}d left</span>
              </div>
            </div>
            <button
              onClick={toggle}
              className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-orange-400 hover:border-orange-500/20 transition-all duration-300 cursor-pointer flex-shrink-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={15} className="rotate-0 transition-transform duration-500" /> : <Moon size={15} className="rotate-0 transition-transform duration-500" />}
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-screen">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 h-16 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/15 border border-orange-500/30 flex items-center justify-center">
              <Target size={15} className="text-orange-400" />
            </div>
            <span className="font-black text-xs tracking-wider uppercase text-slate-100">Claude Certification Launchpad</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 px-2.5 py-1 rounded-xl text-[10px]">
              {streak > 0 && <span className="flex items-center gap-0.5 text-orange-400 font-mono font-bold"><Flame size={10} className="fill-orange-400/25"/> {streak}d</span>}
              <span className="text-slate-400 font-mono">{daysLeft}d left</span>
            </div>
            <button
              onClick={toggle}
              className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-orange-400 transition-colors"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        {/* Dynamic Outlet view frame */}
        <main className="flex-1 px-4 md:px-8 py-6 pb-24 lg:pb-8 relative z-10 page-enter">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* ── Crafted-by credit ── */}
        {/* 
        <div className="hidden lg:flex items-center justify-end px-8 py-3 border-t border-white/[0.03]">
          <p className="text-[10px] font-mono text-slate-600 tracking-wider select-none">
            Crafted by :{' '}
            <span className="text-orange-500/70 font-bold">Ravi Kiran</span>
          </p>
        </div>
        */}
        {/* Mobile credit — sits just above the floating nav */}
        {/* 
        <div className="lg:hidden flex justify-center pb-20 pt-2">
          <p className="text-[9px] font-mono text-slate-700 tracking-wider select-none">
            Crafted by : <span className="text-orange-500/60 font-bold">Ravi Kiran</span>
          </p>
        </div>
        */}

        {/* Mobile floating navigation capsule */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-35 flex justify-center">
          <nav className="w-full max-w-md bg-slate-950/90 backdrop-blur-xl border border-white/5 rounded-2xl flex px-2 py-1 shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-x-auto scrollbar-none">
            {NAV.map(({ to, icon: Icon, label, end }) => (
              <NavLink key={to} to={to} end={end} className={bottomClass}>
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-orange-400' : 'text-slate-500'} />
                    <span className="text-[9px] mt-0.5 flex items-center gap-0.5">
                      {label}
                      {label === 'Architect Digest' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                      )}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 w-4 h-0.5 rounded-full bg-orange-400 shadow-[0_0_6px_var(--orange-accent)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

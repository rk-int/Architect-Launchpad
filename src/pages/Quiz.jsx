import { useNavigate } from 'react-router-dom'
import { DOMAINS, QUIZ_QUESTIONS } from '../lib/data'
import { EXAM_QUESTIONS } from '../lib/examQuestions'
import { getQuizHistory } from '../lib/storage'
import { Brain, Clock, Target, Calendar, BarChart2, ShieldAlert } from 'lucide-react'

export default function Quiz() {
  const navigate = useNavigate()
  const history = getQuizHistory()

  const start = (type, domain = null) => {
    sessionStorage.setItem('cca_quiz_config', JSON.stringify({ type, domain, startedAt: Date.now() }))
    navigate('/quiz/active')
  }

  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 relative z-10 space-y-6 max-w-2xl">
      
      {/* Header telemetry info */}
      <div className="border-b border-white/5 pb-4">
        <p className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-1">Pillar 8 · Examination</p>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          Simulator Engine Console
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-1">
          {QUIZ_QUESTIONS.length + EXAM_QUESTIONS.length} Active CCA-specific assessment nodes loaded
        </p>
      </div>

      {/* 77-Question Certification Simulation Card */}
      <div className="neo-glass rounded-3xl p-6 relative overflow-hidden glowing-border-orange shadow-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full filter blur-xl" />
        <div className="flex items-center gap-2 mb-2">
          <Target size={14} className="text-orange-400" />
          <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-semibold">
            OFFICIAL 77-QUESTION SIMULATION
          </span>
        </div>
        <h3 className="font-black text-lg text-slate-100 leading-tight">CCA-F Mock Examination</h3>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mt-2 mb-5">
          <span className="flex items-center gap-1"><Clock size={12} /> 120 min timer</span>
          <span>•</span>
          <span>{EXAM_QUESTIONS.length} Questions</span>
          <span>•</span>
          <span className="text-orange-400/90 font-bold">Scaled 100 - 1000</span>
        </div>
        <button
          onClick={() => start('exam_simulation')}
          className="w-full bg-orange-600 hover:bg-orange-500 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,107,0,0.25)] hover:shadow-[0_0_25px_rgba(255,107,0,0.4)]"
        >
          Initialize Simulator Engine
        </button>
      </div>

      {/* Mini Mock Exam Card */}
      <div className="neo-glass rounded-3xl p-5 relative overflow-hidden border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={14} className="text-slate-400" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            MINI PRACTICE ASSESSMENTS
          </span>
        </div>
        <h3 className="font-bold text-sm text-slate-200">5-Domain Practice Run (Short Form)</h3>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 mt-2 mb-4">
          <span className="flex items-center gap-1"><Clock size={11} /> 100 min</span>
          <span>•</span>
          <span>{QUIZ_QUESTIONS.length} Questions</span>
        </div>
        <button
          onClick={() => start('mock')}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          Start Mini Assessment
        </button>
      </div>

      {/* Topic Quizzes */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono text-slate-400 tracking-widest uppercase">Targeted Topic Quizzes</h2>
        <div className="grid grid-cols-1 gap-2">
          {DOMAINS.map(d => {
            const count = QUIZ_QUESTIONS.filter(q => q.domain === d.id).length
            if (!count) return null
            return (
              <button
                key={d.id}
                onClick={() => start('topic', d.id)}
                className="w-full flex items-center gap-3.5 neo-glass rounded-2xl p-4 text-left border hover:border-orange-500/10 cursor-pointer group transition-all"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 group-hover:scale-105 transition-transform"
                  style={{ background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}25` }}
                >
                  {d.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-200 truncate group-hover:text-orange-400 transition-colors leading-tight">{d.label}</h4>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">
                    {count} questions · ~{count * 2} min · {d.weight}% of Blueprint
                  </span>
                </div>
                <Brain size={14} className="text-slate-600 group-hover:text-orange-400 transition-colors" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Attempts History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-mono text-slate-400 tracking-widest uppercase">Simulator Attempt Logs</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map((a, i) => {
              const isSim = a.type === 'exam_simulation'
              const passed = isSim ? a.scaledScore >= 720 : a.pct >= 70
              const scoreColor = passed ? 'text-green-400' : 'text-red-400'
              const glowColor = passed ? 'shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'shadow-[0_0_10px_rgba(239,68,68,0.1)]'

              return (
                <div key={i} className="flex items-center justify-between neo-glass rounded-2xl px-5 py-3.5 border-white/5">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-200 truncate">
                      {isSim ? '77-Question Simulator Run' : (a.type === 'mock' ? 'Mini Mock Exam' : `${a.domain} Targeted Quiz`)}
                    </h4>
                    <span className="text-[9px] text-slate-500 font-mono block mt-1">
                      Taken on {new Date(a.takenAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-base font-black font-mono leading-none ${scoreColor}`}>{isSim ? a.scaledScore : `${a.pct}%`}</div>
                      <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{isSim ? (passed ? 'PASS' : 'FAIL') : `${a.score} / ${a.total}`}</span>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'} ${glowColor}`} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

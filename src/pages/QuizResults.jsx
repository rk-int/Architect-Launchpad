import { useNavigate } from 'react-router-dom'
import { DOMAINS } from '../lib/data'
import ProgressRing from '../components/ProgressRing'
import { RotateCcw, Home, Award, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function QuizResults() {
  const navigate = useNavigate()
  const result = JSON.parse(sessionStorage.getItem('cca_quiz_result') || 'null')

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center bg-animated text-center p-8">
      <div className="neo-glass rounded-3xl p-6 max-w-sm space-y-4 border-white/5">
        <AlertTriangle className="text-orange-400 mx-auto" size={32} />
        <div className="text-sm font-mono text-slate-400">No assessment results log found in session.</div>
        <button onClick={() => navigate('/quiz')} className="bg-orange-600/10 border border-orange-500/30 text-orange-400 font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer">
          Go to Quiz
        </button>
      </div>
    </div>
  )

  const isExamSim = result.type === 'exam_simulation'
  const isPassed = isExamSim ? (result.scaledScore >= 720) : (result.pct >= 70)
  
  const grade = isExamSim 
    ? (isPassed ? 'PASS' : 'FAIL')
    : (result.pct >= 90 ? 'Excellent' : result.pct >= 70 ? 'Passing' : 'Needs Work')
     
  const gradeColor = isPassed ? '#adff00' : '#ef4444' // Cyber Lime vs Red
  const ringColor = isPassed ? '#adff00' : '#ef4444'
  const weak = Object.entries(result.domainScores || {}).filter(([, ds]) => Math.round(ds.correct / ds.total * 100) < 70)

  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 max-w-2xl mx-auto space-y-6 relative z-10">
      
      {/* Dynamic Results Core Panel */}
      <div className="neo-glass rounded-3xl p-6 text-center relative overflow-hidden glowing-border-orange shadow-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full filter blur-xl" />
        
        <div className="flex justify-center mb-4">
          <ProgressRing pct={result.pct} size={110} stroke={7} color={ringColor} />
        </div>

        <h2 className="text-2xl font-black tracking-widest uppercase mb-1" style={{ color: gradeColor }}>
          {grade}
        </h2>

        {isExamSim && (
          <div className="space-y-1 my-3">
            <div className="text-3xl font-black font-mono text-slate-100">{result.scaledScore}</div>
            <span className="text-[10px] text-slate-500 font-mono block">
              SCALED SCORE (PASSING MARKS: 720 / RANGE: 100 - 1000)
            </span>
          </div>
        )}

        <p className="text-sm text-slate-300 font-sans mt-2">
          {result.score} / {result.total} Questions answered correctly ({result.pct}%)
        </p>

        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mt-4 bg-slate-900 border border-white/5 text-slate-400">
          {isExamSim ? 'Official 77-Question Mock Simulation' : (result.type === 'mock' ? 'Full Practice Mock' : `${result.domain} Subject Assessment`)}
        </span>
      </div>

      {/* Domain Breakdown Progress bars */}
      {Object.keys(result.domainScores || {}).length > 0 && (
        <div className="neo-glass rounded-3xl p-5 md:p-6 space-y-4">
          <h3 className="text-xs font-mono text-slate-400 tracking-widest uppercase border-b border-white/5 pb-2">
            Domain Competency Readout
          </h3>
          <div className="space-y-4">
            {DOMAINS.filter(d => result.domainScores?.[d.id]).map(d => {
              const ds = result.domainScores[d.id]
              const dp = Math.round(ds.correct / ds.total * 100)
              const scoreBarColor = dp >= 70 ? '#adff00' : dp >= 50 ? '#ff8a00' : '#ef4444'

              return (
                <div key={d.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-sans font-medium">{d.label}</span>
                    <span className="text-slate-400">{ds.correct}/{ds.total} · {dp}%</span>
                  </div>
                  <div className="h-2 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${dp}%`,
                        background: scoreBarColor,
                        boxShadow: `0 0 8px ${scoreBarColor}50`
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recommended Review Actions */}
      {weak.length > 0 && (
        <div className="bg-red-950/15 border border-red-500/20 rounded-3xl p-5 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full filter blur-lg" />
          <h3 className="text-xs font-mono text-red-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <AlertTriangle size={12} /> Target Areas for Remediation
          </h3>
          <div className="space-y-1.5">
            {weak.map(([domain]) => {
              const d = DOMAINS.find(x => x.id === domain)
              return (
                <div key={domain} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-red-400 font-bold font-mono">→</span>
                  <span>{d?.label}: Re-read subject blueprint guides & rebuild weekly code exercises</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Question Itemized Logs */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-slate-400 tracking-widest uppercase">Itemized Scenario Log</h3>
        <div className="space-y-2">
          {result.answers.map((a, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4.5 space-y-2.5 transition-all ${
                a.correct 
                  ? 'bg-green-950/10 border-green-500/15' 
                  : 'bg-red-950/10 border-red-500/15'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  {a.correct ? (
                    <CheckCircle size={12} className="text-green-400" />
                  ) : (
                    <XCircle size={12} className="text-red-400" />
                  )}
                  <span className={a.correct ? 'text-green-400' : 'text-red-400'}>
                    {a.correct ? 'CORRECT // ACCURATE' : 'INCORRECT // MISCONCEPTION'}
                  </span>
                </span>
                <span className="text-slate-500">{a.domain} · SCENARIO {i + 1}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{a.questionText}</p>
              <div className="text-[11px] text-slate-400 font-sans leading-relaxed border-t border-white/5 pt-2 mt-2 italic">
                <span className="font-mono text-slate-500 uppercase tracking-widest text-[9px] block mb-1">Architect Reason:</span>
                {a.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retake / Back controls */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <button
          onClick={() => {
            sessionStorage.removeItem('cca_quiz_result')
            navigate('/quiz')
          }}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <RotateCcw size={14} /> Retake Quiz
        </button>
        
        <button
          onClick={() => {
            sessionStorage.removeItem('cca_quiz_result')
            navigate('/')
          }}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,107,0,0.2)]"
        >
          <Home size={14} /> Go to Dashboard
        </button>
      </div>
    </div>
  )
}

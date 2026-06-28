import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUIZ_QUESTIONS, DOMAINS } from '../lib/data'
import { EXAM_QUESTIONS } from '../lib/examQuestions'
import { saveQuizResult } from '../lib/storage'
import { X, Clock, AlertTriangle, ChevronRight } from 'lucide-react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function QuizActive() {
  const navigate = useNavigate()
  const config = JSON.parse(sessionStorage.getItem('cca_quiz_config') || '{}')
  
  const [questions] = useState(() => {
    const sourceQ = config.type === 'exam_simulation' ? EXAM_QUESTIONS : QUIZ_QUESTIONS
    const allQ = config.domain ? sourceQ.filter(q => q.domain === config.domain) : sourceQ
    return shuffle(allQ)
  })
  
  const timeLimit = (config.type === 'mock' || config.type === 'exam_simulation') ? 7200 : Math.min(questions.length * 120, 1200)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState([])
  const answersRef = useRef([])
  const timerRef = useRef(null)

  // Timer loop
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          doSubmit(answersRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Keyboard shortcut listener
  useEffect(() => {
    const handler = (e) => {
      if (!answered && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1
        if (idx < questions[current]?.options.length) handleSelect(idx)
      }
      if (answered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [answered, current])

  const doSubmit = (ans) => {
    clearInterval(timerRef.current)
    const score = ans.filter(a => a.correct).length
    const domainScores = {}
    ans.forEach(a => {
      if (!domainScores[a.domain]) domainScores[a.domain] = { correct: 0, total: 0 }
      domainScores[a.domain].total++
      if (a.correct) domainScores[a.domain].correct++
    })
    
    const pct = ans.length ? Math.round(score / ans.length * 100) : 0
    const scaledScore = ans.length ? (100 + Math.round((score / ans.length) * 900)) : 100

    const result = {
      type: config.type,
      domain: config.domain,
      score,
      total: ans.length,
      pct,
      scaledScore,
      domainScores,
      answers: ans,
      takenAt: Date.now(),
    }
    saveQuizResult(result)
    sessionStorage.setItem('cca_quiz_result', JSON.stringify(result))
    navigate('/quiz/results')
  }

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
  }

  const handleNext = () => {
    const q = questions[current]
    const newAns = [...answers, {
      questionId: q.id,
      questionText: q.question,
      options: q.options,
      correctIndex: q.correct,
      domain: q.domain,
      selected,
      correct: selected === q.correct,
      explanation: q.explanation,
    }]
    answersRef.current = newAns
    setAnswers(newAns)
    if (current + 1 >= questions.length) {
      doSubmit(newAns)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center bg-animated text-center p-8">
      <div className="neo-glass rounded-3xl p-6 max-w-sm space-y-4 border-white/5">
        <AlertTriangle className="text-orange-400 mx-auto" size={32} />
        <div className="text-sm font-mono text-slate-400">No questions found for this configuration selection.</div>
        <button onClick={() => navigate('/quiz')} className="bg-orange-600/10 border border-orange-500/30 text-orange-400 font-bold py-2 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer">
          Return to Console
        </button>
      </div>
    </div>
  )

  const q = questions[current]
  const domain = DOMAINS.find(d => d.id === q.domain)
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timePct = (timeLeft / timeLimit) * 100
  const timeColor = timePct > 50 ? 'text-green-400' : timePct > 20 ? 'text-amber-400 animate-pulse' : 'text-red-400 animate-bounce'

  return (
    <div className="min-h-screen bg-animated flex flex-col max-w-2xl mx-auto space-y-6 pb-12">
      
      {/* Sticky Telemetry HUD Timer bar */}
      <div className="sticky top-16 lg:top-4 z-20 neo-glass rounded-2xl px-5 py-3.5 shadow-xl border-white/5 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/quiz')}
          aria-label="Exit quiz"
          className="text-slate-500 hover:text-orange-400 hover:bg-slate-900 border border-transparent hover:border-white/5 transition-all p-1.5 rounded-xl cursor-pointer"
        >
          <X size={16} />
        </button>
        
        {/* Progress indicators */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">QUESTION READOUT</span>
          <span className="text-xs font-mono font-bold text-slate-200">{current + 1} of {questions.length}</span>
        </div>

        {/* Floating Timer Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/5 font-mono text-xs font-bold ${timeColor}`}>
          <Clock size={12} />
          <span>{mins}:{secs.toString().padStart(2, '0')}</span>
        </div>

        {/* Global Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-950 rounded-b-2xl overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Display */}
      <div className="flex-1 space-y-6">
        {/* Domain telemetry badge */}
        <div
          className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold border"
          style={{
            background: `${domain?.color || '#ff6b00'}15`,
            color: domain?.color || '#ff6b00',
            borderColor: `${domain?.color || '#ff6b00'}30`,
          }}
        >
          {q.domain} // {domain?.label || 'Cross-Domain'}
        </div>

        <h2 className="text-lg lg:text-xl font-bold text-slate-100 leading-snug tracking-tight">
          {q.question}
        </h2>

        {/* Keyboard hints */}
        {!answered && (
          <p className="text-[10px] text-slate-500 font-mono">
            PRESS KEYS [1 – {q.options.length}] TO SELECT OPTION · ENTER TO CONFIRM
          </p>
        )}

        {/* Option Plates */}
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let cls = 'bg-slate-900/60 border-white/5 text-slate-300'
            let glow = ''
            if (answered) {
              if (idx === q.correct) {
                cls = 'bg-green-950/25 border-green-500/40 text-green-400'
                glow = 'shadow-[0_0_15px_rgba(34,197,94,0.15)]'
              } else if (idx === selected && selected !== q.correct) {
                cls = 'bg-red-950/25 border-red-500/40 text-red-400'
              } else {
                cls = 'bg-slate-950/30 border-white/5 text-slate-600'
              }
            } else if (selected === idx) {
              cls = 'bg-orange-600/15 border-orange-500/40 text-orange-300'
              glow = 'shadow-[0_0_15px_rgba(255,107,0,0.15)]'
            }

            const stateIcon = answered && idx === q.correct 
              ? '✓' 
              : answered && idx === selected && selected !== q.correct 
              ? '✗' 
              : OPTION_LABELS[idx];

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left flex gap-3.5 p-4 rounded-2xl border transition-all duration-300 ${cls} ${glow} ${
                  !answered ? 'hover:border-orange-500/25 hover:bg-slate-900/70 cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Vector circular options */}
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-mono font-bold">
                  {stateIcon}
                </span>
                <span className="text-sm leading-relaxed">{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Detailed Explanation Panel */}
        {answered && (
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-2.5 slide-up">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-1">
              TELEMETRY ANALYSIS EXPLANATION
            </span>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Action Submit/Next Bar */}
      {answered && (
        <div className="border-t border-white/5 pt-5 flex flex-col items-center gap-3">
          <button
            onClick={handleNext}
            className="w-full bg-orange-600 hover:bg-orange-500 text-slate-950 font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,107,0,0.2)] hover:shadow-[0_0_25px_rgba(255,107,0,0.4)] flex items-center justify-center gap-1.5"
          >
            <span>{current + 1 >= questions.length ? 'FINISH ASSESSMENT' : 'NEXT SCENARIO'}</span>
            <ChevronRight size={14} className="stroke-[3]" />
          </button>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            PRESS [ENTER] TO ADVANCE
          </span>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, saveUser, exportData, importData, resetProgress } from '../lib/storage'
import { getDefaultExamDate, getWeeksDurationSafe } from '../lib/constants'
import { ChevronRight, Download, Upload, Trash2, ShieldAlert, Award, Save } from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const user = getUser() || {}
  const [name, setName] = useState(user.name || '')
  const [examDate, setExamDate] = useState(user.examDate || getDefaultExamDate())
  const [saved, setSaved] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  const durationWeeks = getWeeksDurationSafe(user.startedAt, examDate)
  const isValid = durationWeeks >= 3 && durationWeeks <= 9

  const handleSave = () => {
    if (!isValid) return
    saveUser({ ...user, name: name.trim() || user.name, examDate })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    setImportError('')
    try {
      await importData(file)
      window.location.reload()
    } catch (err) {
      setImportError('Invalid configuration file. Ensure it matches the schema.')
      setImporting(false)
    }
  }

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetProgress()
    navigate('/')
  }

  const Section = ({ title, children }) => (
    <div className="neo-glass rounded-3xl p-5 md:p-6 space-y-4 border-white/5">
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-1">
        {title} CONFIG
      </span>
      {children}
    </div>
  )

  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 max-w-lg mx-auto space-y-6 relative z-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <p className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-1">System Config</p>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          Claude Professional Settings
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-1">Configure profile details, schedule parameters, and state data</p>
      </div>

      {/* Profile settings */}
      <Section title="PROFILE">
        <div className="space-y-1.5">
          <label className="block text-xs text-slate-400 font-medium">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 focus:border-orange-500 rounded-xl px-4 py-3 text-slate-200 text-sm outline-none transition-all duration-300"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs text-slate-400 font-medium">Target Exam Date</label>
          <input
            type="date"
            value={examDate}
            onChange={e => setExamDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className="w-full bg-slate-950 border border-white/5 focus:border-orange-500 rounded-xl px-4 py-3 text-slate-200 text-sm outline-none transition-all duration-300"
          />
        </div>

        {/* Live validation feedback block */}
        {!isValid ? (
          <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] text-red-400 font-bold font-mono uppercase tracking-widest">
              ⚠️ TARGET DATE OUT OF RANGE
            </p>
            <p className="text-xs text-slate-400 leading-normal font-sans">
              Plan duration is <strong className="text-red-400 font-mono">{durationWeeks} weeks</strong>. You must select a target between 3 and 9 weeks from start date to save.
            </p>
          </div>
        ) : (
          <div className="bg-green-950/10 border border-green-500/20 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] text-green-400 font-bold font-mono uppercase tracking-widest">
              ✓ SCHEDULE PLAN CONFIRMED
            </p>
            <p className="text-xs text-slate-400 leading-normal font-sans">
              System study plan will adjust to exactly <strong className="text-green-400 font-mono">{durationWeeks} weeks</strong>.
            </p>
          </div>
        )}
        
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border disabled:opacity-35 disabled:cursor-not-allowed ${
            saved
              ? 'bg-green-950/20 border-green-500/30 text-green-400'
              : 'bg-orange-600 hover:bg-orange-500 text-slate-950 shadow-[0_0_15px_rgba(255,107,0,0.15)] hover:scale-[1.01]'
          }`}
        >
          <Save size={13} />
          {saved ? 'Changes Saved Successfully' : 'Save Profiles'}
        </button>
      </Section>

      {/* Backup and Restore data */}
      {/* 
      <Section title="DATA">
        <button
          onClick={exportData}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/50 hover:bg-slate-900 border border-white/5 rounded-xl text-slate-300 hover:text-slate-100 transition-all text-xs font-mono cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <Download size={14} className="text-orange-400" />
            EXPORT DATA BACKUP (JSON)
          </span>
          <ChevronRight size={13} className="text-slate-600" />
        </button>

        <div className="relative">
          <label className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/50 hover:bg-slate-900 border border-white/5 rounded-xl text-slate-300 hover:text-slate-100 transition-all text-xs font-mono cursor-pointer">
            <span className="flex items-center gap-2.5">
              <Upload size={14} className="text-lime-400" />
              {importing ? 'IMPORTING SYSTEM STATE…' : 'IMPORT DATA RESTORE (JSON)'}
            </span>
            <ChevronRight size={13} className="text-slate-600" />
            <input
              type="file"
              accept=".json"
              className="sr-only"
              onChange={handleImport}
              disabled={importing}
            />
          </label>
          {importError && (
            <p className="text-[10px] font-mono text-red-400 mt-2 px-1">{importError}</p>
          )}
        </div>
      </Section>
      */}

      {/* State Reset Danger zone */}
      <Section title="DANGER">
        <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-4 space-y-4">
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Resetting your progress logs will clear all task completion flags and mock exam diagnostic records permanently.
          </p>
          
          <button
            onClick={handleReset}
            className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
              confirmReset
                ? 'bg-red-900/40 border-red-500/50 text-red-200'
                : 'bg-slate-950 hover:bg-red-950/20 border-white/5 hover:border-red-500/30 text-red-400'
            }`}
          >
            <Trash2 size={13} />
            {confirmReset ? 'CONFIRM DESTRUCTIVE RESET' : 'RESET ALL PROGRESS'}
          </button>
          
          {confirmReset && (
            <button
              onClick={() => setConfirmReset(false)}
              className="w-full text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest text-center"
            >
              Cancel Reset
            </button>
          )}
        </div>
      </Section>
    </div>
  )
}

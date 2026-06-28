import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DOMAINS } from '../lib/data'
import { ShieldAlert, BookOpen, Search, ArrowLeft, Filter, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

const ANTI_PATTERNS = [
  {
    pattern: 'Subagent Context Inheritance',
    domain: 'D1',
    severity: 'HIGH',
    trap: "Assuming a spawned subagent automatically inherits the coordinator's prompt instructions, prior message history, or whitelisted tool results.",
    fix: 'Treat subagents as completely fresh, stateless sessions. Pass all necessary facts, goals, and target schemas explicitly in the task parameters payload.'
  },
  {
    pattern: '18-Tool Degradation Cliff',
    domain: 'D2',
    severity: 'MEDIUM',
    trap: 'Stacking too many tools (20+) on a single agent, assuming more capabilities is better. Tool selection accuracy drops sharply as descriptions blur in the attention window.',
    fix: 'Cap active tools at ~18 per agent. Decompose complex tasks and route them to specialized subagents with narrow, whitelisted tool mappings.'
  },
  {
    pattern: 'Bigger Model for a Design Problem',
    domain: 'Cross',
    severity: 'HIGH',
    trap: 'Upgrading the model tier (e.g. from Haiku to Sonnet, or increasing temperature/tokens) to resolve agentic loop errors that are actually caused by bad tool descriptions or lack of task decomposition.',
    fix: 'Fix the system design first: improve tool description parameters, add few-shot examples, and decompose tasks. Only upgrade model size when the system design is fully optimized.'
  },
  {
    pattern: 'Prompt-Tuned Safety Guardrails',
    domain: 'D4',
    severity: 'HIGH',
    trap: "Relying on natural language system prompt instructions (e.g., 'never close accounts without consent') to enforce high-stakes security, safety, or financial constraints.",
    fix: 'Use deterministic SDK interceptor hooks (e.g., PreToolUse or PostToolUse middleware) to programmatically validate inputs and block unauthorized tool execution.'
  },
  {
    pattern: 'Progressive Summarization Loss',
    domain: 'D5',
    severity: 'HIGH',
    trap: 'Relying on auto-summarizers to compress conversation history as it grows. Critical case facts, unique IDs, or system constraints get compressed away, leading to agent contradictions.',
    fix: "Implement a 'CASE_FACTS' block at the beginning of the context window that is pinned and explicitly exempted from progressive summarization."
  },
  {
    pattern: 'Lost-in-the-Middle Attention Decay',
    domain: 'D5',
    severity: 'MEDIUM',
    trap: 'Placing critical instructions, system rules, or schemas in the middle of a very long prompt context window where the model attention is weakest.',
    fix: 'Place critical reference data at the absolute start or end of the context window, and repeat critical instructions at the end of the prompt.'
  },
  {
    pattern: 'Blind Tool Schema Trust',
    domain: 'D2',
    severity: 'MEDIUM',
    trap: "Assuming the model's tool calls will perfectly comply with your JSON schema on the first attempt, leading to silent failures downstream.",
    fix: 'Validate all tool inputs against the schema programmatically, and feed validation errors back to the model in a retry loop (capped at 2-3 attempts).'
  },
  {
    pattern: 'CLAUDE.md Hierarchy Confusion',
    domain: 'D3',
    severity: 'LOW',
    trap: "Editing user-level or project-level CLAUDE.md rules and expecting them to override directory-specific constraints, or assuming rules resolve as a flat file.",
    fix: 'Understand cascading resolution precedence: project-level overrides user-level, and subdirectory CLAUDE.md cascades to override project-level. Run the `/memory` command to verify.'
  }
]

export default function Reference() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('All')

  const filteredPatterns = ANTI_PATTERNS.filter(p => {
    const matchesSearch = p.pattern.toLowerCase().includes(search.toLowerCase()) || 
                          p.trap.toLowerCase().includes(search.toLowerCase()) ||
                          p.fix.toLowerCase().includes(search.toLowerCase())
    const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain
    return matchesSearch && matchesDomain
  })

  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-850 pb-4">
        <div>
          <p className="text-xs font-mono text-stone-500 tracking-widest uppercase mb-1">Pillar 7 · Reference</p>
          <h1 className="text-2xl font-black text-stone-100 flex items-center gap-2">
            <ShieldAlert className="text-orange-500" size={24} />
            CCA-F Anti-Patterns & Cheatsheets
          </h1>
          <p className="text-sm text-stone-500 mt-1">Quick-lookup of the 8 canonical traps, distractors, and architecture rules</p>
        </div>
        <button onClick={() => navigate('/plan')} className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-xs font-mono bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
          <ArrowLeft size={12}/> Learning Plan
        </button>
      </div>

      {/* The Two Core Deciders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model vs Design */}
        <div className="bg-stone-900/60 border border-stone-850 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">Rule #1</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950/40 text-orange-400 border border-orange-900/30 font-mono">Model vs Design</span>
          </div>
          <h3 className="font-bold text-stone-100 text-sm">Design Optimization Over Scale</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-red-950/15 border border-red-900/20 rounded-lg">
              <span className="font-bold text-red-400 block mb-0.5">❌ Distractor Shape:</span>
              Suggests upgrading to a larger model, using more tokens, or adjusting temperature to fix agent errors.
            </div>
            <div className="p-2.5 bg-green-950/15 border border-green-900/20 rounded-lg">
              <span className="font-bold text-green-400 block mb-0.5">✓ Correct Shape:</span>
              Fixes system design—clarify tool descriptions, add targeted few-shot examples, or apply task decomposition.
            </div>
          </div>
          <p className="text-xs text-stone-500 italic leading-relaxed">
            <strong>Decision Rule:</strong> Fix architecture first. Only escalate the model tier after the design is fully optimized.
          </p>
        </div>

        {/* Prompt vs Hook */}
        <div className="bg-stone-900/60 border border-stone-850 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">Rule #2</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950/40 text-orange-400 border border-orange-900/30 font-mono">Prompt vs Hook</span>
          </div>
          <h3 className="font-bold text-stone-100 text-sm">Deterministic Policy Enforcement</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-red-950/15 border border-red-900/20 rounded-lg">
              <span className="font-bold text-red-400 block mb-0.5">❌ Distractor Shape:</span>
              Suggests adding compliance, safety, or financial constraints (e.g. refund limits) to the system prompt.
            </div>
            <div className="p-2.5 bg-green-950/15 border border-green-900/20 rounded-lg">
              <span className="font-bold text-green-400 block mb-0.5">✓ Correct Shape:</span>
              Uses deterministic SDK hooks (<code className="text-green-300">PreToolUse</code> / <code className="text-green-300">PostToolUse</code>) to programmatically block or redirect calls.
            </div>
          </div>
          <p className="text-xs text-stone-500 italic leading-relaxed">
            <strong>Decision Rule:</strong> If being wrong has a direct financial or security cost, the correct architecture requires a hook.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-stone-900/40 p-4 border border-stone-850 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
          <input 
            type="text"
            placeholder="Search anti-patterns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'D1', 'D2', 'D3', 'D4', 'D5', 'Cross'].map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                selectedDomain === dom 
                  ? 'bg-orange-600 border-orange-500 text-white font-bold' 
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {dom === 'All' ? 'All Domains' : dom === 'Cross' ? 'Cross-Domain' : dom}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Anti-Patterns Table */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-stone-850 flex items-center justify-between">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">8 Canonical Traps</span>
          <span className="text-[10px] text-stone-500 font-mono">Showing {filteredPatterns.length} of 8</span>
        </div>
        <div className="divide-y divide-stone-850">
          {filteredPatterns.map((ap, idx) => {
            const severityColor = ap.severity === 'HIGH' ? 'text-red-400 bg-red-950/30 border-red-900/30' : ap.severity === 'MEDIUM' ? 'text-amber-400 bg-amber-950/30 border-amber-900/30' : 'text-stone-400 bg-stone-950 border-stone-800';
            const domLabel = DOMAINS.find(d => d.id === ap.domain)?.label || 'Cross-Domain';
            return (
              <div key={idx} className="p-5 hover:bg-stone-850/20 transition-colors space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="font-bold text-stone-200 text-sm leading-tight">{ap.pattern}</h3>
                    <span className="text-[10px] text-stone-500 font-mono block mt-1">{ap.domain === 'Cross' ? 'Cross-Domain' : `${ap.domain} · ${domLabel}`}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${severityColor}`}>
                    {ap.severity} SEVERITY
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed mt-2 pt-2 border-t border-stone-850/30">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-red-400 tracking-wider block">❌ THE TRAP (DISTRACTOR):</span>
                    <p className="text-stone-400">{ap.trap}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-green-400 tracking-wider block">✓ THE ARCHITECTURAL FIX:</span>
                    <p className="text-stone-300">{ap.fix}</p>
                  </div>
                </div>
              </div>
            )
          })}
          {filteredPatterns.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-sm font-mono">No traps match your search filters</div>
          )}
        </div>
      </div>

      {/* Decision Cheatsheets */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono text-stone-500 uppercase tracking-widest">Decision Cheatsheets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* tool_choice Cheatsheet */}
          <div className="bg-stone-900 border border-stone-850 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-orange-500" />
              tool_choice Decision Guide
            </h3>
            <div className="space-y-2 text-xs">
              <div className="border-b border-stone-850 pb-2">
                <code className="text-orange-400 font-bold block mb-0.5">auto</code>
                <span className="text-stone-400">The model decides whether to use a tool or return text. Best for general conversations and natural loops.</span>
              </div>
              <div className="border-b border-stone-850 pb-2">
                <code className="text-orange-400 font-bold block mb-0.5">any</code>
                <span className="text-stone-400">Forces the model to call at least one of the available tools. Best when a tool call is required but the exact tool is selected dynamically.</span>
              </div>
              <div className="pb-1">
                <code className="text-orange-400 font-bold block mb-0.5">{"{ type: 'tool', name: 'x' }"}</code>
                <span className="text-stone-400">Forces the model to call the specific tool. Guarantees structured output or exact workflow routing.</span>
              </div>
            </div>
          </div>

          {/* Hooks vs CLAUDE.md Cheatsheet */}
          <div className="bg-stone-900 border border-stone-850 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-orange-500" />
              Hooks vs. CLAUDE.md Guide
            </h3>
            <div className="space-y-2 text-xs">
              <div className="border-b border-stone-850 pb-2">
                <span className="font-bold text-orange-400 block mb-0.5">SDK Hooks</span>
                <span className="text-stone-400">Enforces programmatic constraints (safety, logic blocks). Executes with 100% guarantee regardless of prompt drift. Use for billing limits and validations.</span>
              </div>
              <div className="border-b border-stone-850 pb-2">
                <span className="font-bold text-orange-400 block mb-0.5">Project CLAUDE.md</span>
                <span className="text-stone-400">Project-level instructions and conventions. Advisory guidelines for development and commands. Read automatically by Claude Code.</span>
              </div>
              <div className="pb-1">
                <span className="font-bold text-orange-400 block mb-0.5">User CLAUDE.md</span>
                <span className="text-stone-400">Personal editor preferences and local machine paths. Never commit this level to a team repository.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

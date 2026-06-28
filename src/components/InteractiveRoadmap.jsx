import { useState } from 'react'
import { HelpCircle, ChevronRight, Play, Settings2, ShieldCheck, Compass, GitMerge, FileCheck } from 'lucide-react'

const ROADMAP_NODES = [
  {
    id: 'begin',
    label: 'BEGIN',
    left: '8%',
    top: '81%',
    icon: '🚀',
    desc: 'Initialize the certification trajectory.',
    details: 'Week 1 Orientation, local setup, and system diagnostics.',
  },
  {
    id: 'foundations',
    label: 'AGENT FOUNDATIONS',
    left: '23.8%',
    top: '84%',
    icon: '📚',
    desc: 'Core principles of Anthropic model foundations.',
    details: 'LLM limits, non-determinism, and training parameters.',
  },
  {
    id: 'mcp',
    label: 'TOOLS & MCP',
    left: '39%',
    top: '64%',
    icon: '🔌',
    desc: 'Connecting Claude to tools and models.',
    details: 'Model Context Protocol server configurations and client hooks.',
  },
  {
    id: 'claude_code',
    label: 'CLAUDE CODE',
    left: '58%',
    top: '61%',
    icon: '💻',
    desc: 'Master the command CLI dev workflows.',
    details: 'Local project structures, CLAUDE.md guidelines, and print mode.',
  },
  {
    id: 'prompt_engineering',
    label: 'PROMPT ENGINEERING',
    left: '74%',
    top: '70%',
    icon: '✍️',
    desc: 'Structural engineering of prompt signals.',
    details: 'XML tag formats, system prompt schemas, and few-shot examples.',
  },
  {
    id: 'context',
    label: 'CONTEXT & RELIABILITY',
    left: '71%',
    top: '50%',
    icon: '🧠',
    desc: 'Context management & state retention.',
    details: 'Lost-in-the-middle positioning, caching, and token optimization.',
  },
  {
    id: 'monitoring',
    label: 'MONITORING & OPTIMIZATION',
    left: '89%',
    top: '47%',
    icon: '📊',
    desc: 'Telemetry, logging, and performance analysis.',
    details: 'System prompt cache monitoring, and token execution costs.',
  },
  {
    id: 'planning',
    label: 'PLANNING & ORCHESTRATION',
    left: '62%',
    top: '33%',
    icon: '⚙️',
    desc: 'Orchestrating complex multi-agent flows.',
    details: 'Hub-and-spoke models, parallel subagent execution, and loops.',
  },
  {
    id: 'safety',
    label: 'SAFETY & GUARDRAILS',
    left: '74%',
    top: '28%',
    icon: '🛡️',
    desc: 'Programmatic input/output checks.',
    details: 'Moderation filters, toxic validation layers, and safety boundaries.',
  },
  {
    id: 'testing',
    label: 'EVALUITY & TESTING',
    left: '60%',
    top: '17%',
    icon: '🧪',
    desc: 'Systematic quality evaluations.',
    details: 'Automated test suite configurations and golden dataset scoring.',
  },
  {
    id: 'architect',
    label: 'CERTIFIED ARCHITECT',
    left: '73%',
    top: '7%',
    icon: '👑',
    desc: 'Reach the summit of Claude certification.',
    details: 'Practice simulations, final review checklist, and mock exams.',
  },
]

export default function InteractiveRoadmap() {
  const [activeNode, setActiveNode] = useState(null)

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-slate-950">
      {/* Landscape Base Image */}
      <img
        src="/assets/roadmap_bg.jpg"
        alt="Anthropic Claude Roadmap Landscape"
        className="w-full h-full object-cover object-center pointer-events-none opacity-85 select-none"
      />

      {/* Dynamic Animated Overlay Infographics */}
      
      {/* 1. Rotating gear overlay on Planning & Orchestration (near 62%, 33%) */}
      <div className="absolute left-[62.8%] top-[33.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <GitMerge className="text-orange-500 animate-slow-spin stroke-[1.2]" size={36} />
      </div>

      {/* 2. Rotating compass outline on Context & Reliability (near 71%, 50%) */}
      <div className="absolute left-[72%] top-[50.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-45">
        <Compass className="text-orange-400 animate-reverse-spin stroke-[1.2]" size={32} />
      </div>

      {/* 3. Glowing, floating crystals/prompt nodes on Prompt Engineering (near 74%, 70%) */}
      <div className="absolute left-[75.2%] top-[71%] -translate-x-1/2 -translate-y-1/2 pointer-events-none sparkle-node">
        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full shadow-[0_0_8px_#ff8c00] animate-ping" />
      </div>

      {/* 4. Pulsing beacon over the Final Archway Certified Architect (near 73%, 7%) */}
      <div className="absolute left-[73.8%] top-[8.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-2.5 h-2.5 bg-orange-400 rounded-full shadow-[0_0_12px_#ff6b00] animate-pulse" />
      </div>

      {/* Interactive Beacon Nodes */}
      {ROADMAP_NODES.map((node) => {
        const isActive = activeNode?.id === node.id

        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            style={{ left: node.left, top: node.top }}
          >
            {/* Pulsing Beacon Ring */}
            <div
              onMouseEnter={() => setActiveNode(node)}
              onMouseLeave={() => setActiveNode(null)}
              className="w-5 h-5 flex items-center justify-center cursor-pointer relative"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 group-hover:bg-orange-400 group-hover:scale-125 transition-all duration-300 shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
              <div className="roadmap-beacon absolute inset-0 rounded-full pointer-events-none" />
            </div>

            {/* Glowing Tooltip Popover */}
            {isActive && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 p-3.5 rounded-2xl bg-slate-950/95 border border-orange-500/30 shadow-[0_0_25px_rgba(255,107,0,0.25)] text-slate-100 space-y-1.5 z-40 backdrop-blur-md animate-float">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-1">
                  <span className="text-xs">{node.icon}</span>
                  <span className="text-[10px] font-mono text-orange-400 tracking-wider font-bold uppercase truncate">{node.label}</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-snug font-sans font-medium">{node.desc}</p>
                <p className="text-[9px] text-slate-400 font-sans leading-normal border-t border-white/5 pt-1 mt-1 italic">{node.details}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

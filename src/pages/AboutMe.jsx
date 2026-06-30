import { useTheme } from '../lib/ThemeContext'
import { User, Award, Cpu, ShieldCheck, Key } from 'lucide-react'

export default function AboutMe() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const certifications = [
    {
      category: 'Google Cloud',
      logo: 'gcp.svg',
      items: [
        { name: 'Google Cloud Professional Cloud Architect', badge: 'gcp-pca.png' },
        { name: 'Google Cloud Associate Cloud Engineer', badge: 'gcp-ace.png' }
      ]
    },
    {
      category: 'Amazon Web Services (AWS)',
      logo: 'aws.svg',
      items: [
        { name: 'AWS Certified Solutions Architect', badge: 'aws-sa.png' },
        { name: 'AWS Certified Cloud Practitioner', badge: 'aws-cp.png' }
      ]
    },
    {
      category: 'Microsoft',
      logo: 'microsoft.svg',
      items: [
        { name: 'Microsoft AI Skill Fest Achiever', badge: 'ms-ai.png' }
      ]
    },
    {
      category: 'Salesforce',
      logo: 'salesforce.svg',
      items: [
        { name: 'Salesforce Certified Data Cloud Consultant (Data 360)', badge: 'sf-data-cloud.png' },
        { name: 'Salesforce Certified Platform Data Architect', badge: 'sf-data-arch.png' },
        { name: 'Salesforce Certified AI Specialist', badge: 'sf-ai-spec.png' },
        { name: 'Salesforce Certified AI Associate', badge: 'sf-ai-assoc.png' },
        { name: 'Salesforce Certified Agentforce Specialist', badge: 'sf-agentforce.png' },
        { name: 'Salesforce Certified Platform Administrator', badge: 'sf-admin.png' },
        { name: 'Salesforce Certified MuleSoft Developer I', badge: 'sf-mule-dev.png' }
      ]
    },
    {
      category: 'MuleSoft',
      logo: 'mulesoft.svg',
      items: [
        { name: 'MuleSoft Certified Platform Architect – Level 1 (MCPA-L1)', badge: 'mule-platform-arch.png' },
        { name: 'MuleSoft Certified Integration Architect – Level 1', badge: 'mule-integration-arch.png' },
        { name: 'MuleSoft Certified Developer – Level 1 (Mule 4)', badge: 'mule-dev.png' }
      ]
    },
    {
      category: 'Oracle',
      logo: 'oracle.svg',
      items: [
        { name: 'Oracle APEX Cloud Developer', badge: 'oracle-apex.png' }
      ]
    },
    {
      category: 'Agile',
      logo: 'scrum.svg',
      items: [
        { name: 'Certified Scrum Professional ScrumMaster (CSP-SM)', badge: 'scrum-csp.png' }
      ]
    },
    {
      category: 'API Academy',
      logo: 'api-academy',
      items: [
        { name: 'API Academy Certified Security Architect', badge: 'api-security.png' },
        { name: 'API Academy Certified API Designer', badge: 'api-designer.png' }
      ]
    }
  ]

  const expertises = [
    'Enterprise Architecture',
    'AI & Generative AI Architecture',
    'Agentic AI Solutions',
    'Model Context Protocol (MCP)',
    'Retrieval-Augmented Generation (RAG)',
    'Large Language Models (LLMs)',
    'Enterprise AI Integration',
    'API Management & API Security',
    'Enterprise Integration',
    'MuleSoft Architecture',
    'Salesforce Data Cloud',
    'Salesforce AI & Agentforce',
    'Google Cloud Platform (GCP)',
    'Amazon Web Services (AWS)',
    'Microsoft Azure',
    'Kubernetes',
    'Docker',
    'Terraform',
    'DevOps & CI/CD',
    'Observability & Monitoring',
    'Serverless Computing',
    'Event-Driven Architecture',
    'Cloud Migration & Modernization',
    'Digital Transformation',
    'Solution Architecture',
    'Data Integration & Data Engineering'
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.12)]">
          <User size={22} className="text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            About Me
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Solutions Architect
          </p>
        </div>
      </div>

      {/* ── Profile Bio Card ── */}
      <div className="neo-glass rounded-3xl p-6 md:p-8 relative overflow-hidden glowing-border-orange">
        {/* Glow Ring */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar Placeholder */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-lg border border-white/10 flex-shrink-0 select-none mx-auto md:mx-0">
            <User size={36} className="text-slate-950" />
          </div>

          <div className="space-y-4 flex-1 text-center md:text-left">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                Enterprise Integration, Cloud, AI, and Digital Transformation Architect
              </span>
            </div>
            
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-light">
              Passionate engineer specialized in architecting advanced AI solutions, Model Context Protocol (MCP) integrations, and high-performance serverless systems. Creator of the Claude Certified Architect LaunchPad platform.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ── Left/Middle Column: Certifications ── */}
        <div className="lg:col-span-2 space-y-5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Award size={14} className="text-orange-400" />
            Professional Certifications & Achievements
          </h3>

          <div className="space-y-4">
            {certifications.map(c => (
              <div 
                key={c.category}
                className="neo-glass rounded-2xl p-5 border border-white/5 space-y-4 hover:border-orange-500/20 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0">
                    {c.logo === 'api-academy' ? (
                      <ShieldCheck size={18} className="text-orange-400" />
                    ) : (
                      <img
                        src={`/assets/logos/${c.logo}`}
                        alt={`${c.category} logo`}
                        className="w-full h-full object-contain"
                        style={{
                          filter: isDark ? 'invert(0.9) brightness(1.2)' : 'none'
                        }}
                      />
                    )}
                  </div>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                    {c.category}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {c.items.map(item => (
                    <div 
                      key={item.name} 
                      className="flex items-center gap-3 bg-slate-950/40 hover:bg-slate-950/70 border border-white/5 hover:border-orange-500/20 px-3 py-2.5 rounded-xl transition-all duration-300 group/item"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0 shadow-md group-hover/item:border-orange-500/30 transition-colors">
                        <img
                          src={`/assets/badges/${item.badge}`}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-slate-300 group-hover/item:text-orange-400 transition-colors leading-snug break-words">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Core Expertise ── */}
        <div className="space-y-5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Cpu size={14} className="text-orange-400" />
            Core Expertise
          </h3>

          <div className="neo-glass rounded-2xl p-5 border border-white/5 space-y-3">
            <div className="flex flex-wrap gap-2">
              {expertises.map(exp => (
                <span
                  key={exp}
                  className="text-[10px] font-mono font-semibold bg-slate-900 border border-white/5 hover:border-orange-500/30 text-slate-300 px-2.5 py-1 rounded-lg transition-colors cursor-default"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

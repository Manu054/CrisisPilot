import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowRight, 
  Brain, 
  Sliders, 
  History, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Database, 
  RotateCw,
  Sparkles,
  BarChart3,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#11182B] selection:bg-[#F0EEFF] selection:text-[#6D5CE7] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#FAFBFD]/90 backdrop-blur-md border-b border-[#E4E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D5CE7] to-[#9B8CF6] flex items-center justify-center text-white shadow-sm shadow-[#6D5CE7]/25">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-[#11182B]">Crisis<span className="text-[#6D5CE7]">Pilot</span></span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-[#F0EEFF] text-[#6D5CE7] rounded-md border border-[#6D5CE7]/20">
                Enterprise
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-[#69758C] hover:text-[#11182B] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#6D5CE7] hover:bg-[#5B4BC9] px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0EEFF] border border-[#6D5CE7]/20 text-[#6D5CE7] text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Decision Intelligence with HindSight Memory</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#11182B] leading-[1.15] mb-6">
          Your company should not solve the <span className="text-[#6D5CE7]">same crisis twice</span>.
        </h1>

        {/* Supporting description */}
        <p className="text-base sm:text-lg text-[#69758C] max-w-3xl mx-auto leading-relaxed mb-9">
          CrisisPilot helps businesses make smarter decisions during sales and inventory crises by combining current business data, organizational memory, historical decisions, and scenario simulation.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-[#6D5CE7] hover:bg-[#5B4BC9] shadow-md shadow-[#6D5CE7]/25 transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#11182B] bg-white hover:bg-slate-50 border border-[#E4E8F0] shadow-xs transition-all cursor-pointer"
          >
            <span>Sign In</span>
          </button>
        </div>

        {/* Core Capabilities Pills */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left max-w-4xl mx-auto">
          {[
            { title: "Analyze current crisis", desc: "Live SKU runways, margin erosion, & overstock risks" },
            { title: "Retrieve historical cases", desc: "Semantic recall of similar institutional precedents" },
            { title: "Learn from outcomes", desc: "Track exact revenue and clearance margins achieved" },
            { title: "Simulate candidate strategies", desc: "Deterministic mathematical modeling before commit" },
            { title: "Recommend evidence actions", desc: "Multi-agent synthesis grounded in past truth" },
            { title: "Preserve as memory", desc: "Retain outcome into HindSight for future crises" },
          ].map((cap, i) => (
            <div key={i} className="bg-white border border-[#E4E8F0] rounded-xl p-3.5 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#6D5CE7] shrink-0" />
                <span className="text-xs font-semibold text-[#11182B]">{cap.title}</span>
              </div>
              <p className="text-[11px] text-[#69758C] pl-6 leading-normal">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Architectural Decision Loop Flow */}
      <section className="py-16 bg-white border-y border-[#E4E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-widest text-[#6D5CE7] uppercase mb-2">The Closed-Loop Decision Engine</h2>
            <p className="text-2xl font-bold text-[#11182B] tracking-tight">How Institutional Knowledge Drives Action</p>
            <p className="text-xs text-[#69758C] mt-2">Every crisis resolved compounds into long-term organizational advantage.</p>
          </div>

          {/* Stepper Grid with Flow Arrows */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 items-center">
            {[
              { step: "01", label: "CURRENT CRISIS", sub: "Overstock, Expiry, or Sales Drop", icon: AlertIcon },
              { step: "02", label: "HISTORICAL MEMORY", sub: "HindSight Precedents Recalled", icon: Brain },
              { step: "03", label: "STRATEGY SIMULATION", sub: "Deterministic Financial Runs", icon: Sliders },
              { step: "04", label: "DECISION", sub: "Evidence-Backed Synthesis", icon: Compass },
              { step: "05", label: "OUTCOME", sub: "Channel Execution Tracked", icon: BarChart3 },
              { step: "06", label: "LEARN", sub: "Results Retained in Bank", icon: Database },
              { step: "↻", label: "FUTURE CRISIS", sub: "Higher Confidence Next Time", icon: RotateCw },
            ].map((node, index) => {
              const Icon = node.icon;
              const isHighlight = index === 1 || index === 5;
              return (
                <div 
                  key={index} 
                  className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all ${
                    isHighlight 
                      ? 'bg-[#F0EEFF]/50 border-[#6D5CE7]/30 shadow-xs' 
                      : 'bg-[#FAFBFD] border-[#E4E8F0]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${
                    isHighlight ? 'bg-[#6D5CE7] text-white' : 'bg-white text-[#6D5CE7] border border-[#E4E8F0]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#6D5CE7] tracking-wider uppercase mb-1">{node.step}</span>
                  <span className="text-xs font-bold text-[#11182B] leading-tight mb-1">{node.label}</span>
                  <span className="text-[10px] text-[#69758C] leading-snug">{node.sub}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why CrisisPilot Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-white to-[#F8FAFC] border border-[#E4E8F0] rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6D5CE7]">Why CrisisPilot?</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#11182B] tracking-tight mt-2 mb-6">
              Current data tells you what is happening.<br />
              <span className="text-[#6D5CE7]">Historical memory tells you what your organization has already learned.</span>
            </h3>
            <p className="text-sm sm:text-base text-[#69758C] leading-relaxed mb-6">
              CrisisPilot brings both together when the next decision matters. Most retail and consumer enterprises lose millions discounting blindly during excess stock situations because teams forget what promotion depths, channel shifts, and bundle configurations actually worked 12 months ago.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E4E8F0]">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</div>
                <div>
                  <h4 className="text-xs font-bold text-[#11182B]">Traditional Reactive Approach</h4>
                  <p className="text-[11px] text-[#69758C] mt-0.5">Siloed spreadsheets, ad-hoc gut feel, uncoordinated panic markdowns, and repeated expensive mistakes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-[#11182B]">CrisisPilot Decision Intelligence</h4>
                  <p className="text-[11px] text-[#69758C] mt-0.5">Instant memory recall, deterministic strategy simulations, objective risk controls, and automated institutional learning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HindSight-Powered Organizational Memory Section */}
      <section className="py-16 bg-[#FAFBFD] border-t border-[#E4E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F0EEFF] text-[#6D5CE7] text-xs font-semibold mb-3 border border-[#6D5CE7]/20">
                <Brain className="w-3.5 h-3.5" />
                <span>Memory Layer</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#11182B] tracking-tight mb-4">
                HindSight-powered organizational memory
              </h3>
              <p className="text-sm text-[#69758C] leading-relaxed mb-5">
                CrisisPilot integrates Vectorize’s official HindSight engine directly into your enterprise workspace. It records previous crises, decisions taken, financial outcomes, markdown depths, and qualitative lessons learned.
              </p>
              <p className="text-sm text-[#69758C] leading-relaxed">
                When a new crisis emerges, HindSight performs semantic vector recall across historical case documents, ensuring recommendations are backed by empirical organizational truth—never generic guesses.
              </p>
            </div>

            <div className="lg:col-span-5 bg-white border border-[#E4E8F0] rounded-2xl p-6 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E8F0]">
                <span className="text-xs font-bold text-[#11182B]">Institutional Precedent Recall</span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">94% Similarity</span>
              </div>
              <div className="bg-[#FAFBFD] border border-[#E4E8F0] rounded-xl p-3">
                <span className="text-[11px] font-semibold text-[#11182B]">Case #104: Legacy Batch Overstock</span>
                <p className="text-[10px] text-[#69758C] mt-1 leading-normal">
                  "Bundled 46k units with accessory kit at 15% discount. Cleared 74% stock in 52 days with 24.1% margin."
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#69758C] pt-1">
                <span>Verified Historical Outcome:</span>
                <span className="font-semibold text-emerald-600">+₹3.15 Cr Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: 6-Step Methodology */}
      <section className="py-20 bg-white border-t border-[#E4E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-xs font-bold tracking-widest text-[#6D5CE7] uppercase mb-2">How It Works</h2>
            <p className="text-2xl font-bold text-[#11182B] tracking-tight">Six Steps from Problem to Resolution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { num: "1", title: "Understand", desc: "Quantify current inventory, run rate, unit price, cost floor, and expiration runway.", icon: Layers },
              { num: "2", title: "Remember", desc: "Retrieve verified organizational memories and past cases with high situational similarity.", icon: Brain },
              { num: "3", title: "Compare", desc: "Evaluate alternative candidates (Markdowns, Bundles, Channel Shifts, Liquidation).", icon: Sliders },
              { num: "4", title: "Simulate", desc: "Calculate clearance velocity, margin dilution, and financial returns deterministically.", icon: TrendingUp },
              { num: "5", title: "Decide", desc: "Review evidence-backed recommendation, risks, and next steps with executive signoff.", icon: CheckCircle2 },
              { num: "6", title: "Learn", desc: "Record actual performance outcomes; retain findings back into HindSight memory.", icon: Database },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-[#FAFBFD] border border-[#E4E8F0] rounded-xl p-5 hover:border-[#6D5CE7]/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-md bg-[#F0EEFF] text-[#6D5CE7] font-bold text-xs flex items-center justify-center">
                      {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-[#69758C]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#11182B] mb-1">{step.title}</h4>
                  <p className="text-xs text-[#69758C] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-[#11182B] rounded-3xl p-10 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 text-white">
              Ready to make your next decision with organizational memory?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
              Sign in with your enterprise credentials or launch your organization’s dedicated decision workspace in seconds.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-[#11182B] bg-white hover:bg-slate-100 shadow-md transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer className="mt-auto border-t border-[#E4E8F0] bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#69758C]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#6D5CE7]" />
            <span className="font-semibold text-[#11182B]">CrisisPilot</span>
            <span>— AI Decision Intelligence for Business</span>
          </div>
          <div>
            <span>Powered by HindSight Institutional Memory & Deterministic Simulations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AlertIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

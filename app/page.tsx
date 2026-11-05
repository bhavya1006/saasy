"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  Download,
  ExternalLink,
  FileText,
  Flag,
  Globe2,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Target as TargetIcon,
  X,
} from "lucide-react";

type Step = "overview" | "intake" | "profile" | "competitors" | "opportunities" | "plan" | "report";
type View = "landing" | "loading" | "workspace";

const steps: { id: Step; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "intake", label: "Business intake", icon: Globe2 },
  { id: "profile", label: "Profile review", icon: FileText },
  { id: "competitors", label: "Competitors", icon: Search },
  { id: "opportunities", label: "Opportunities", icon: TargetIcon },
  { id: "plan", label: "Action plan", icon: Flag },
  { id: "report", label: "Report", icon: BarChart3 },
];

const competitorSeed = [
  { name: "Northstar Studio", type: "Direct", scale: "Regional", score: 86, source: "Public website", approved: true },
  { name: "Morrow & Co.", type: "Direct", scale: "City / district", score: 78, source: "Public website", approved: true },
  { name: "The Workshop Collective", type: "Aspirational", scale: "National", score: 64, source: "Manual suggestion", approved: false },
];

const opportunities = [
  { title: "Make the service promise easier to find", category: "Visibility", priority: "High", score: 86, detail: "Your homepage leads with craft, but the first viewport does not state who the service is for.", action: "Add a one-line audience and outcome statement above the fold.", evidence: "Homepage · observed", effort: "2–4 hours" },
  { title: "Turn proof into a conversion path", category: "Customer experience", priority: "High", score: 78, detail: "Case studies are present but disconnected from the primary contact action.", action: "Add a project result and next step to each featured case study.", evidence: "Case studies · observed", effort: "1 day" },
  { title: "Own the comparison conversation", category: "Positioning", priority: "Medium", score: 68, detail: "Competitors explain their process more concretely than the current site.", action: "Publish a short process page that names three decision criteria.", evidence: "Competitor sample · inferred", effort: "1–2 days" },
];

const initialForm = { website: "https://northstar.studio", vertical: "Professional services", market: "Manchester, UK", audience: "Founder-led teams ready to grow", price: "Premium", stage: "Established", goal: "Create a steadier pipeline", budget: "£1,000–£2,500 / month" };

export default function HomePage() {
  const [view, setView] = useState<View>("landing");
  const [auditId, setAuditId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<Step>("overview");
  const [form, setForm] = useState(() => {
    if (typeof window === "undefined") return initialForm;
    const saved = window.localStorage.getItem("saas001-demo-intake");
    return saved ? { ...initialForm, ...JSON.parse(saved) } : initialForm;
  });
  const [approved, setApproved] = useState(competitorSeed.map((item) => item.approved));
  const [completed, setCompleted] = useState<number[]>([1]);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (view !== "loading") return;
    const timer = window.setTimeout(() => setView("workspace"), 2000);
    return () => window.clearTimeout(timer);
  }, [view]);

  const updateForm = (key: keyof typeof form, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    window.localStorage.setItem("saas001-demo-intake", JSON.stringify(next));
  };

  const exportReport = () => {
    const markdown = `# SaaS001 growth snapshot\n\n## ${form.website}\n\nGenerated in local demo mode on ${new Date().toLocaleDateString()}.\n\n## Top opportunities\n\n${opportunities.map((item, index) => `${index + 1}. **${item.title}** — ${item.action} (${item.evidence})`).join("\n")}\n\n> This report contains observations from a typed fixture. It is not a live audit and includes no search volume, traffic, revenue, or ranking claims.`;
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "saas001-growth-snapshot.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const goTo = (step: Step) => { setActiveStep(step); setMobileNav(false); };
  const startWorkspace = async () => {
    setView("loading");
    setAuditId(null);
    try {
      const response = await fetch("/api/audit/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: form.website }) });
      if (!response.ok) throw new Error("Audit service unavailable");
      const payload = await response.json() as { audit?: { id: string } };
      setAuditId(payload.audit?.id ?? null);
    } catch {
      setAuditId(null);
    }
  };

  if (view === "landing") return <Landing onStart={startWorkspace} />;
  if (view === "loading") return <Loading auditId={auditId} onComplete={() => setView("workspace")} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Sparkles size={16} /></div><span>SaaS001</span><span className="demo-chip">DEMO</span></div>
        <div className="workspace-switcher"><div className="workspace-avatar">N</div><div><strong>Northstar Studio</strong><small>Growth workspace</small></div><ChevronRight size={15} /></div>
        <nav className="nav-list" aria-label="Workspace navigation">
          <p className="nav-label">WORKSPACE</p>
          {steps.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${activeStep === id ? "active" : ""}`} onClick={() => goTo(id)}><Icon size={17} /><span>{label}</span>{id === "opportunities" && <span className="nav-count">3</span>}</button>)}
          <p className="nav-label nav-label-lower">SYSTEM</p>
          <button className="nav-item"><ShieldCheck size={17} /><span>Evidence & limits</span><CircleHelp size={14} className="muted-icon" /></button>
        </nav>
        <div className="sidebar-footer"><div className="status-dot" /><span>Local demo mode</span><button aria-label="Help"><CircleHelp size={15} /></button></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{steps.find((step) => step.id === activeStep)?.label}</strong></div><div className="topbar-actions"><span className="last-scan"><span className="status-dot" /> Demo data · not a live scan</span><button className="avatar-button" aria-label="Account">AM</button></div></header>

        <div className="content-wrap">
          {activeStep === "overview" && <Overview goTo={goTo} approved={approved} />}
          {activeStep === "intake" && <Intake form={form} updateForm={updateForm} onContinue={() => goTo("profile")} />}
          {activeStep === "profile" && <Profile form={form} onContinue={() => goTo("competitors")} />}
          {activeStep === "competitors" && <Competitors approved={approved} setApproved={setApproved} onContinue={() => goTo("opportunities")} />}
          {activeStep === "opportunities" && <Opportunities onContinue={() => goTo("plan")} />}
          {activeStep === "plan" && <ActionPlan completed={completed} setCompleted={setCompleted} onContinue={() => goTo("report")} />}
          {activeStep === "report" && <Report onExport={exportReport} />}
        </div>
      </main>
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return <main className="landing">
    <div className="landing-noise" />
    <header className="landing-nav"><div className="brand landing-brand"><div className="brand-mark"><Sparkles size={16} /></div><span>SaaS001</span></div><div className="landing-nav-actions"><span className="nav-status"><span className="status-dot" /> Evidence-first growth</span><button className="landing-login" onClick={onStart}>Open workspace <ArrowUpRight size={15} /></button></div></header>
    <section className="landing-hero"><div className="hero-copy"><span className="landing-kicker">GROWTH INTELLIGENCE / 001</span><h1>Find the next<br /><em>right move.</em></h1><p>Turn your website, market context, and competitive landscape into a focused plan your team can actually use.</p><div className="hero-actions"><button className="landing-cta" onClick={onStart}>Build your growth snapshot <ArrowUpRight size={17} /></button><span className="hero-note"><ShieldCheck size={14} /> No API key required for demo mode</span></div></div><div className="orbit-art" aria-hidden="true"><div className="orbit-core"><Sparkles size={27} /></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="orbit-dot dot-one" /><div className="orbit-dot dot-two" /><span className="orbit-label label-top">OBSERVED</span><span className="orbit-label label-bottom">ACTIONABLE</span></div></section>
    <section className="landing-proof"><div><span className="proof-index">01</span><strong>Evidence before opinion</strong><p>Every signal is labeled observed, inferred, or unknown.</p></div><div><span className="proof-index">02</span><strong>Human approval stays central</strong><p>You decide which competitors and recommendations belong.</p></div><div><span className="proof-index">03</span><strong>A plan, not a report dump</strong><p>Leave with a small sprint and a clear next decision.</p></div></section>
    <footer className="landing-footer"><span>SaaS001 · Local demo mode</span><span>Built for thoughtful growth teams</span></footer>
  </main>;
}

function Loading({ auditId, onComplete }: { auditId: string | null; onComplete: () => void }) {
  useEffect(() => {
    let active = true;
    const checkStatus = async () => {
      if (!auditId) return;
      try {
        const response = await fetch(`/api/audit/${auditId}/status`, { cache: "no-store" });
        const payload = await response.json() as { audit?: { status: string } };
        if (active && payload.audit?.status === "completed") onComplete();
      } catch {
        if (active) onComplete();
      }
    };
    if (auditId) {
      void checkStatus();
      const interval = window.setInterval(() => void checkStatus(), 300);
      return () => { active = false; window.clearInterval(interval); };
    }
    const fallback = window.setTimeout(onComplete, 2000);
    return () => { active = false; window.clearTimeout(fallback); };
  }, [auditId, onComplete]);

  return <main className="loading-screen"><div className="loading-orbit"><div className="loader-core"><Sparkles size={21} /></div><div className="loader-curve curve-a" /><div className="loader-curve curve-b" /><div className="loader-curve curve-c" /></div><p className="loading-kicker">PREPARING YOUR WORKSPACE</p><h1>Gathering the signal<span className="loading-dots">...</span></h1><p className="loading-copy">Setting up your evidence map and growth starting point.</p><div className="loading-track"><span /></div><small>{auditId ? "Audit service · checking progress" : "Demo data · ready in a moment"}</small></main>;
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: React.ReactNode }) {
  return <div className="page-intro"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{copy}</p></div>{action}</div>;
}

function Overview({ goTo, approved }: { goTo: (step: Step) => void; approved: boolean[] }) {
  return <>
    <PageIntro eyebrow="Monday, 5 November 2026" title="Good morning, Alex." copy="Here is the clearest path from what your market is showing to what your team should do next." action={<button className="primary-button" onClick={() => goTo("intake")}><Sparkles size={16} /> Start an audit <ArrowUpRight size={16} /></button>} />
    <div className="hero-banner"><div><span className="banner-kicker">YOUR NEXT DECISION</span><h2>Make your service promise easier to find.</h2><p>We found a high-confidence visibility gap between your homepage and the audience you want to reach.</p><button className="text-button" onClick={() => goTo("opportunities")}>Review the opportunity <ArrowUpRight size={15} /></button></div><div className="banner-score"><span>86</span><small>priority</small></div></div>
    <div className="section-heading"><div><p className="eyebrow">AUDIT PROGRESS</p><h2>Northstar Studio growth snapshot</h2></div><span className="date-stamp">Fixture · 05 Nov 2026</span></div>
    <div className="metric-grid"><Metric label="Profile confidence" value="82%" note="7 of 9 fields confirmed" tone="blue" /><Metric label="Approved competitors" value={`${approved.filter(Boolean).length}/3`} note="Human review required" tone="orange" /><Metric label="Open opportunities" value="3" note="2 high priority" tone="green" /><Metric label="Plan progress" value="1/6" note="30-day starter plan" tone="purple" /></div>
    <div className="overview-grid"><div className="panel journey-panel"><div className="panel-heading"><div><p className="eyebrow">THE WORKFLOW</p><h3>From evidence to action</h3></div><span className="quiet-label">P0 DEMO</span></div>{["Business intake", "Profile review", "Competitor approval", "Opportunity finder", "30-day action plan"].map((item, index) => <button key={item} className="journey-row" onClick={() => goTo(steps[index + 1].id)}><span className={`journey-number ${index === 0 ? "done" : ""}`}>{index === 0 ? <Check size={13} /> : index + 1}</span><span>{item}</span><small>{index === 0 ? "Complete" : index === 1 ? "Ready for review" : "Up next"}</small><ChevronRight size={16} /></button>)}</div><div className="panel evidence-panel"><div className="panel-heading"><div><p className="eyebrow">TRUST LAYER</p><h3>What this report knows</h3></div><ShieldCheck size={20} className="green-icon" /></div><div className="evidence-item"><span className="legend-dot observed" /><div><strong>Observed</strong><small>Directly visible on a public page</small></div><b>12</b></div><div className="evidence-item"><span className="legend-dot inferred" /><div><strong>Inferred</strong><small>Reasoned from multiple signals</small></div><b>4</b></div><div className="evidence-item"><span className="legend-dot unknown" /><div><strong>Unknown</strong><small>Not available without permission</small></div><b>3</b></div><p className="panel-footnote">No rankings, traffic, revenue, or ROI have been estimated.</p></div></div>
  </>;
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) { return <div className="metric-card"><span className={`metric-icon ${tone}`}><span className={`metric-art metric-art-${tone}`} /></span><div><span className="metric-label">{label}</span><strong>{value}</strong><small>{note}</small></div></div>; }

function Intake({ form, updateForm, onContinue }: { form: typeof initialForm; updateForm: (key: keyof typeof initialForm, value: string) => void; onContinue: () => void }) {
  const fields: [keyof typeof initialForm, string, string][] = [["website", "Website URL", "https://"], ["vertical", "Vertical", "e.g. Professional services"], ["market", "Target market", "City, region, or service area"], ["audience", "Ideal audience", "Who do you want to reach?"], ["price", "Price position", "Premium, mid-market, or accessible"], ["stage", "Business stage", "Established, growing, or new"], ["goal", "Primary growth goal", "What would make this useful?"], ["budget", "Approximate marketing budget", "Monthly working range"]];
  return <><PageIntro eyebrow="STEP 01 / BUSINESS INTAKE" title="Start with the context only you know." copy="A useful growth report begins with your reality. These details shape the questions we ask and keep comparisons honest." /><div className="form-panel"><div className="form-grid">{fields.map(([key, label, placeholder]) => <label key={key} className={key === "goal" || key === "website" ? "wide-field" : ""}><span>{label}</span><input value={form[key]} onChange={(event) => updateForm(key, event.target.value)} placeholder={placeholder} /></label>)}</div><div className="local-note"><Globe2 size={18} /><div><strong>Local discovery radius</strong><p>We will use a 25 km starting radius for local competitor discovery. You can adjust this later.</p></div><button className="small-toggle" aria-label="Local discovery enabled"><span /></button></div><div className="form-footer"><span><ShieldCheck size={15} /> Saved to this browser</span><button className="primary-button" onClick={onContinue}>Review profile <ChevronRight size={16} /></button></div></div></>;
}

function Profile({ form, onContinue }: { form: typeof initialForm; onContinue: () => void }) { return <><PageIntro eyebrow="STEP 02 / PROFILE REVIEW" title="This is the working truth." copy="We have turned your intake into a starting profile. Confirm what is right, edit what is not, and keep unknowns visible." action={<button className="secondary-button"><FileText size={16} /> Edit all fields</button>} /><div className="profile-layout"><div className="panel profile-card"><div className="profile-title"><div className="profile-logo">N</div><div><h2>Northstar Studio</h2><p>{form.website}</p></div><span className="confidence-badge"><Check size={13} /> 82% confident</span></div><div className="profile-fields">{[["Category", form.vertical, "Intake"], ["Audience", form.audience, "Intake"], ["Market", form.market, "Intake"], ["Price position", form.price, "User confirmed"], ["Growth goal", form.goal, "User confirmed"], ["Differentiation", "Unknown until evidence review", "Unavailable"]].map(([label, value, source]) => <div className="profile-field" key={label}><span>{label}</span><strong>{value}</strong><small>{source}</small></div>)}</div></div><div className="panel side-note"><span className="note-icon"><Sparkles size={17} /></span><h3>One useful constraint</h3><p>We will compare visible offers and proof, not private performance. That keeps the report actionable without inventing certainty.</p><button className="text-button" onClick={onContinue}>Continue to competitors <ArrowUpRight size={15} /></button></div></div></>; }

function Competitors({ approved, setApproved, onContinue }: { approved: boolean[]; setApproved: (value: boolean[]) => void; onContinue: () => void }) { return <><PageIntro eyebrow="STEP 03 / HUMAN REVIEW" title="Choose who belongs in the comparison." copy="Suggestions are hypotheses, not facts. Approve only the businesses you would genuinely learn from." action={<button className="secondary-button"><Search size={16} /> Add competitor</button>} /><div className="review-toolbar"><span><strong>{approved.filter(Boolean).length}</strong> of 3 approved</span><span className="toolbar-note"><ShieldCheck size={15} /> Sources and dates stay attached</span></div><div className="competitor-list">{competitorSeed.map((item, index) => <div className={`competitor-row ${approved[index] ? "approved" : ""}`} key={item.name}><div className={`company-mark mark-${index}`}>{item.name.charAt(0)}</div><div className="competitor-main"><div className="name-line"><h3>{item.name}</h3><span className={`relationship ${item.type.toLowerCase()}`}>{item.type}</span></div><p>{item.source} · Retrieved 05 Nov 2026</p><div className="factor-list"><span>Offering overlap <b>{item.score}%</b></span><span>Audience fit <b>{item.score - 4}%</b></span><span>Geography <b>{item.scale}</b></span></div></div><div className="relevance-score"><strong>{item.score}</strong><small>relevance</small></div><button className={`approval-button ${approved[index] ? "is-approved" : ""}`} onClick={() => setApproved(approved.map((value, i) => i === index ? !value : value))} aria-label={`${approved[index] ? "Reject" : "Approve"} ${item.name}`}>{approved[index] ? <><Check size={15} /> Approved</> : <><X size={15} /> Reject</>}</button></div>)}</div><div className="continue-row"><span>Only approved competitors move into the comparison.</span><button className="primary-button" onClick={onContinue}>View opportunities <ChevronRight size={16} /></button></div></>; }

function Opportunities({ onContinue }: { onContinue: () => void }) { return <><PageIntro eyebrow="STEP 04 / OPPORTUNITY FINDER" title="Three moves worth making next." copy="Prioritized from observed evidence, competitive gaps, your growth goal, and practical feasibility. Scores are hypotheses, not forecasts." action={<span className="hypothesis-label"><CircleHelp size={15} /> Hypothesis weights · 30 / 25 / 20 / 15 / 10</span>} /><div className="opportunity-list">{opportunities.map((item, index) => <div className="opportunity-card" key={item.title}><div className="opp-rank">0{index + 1}</div><div className="opp-body"><div className="opp-topline"><span className="category-label">{item.category}</span><span className={`priority-label ${item.priority.toLowerCase()}`}>{item.priority} priority</span></div><h2>{item.title}</h2><p>{item.detail}</p><div className="opp-action"><ArrowUpRight size={15} /><strong>{item.action}</strong></div><div className="opp-meta"><span><FileText size={14} /> {item.evidence}</span><span><Flag size={14} /> {item.effort}</span><span><ExternalLink size={14} /> Proof: page updated</span></div></div><div className="opp-score"><strong>{item.score}</strong><small>priority</small></div></div>)}</div><div className="continue-row"><span>Every recommendation links back to a source or is marked unknown.</span><button className="primary-button" onClick={onContinue}>Build 30-day plan <ChevronRight size={16} /></button></div></>; }

function ActionPlan({ completed, setCompleted, onContinue }: { completed: number[]; setCompleted: (value: number[]) => void; onContinue: () => void }) { const tasks = ["Rewrite the homepage opening promise", "Add outcome-led proof to two case studies", "Draft the process comparison page", "Review the updated pages with a customer", "Publish and capture first-week questions", "Revisit the competitor shortlist"]; return <><PageIntro eyebrow="STEP 05 / 30-DAY STARTER PLAN" title="Turn insight into a small, owned sprint." copy="A focused first month creates evidence for the next decision. Assign owners and dates when you move this from demo mode into a workspace." action={<span className="plan-progress">{completed.length} / {tasks.length} complete</span>} /><div className="plan-layout"><div className="panel task-panel"><div className="timeline-line" />{tasks.map((task, index) => <button className={`task-row ${completed.includes(index) ? "task-done" : ""}`} key={task} onClick={() => setCompleted(completed.includes(index) ? completed.filter((item) => item !== index) : [...completed, index])}><span className="task-check">{completed.includes(index) && <Check size={14} />}</span><span className="task-week">W{index < 2 ? 1 : index < 4 ? 2 : 3}</span><span className="task-copy"><strong>{task}</strong><small>{index % 2 === 0 ? "Northstar team" : "Marketing owner"} · {index < 2 ? "This week" : "Next up"}</small></span><ChevronRight size={16} /></button>)}</div><div className="panel plan-summary"><p className="eyebrow">PLAN GUARDRAILS</p><h3>What success looks like</h3><p>One clearer promise, two stronger proof points, and a documented set of customer questions.</p><div className="summary-stat"><strong>£0–£500</strong><span>estimated first-month spend</span></div><div className="summary-stat"><strong>2–4 days</strong><span>focused team effort</span></div><button className="text-button" onClick={onContinue}>Open report <ArrowUpRight size={15} /></button></div></div></>; }

function Report({ onExport }: { onExport: () => void }) { return <><PageIntro eyebrow="FINAL / EXECUTIVE SNAPSHOT" title="A report you can act on." copy="This is the shape of the output: concise, sourced, and clear about what it cannot know." action={<button className="primary-button" onClick={onExport}><Download size={16} /> Export Markdown</button>} /><div className="report-header"><div><span className="report-status"><Check size={13} /> Snapshot ready</span><h2>Northstar Studio · growth snapshot</h2><p>Evidence window: 05 Nov 2026 · 3 public pages sampled · local demo fixture</p></div><div className="report-score"><strong>86</strong><span>next best move</span></div></div><div className="report-grid"><div className="panel report-section"><p className="eyebrow">THE RECOMMENDATION</p><h3>Make the service promise easier to find.</h3><p>Your homepage leads with craft, but the first viewport does not state who the service is for. Add one audience and outcome statement above the fold, then watch the questions it changes.</p><div className="source-link"><FileText size={14} /> Homepage · observed <ExternalLink size={13} /></div></div><div className="panel report-section"><p className="eyebrow">LIMITATIONS</p><h3>Known unknowns stay visible.</h3><ul><li>No search rankings or traffic were measured.</li><li>Social signals were not available in this fixture.</li><li>Competitor relevance needs your judgment.</li></ul></div></div><div className="evidence-strip"><ShieldCheck size={17} /><span>Evidence-backed by design</span><small>Observed, inferred, and unavailable signals are labeled throughout the report.</small></div></>; }
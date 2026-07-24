"use client";

import { useState } from "react";

type Case = {
  avatar: string;
  name: string;
  age: number;
  label: string;
  chief: string;
  note: string;
  vitals: { label: string; value: string; tone?: string }[];
  options: string[];
  correct: number;
  treatment: string;
  explanation: string;
};

const cases: Case[] = [
  {
    avatar: "👩🏾",
    name: "Maya Chen",
    age: 24,
    label: "First visit · 10 min",
    chief: "I’ve had a sore throat and cough for three days.",
    note: "No shortness of breath. Eating and drinking normally. Her housemate had a cold last week.",
    vitals: [
      { label: "Temp", value: "37.4°C" },
      { label: "Heart rate", value: "78 bpm" },
      { label: "O₂ saturation", value: "99%", tone: "good" },
    ],
    options: ["Viral upper respiratory infection", "Strep throat", "Bacterial pneumonia"],
    correct: 0,
    treatment: "Rest, fluids & symptom relief",
    explanation: "A cough with mild symptoms and normal oxygen levels makes a viral cold much more likely than a bacterial infection.",
  },
  {
    avatar: "👨🏻",
    name: "Elliot Brooks",
    age: 58,
    label: "Follow-up · 8 min",
    chief: "I keep getting thirsty and need the bathroom all night.",
    note: "Symptoms have gradually appeared over two months. No fever or pain when passing urine.",
    vitals: [
      { label: "Random glucose", value: "14.2 mmol/L", tone: "warn" },
      { label: "Heart rate", value: "82 bpm" },
      { label: "Blood pressure", value: "136/84" },
    ],
    options: ["Type 2 diabetes", "Urinary tract infection", "Dehydration only"],
    correct: 0,
    treatment: "Arrange HbA1c & lifestyle review",
    explanation: "Persistent thirst and frequent urination alongside a high random glucose strongly point to diabetes, which needs confirmation and support.",
  },
];

export default function Home() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [step, setStep] = useState<"diagnosis" | "treatment">("diagnosis");
  const [treatmentPicked, setTreatmentPicked] = useState(false);
  const [xp, setXp] = useState(240);
  const [showHint, setShowHint] = useState(false);
  const current = cases[caseIndex];
  const isCorrect = choice === current.correct;

  function chooseDiagnosis(index: number) {
    setChoice(index);
    if (index === current.correct) setXp((value) => value + 20);
  }

  function nextCase() {
    setCaseIndex((value) => (value + 1) % cases.length);
    setChoice(null);
    setStep("diagnosis");
    setTreatmentPicked(false);
    setShowHint(false);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Clinique home">
          <span className="brand-mark">+</span><span>clinique</span>
        </a>

        <nav aria-label="Main navigation">
          <a className="nav-item active" href="#today"><span>⌂</span>Today</a>
          <a className="nav-item" href="#learn"><span>◫</span>Learn</a>
          <a className="nav-item" href="#patients"><span>♧</span>Patients</a>
          <a className="nav-item" href="#progress"><span>◌</span>Progress</a>
        </nav>

        <section className="streak-card" aria-label="Learning streak">
          <div className="streak-top"><span className="flame">♨</span><strong>7 day streak</strong></div>
          <p>You’re building a habit. Keep it going.</p>
          <div className="week" aria-label="Seven day activity">
            {['M','T','W','T','F','S','S'].map((day, index) => <span className={index < 5 ? "done" : ""} key={`${day}-${index}`}>{index < 5 ? "✓" : day}</span>)}
          </div>
        </section>

        <div className="profile"><span className="profile-avatar">IQ</span><span><strong>Isabella</strong><small>Medical explorer</small></span><button aria-label="Profile options">•••</button></div>
      </aside>

      <section className="content" id="top">
        <header className="topbar">
          <div><p className="eyebrow">Friday, 24 July</p><h1>Good afternoon, Isabella <span>✦</span></h1></div>
          <div className="top-actions"><button className="xp-pill" aria-label="Experience points"><b>⚡</b> {xp} XP</button><button className="bell" aria-label="Notifications">♧<i /></button></div>
        </header>

        <section className="welcome" id="today">
          <div><p className="eyebrow">YOUR DAILY ROUND</p><h2>One patient. One lesson.<br /><em>One step closer to confident.</em></h2></div>
          <div className="round-progress"><span>Daily progress</span><strong>{step === "treatment" && treatmentPicked ? "2 / 2" : "1 / 2"}</strong><div><i style={{ width: step === "treatment" && treatmentPicked ? "100%" : "50%" }} /></div></div>
        </section>

        <div className="workspace">
          <article className="case-card" id="patients">
            <div className="case-header"><span className="tag">TODAY’S PATIENT</span><span className="case-count">Case {caseIndex + 1} of {cases.length}</span></div>
            <div className="patient-row"><div className="patient-avatar">{current.avatar}</div><div><h2>{current.name} <span>{current.age}</span></h2><p>{current.label}</p></div><button className="notes" aria-label="Open patient notes">▤</button></div>
            <blockquote>“{current.chief}”</blockquote>
            <p className="patient-note">{current.note}</p>
            <div className="vitals">{current.vitals.map((vital) => <div key={vital.label}><span>{vital.label}</span><strong className={vital.tone || ""}>{vital.value}</strong></div>)}</div>
            <p className="simulation-note">Learning simulation — these short cases build understanding, not clinical judgement for real patients.</p>

            {step === "diagnosis" ? <section className="question" aria-live="polite">
              <div className="question-title"><span className="step-number">01</span><div><p className="eyebrow">MAKE A CALL</p><h3>What’s the most likely diagnosis?</h3></div><button className="hint" onClick={() => setShowHint(!showHint)}>♡ Hint</button></div>
              {showHint && <p className="hint-copy">Start with what is reassuring: stable vital signs and no breathing difficulty.</p>}
              <div className="answers">
                {current.options.map((option, index) => <button key={option} onClick={() => chooseDiagnosis(index)} className={choice === null ? "" : index === current.correct ? "correct" : choice === index ? "incorrect" : "muted"}><span>{String.fromCharCode(65 + index)}</span>{option}{choice !== null && index === current.correct && <b>✓</b>}{choice === index && index !== current.correct && <b>↗</b>}</button>)}
              </div>
              {choice !== null && <div className={`feedback ${isCorrect ? "positive" : "retry"}`}><strong>{isCorrect ? "Nice clinical reasoning! +20 XP" : "Almost — look at the reassuring signs."}</strong><p>{isCorrect ? current.explanation : "Try the clue again or choose a different answer."}</p>{isCorrect ? <button onClick={() => setStep("treatment")}>Continue to treatment <span>→</span></button> : <button className="try-again" onClick={() => setChoice(null)}>Try again</button>}</div>}
            </section> : <section className="question treatment-step" aria-live="polite">
              <div className="question-title"><span className="step-number">02</span><div><p className="eyebrow">FIRST-LINE CARE</p><h3>What would you suggest first?</h3></div></div>
              <div className="treatment-option"><span className="treatment-icon">✚</span><div><strong>{current.treatment}</strong><p>Safe, supportive care for this presentation.</p></div><button disabled={treatmentPicked} onClick={() => { if (!treatmentPicked) { setTreatmentPicked(true); setXp((value) => value + 10); } }}>{treatmentPicked ? "Chosen ✓" : "Choose"}</button></div>
              {treatmentPicked && <div className="feedback positive"><strong>Round complete! +10 XP</strong><p>You’ve practised separating common viral illness from conditions that need urgent treatment.</p><button onClick={nextCase}>Meet next patient <span>→</span></button></div>}
            </section>}
          </article>

          <aside className="right-rail" id="learn">
            <section className="skill-card"><div className="mini-illustration"><span className="spark s1">+</span><span className="spark s2">✦</span><div className="book">▱</div></div><p className="eyebrow">KEEP EXPLORING</p><h3>Build your clinical instincts</h3><p>Short lessons that connect the dots.</p><button>Explore the basics <span>→</span></button></section>
            <section className="review-card" id="progress"><div className="review-head"><span className="review-icon">◷</span><div><p className="eyebrow">QUICK REVIEW</p><h3>3 cards waiting</h3></div></div><p>Refresh what you learned before it fades.</p><button>Review now <span>→</span></button></section>
            <section className="level-card"><div><span>LEVEL 2</span><strong>Curious clinician</strong></div><div className="level-track"><i style={{ width: `${Math.min(100, Math.round((xp / 500) * 100))}%` }} /></div><p>{xp} / 500 XP to level 3</p></section>
          </aside>
        </div>
      </section>
    </main>
  );
}

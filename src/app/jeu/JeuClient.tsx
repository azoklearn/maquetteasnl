"use client";

import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

export function JeuClient({ questions }: { questions: Question[] }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const q = questions[current];
  const total = questions.length;

  const score = answers.reduce(
    (acc, a, idx) => (a === questions[idx]?.correctIndex ? acc + 1 : acc),
    0,
  );

  function handleAnswer(optionIndex: number) {
    if (showResults) return;
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
  }

  function nextQuestion() {
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  }

  function restart() {
    setAnswers([]);
    setCurrent(0);
    setShowResults(false);
  }

  const selected = answers[current];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <div className="bg-[#111] border-b border-white/5 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.35em]">
            🔴 Quiz ASNL
          </p>
          <h1
            className="text-white text-4xl md:text-6xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Teste tes connaissances
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            Choisis ta réponse pour chaque question et découvre ton score final. Idéal pour défier
            tes amis supporters rouge et blanc.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8 text-sm md:text-base">
        {/* Carte principale du quiz */}
        <section className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-7 space-y-6 shadow-xl shadow-black/30">
          {/* Progression */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.35em]">
              Question {current + 1} / {total}
            </p>
            <p className="text-white/70 text-xs">
              Score provisoire :{" "}
              <span className="font-semibold text-white">
                {score} / {total}
              </span>
            </p>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#fd0000] transition-all"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="space-y-3">
            <h2
              className="text-white text-xl md:text-2xl font-black uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {q.question}
            </h2>
            <p className="text-white/40 text-xs">
              Clique sur une réponse pour la sélectionner.
            </p>
          </div>

          {/* Réponses */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect = showResults && idx === q.correctIndex;
              const isWrong =
                showResults && isSelected && selected !== q.correctIndex;

              let bg = "bg-white/5 hover:bg-white/10 border-white/10 text-white/80";
              if (isSelected && !showResults) {
                bg = "bg-[#fd0000] border-[#fd0000] text-white";
              }
              if (isCorrect) {
                bg = "bg-emerald-600/80 border-emerald-400 text-white";
              } else if (isWrong) {
                bg = "bg-red-600/80 border-red-400 text-white";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={showResults}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm md:text-base font-medium transition-all flex items-center gap-3 ${
                    showResults ? "cursor-default" : "cursor-pointer"
                  } ${bg}`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/20 border border-white/10 text-xs font-semibold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {!showResults ? (
              <button
                type="button"
                onClick={nextQuestion}
                disabled={selected === undefined}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#fd0000] hover:bg-[#cc0000] text-white font-bold text-sm uppercase tracking-[0.18em] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {current < total - 1 ? "Question suivante" : "Voir mon score"}
              </button>
            ) : (
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-[0.18em] transition-all"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Rejouer le quiz
              </button>
            )}

            {showResults && (
              <div className="text-right text-sm">
                <p className="text-white/70">
                  Ton score :{" "}
                  <span className="font-bold text-white">
                    {score} / {total}
                  </span>
                </p>
                <p className="text-white/40 text-xs">
                  {score === total
                    ? "Parfait, tu es imbattable sur l’ASNL."
                    : score >= 3
                    ? "Très bien, tu connais déjà bien le club."
                    : "Pas grave, tu feras mieux au prochain match !" }
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Rappel des bonnes réponses */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2
            className="text-white text-2xl md:text-3xl font-black uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ✅ Solutions du quiz
          </h2>
          <ul className="space-y-1 text-white/80">
            <li>
              <span className="font-semibold">1.</span> 1967
            </li>
            <li>
              <span className="font-semibold">2.</span> Michel Platini
            </li>
            <li>
              <span className="font-semibold">3.</span> Coupe de France
            </li>
            <li>
              <span className="font-semibold">4.</span> Stade Marcel-Picot
            </li>
            <li>
              <span className="font-semibold">5.</span> Rouge et blanc
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}


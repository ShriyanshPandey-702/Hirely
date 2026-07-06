import { downloadAnalysisPDF } from "../utils/generatePDF";
import { FiDownload } from "react-icons/fi";

// ── Small building blocks ────────────────────────────────────────────────

function Section({ title, count, children, className = "" }) {
  return (
    <section className={`card p-6 sm:p-7 ${className}`}>
      <header className="flex items-baseline justify-between gap-3 mb-5 pb-3 border-b border-[var(--hairline)]">
        <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{title}</h3>
        {count != null && (
          <span className="text-xs font-mono text-[var(--faint)] tabular-nums">
            {count}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

// Editorial list: hairline-separated rows with a restrained +/– marker.
function MarkerList({ items, tone }) {
  const mark = tone === "pos" ? "+" : "–";
  const color = tone === "pos" ? "var(--score-strong)" : "var(--danger)";
  return (
    <ul className="divide-y divide-[var(--hairline)]">
      {items.map((it, i) => (
        <li
          key={i}
          className="flex gap-3 py-2.5 first:pt-0 last:pb-0 text-sm leading-relaxed text-[var(--muted)]"
        >
          <span
            className="font-mono font-bold flex-shrink-0 select-none"
            style={{ color }}
            aria-hidden
          >
            {mark}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyNote({ children }) {
  return <p className="text-sm text-[var(--faint)] italic">{children}</p>;
}

function Chips({ items, variant }) {
  if (!items?.length) return <EmptyNote>None</EmptyNote>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((k, i) => (
        <span
          key={i}
          className={`text-sm px-2.5 py-1 ${variant === "match" ? "chip-match" : "chip-miss"}`}
        >
          {k}
        </span>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────

function AnalysisResult({ analysis }) {
  if (!analysis) return null;

  const circumference = 339.29;
  const score = analysis.matchScore ?? 0;
  const scoreOffset = circumference - (score / 100) * circumference;
  const scoreVar =
    score >= 75
      ? "var(--score-strong)"
      : score >= 50
      ? "var(--score-mid)"
      : "var(--score-low)";

  const hasSkills = analysis.matchedSkills?.length || analysis.missingSkills?.length;
  const hasKeywords =
    analysis.matchedKeywords?.length || analysis.missingKeywords?.length;

  return (
    <div className="space-y-5 fade-in-up">
      {/* Score hero — ring beside the verdict */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--ring-track)" strokeWidth="7" />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={scoreVar}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                className="score-ring-animate"
                style={{ "--score-offset": scoreOffset }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold tabular-nums" style={{ color: scoreVar }}>
                {score}
              </span>
              <span className="text-[var(--faint)] text-xs">/ 100</span>
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <p className="eyebrow mb-2">Match Score</p>
            <p className="font-display text-2xl sm:text-3xl font-semibold leading-tight" style={{ color: scoreVar }}>
              {analysis.recommendation}
            </p>
            <button
              onClick={() => downloadAnalysisPDF(analysis)}
              className="btn-accent inline-flex items-center gap-2 mt-5 px-5 py-2.5 font-semibold text-sm"
            >
              <FiDownload /> Download report
            </button>
          </div>
        </div>
      </div>

      {/* Skills — matched & missing together */}
      {hasSkills ? (
        <Section title="Skills">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <p className="eyebrow mb-3">Matched · {analysis.matchedSkills?.length || 0}</p>
              {analysis.matchedSkills?.length ? (
                <MarkerList items={analysis.matchedSkills} tone="pos" />
              ) : (
                <EmptyNote>No direct matches found.</EmptyNote>
              )}
            </div>
            <div>
              <p className="eyebrow mb-3">Missing · {analysis.missingSkills?.length || 0}</p>
              {analysis.missingSkills?.length ? (
                <MarkerList items={analysis.missingSkills} tone="neg" />
              ) : (
                <EmptyNote>Nothing major missing.</EmptyNote>
              )}
            </div>
          </div>
        </Section>
      ) : null}

      {/* Keywords — chips */}
      {hasKeywords ? (
        <Section title="Keywords">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <p className="eyebrow mb-3">Matched · {analysis.matchedKeywords?.length || 0}</p>
              <Chips items={analysis.matchedKeywords} variant="match" />
            </div>
            <div>
              <p className="eyebrow mb-3">Missing · {analysis.missingKeywords?.length || 0}</p>
              <Chips items={analysis.missingKeywords} variant="miss" />
            </div>
          </div>
        </Section>
      ) : null}

      {/* Strengths & Skill Gaps — side by side */}
      {(analysis.strengths?.length || analysis.skillGaps?.length) ? (
        <div className="grid md:grid-cols-2 gap-5">
          {analysis.strengths?.length > 0 && (
            <Section title="Candidate Strengths" count={analysis.strengths.length}>
              <MarkerList items={analysis.strengths} tone="pos" />
            </Section>
          )}
          {analysis.skillGaps?.length > 0 && (
            <Section title="Skill Gaps" count={analysis.skillGaps.length}>
              <MarkerList items={analysis.skillGaps} tone="neg" />
            </Section>
          )}
        </div>
      ) : null}

      {/* Reasoning — prose */}
      {analysis.reasoning && (
        <Section title="Reasoning">
          <p className="text-[15px] leading-relaxed text-[var(--muted)]">
            {analysis.reasoning}
          </p>
        </Section>
      )}

      {/* Suggestions — numbered */}
      {analysis.suggestions?.length > 0 && (
        <Section title="Suggestions" count={analysis.suggestions.length}>
          <ol className="space-y-4">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-sm font-bold text-[var(--accent)] tabular-nums flex-shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-[var(--muted)]">{s}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}

export default AnalysisResult;

import { useTheme } from "../context/ThemeContext";
import { downloadAnalysisPDF } from "../utils/generatePDF";

// Renders a full AI analysis breakdown (score ring + all sections + PDF download).
// Reused by the Dashboard (fresh result) and the History page (past result).
function AnalysisResult({ analysis }) {
  const { theme } = useTheme();

  if (!analysis) return null;

  const cardClass = "card";
  const secondaryText = "text-[var(--muted)]";

  const circumference = 339.29;
  const score = analysis.matchScore ?? 0;
  const scoreOffset = circumference - (score / 100) * circumference;

  const scoreVar =
    score >= 75
      ? "var(--score-strong)"
      : score >= 50
      ? "var(--score-mid)"
      : "var(--score-low)";

  return (
    <div className="space-y-5 fade-in-up">
      {/* ATS Score */}
      <div className={`${cardClass} p-8`}>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-2">
            <p className="eyebrow">Match Score</p>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
              style={{ color: scoreVar, borderColor: scoreVar }}
            >
              {analysis.recommendation}
            </span>
          </div>

          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--ring-track)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={scoreVar}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                className="score-ring-animate"
                style={{ "--score-offset": scoreOffset }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold" style={{ color: scoreVar }}>{score}</span>
              <span className="text-[var(--faint)] text-xs mt-0.5">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Report */}
      <div className="flex justify-center">
        <button
          onClick={() => downloadAnalysisPDF(analysis)}
          className="btn-accent px-6 py-3 font-semibold text-sm"
        >
          Download PDF Report
        </button>
      </div>

      {/* Matched Skills */}
      {analysis.matchedSkills?.length > 0 && (
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Matched Skills</h2>
          </div>
          <ul className="space-y-2.5">
            {analysis.matchedSkills.map((item, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm ${secondaryText} leading-relaxed`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Skills */}
      {analysis.missingSkills?.length > 0 && (
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Missing Skills</h2>
          </div>
          <ul className="space-y-2.5">
            {analysis.missingSkills.map((item, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm ${secondaryText} leading-relaxed`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Matched Keywords */}
      {analysis.matchedKeywords?.length > 0 && (
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">✓</div>
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider">Matched Keywords</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.matchedKeywords.map((keyword, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {analysis.missingKeywords?.length > 0 && (
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">✕</div>
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Missing Keywords</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Strengths */}
      {analysis.strengths?.length > 0 && (
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">Candidate Strengths</h2>
          </div>
          <ul className="space-y-2.5">
            {analysis.strengths.map((item, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm ${secondaryText} leading-relaxed`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skill Gaps */}
      {analysis.skillGaps?.length > 0 && (
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Skill Gaps</h2>
          </div>
          <ul className="space-y-2.5">
            {analysis.skillGaps.map((item, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm ${secondaryText} leading-relaxed`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reasoning */}
      {analysis.reasoning && (
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gray-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Reasoning</h2>
          </div>
          <p className={`text-sm leading-relaxed ${secondaryText}`}>{analysis.reasoning}</p>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions?.length > 0 && (
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">Suggestions</h2>
          </div>
          <ul className="space-y-2.5">
            {analysis.suggestions.map((item, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm ${secondaryText} leading-relaxed`}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AnalysisResult;
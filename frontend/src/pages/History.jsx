import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/navbar";
import AnalysisResult from "../components/AnalysisResult";
import ConfirmationModal from "../components/ConfirmationModal";
import api from "../utils/api";
import { FiClock, FiSearch, FiTrash2, FiX } from "react-icons/fi";

function scoreColor(score) {
  if (score >= 75) return "text-[var(--score-strong)]";
  if (score >= 50) return "text-[var(--score-mid)]";
  return "text-[var(--score-low)]";
}

function scoreVar(score) {
  if (score >= 75) return "var(--score-strong)";
  if (score >= 50) return "var(--score-mid)";
  return "var(--score-low)";
}

function History() {
  const { theme } = useTheme();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent"); // recent | score
  const [selected, setSelected] = useState(null); // analysis object shown in modal
  const [modal, setModal] = useState({ isOpen: false, onConfirm: () => {} });

  const cardClass = "card";
  const primaryText = "text-[var(--ink)]";
  const secondaryText = "text-[var(--muted)]";

  const inputClass =
    "w-full rounded-[var(--radius)] pl-10 pr-4 py-2.5 outline-none transition-colors duration-200 border bg-[var(--surface-2)] border-[var(--hairline)] text-[var(--ink)] placeholder-[var(--faint)] focus:border-[var(--accent)]";

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/resume/history");
        setHistory(data.history || []);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const deleteItem = async (id) => {
    try {
      await api.delete(`/resume/history/${id}`);
      setHistory((h) => h.filter((item) => item._id !== id));
      toast.success("Analysis deleted");
    } catch {
      toast.error("Failed to delete analysis");
    }
  };

  const clearAll = async () => {
    try {
      await api.delete("/resume/history");
      setHistory([]);
      toast.success("History cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  };

  const filtered = useMemo(() => {
    let list = [...history];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.jobTitle?.toLowerCase().includes(q) ||
          i.fileName?.toLowerCase().includes(q)
      );
    }
    if (sort === "score") {
      list.sort((a, b) => b.matchScore - a.matchScore);
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [history, query, sort]);

  // Score trend (chronological, last 12)
  const trend = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-12)
      .map((i) => ({
        score: i.matchScore,
        title: i.jobTitle,
        date: i.createdAt,
      }));
  }, [history]);

  const avgScore = history.length
    ? Math.round(history.reduce((s, i) => s + i.matchScore, 0) / history.length)
    : 0;

  // Geometry for the trend chart (0–100 coordinate space, y inverted)
  const trendGeo = useMemo(() => {
    const n = trend.length;
    return trend.map((t, i) => ({
      ...t,
      x: n > 1 ? (i / (n - 1)) * 100 : 50,
      y: 100 - t.score,
    }));
  }, [trend]);

  const linePath = trendGeo.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = trendGeo.length
    ? `M ${trendGeo[0].x} 100 ${trendGeo.map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${trendGeo[trendGeo.length - 1].x} 100 Z`
    : "";
  const latest = trend.length ? trend[trend.length - 1].score : 0;
  const fmtDay = (d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Header */}
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${primaryText}`}>
                Analysis History
              </h1>
              <p className={`text-sm mt-1 ${secondaryText}`}>
                {history.length} analysis{history.length !== 1 ? "es" : ""} · avg score {avgScore}%
              </p>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setModal({ isOpen: true, onConfirm: clearAll })}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-[var(--radius)] transition-colors duration-200 border border-[var(--hairline)] text-[var(--muted)] font-medium hover:text-[var(--danger)] hover:border-[var(--danger)]"
              >
                <FiTrash2 /> Clear All
              </button>
            )}
          </div>

          {/* Trend chart */}
          {trend.length > 1 && (
            <div className={`${cardClass} p-6 mb-6`}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="eyebrow">Score Trend</p>
                  <p className={`text-xs mt-1 ${secondaryText}`}>Last {trend.length} analyses</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-display leading-none" style={{ color: scoreVar(latest) }}>
                    {latest}%
                  </p>
                  <p className={`text-[11px] mt-1 ${secondaryText}`}>latest</p>
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-40 w-full">
                {/* horizontal gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[100, 75, 50, 25, 0].map((g) => (
                    <div key={g} className="w-full border-t border-dashed border-[var(--hairline)] opacity-50" />
                  ))}
                </div>

                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* average reference line */}
                  <line
                    x1="0" y1={100 - avgScore} x2="100" y2={100 - avgScore}
                    stroke="var(--muted)" strokeWidth="1" strokeDasharray="2 3"
                    vectorEffect="non-scaling-stroke" opacity="0.6"
                  />
                  <path d={areaPath} fill="url(#trendFill)" />
                  <path
                    d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2"
                    strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* avg label */}
                <span
                  className="absolute right-0 -translate-y-1/2 text-[10px] font-mono px-1 rounded bg-[var(--surface)] text-[var(--muted)]"
                  style={{ top: `${100 - avgScore}%` }}
                >
                  avg {avgScore}%
                </span>

                {/* data points + tooltips (HTML overlay keeps dots circular) */}
                {trendGeo.map((p, i) => (
                  <div
                    key={i}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  >
                    <span
                      className="block rounded-full ring-2 ring-[var(--surface)] transition-transform duration-150 group-hover:scale-150"
                      style={{
                        width: i === trendGeo.length - 1 ? 12 : 9,
                        height: i === trendGeo.length - 1 ? 12 : 9,
                        background: scoreVar(p.score),
                      }}
                    />
                    {/* tooltip */}
                    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[180px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                      <div className="rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--surface)] shadow-lg px-2.5 py-1.5">
                        <p className="text-xs font-semibold truncate" style={{ color: scoreVar(p.score) }}>
                          {p.score}% · <span className="text-[var(--ink)]">{p.title}</span>
                        </p>
                        <p className="text-[10px] text-[var(--faint)] font-mono">{new Date(p.date).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* x-axis date range */}
              <div className="flex justify-between mt-3">
                <span className={`text-[11px] font-mono ${secondaryText}`}>{fmtDay(trend[0].date)}</span>
                <span className={`text-[11px] font-mono ${secondaryText}`}>{fmtDay(trend[trend.length - 1].date)}</span>
              </div>
            </div>
          )}

          {/* Search + sort */}
          {history.length > 0 && (
            <div className="flex gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${secondaryText}`} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by job title or file name..."
                  className={inputClass}
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-[var(--radius)] px-4 py-2.5 outline-none border transition-colors bg-[var(--surface-2)] border-[var(--hairline)] text-[var(--ink)] focus:border-[var(--accent)]"
              >
                <option value="recent">Most Recent</option>
                <option value="score">Highest Score</option>
              </select>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className={`${cardClass} p-16 flex flex-col items-center gap-4`}>
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--hairline)]" />
                <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent)] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <p className={secondaryText}>Loading your history…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-[var(--radius)] border border-dashed border-[var(--hairline)] bg-[var(--surface-2)]">
              <div className="w-14 h-14 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mb-4">
                <FiClock className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <p className={`font-medium ${primaryText}`}>
                {history.length === 0 ? "No analyses yet" : "No results match your search"}
              </p>
              <p className={`text-sm mt-1 ${secondaryText}`}>
                {history.length === 0 ? "Run your first resume analysis from the Dashboard." : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  className="card p-4 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${primaryText}`}>{item.jobTitle}</p>
                      <p className="text-xs text-[var(--faint)] mt-1 truncate">{item.fileName}</p>
                      <p className="text-xs text-[var(--faint)] mt-0.5">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold font-display" style={{ color: scoreVar(item.matchScore) }}>{item.matchScore}%</p>
                      <p className="text-xs text-[var(--muted)]">{item.recommendation}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setSelected(item.analysis)}
                      className="px-4 py-1.5 rounded-[var(--radius)] text-sm transition-colors duration-200 border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-medium hover:brightness-110"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => setModal({ isOpen: true, onConfirm: () => deleteItem(item._id) })}
                      className="px-4 py-1.5 rounded-[var(--radius)] text-sm transition-colors duration-200 border border-[var(--hairline)] text-[var(--muted)] font-medium hover:text-[var(--danger)] hover:border-[var(--danger)]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm fade-in" onClick={() => setSelected(null)}>
          <div className="min-h-screen py-10 px-4 flex justify-center">
            <div
              className="relative w-full max-w-2xl rounded-[var(--radius)] p-5 sm:p-6 h-fit bg-[var(--surface)] border border-[var(--hairline)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-[var(--radius)] flex items-center justify-center transition bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--hairline)] hover:bg-[var(--surface-2)]"
                aria-label="Close"
              >
                <FiX />
              </button>
              <AnalysisResult analysis={selected} />
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal((m) => ({ ...m, isOpen: false }))}
        title="Delete Analysis"
        description="Are you sure? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}

export default History;
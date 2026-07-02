import { useState } from "react";
import axios from "axios";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Please select a resume first.");
      return;
    }

    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {

      const response = await axios.post(
        "http://localhost:5001/api/resume/upload",
        formData
      );

      setResult(response.data);

    } catch (error) {

      console.error(error);

      if (error.response) {
        setResult({
          error: true,
          message: error.response.data.message,
        });
      } else {
        setResult({
          error: true,
          message: "Something went wrong.",
        });
      }

    } finally {
      setLoading(false);
    }

  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const circumference = 339.29;
  const score = result?.analysis?.score ?? 0;
  const scoreOffset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 90
      ? {
          stroke: "#10b981",
          text: "text-emerald-400",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          label: "Excellent",
        }
      : score >= 70
      ? {
          stroke: "#38bdf8",
          text: "text-sky-400",
          badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
          label: "Good",
        }
      : {
          stroke: "#f59e0b",
          text: "text-amber-400",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          label: "Needs Work",
        };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,_rgba(99,102,241,0.12),_transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 sm:py-24">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered · Google Gemini
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent mb-4 leading-tight">
            Smart Resume<br />Analyzer
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Upload your resume and receive an AI-powered ATS analysis with actionable feedback.
          </p>
        </div>

        {/* Upload */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6 sm:p-8 mb-6">

          <label
            htmlFor="resume-input"
            className="flex flex-col items-center justify-center gap-4 w-full border-2 border-dashed border-white/15 rounded-xl p-8 sm:p-10 cursor-pointer hover:border-white/30 hover:bg-white/[0.03] transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-full bg-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12L8 8m4-4l4 4"
                />
              </svg>
            </div>

            {selectedFile ? (
              <div className="text-center">
                <p className="text-white font-medium text-sm break-all">{selectedFile.name}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {formatFileSize(selectedFile.size)} · Click to change
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-300 text-sm">
                  Drop your resume here, or{" "}
                  <span className="text-white underline underline-offset-2">browse</span>
                </p>
                <p className="text-gray-600 text-xs mt-1">Supports PDF, DOC, DOCX</p>
              </div>
            )}

            <input
              id="resume-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="mt-6 w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-white text-black hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] active:translate-y-0"
          >
            {loading ? "Analyzing..." : "Analyze Resume →"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-12 flex flex-col items-center gap-5 fade-in-up">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Analyzing Resume...</p>
              <p className="text-gray-500 text-sm mt-1">This may take a few seconds.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && result?.error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm p-6 flex items-start gap-4 fade-in-up">
            <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
              </svg>
            </div>
            <div>
              <p className="text-red-400 font-semibold text-sm">Analysis Failed</p>
              <p className="text-red-300/70 text-sm mt-1">{result.message}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && result?.success && result.analysis && (
          <div className="space-y-5 fade-in-up">

            {/* ATS Score */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-8">
              <div className="flex flex-col items-center gap-5">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    ATS Score
                  </p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${scoreColor.badge}`}>
                    {scoreColor.label}
                  </span>
                </div>

                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60" cy="60" r="54"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60" cy="60" r="54"
                      fill="none"
                      stroke={scoreColor.stroke}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      className="score-ring-animate"
                      style={{ "--score-offset": scoreOffset }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${scoreColor.text}`}>{score}</span>
                    <span className="text-gray-500 text-xs mt-0.5">/ 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {result.analysis.strengths?.length > 0 && (
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Strengths</h2>
                </div>
                <ul className="space-y-2.5">
                  {result.analysis.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {result.analysis.weaknesses?.length > 0 && (
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Weaknesses</h2>
                </div>
                <ul className="space-y-2.5">
                  {result.analysis.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.analysis.suggestions?.length > 0 && (
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wider">Suggestions</h2>
                </div>
                <ul className="space-y-2.5">
                  {result.analysis.suggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

        <p className="text-center text-gray-700 text-xs mt-14">
          Built with React • Express • Tailwind CSS • Gemini AI
        </p>

      </div>
    </div>
  );
}

export default App;
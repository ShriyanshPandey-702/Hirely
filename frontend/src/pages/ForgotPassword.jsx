import { useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

function ForgotPassword() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      toast.success(response.data.message || "Reset link generated");
      setSuccess(response.data.resetUrl);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("User not found with this email");
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const cardClass = "card";

  const primaryText = "text-[var(--ink)]";
  const secondaryText = "text-[var(--muted)]";

  const inputClass = "w-full rounded-[var(--radius)] px-4 py-3.5 outline-none transition-colors duration-200 border bg-[var(--surface-2)] border-[var(--hairline)] text-[var(--ink)] placeholder-[var(--faint)] focus:border-[var(--accent)]";

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-[var(--bg)] text-[var(--ink)]`}>
      

      <div className={`relative z-10 w-full max-w-md ${cardClass} p-8 sm:p-10 fade-in-up`}>
        
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6 bg-[var(--surface-2)] border border-[var(--hairline)] text-[var(--muted)]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            AI Recruiter Assistant
          </div>
          
          <h1 className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-2 text-[var(--ink)]`}>
            Reset Password
          </h1>
          <p className={`text-sm ${secondaryText}`}>
            Enter your email to receive a reset link
          </p>
        </div>

        {success ? (
          <div className="text-center fade-in-up">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className={`text-xl font-bold mb-2 ${primaryText}`}>Password Reset Link Generated</h2>
            <p className={`mb-6 text-sm ${secondaryText}`}>
              A secure reset link has been generated. Since this demo project does not use an email service, you can copy or open the link below to continue.
            </p>
            
            <div className={`flex items-center gap-2 p-3 rounded-xl border mb-6 text-left bg-[var(--surface-2)] border-[var(--hairline)]`}>
              <input
                type="text"
                readOnly
                value={success}
                className={`w-full bg-transparent text-sm outline-none text-[var(--ink)]`}
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(success);
                  toast.success("Link copied to clipboard!");
                }}
                className={`p-2 rounded-lg transition-colors hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]`}
                title="Copy Link"
              >
                <FiCopy size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href={success}
                className={`w-full inline-flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 
                  ${theme === "dark" 
                    ? "btn-accent" 
                    : "btn-accent"} 
                  hover:scale-[1.01] active:scale-[0.99] active:translate-y-0`}
              >
                <FiExternalLink size={16} />
                Open Reset Password
              </a>
              <Link
                to="/login"
                className="w-full inline-block py-3.5 px-6 rounded-[var(--radius)] font-semibold text-sm transition-colors duration-200 border border-[var(--hairline)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`border ${error ? 'border-red-500/50 focus:border-red-500' : ''} ${inputClass}`}
              />
              {error && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 
                ${theme === "dark" 
                  ? "btn-accent" 
                  : "btn-accent"} 
                disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] active:translate-y-0 flex justify-center items-center gap-2`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Link...
                </>
              ) : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className={`mt-8 text-center text-sm ${secondaryText}`}>
          Remember your password?{" "}
          <Link
            to="/login"
            className={`font-medium transition-colors text-[var(--accent)] hover:brightness-110`}
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

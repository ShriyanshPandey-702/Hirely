import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/navbar";
import api from "../utils/api";
import {
  FiUser,
  FiSave,
  FiCamera,
  FiCalendar,
  FiSettings,
  FiFileText,
  FiTrendingUp,
  FiAward,
  FiTarget,
} from "react-icons/fi";

function StatCard({ icon: Icon, label, value, cardClass, secondaryText, primaryText }) {
  return (
    <div className={`${cardClass} p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[var(--accent)]" />
        </div>
        <span className={`text-xs font-medium ${secondaryText}`}>{label}</span>
      </div>
      <p className={`text-2xl font-bold ${primaryText}`}>{value}</p>
    </div>
  );
}

function Profile() {
  const { theme } = useTheme();
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();

  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");

  const cardClass = "card";
  const primaryText = "text-[var(--ink)]";
  const secondaryText = "text-[var(--muted)]";
  const inputClass =
    "w-full rounded-[var(--radius)] pl-10 pr-4 py-3 outline-none transition-colors duration-200 border bg-[var(--surface-2)] border-[var(--hairline)] text-[var(--ink)] placeholder-[var(--faint)] focus:border-[var(--accent)]";

  useEffect(() => {
    if (user) setName(user.fullName || "");
  }, [user]);

  useEffect(() => {
    api
      .get("/resume/history")
      .then((r) => setHistory(r.data.history || []))
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    if (history.length === 0) return { total: 0, avg: 0, best: 0, topRole: "—" };
    const total = history.length;
    const avg = Math.round(history.reduce((s, i) => s + i.matchScore, 0) / total);
    const best = Math.max(...history.map((i) => i.matchScore));
    const counts = {};
    history.forEach((i) => (counts[i.jobTitle] = (counts[i.jobTitle] || 0) + 1));
    const topRole = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return { total, avg, best, topRole };
  }, [history]);

  const email = user?.primaryEmailAddress?.emailAddress || "";

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const parts = name.trim().split(/\s+/);
      await user.update({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" "),
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.errors?.[0]?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB");
      return;
    }
    setUploadingAvatar(true);
    try {
      await user.setProfileImage({ file });
      await user.reload();
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(error?.errors?.[0]?.message || "Photo upload failed");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-6 ${primaryText}`}>
            Profile
          </h1>

          {!isLoaded ? (
            <div className={`${cardClass} p-16 flex flex-col items-center gap-4`}>
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--hairline)]" />
                <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent)] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <p className={secondaryText}>Loading profile…</p>
            </div>
          ) : (
            <>
              {/* Identity card */}
              <div className={`${cardClass} p-6 mb-6 flex flex-wrap items-center gap-5`}>
                <div className="relative flex-shrink-0">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user?.fullName || "Avatar"}
                      className="w-16 h-16 rounded-[var(--radius)] object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-[var(--radius)] bg-[var(--accent-soft)]" />
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-input"
                  />
                  <label
                    htmlFor="avatar-input"
                    title="Change photo"
                    className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border-2 border-[var(--bg)] bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-110 ${uploadingAvatar ? "opacity-70 cursor-wait" : ""}`}
                  >
                    {uploadingAvatar ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    ) : (
                      <FiCamera className="w-3.5 h-3.5" />
                    )}
                  </label>
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`text-xl font-bold truncate ${primaryText}`}>{user?.fullName || "Your name"}</p>
                  <p className={`text-sm truncate ${secondaryText}`}>{email}</p>
                  {user?.createdAt && (
                    <p className="text-xs text-[var(--faint)] mt-1 flex items-center gap-1.5">
                      <FiCalendar className="w-3 h-3" />
                      Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => openUserProfile()}
                  className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] text-sm font-medium border border-[var(--hairline)] bg-[var(--surface-2)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
                >
                  <FiSettings className="w-4 h-4" /> Manage account
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 items-start">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <StatCard icon={FiFileText} label="Analyses" value={stats.total} cardClass={cardClass} secondaryText={secondaryText} primaryText={primaryText} />
                  <StatCard icon={FiTrendingUp} label="Avg Score" value={`${stats.avg}%`} cardClass={cardClass} secondaryText={secondaryText} primaryText={primaryText} />
                  <StatCard icon={FiAward} label="Best Score" value={`${stats.best}%`} cardClass={cardClass} secondaryText={secondaryText} primaryText={primaryText} />
                  <StatCard icon={FiTarget} label="Top Role" value={stats.topRole} cardClass={cardClass} secondaryText={secondaryText} primaryText={primaryText} />
                </div>

                {/* Edit name */}
                <div className={`${cardClass} p-6`}>
                  <h2 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${secondaryText}`}>Display name</h2>
                  <p className={`text-xs mb-5 ${secondaryText}`}>
                    Change your name here. Email, password and connected accounts live under{" "}
                    <button onClick={() => openUserProfile()} className="text-[var(--accent)] hover:underline">
                      Manage account
                    </button>
                    .
                  </p>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="relative">
                      <FiUser className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${secondaryText}`} />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-accent flex items-center justify-center gap-2 w-full py-3 px-6 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSave />
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

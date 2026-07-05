import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, description, confirmText = "Delete", isDestructive = true }) {
  const { theme } = useTheme();
  const modalRef = useRef(null);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm fade-in-up"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="card w-full max-w-md p-6 sm:p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h3 id="modal-title" className="font-display text-xl font-semibold mb-3 text-[var(--ink)]">
          {title}
        </h3>

        <p className="text-sm mb-8 leading-relaxed text-[var(--muted)]">
          {description}
        </p>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-[var(--radius)] font-medium text-sm transition-colors duration-200 bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--hairline)] hover:text-[var(--ink)]"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-[var(--radius)] font-semibold text-sm transition-transform duration-200 hover:-translate-y-0.5
              ${isDestructive
                ? "text-white"
                : "btn-accent"}
            `}
            style={isDestructive ? { background: "var(--danger)" } : undefined}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;

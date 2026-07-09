import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for Clerk to load the session before deciding
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--hairline)]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent)] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default ProtectedRoute;

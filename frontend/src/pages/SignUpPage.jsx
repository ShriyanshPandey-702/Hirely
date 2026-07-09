import { SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "../context/ThemeContext";

export default function SignUpPage() {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-4 py-10">
      <img src="/Hirely_icon.png" alt="Hirely" className="h-11 w-11 object-contain mb-5" />
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          variables: {
            colorPrimary: theme === "dark" ? "#e8a33d" : "#35543f",
            borderRadius: "0.5rem",
            fontFamily: '"Public Sans", system-ui, sans-serif',
          },
        }}
      />
    </div>
  );
}

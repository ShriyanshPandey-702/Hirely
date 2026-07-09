import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in frontend/.env");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ThemeProvider>
        <BrowserRouter>
          <App />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
          />
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
)

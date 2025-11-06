import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ConfigError } from "@/components/ConfigError";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Messages from "./pages/Messages";
import Documents from "./pages/Documents";
import Contacts from "./pages/Contacts";
import CalendarPage from "./pages/CalendarPage";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Emails from "./pages/Emails";
import Rag from "./pages/Rag";
import Analytics from "./pages/Analytics";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

// Check if configuration is valid
const isConfigValid = () => {
  // @ts-ignore
  const env = typeof window !== 'undefined' && window.__ENV__ ? window.__ENV__ : {};
  const url = env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === '' || url === 'https://placeholder.supabase.co') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase');
    } catch {
      return false;
    }
  };
  
  // Validate key format
  const isValidKey = (key: string): boolean => {
    if (!key || key.trim() === '' || key === 'placeholder-key') return false;
    return key.length > 20 && (key.startsWith('eyJ') || key.length > 50);
  };
  
  return isValidUrl(url) && isValidKey(key);
};

// Component to handle auth callbacks (email confirmation, etc.)
const AuthCallbackHandler = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for hash-based callback (email confirmation)
      const hash = window.location.hash.substring(1);
      if (hash) {
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (accessToken && refreshToken) {
          // Email confirmation or password reset callback
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            return;
          }

          // Redirect to dashboard after successful confirmation
          const redirectTo = searchParams.get('redirectTo') || '/dashboard';
          window.location.href = redirectTo;
          return;
        }
      }

      // Check for query-based callback (PKCE flow)
      const code = searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Error exchanging code for session:', error);
          return;
        }
        const redirectTo = searchParams.get('redirectTo') || '/dashboard';
        window.location.href = redirectTo;
      }
    };

    handleAuthCallback();
  }, [searchParams]);

  return null;
};

const App = () => {
  // Show config error if environment variables are missing
  if (!isConfigValid()) {
    return <ConfigError />;
  }

  return (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth" element={
                  <>
                    <AuthCallbackHandler />
                    <Auth />
                  </>
                } />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases"
            element={
              <ProtectedRoute>
                <Cases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emails"
            element={
              <ProtectedRoute>
                <Emails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rag"
            element={
              <ProtectedRoute>
                <Rag />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <ProtectedRoute>
                <Compliance />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;

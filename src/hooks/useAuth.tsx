import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setError(null);
      }
    );

    // Check for existing session
    supabase.auth.getSession()
      .then(({ data: { session }, error: sessionError }) => {
        if (!mounted) return;
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError(sessionError);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Unexpected error in useAuth:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Error signing out:", signOutError);
        setError(signOutError);
        return;
      }
      navigate("/auth");
    } catch (err) {
      console.error("Unexpected error signing out:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  return { user, session, loading, error, signOut };
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "lawyer" | "client";

export const useUserRole = (userId?: string) => {
  return useQuery({
    queryKey: ["userRole", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.role as UserRole | null;
    },
    enabled: !!userId,
  });
};

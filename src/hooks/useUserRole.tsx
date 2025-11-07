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
        .eq("user_id", userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return null;
      }

      const priority: UserRole[] = ["admin", "lawyer", "client"];
      for (const role of priority) {
        if (data.some((item) => item.role === role)) {
          return role;
        }
      }

      return (data[0]?.role as UserRole) ?? null;
    },
    enabled: !!userId,
  });
};

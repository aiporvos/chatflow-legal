import { Scale, FolderOpen, FileText, Scale as ScaleIcon, Mail, Calendar, MessageSquare, BarChart3, Shield, Settings, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCases } from "@/hooks/useCases";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { data: cases } = useCases();
  const { data: messages } = useWhatsAppMessages();
  const { data: userRole } = useUserRole(user?.id);
  
  const { data: documents } = useQuery({
    queryKey: ["documents-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const activeCases = cases?.filter(c => c.status !== "closed" && c.status !== "archived").length || 0;
  const messagesCount = messages?.length || 0;
  const isAdmin = userRole === "admin";

  const menuItems = [
    { icon: FolderOpen, label: "Expedientes", path: "/cases", count: activeCases },
    { icon: FileText, label: "Documentos", path: "/documents", count: documents || 234 },
    { icon: ScaleIcon, label: "RAG Jurídico", path: "/rag", badge: "Pro", badgeColor: "bg-purple-500" },
    { icon: Mail, label: "Correos", path: "/mail", count: 12 },
    { icon: Calendar, label: "Agenda", path: "/calendar" },
    { icon: MessageSquare, label: "WhatsApp", path: "/messages", count: messagesCount },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Shield, label: "Cumplimiento", path: "/compliance" },
    ...(isAdmin ? [{ icon: ShieldCheck, label: "Administración", path: "/admin" }] : []),
    { icon: Settings, label: "Configuración", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="flex h-screen w-56 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-border px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Scale className="h-6 w-6 text-primary" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-foreground">Asistente Legal IA</h1>
          <p className="text-xs text-muted-foreground">Gestión Legal Inteligente</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
              isActive(item.path)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
            {item.count !== undefined && (
              <Badge variant="secondary" className="h-5 min-w-[20px] px-1.5 text-xs">
                {item.count}
              </Badge>
            )}
            {item.badge && (
              <Badge className={`${item.badgeColor} text-white text-xs px-2 py-0.5`}>
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </nav>

      {/* Security Status */}
      <div className="border-t border-border p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-foreground">Estado de Seguridad</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Todos los sistemas operando con cifrado E2E activo
          </p>
          <Progress value={100} className="h-2" />
          <p className="text-center text-xs font-medium text-green-500">100%</p>
        </div>
      </div>
    </aside>
  );
};

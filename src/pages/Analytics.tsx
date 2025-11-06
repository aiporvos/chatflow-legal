import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCases } from "@/hooks/useCases";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  FolderOpen, 
  Clock,
  DollarSign,
  BarChart3
} from "lucide-react";

const Analytics = () => {
  const { data: cases } = useCases();
  const { data: messages } = useWhatsAppMessages();
  
  const { data: documentsCount } = useQuery({
    queryKey: ["documents-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const activeCases = cases?.filter(c => c.status !== "closed" && c.status !== "archived").length || 0;

  const stats = [
    {
      title: "Expedientes Totales",
      value: cases?.length || 0,
      change: `${activeCases} activos`,
      icon: FolderOpen,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Documentos",
      value: documentsCount || 0,
      change: "Este mes",
      icon: FileText,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      title: "Mensajes WhatsApp",
      value: messages?.length || 0,
      change: "Total enviados",
      icon: MessageSquare,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Tiempo Ahorrado",
      value: "0h",
      change: "Este mes",
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Métricas y estadísticas del sistema
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
                <p className="text-sm font-medium text-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Resumen Mensual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Consultas atendidas</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Documentos generados</span>
                  <span className="font-medium">{documentsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expedientes activos</span>
                  <span className="font-medium">{activeCases}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mensajes enviados</span>
                  <span className="font-medium">{messages?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Ahorro Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-500">$0</p>
              <p className="text-sm text-muted-foreground mt-2">
                Basado en 0 horas ahorradas × $40,000/hora profesional
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">0% vs mes anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Estado de Expedientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10">
                <span className="font-medium">Nuevos</span>
                <span className="text-2xl font-bold text-blue-500">
                  {cases?.filter(c => c.status === "new").length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-500/10">
                <span className="font-medium">En Progreso</span>
                <span className="text-2xl font-bold text-yellow-500">
                  {cases?.filter(c => c.status === "in_progress").length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10">
                <span className="font-medium">Cerrados</span>
                <span className="text-2xl font-bold text-green-500">
                  {cases?.filter(c => c.status === "closed").length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;

import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCases } from "@/hooks/useCases";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  MessageSquare, 
  FolderOpen, 
  Clock, 
  Search, 
  Mail, 
  Calendar,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: cases, isLoading: casesLoading } = useCases();
  const { data: messages, isLoading: messagesLoading } = useWhatsAppMessages();
  
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
  const recentCases = cases?.slice(0, 3) || [];

  const stats = [
    {
      title: "Expedientes Activos",
      value: activeCases,
      change: "+3 esta semana",
      icon: FolderOpen,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Documentos Generados",
      value: documentsCount || 0,
      change: "+18 este mes",
      icon: FileText,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      title: "Consultas RAG",
      value: 0,
      change: "+150 hoy",
      icon: Search,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Tiempo Ahorrado",
      value: "0h",
      change: "esta semana",
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
    },
  ];

  const quickActions = [
    {
      title: "Redactar Demanda",
      description: "Crear nueva demanda con asistencia IA",
      icon: FileText,
      iconColor: "text-primary",
    },
    {
      title: "Consultar Jurisprudencia",
      description: "Buscar precedentes relevantes",
      icon: Search,
      iconColor: "text-primary",
    },
    {
      title: "Revisar Correos",
      description: "12 correos pendientes de clasificar",
      icon: Mail,
      iconColor: "text-primary",
    },
    {
      title: "Programar Reunión",
      description: "Crear evento en calendario",
      icon: Calendar,
      iconColor: "text-primary",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="bg-card border-border hover-scale">
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

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {quickActions.map((action) => (
                  <Card key={action.title} className="bg-card border-border hover-scale cursor-pointer transition-all hover:border-primary/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{action.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Cases */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Expedientes Recientes</h2>
                <Button variant="link" className="text-primary">Ver todos</Button>
              </div>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  {casesLoading ? (
                    <div className="text-center text-muted-foreground py-8">
                      Cargando expedientes...
                    </div>
                  ) : recentCases.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No hay expedientes registrados
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentCases.map((case_) => (
                        <div
                          key={case_.id}
                          className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div>
                            <h3 className="font-medium text-foreground">{case_.title}</h3>
                            <p className="text-sm text-muted-foreground">{case_.case_number}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                            case_.status === "new" ? "bg-blue-500/10 text-blue-500" :
                            case_.status === "in_progress" ? "bg-yellow-500/10 text-yellow-500" :
                            "bg-gray-500/10 text-gray-500"
                          }`}>
                            {case_.status === "new" ? "Nuevo" : 
                             case_.status === "in_progress" ? "En Progreso" : case_.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Recent Queries */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Consultas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Cargando consultas...
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Analytics - Noviembre 2024</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Resumen Mensual</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">💬 Consultas atendidas:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">📄 Documentos generados:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">📁 Expedientes activos:</span>
                      <span className="font-medium">{activeCases}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">⏱️ Tiempo ahorrado:</span>
                      <span className="font-medium text-green-500">0 horas</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">Ahorro estimado del mes</span>
                  </div>
                  <p className="text-3xl font-bold text-green-500">$0</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (0 hs × $40,000/hora profesional)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

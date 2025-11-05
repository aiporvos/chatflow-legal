import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCases } from "@/hooks/useCases";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, MessageSquare, FolderOpen, Calendar, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: cases, isLoading: casesLoading } = useCases();
  const { data: messages, isLoading: messagesLoading } = useWhatsAppMessages();
  
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["documents-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    {
      title: "Expedientes Activos",
      value: cases?.filter(c => c.status !== "closed" && c.status !== "archived").length || 0,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Mensajes WhatsApp",
      value: messages?.length || 0,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Documentos",
      value: 0, // Will be populated from query
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Eventos Próximos",
      value: 0, // Will be populated from query
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentCases = cases?.slice(0, 5) || [];
  const recentMessages = messages?.slice(-5) || [];

  const isLoading = casesLoading || messagesLoading || documentsLoading || eventsLoading;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visión general del sistema de gestión legal
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="hover-scale" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Actualizado en tiempo real
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Grid */}
        <div className="grid gap-4 md:grid-cols-2 animate-fade-in">
          {/* Recent Cases */}
          <Card>
            <CardHeader>
              <CardTitle>Expedientes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {casesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentCases.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay expedientes registrados
                </p>
              ) : (
                <div className="space-y-2">
                  {recentCases.map((case_) => (
                    <div
                      key={case_.id}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{case_.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {case_.case_number}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        case_.status === "new" ? "bg-blue-100 text-blue-700" :
                        case_.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                        case_.status === "closed" ? "bg-green-100 text-green-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {case_.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Mensajes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay mensajes registrados
                </p>
              ) : (
                <div className="space-y-2">
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                    >
                      <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{message.message_content}</p>
                        <p className="text-xs text-muted-foreground">
                          De: {message.from_number}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

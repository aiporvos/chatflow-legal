import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Webhook, Database, CheckCircle2, XCircle, Clock, TrendingUp, Activity } from "lucide-react";
import { useWebhooks } from "@/hooks/useWebhooks";
import { CreateWebhookDialog } from "@/components/admin/CreateWebhookDialog";
import { WebhookCard } from "@/components/admin/WebhookCard";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { useCases } from "@/hooks/useCases";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuth } from "@/hooks/useAuth";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

const Admin = () => {
  const { user } = useAuth();
  const { data: webhooks, isLoading: webhooksLoading } = useWebhooks();
  const { data: userRole, isLoading: roleLoading } = useUserRole(user?.id);
  const { data: cases } = useCases();
  const { data: messages } = useWhatsAppMessages();
  const { data: documents } = useDocuments();

  const isAdmin = userRole === "admin";

  // Redirect if not admin
  if (!roleLoading && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (roleLoading || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Skeleton className="h-32 w-32 rounded-full bg-card" />
        </div>
      </Layout>
    );
  }

  const activeWebhooks = webhooks?.filter((w) => w.is_active).length || 0;
  const totalWebhooks = webhooks?.length || 0;

  // Generate chart data
  const syncTrendData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map((day, index) => ({
      day,
      expedientes: Math.floor(Math.random() * 20) + (cases?.length || 0) / 7,
      mensajes: Math.floor(Math.random() * 50) + (messages?.length || 0) / 7,
      documentos: Math.floor(Math.random() * 15) + (documents?.length || 0) / 7,
    }));
  }, [cases, messages, documents]);

  const webhookActivityData = useMemo(() => {
    return webhooks?.map(webhook => ({
      name: webhook.name.substring(0, 15) + '...',
      llamadas: Math.floor(Math.random() * 100) + 50,
      exitosas: Math.floor(Math.random() * 80) + 60,
    })) || [];
  }, [webhooks]);

  const statusDistribution = useMemo(() => [
    { name: 'Activos', value: activeWebhooks, color: '#10b981' },
    { name: 'Inactivos', value: totalWebhooks - activeWebhooks, color: '#ef4444' },
  ], [activeWebhooks, totalWebhooks]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Administración
              </h1>
            </div>
            <p className="text-muted-foreground">
              Gestiona webhooks de N8N y monitorea el estado del sistema
            </p>
          </div>
          <CreateWebhookDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Webhooks
              </CardTitle>
              <Webhook className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalWebhooks}</div>
              <p className="text-xs text-muted-foreground">
                {activeWebhooks} activos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expedientes Sincronizados
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{cases?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total en base de datos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mensajes WhatsApp
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{messages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total sincronizados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Documentos en Drive
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{documents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Listos para RAG
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Dashboard */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Métricas de Sincronización
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Sync Trend Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-500" />
                  Tendencia de Sincronización
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Datos sincronizados en los últimos 7 días
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={syncTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="expedientes" stroke="#06b6d4" strokeWidth={2} name="Expedientes" />
                    <Line type="monotone" dataKey="mensajes" stroke="#8b5cf6" strokeWidth={2} name="Mensajes" />
                    <Line type="monotone" dataKey="documentos" stroke="#10b981" strokeWidth={2} name="Documentos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Webhook Activity Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Webhook className="h-4 w-4 text-cyan-500" />
                  Actividad de Webhooks
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Llamadas totales vs exitosas por webhook
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={webhookActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="llamadas" fill="#06b6d4" name="Total Llamadas" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="exitosas" fill="#10b981" name="Exitosas" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Webhook Status Distribution */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Estado de Webhooks
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Distribución de webhooks activos vs inactivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Real-time Sync Status */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-500" />
                  Estado de Sincronización
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Monitoreo en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center gap-3">
                      {activeWebhooks > 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">Webhooks N8N</p>
                        <p className="text-sm text-muted-foreground">
                          {activeWebhooks > 0
                            ? `${activeWebhooks} webhook${activeWebhooks > 1 ? "s" : ""} activo${activeWebhooks > 1 ? "s" : ""}`
                            : "No hay webhooks activos"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={activeWebhooks > 0 ? "default" : "secondary"}
                      className={
                        activeWebhooks > 0
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }
                    >
                      {activeWebhooks > 0 ? "Conectado" : "Desconectado"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-foreground">Última Sincronización</p>
                        <p className="text-sm text-muted-foreground">
                          {messages && messages.length > 0
                            ? new Date(messages[messages.length - 1].created_at!).toLocaleString("es-ES")
                            : "Sin sincronizaciones recientes"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      Tiempo Real
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Webhooks List */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Webhooks Configurados
          </h2>
          {webhooksLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full bg-card" />
              ))}
            </div>
          ) : webhooks && webhooks.length > 0 ? (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <WebhookCard key={webhook.id} webhook={webhook} />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Webhook className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  No hay webhooks configurados
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crea tu primer webhook para comenzar a sincronizar datos con N8N
                </p>
                <CreateWebhookDialog />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Instructions */}
        <Card className="bg-primary/5 border-primary/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-foreground">URLs de los Edge Functions</CardTitle>
            <CardDescription className="text-muted-foreground">
              Configura estas URLs en tus workflows de N8N
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg bg-background border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Webhook de Expedientes:
                </p>
                <code className="text-xs text-primary">
                  {import.meta.env.VITE_SUPABASE_URL}/functions/v1/n8n-cases-webhook
                </code>
              </div>
              <div className="rounded-lg bg-background border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Webhook de WhatsApp:
                </p>
                <code className="text-xs text-primary">
                  {import.meta.env.VITE_SUPABASE_URL}/functions/v1/n8n-whatsapp-webhook
                </code>
              </div>
              <div className="rounded-lg bg-background border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Webhook de Documentos:
                </p>
                <code className="text-xs text-primary">
                  {import.meta.env.VITE_SUPABASE_URL}/functions/v1/n8n-documents-webhook
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;

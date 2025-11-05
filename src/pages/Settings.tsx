import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Webhook, Database, Mail, MessageSquare, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { RagWebhookSettings } from "@/components/admin/RagWebhookSettings";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: role, isLoading: isLoadingRole } = useUserRole(user?.id);
  const [n8nConfig, setN8nConfig] = useState({
    baseUrl: localStorage.getItem("n8n_base_url") || "",
    casesWebhook: localStorage.getItem("n8n_cases_webhook") || "",
    documentsWebhook: localStorage.getItem("n8n_documents_webhook") || "",
    whatsappIncomingWebhook: localStorage.getItem("n8n_whatsapp_incoming_webhook") || "",
    whatsappOutgoingWebhook: localStorage.getItem("n8n_whatsapp_outgoing_webhook") || "",
    emailWebhook: localStorage.getItem("n8n_email_webhook") || "",
    calendarWebhook: localStorage.getItem("n8n_calendar_webhook") || "",
    scanDocumentWebhook: localStorage.getItem("n8n_scan_document_webhook") || "",
    generateDocumentWebhook: localStorage.getItem("n8n_generate_document_webhook") || "",
    visionApiWebhook: localStorage.getItem("n8n_vision_api_webhook") || "",
  });

  const [supabaseConfig, setSupabaseConfig] = useState({
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  });

  const saveN8nConfig = () => {
    if (role !== "admin") {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden modificar esta configuración",
        variant: "destructive",
      });
      return;
    }
    
    Object.entries(n8nConfig).forEach(([key, value]) => {
      localStorage.setItem(`n8n_${key.replace(/([A-Z])/g, "_$1").toLowerCase()}`, value);
    });
    toast({
      title: "Configuración guardada",
      description: "Los endpoints de N8N han sido actualizados",
    });
  };

  const isAdmin = role === "admin";

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Gestiona los endpoints y configuraciones del sistema
          </p>
        </div>

        <Tabs defaultValue="rag" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="rag" className="data-[state=active]:bg-background">
              <Webhook className="h-4 w-4 mr-2" />
              Webhook RAG
            </TabsTrigger>
            <TabsTrigger value="n8n" className="data-[state=active]:bg-background">
              <Webhook className="h-4 w-4 mr-2" />
              N8N Webhooks
            </TabsTrigger>
            <TabsTrigger value="supabase" className="data-[state=active]:bg-background">
              <Database className="h-4 w-4 mr-2" />
              Supabase
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rag">
            <RagWebhookSettings />
          </TabsContent>

          <TabsContent value="n8n" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Configuración de N8N</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configura los webhooks de N8N para cada funcionalidad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isAdmin && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Solo los administradores pueden modificar la configuración de webhooks N8N.
                    </AlertDescription>
                  </Alert>
                )}
                {/* Base URL */}
                <div className="space-y-2">
                  <Label htmlFor="baseUrl" className="text-foreground">URL Base de N8N</Label>
                  <Input
                    id="baseUrl"
                    placeholder="https://n8n.tudominio.com"
                    value={n8nConfig.baseUrl}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, baseUrl: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                </div>

                {/* Expedientes */}
                <div className="space-y-2">
                  <Label htmlFor="casesWebhook" className="text-foreground flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4 text-primary" />
                    Webhook de Expedientes
                  </Label>
                  <Input
                    id="casesWebhook"
                    placeholder="/webhook/expedientes"
                    value={n8nConfig.casesWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, casesWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Página de Expedientes - Escaneo de imágenes
                  </p>
                </div>

                {/* Escaneo de Documentos */}
                <div className="space-y-2">
                  <Label htmlFor="scanDocumentWebhook" className="text-foreground flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4 text-primary" />
                    Webhook de Escaneo de Documentos
                  </Label>
                  <Input
                    id="scanDocumentWebhook"
                    placeholder="/webhook/scan-document"
                    value={n8nConfig.scanDocumentWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, scanDocumentWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Subir imagen de expediente → Vision API → Extraer datos
                  </p>
                </div>

                {/* Documentos */}
                <div className="space-y-2">
                  <Label htmlFor="documentsWebhook" className="text-foreground flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4 text-primary" />
                    Webhook de Documentos
                  </Label>
                  <Input
                    id="documentsWebhook"
                    placeholder="/webhook/documentos"
                    value={n8nConfig.documentsWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, documentsWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Subir documentos a Drive y RAG
                  </p>
                </div>

                {/* Generar Documentos */}
                <div className="space-y-2">
                  <Label htmlFor="generateDocumentWebhook" className="text-foreground flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4 text-primary" />
                    Webhook de Generación de Documentos
                  </Label>
                  <Input
                    id="generateDocumentWebhook"
                    placeholder="/webhook/generate-document"
                    value={n8nConfig.generateDocumentWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, generateDocumentWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Página de Documentos - Generar documentos genéricos y específicos
                  </p>
                </div>

                {/* Vision API */}
                <div className="space-y-2">
                  <Label htmlFor="visionApiWebhook" className="text-foreground flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4 text-primary" />
                    Webhook de Vision API (Plantillas)
                  </Label>
                  <Input
                    id="visionApiWebhook"
                    placeholder="/webhook/vision-analyze"
                    value={n8nConfig.visionApiWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, visionApiWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Crear plantillas desde imagen - Analiza y extrae campos variables
                  </p>
                </div>

                {/* WhatsApp Incoming */}
                <div className="space-y-2">
                  <Label htmlFor="whatsappIncomingWebhook" className="text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    Webhook de WhatsApp (Entrante)
                  </Label>
                  <Input
                    id="whatsappIncomingWebhook"
                    placeholder="/webhook/whatsapp-incoming"
                    value={n8nConfig.whatsappIncomingWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, whatsappIncomingWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Recibir mensajes desde WhatsApp → Edge Function → Base de datos
                  </p>
                </div>

                {/* WhatsApp Outgoing */}
                <div className="space-y-2">
                  <Label htmlFor="whatsappOutgoingWebhook" className="text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    Webhook de WhatsApp (Saliente)
                  </Label>
                  <Input
                    id="whatsappOutgoingWebhook"
                    placeholder="/webhook/whatsapp-outgoing"
                    value={n8nConfig.whatsappOutgoingWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, whatsappOutgoingWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Enviar mensajes desde la app → N8N → WhatsApp
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="emailWebhook" className="text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    Webhook de Correos
                  </Label>
                  <Input
                    id="emailWebhook"
                    placeholder="/webhook/email"
                    value={n8nConfig.emailWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, emailWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Página de Correos - Gmail integration
                  </p>
                </div>

                {/* Calendar */}
                <div className="space-y-2">
                  <Label htmlFor="calendarWebhook" className="text-foreground flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-purple-500" />
                    Webhook de Agenda
                  </Label>
                  <Input
                    id="calendarWebhook"
                    placeholder="/webhook/calendar"
                    value={n8nConfig.calendarWebhook}
                    onChange={(e) => setN8nConfig({ ...n8nConfig, calendarWebhook: e.target.value })}
                    className="bg-background border-border"
                    disabled={!isAdmin}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Página de Agenda - Crear citas con lenguaje natural
                  </p>
                </div>

                <Button onClick={saveN8nConfig} className="w-full" disabled={!isAdmin}>
                  Guardar Configuración de N8N
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supabase">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Configuración de Supabase</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Información de conexión a Supabase (solo lectura)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">URL de Supabase</Label>
                  <Input
                    value={supabaseConfig.url}
                    readOnly
                    className="bg-muted border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se usa en: Todas las consultas directas a base de datos (Dashboard, perfiles, autenticación)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Anon Key</Label>
                  <Textarea
                    value={supabaseConfig.anonKey}
                    readOnly
                    className="bg-muted border-border font-mono text-xs"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Clave pública para autenticación del cliente
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Search, RefreshCw, Edit, Inbox, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Emails = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const handleSendEmail = async () => {
    const webhookUrl = localStorage.getItem("n8n_email_webhook");
    if (!webhookUrl) {
      toast({
        title: "Error de configuración",
        description: "Configura el webhook de correos en Configuración",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${localStorage.getItem("n8n_base_url")}${webhookUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          ...emailForm,
        }),
      });

      if (response.ok) {
        toast({
          title: "Correo enviado",
          description: "El correo se ha enviado exitosamente",
        });
        setEmailForm({ to: "", subject: "", body: "" });
        setIsComposing(false);
      }
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "No se pudo enviar el correo",
        variant: "destructive",
      });
    }
  };

  const handleFetchEmails = async () => {
    const webhookUrl = localStorage.getItem("n8n_email_webhook");
    if (!webhookUrl) {
      toast({
        title: "Error de configuración",
        description: "Configura el webhook de correos en Configuración",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sincronizando",
      description: "Consultando correos desde Gmail...",
    });

    // Aquí N8N se encargará de obtener los correos de Gmail
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Mail className="h-8 w-8 text-primary" />
              Correos
            </h1>
            <p className="text-muted-foreground">
              Gestiona tu bandeja de entrada de Gmail
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleFetchEmails}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar
            </Button>
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Redactar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Redactar Correo</DialogTitle>
                  <DialogDescription>
                    Envía un correo a través de N8N
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="to">Para</Label>
                    <Input
                      id="to"
                      placeholder="destinatario@ejemplo.com"
                      value={emailForm.to}
                      onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      placeholder="Asunto del correo"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="body">Mensaje</Label>
                    <Textarea
                      id="body"
                      placeholder="Escribe tu mensaje aquí..."
                      rows={10}
                      value={emailForm.body}
                      onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsComposing(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSendEmail}>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Mail className="h-5 w-5 text-primary" />
              Integración con Gmail
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Los correos se gestionan a través de N8N conectado a tu cuenta de Gmail.
              Configura tu webhook en Configuración → N8N Webhooks.
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="inbox" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="inbox" className="data-[state=active]:bg-background">
              <Inbox className="h-4 w-4 mr-2" />
              Bandeja de entrada
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-background">
              <FileEdit className="h-4 w-4 mr-2" />
              Borradores
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar correos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <TabsContent value="inbox">
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Bandeja de entrada vacía
                </h3>
                <p className="text-sm text-muted-foreground">
                  Haz clic en "Sincronizar" para obtener tus correos de Gmail
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts">
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <FileEdit className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Sin borradores
                </h3>
                <p className="text-sm text-muted-foreground">
                  Los borradores guardados aparecerán aquí
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Emails;
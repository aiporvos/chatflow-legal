import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { MessageSquare, Phone, Clock, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const { data: messages, isLoading } = useWhatsAppMessages();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState({ to: "", content: "" });
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    const webhookUrl = localStorage.getItem("n8n_whatsapp_outgoing_webhook");
    if (!webhookUrl) {
      toast({
        title: "Error de configuración",
        description: "Configura el webhook de WhatsApp (Saliente) en Configuración",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`${localStorage.getItem("n8n_base_url")}${webhookUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          to_number: newMessage.to,
          message_content: newMessage.content,
          message_type: "text",
        }),
      });

      if (response.ok) {
        toast({
          title: "Mensaje enviado",
          description: "Tu mensaje ha sido enviado",
        });
        setNewMessage({ to: "", content: "" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "read":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      sent: "Enviado",
      delivered: "Entregado",
      read: "Leído",
      failed: "Fallido",
    };
    return labels[status] || status;
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Send Message Card */}
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageSquare className="h-5 w-5 text-green-500" />
              Enviar Mensaje de WhatsApp
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Los mensajes se procesan y envían a través de N8N
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Número de teléfono (con código país)"
                value={newMessage.to}
                onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.to || !newMessage.content}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-card" />
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Historial de Mensajes</CardTitle>
              <CardDescription className="text-muted-foreground">
                {messages.length} mensaje{messages.length !== 1 ? "s" : ""} en total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                          <MessageSquare className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              De: {message.from_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Para: {message.to_number}
                            </p>
                            {message.case && (
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  📁 {message.case.case_number}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {message.case.title}
                                </span>
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className={getStatusColor(message.status)}>
                            {getStatusLabel(message.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">{message.message_content}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(message.created_at).toLocaleString("es-ES")}
                          <Badge variant="secondary" className="ml-2 bg-secondary text-secondary-foreground">
                            {message.message_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No hay mensajes</h3>
              <p className="text-sm text-muted-foreground">
                Los mensajes aparecerán aquí cuando se reciban desde N8N
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Messages;

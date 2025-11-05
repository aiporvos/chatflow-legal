import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { MessageSquare, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const Messages = () => {
  const { data: messages, isLoading } = useWhatsAppMessages();

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
        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Phone className="h-5 w-5 text-primary" />
              Integración con N8N
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Los mensajes se sincronizan automáticamente desde tus workflows de N8N.
              Configura tus webhooks en la sección de administración.
            </CardDescription>
          </CardHeader>
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
                          <div>
                            <p className="font-medium text-foreground">
                              De: {message.from_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Para: {message.to_number}
                            </p>
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

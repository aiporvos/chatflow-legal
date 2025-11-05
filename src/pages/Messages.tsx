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
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "read":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Mensajes de WhatsApp</h1>
          <p className="text-muted-foreground">
            Visualiza todas las conversaciones en tiempo real
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Integración con N8N
            </CardTitle>
            <CardDescription>
              Los mensajes se sincronizan automáticamente desde tus workflows de N8N.
              Configura tus webhooks en la sección de administración.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Messages List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Historial de Mensajes</CardTitle>
              <CardDescription>
                {messages.length} mensaje{messages.length !== 1 ? "s" : ""} en total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
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
                        <p className="text-sm">{message.message_content}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(message.created_at).toLocaleString("es-ES")}
                          <Badge variant="secondary" className="ml-2">
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
          <Card className="animate-fade-in">
            <CardContent className="py-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay mensajes</h3>
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

import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Send, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const CalendarPage = () => {
  const { toast } = useToast();
  const [appointmentRequest, setAppointmentRequest] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAppointment = async () => {
    const webhookUrl = localStorage.getItem("n8n_calendar_webhook");
    if (!webhookUrl) {
      toast({
        title: "Error de configuración",
        description: "Configura el webhook de agenda en Configuración",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(`${localStorage.getItem("n8n_base_url")}${webhookUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_appointment",
          request: appointmentRequest,
        }),
      });

      if (response.ok) {
        toast({
          title: "Cita en proceso",
          description: "N8N está procesando tu solicitud de cita",
        });
        setAppointmentRequest("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud de cita",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Agenda
          </h1>
          <p className="text-muted-foreground">
            Gestiona eventos y citas con lenguaje natural
          </p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              Crear Cita con Lenguaje Natural
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Describe la cita que necesitas y N8N la procesará automáticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="appointmentRequest">Descripción de la Cita</Label>
              <Textarea
                id="appointmentRequest"
                placeholder="Ej: Necesito una reunión con el cliente Juan Pérez el próximo martes a las 10am para revisar el caso"
                rows={4}
                value={appointmentRequest}
                onChange={(e) => setAppointmentRequest(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Escribe naturalmente: fecha, hora, participantes, motivo, etc.
              </p>
            </div>
            <Button
              onClick={handleCreateAppointment}
              disabled={isCreating || !appointmentRequest}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isCreating ? "Procesando..." : "Crear Cita"}
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="py-12 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Calendario de Eventos</h3>
            <p className="text-sm text-muted-foreground">
              Las citas creadas aparecerán aquí próximamente
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CalendarPage;

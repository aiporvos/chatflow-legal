import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const CalendarPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">
            Gestiona eventos y citas
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Gestión de Calendario</h3>
            <p className="text-sm text-muted-foreground">
              Próximamente: Integración con N8N y Google Calendar
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CalendarPage;

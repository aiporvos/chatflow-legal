import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const Contacts = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">
            Gestiona tu lista de contactos
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Gestión de Contactos</h3>
            <p className="text-sm text-muted-foreground">
              Próximamente: Integración con N8N para gestionar contactos
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Contacts;

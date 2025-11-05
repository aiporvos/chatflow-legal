import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Documents = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los documentos legales
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Gestión de Documentos</h3>
            <p className="text-sm text-muted-foreground">
              Próximamente: Carga y gestión de documentos vinculados a expedientes
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Documents;

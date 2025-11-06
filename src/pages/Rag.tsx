import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueryRagDialog } from "@/components/documents/QueryRagDialog";
import { Scale, BookOpen, Search } from "lucide-react";

const Rag = () => {
  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">RAG Jurídico</h1>
            <p className="text-muted-foreground mt-2">
              Consulta inteligente sobre documentos y jurisprudencia
            </p>
          </div>
          <QueryRagDialog />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Scale className="h-5 w-5 text-purple-500" />
                </div>
                <CardTitle>Consultas RAG</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground mt-1">Total de consultas realizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <CardTitle>Documentos Indexados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground mt-1">Listos para consulta</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <Search className="h-5 w-5 text-green-500" />
                </div>
                <CardTitle>Precisión</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">95%</p>
              <p className="text-sm text-muted-foreground mt-1">En respuestas generadas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Consultas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              No hay consultas recientes. Haz clic en "Consultar RAG" para comenzar.
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Rag;

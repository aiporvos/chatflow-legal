import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ExternalLink, Search, FileStack, Sparkles } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GenerateDocumentDialog } from "@/components/documents/GenerateDocumentDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documents = () => {
  const { data: documents, isLoading } = useDocuments();
  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((doc) =>
    doc.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileStack className="h-8 w-8 text-primary" />
              Documentos
            </h1>
            <p className="text-muted-foreground">
              Gestiona, genera y busca documentos legales
            </p>
          </div>
          <div className="flex gap-2">
            <GenerateDocumentDialog />
            <UploadDocumentDialog />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-card" />
            ))}
          </div>
        ) : filteredDocuments && filteredDocuments.length > 0 ? (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Documentos Almacenados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.file_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{doc.file_type}</span>
                          {doc.file_size && (
                            <>
                              <span>•</span>
                              <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(doc.created_at!).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                        En Google Drive
                      </Badge>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver en Drive
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border animate-fade-in">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No hay documentos</h3>
              <p className="text-sm text-muted-foreground">
                Sube documentos a Google Drive para que estén disponibles para el RAG
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Documents;

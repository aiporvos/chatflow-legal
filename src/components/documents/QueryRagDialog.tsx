import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRagQuery } from "@/hooks/useRagQuery";

export const QueryRagDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { mutate: queryRag, isPending, data: response } = useRagQuery();
  const { toast } = useToast();

  const handleQuery = () => {
    if (!query.trim()) {
      toast({
        title: "Consulta vacía",
        description: "Por favor escribe una pregunta",
        variant: "destructive",
      });
      return;
    }

    queryRag({ query: query.trim() });
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setQuery("");
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Consultar RAG
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultar Documentos con RAG</DialogTitle>
          <DialogDescription>
            Haz preguntas sobre los documentos almacenados en Google Drive
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="query">Tu pregunta</Label>
            <Textarea
              id="query"
              placeholder="Ej: ¿Cuáles son los pasos para una intimación de pago?"
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-2"
              disabled={isPending}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleQuery}
              disabled={isPending || !query.trim()}
              className="flex-1"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Consultar
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>
          </div>

          {response && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Respuesta del RAG
                  </h4>
                  <div className="text-sm text-foreground whitespace-pre-wrap">
                    {response.answer || response.message || "Sin respuesta"}
                  </div>
                  {response.sources && response.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        Fuentes consultadas:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {response.sources.map((source: string, idx: number) => (
                          <li key={idx}>• {source}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QueryRagDialog = () => {
  const navigate = useNavigate();

  return (
    <Button variant="outline" onClick={() => navigate("/rag")}>
      <MessageSquare className="h-4 w-4 mr-2" />
      Consultar RAG
    </Button>
  );
};
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Loader2, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRagQuery, extractRagAnswer } from "@/hooks/useRagQuery";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export const QueryRagDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const { mutate: queryRag, isPending, error } = useRagQuery();
  const { toast } = useToast();

  const isWebhookConfigError = error?.message?.includes("webhook") || error?.message?.includes("Configúralo");

  const markdownComponents = useMemo(
    () => ({
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-2 last:mb-0 leading-relaxed text-foreground">{children}</p>
      ),
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic text-foreground/90">{children}</em>
      ),
      ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="mb-2 space-y-1 list-disc list-inside text-foreground">{children}</ul>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="mb-2 space-y-1 list-decimal list-inside text-foreground">{children}</ol>
      ),
      li: ({ children }: { children?: React.ReactNode }) => (
        <li className="pl-1 text-foreground">{children}</li>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-2 border-primary/40 pl-3 italic text-foreground/90 mb-2">
          {children}
        </blockquote>
      ),
      code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) => (
        inline ? (
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground/90">
            {children}
          </code>
        ) : (
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs font-mono text-foreground/90">
            <code>{children}</code>
          </pre>
        )
      ),
      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {children}
        </a>
      ),
    }),
    []
  );

  const handleQuery = () => {
    if (!query.trim()) {
      toast({
        title: "Consulta vacía",
        description: "Por favor escribe una pregunta",
        variant: "destructive",
      });
      return;
    }

    const trimmed = query.trim();
    const userMessage: ConversationMessage = { role: "user", content: trimmed };
    const conversationForWebhook = [...messages, userMessage].map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMessage]);

    queryRag(
      { query: trimmed, history: [...conversationForWebhook] },
      {
        onSuccess: (data) => {
          const parsed = extractRagAnswer(data);
          const assistantMessage: ConversationMessage = {
            role: "assistant",
            content: parsed.text || "Sin respuesta",
            sources: parsed.sources,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        },
        onError: () => {
          setMessages((prev) => prev.slice(0, -1));
        },
      }
    );

    setQuery("");
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setMessages([]);
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
          {isWebhookConfigError && (
            <Alert variant="destructive">
              <Settings className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-2">
                <span>El webhook RAG no está configurado. Necesitas configurarlo para usar esta función.</span>
                <Link to="/settings" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="mt-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Ir a Configuración
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}

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

          {messages.length > 0 && (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <Card
                  key={`${message.role}-${index}-${message.content.slice(0, 10)}`}
                  className={
                    message.role === "user"
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted/50"
                  }
                >
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        {message.role === "user" ? "Tú" : "Asistente"}
                      </h4>
                      <div className="text-sm text-foreground">
                        {message.role === "assistant" ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        )}
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            Fuentes consultadas:
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {message.sources.map((source, idx) => (
                              <li key={idx}>• {source}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

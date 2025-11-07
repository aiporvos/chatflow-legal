import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Paperclip,
  Plus,
  SendHorizontal,
  Sparkles,
  Trash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useRagChat } from "@/hooks/useRagChat";
import { RagAttachment, RagHistoryItem } from "@/utils/rag";

type RagSession = {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
};

type RagMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  attachments: RagAttachment[] | null;
};

const uploadAttachment = async (
  userId: string,
  file: File
): Promise<RagAttachment> => {
  const bucket = "rag-uploads";
  const path = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw new Error(
      error.message ||
        "No se pudo subir el archivo. Verifica que exista el bucket 'rag-uploads'."
    );
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error("No se pudo obtener la URL pública del archivo subido.");
  }

  return {
    name: file.name,
    url: data.publicUrl,
    type: file.type || "application/octet-stream",
    size: file.size,
  };
};

const fetchSessions = async (userId?: string) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("rag_sessions")
    .select("id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as RagSession[];
};

const fetchMessages = async (sessionId?: string) => {
  if (!sessionId) return [];

  const { data, error } = await supabase
    .from("rag_messages")
    .select("id, role, content, created_at, attachments")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map((item) => ({
    ...item,
    attachments:
      (Array.isArray(item.attachments) ? item.attachments : []) as RagAttachment[],
  })) as RagMessage[];
};

const markdownComponents = {
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
  code: ({
    inline,
    children,
  }: {
    inline?: boolean;
    children?: React.ReactNode;
  }) =>
    inline ? (
      <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground/90">
        {children}
      </code>
    ) : (
      <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs font-mono text-foreground/90">
        <code>{children}</code>
      </pre>
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
};

const RagPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSession, setSelectedSession] = useState<string | null>(
    searchParams.get("session")
  );
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const ragChat = useRagChat();

  const {
    data: sessions,
    isLoading: loadingSessions,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["ragSessions", user?.id],
    queryFn: () => fetchSessions(user?.id),
    enabled: !!user,
  });

  const {
    data: messages,
    isLoading: loadingMessages,
  } = useQuery({
    queryKey: ["ragMessages", selectedSession],
    queryFn: () => fetchMessages(selectedSession || undefined),
    enabled: !!selectedSession,
  });

  useEffect(() => {
    if (!loadingSessions && sessions && sessions.length > 0) {
      if (!selectedSession) {
        setSelectedSession(sessions[0].id);
        setSearchParams({ session: sessions[0].id });
      }
    }
  }, [sessions, loadingSessions, selectedSession, setSearchParams]);

  useEffect(() => {
    if (selectedSession) {
      setSearchParams({ session: selectedSession });
    } else {
      setSearchParams({});
    }
  }, [selectedSession, setSearchParams]);

  const handleStartNewSession = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("rag_sessions")
      .insert({
        user_id: user.id,
        title: "Nueva conversación",
      })
      .select("id")
      .maybeSingle();

    if (error || !data?.id) {
      toast({
        title: "No se pudo crear la conversación",
        description:
          error?.message ||
          "Intenta de nuevo en unos minutos o verifica tu conexión.",
        variant: "destructive",
      });
      return;
    }

    await refetchSessions();
    setSelectedSession(data.id);
    setMessage("");
    setFiles([]);
  };

  const historyForWebhook: RagHistoryItem[] = useMemo(() => {
    if (!messages) return [];
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user?.id || !message.trim()) return;

    try {
      setIsUploading(true);

      const uploadedAttachments = await Promise.all(
        files.map((file) => uploadAttachment(user.id, file))
      );

      const allAttachments = uploadedAttachments;

      const history: RagHistoryItem[] = [
        ...historyForWebhook,
        { role: "user", content: message.trim() },
      ];

      const result = await ragChat.mutateAsync({
        userId: user.id,
        sessionId: selectedSession || undefined,
        title: message.trim(),
        message: message.trim(),
        history,
        attachments: allAttachments,
      });

      if (!selectedSession && result.sessionId) {
        setSelectedSession(result.sessionId);
      }

      setMessage("");
      setFiles([]);

      queryClient.invalidateQueries({
        queryKey: ["ragMessages", result.sessionId || selectedSession],
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "No se pudo enviar el mensaje",
        description:
          error instanceof Error
            ? error.message
            : "Intenta nuevamente en unos minutos.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta conversación?"
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("rag_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      toast({
        title: "No se pudo eliminar la conversación",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await refetchSessions();
    setSelectedSession(null);
    navigate("/rag");
  };

  return (
    <div className="flex h-full min-h-screen bg-background">
      <aside className="w-full max-w-xs border-r border-border bg-card/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-foreground">Asistente RAG</h1>
          <Button size="sm" variant="outline" onClick={handleStartNewSession}>
            <Plus className="h-4 w-4 mr-1" />
            Nuevo chat
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase text-muted-foreground mb-2">
              Sugerencias
            </p>
            <div className="grid gap-2">
              {["Explica el artículo 14 bis", "Resumen del expediente EXP-2024-001", "Puntos clave del contrato modelo"].map(
                (suggestion) => (
                  <Button
                    key={suggestion}
                    variant="secondary"
                    className="justify-start text-left whitespace-normal"
                    onClick={() => setMessage(suggestion)}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    {suggestion}
                  </Button>
                )
              )}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase text-muted-foreground mb-2">
              Conversaciones
            </p>
            <ScrollArea className="h-[50vh] pr-2">
              {loadingSessions && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {!loadingSessions && sessions?.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Aún no tienes conversaciones. Comienza una nueva consulta.
                </div>
              )}
              <div className="space-y-2">
                {sessions?.map((session) => (
                  <Card
                    key={session.id}
                    className={cn(
                      "cursor-pointer border border-transparent hover:border-primary/40 transition-colors",
                      selectedSession === session.id && "border-primary"
                    )}
                    onClick={() => setSelectedSession(session.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {session.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Actualizado:{" "}
                            {new Date(session.updated_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {sessions?.find((s) => s.id === selectedSession)?.title ||
                  "Nueva conversación"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Chatea con el asistente legal y sube documentos o imágenes para
                analizarlos.
              </p>
            </div>
          </header>

          <ScrollArea className="flex-1 px-6 py-6">
            {loadingMessages && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!loadingMessages && (!messages || messages.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Sparkles className="h-8 w-8 mb-2" />
                <p className="text-sm">
                  Aún no hay mensajes en esta conversación. Envia tu primera
                  consulta para comenzar.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {messages?.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div
                    className={cn(
                      "rounded-lg border p-4 shadow-sm",
                      msg.role === "user"
                        ? "ml-auto max-w-3xl bg-primary/10 border-primary/20"
                        : "mr-auto max-w-3xl bg-card border-border"
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {msg.content || "_Sin contenido_"}
                    </ReactMarkdown>

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          Adjuntos
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.attachments.map((attachment, index) => (
                            <a
                              key={`${attachment.url}-${index}`}
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Paperclip className="h-3 w-3" />
                              <span className="truncate max-w-[180px]">
                                {attachment.name}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

        <div className="border-t border-border p-6">
          <div className="space-y-3">
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <Card key={`${file.name}-${index}`} className="border border-primary/30 bg-primary/5 px-3 py-2">
                    <div className="text-xs text-primary flex items-center gap-2">
                      <Paperclip className="h-3 w-3" />
                      <span className="max-w-[220px] truncate">{file.name}</span>
                      <button
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setFiles((prev) =>
                            prev.filter((_, idx) => idx !== index)
                          )
                        }
                      >
                        Quitar
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Textarea
              placeholder="Escribe tu consulta legal aquí..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={ragChat.isPending || isUploading}
            />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    const selected = event.target.files;
                    if (!selected) return;
                    setFiles((prev) => [...prev, ...Array.from(selected)]);
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  disabled={ragChat.isPending || isUploading}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Adjuntar archivos
                </Button>
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={
                  !message.trim() || ragChat.isPending || isUploading
                }
              >
                {ragChat.isPending || isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Enviar
                    <SendHorizontal className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default RagPage;

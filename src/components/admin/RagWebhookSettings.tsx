import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWebhooks } from "@/hooks/useWebhooks";
import { useWebhookMutations } from "@/hooks/useWebhookMutations";
import { Loader2, Webhook } from "lucide-react";

export const RagWebhookSettings = () => {
  const { toast } = useToast();
  const { data: webhooks, isLoading } = useWebhooks();
  const { createWebhook, updateWebhook } = useWebhookMutations();
  
  const [webhookUrl, setWebhookUrl] = useState("");
  const [existingWebhook, setExistingWebhook] = useState<any>(null);

  useEffect(() => {
    if (webhooks) {
      const ragWebhook = webhooks.find(w => w.name === "n8n_rag_query_webhook");
      if (ragWebhook) {
        setExistingWebhook(ragWebhook);
        setWebhookUrl(ragWebhook.webhook_url);
      }
    }
  }, [webhooks]);

  const handleSave = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Error",
        description: "La URL del webhook es requerida",
        variant: "destructive",
      });
      return;
    }

    try {
      if (existingWebhook) {
        await updateWebhook.mutateAsync({
          id: existingWebhook.id,
          updates: {
            webhook_url: webhookUrl,
            is_active: true,
          },
        });
      } else {
        await createWebhook.mutateAsync({
          name: "n8n_rag_query_webhook",
          webhook_url: webhookUrl,
          description: "Webhook para consultas RAG sobre documentos",
          is_active: true,
        });
      }

      toast({
        title: "Éxito",
        description: "Webhook RAG configurado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el webhook",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook RAG
          </CardTitle>
          <CardDescription>
            Configura el webhook de n8n para consultas RAG
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Webhook RAG
        </CardTitle>
        <CardDescription>
          Configura el webhook de n8n para consultas RAG sobre documentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rag-webhook">URL del Webhook N8N</Label>
          <Input
            id="rag-webhook"
            type="url"
            placeholder="https://tu-instancia.n8n.cloud/webhook/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Este webhook se usará para procesar consultas RAG sobre los documentos subidos
          </p>
        </div>

        {existingWebhook && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Estado actual</p>
            <p className="text-sm text-muted-foreground">
              Webhook {existingWebhook.is_active ? "activo" : "inactivo"} - 
              Última actualización: {new Date(existingWebhook.updated_at).toLocaleString()}
            </p>
          </div>
        )}

        <Button 
          onClick={handleSave} 
          disabled={createWebhook.isPending || updateWebhook.isPending}
          className="w-full"
        >
          {(createWebhook.isPending || updateWebhook.isPending) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {existingWebhook ? "Actualizar Webhook" : "Crear Webhook"}
        </Button>
      </CardContent>
    </Card>
  );
};

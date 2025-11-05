import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Webhook, Copy, Trash2, Edit, ExternalLink } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useWebhookMutations } from "@/hooks/useWebhookMutations";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { EditWebhookDialog } from "./EditWebhookDialog";

type WebhookType = Tables<"n8n_webhooks">;

interface WebhookCardProps {
  webhook: WebhookType;
}

export const WebhookCard = ({ webhook }: WebhookCardProps) => {
  const { toggleWebhook, deleteWebhook } = useWebhookMutations();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhook.webhook_url);
    toast({
      title: "URL copiada",
      description: "La URL del webhook se ha copiado al portapapeles",
    });
  };

  const handleToggle = () => {
    toggleWebhook.mutate({
      id: webhook.id,
      isActive: !webhook.is_active,
    });
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar el webhook "${webhook.name}"?`)) {
      deleteWebhook.mutate(webhook.id);
    }
  };

  return (
    <>
      <Card className="bg-card border-border hover:border-primary/20 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Webhook className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{webhook.name}</h3>
                {webhook.description && (
                  <p className="text-sm text-muted-foreground">{webhook.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={webhook.is_active ? "default" : "secondary"}
                className={webhook.is_active ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
              >
                {webhook.is_active ? "Activo" : "Inactivo"}
              </Badge>
              <Switch
                checked={webhook.is_active || false}
                onCheckedChange={handleToggle}
                disabled={toggleWebhook.isPending}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-background border border-border p-3">
              <code className="flex-1 text-xs text-muted-foreground truncate">
                {webhook.webhook_url}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUrl}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(webhook.webhook_url, "_blank")}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Creado: {new Date(webhook.created_at!).toLocaleDateString("es-ES")}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                  className="h-8 gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteWebhook.isPending}
                  className="h-8 gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditWebhookDialog
        webhook={webhook}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
};

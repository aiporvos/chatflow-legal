import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useWebhookMutations } from "@/hooks/useWebhookMutations";
import { Tables } from "@/integrations/supabase/types";

type WebhookType = Tables<"n8n_webhooks">;

interface EditWebhookDialogProps {
  webhook: WebhookType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditWebhookDialog = ({ webhook, open, onOpenChange }: EditWebhookDialogProps) => {
  const [formData, setFormData] = useState({
    name: webhook.name,
    webhook_url: webhook.webhook_url,
    description: webhook.description || "",
  });

  const { updateWebhook } = useWebhookMutations();

  useEffect(() => {
    setFormData({
      name: webhook.name,
      webhook_url: webhook.webhook_url,
      description: webhook.description || "",
    });
  }, [webhook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWebhook.mutateAsync({
      id: webhook.id,
      updates: formData,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Webhook</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-foreground">
              Nombre del Webhook
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-webhook_url" className="text-foreground">
              URL del Webhook
            </Label>
            <Input
              id="edit-webhook_url"
              type="url"
              value={formData.webhook_url}
              onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-foreground">
              Descripción
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background border-border text-foreground"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateWebhook.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateWebhook.isPending}>
              {updateWebhook.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

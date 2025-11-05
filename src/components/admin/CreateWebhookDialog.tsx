import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useWebhookMutations } from "@/hooks/useWebhookMutations";

export const CreateWebhookDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    webhook_url: "",
    description: "",
  });

  const { createWebhook } = useWebhookMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createWebhook.mutateAsync(formData);
    setOpen(false);
    setFormData({ name: "", webhook_url: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Webhook
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Crear Webhook N8N</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nombre del Webhook
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ej: upload_to_drive"
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook_url" className="text-foreground">
              URL del Webhook
            </Label>
            <Input
              id="webhook_url"
              type="url"
              value={formData.webhook_url}
              onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
              placeholder="https://your-n8n-instance.com/webhook/..."
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Descripción (opcional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del propósito del webhook"
              className="bg-background border-border text-foreground"
              rows={3}
            />
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Nota:</strong> Este webhook será usado por el sistema para comunicarse con N8N. 
              Asegúrate de que la URL sea accesible desde este servidor.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createWebhook.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createWebhook.isPending}>
              {createWebhook.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Webhook"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

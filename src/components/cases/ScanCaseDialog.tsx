import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Scan, Upload } from "lucide-react";

export const ScanCaseDialog = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!file) {
      toast({
        title: "Archivo requerido",
        description: "Debes seleccionar una imagen del expediente",
        variant: "destructive",
      });
      return;
    }

    const webhookUrl = localStorage.getItem("n8n_scan_document_webhook");
    if (!webhookUrl) {
      toast({
        title: "Error de configuración",
        description: "Configura el webhook de escaneo en Configuración",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("action", "scan_case");

      const response = await fetch(`${localStorage.getItem("n8n_base_url")}${webhookUrl}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Expediente escaneado",
          description: "Los datos han sido extraídos. Revisa y guarda el expediente.",
        });
        
        // Aquí podrías abrir el diálogo de crear caso con los datos pre-llenados
        setOpen(false);
        setFile(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo escanear el expediente",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Scan className="h-4 w-4 mr-2" />
          Escanear Expediente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escanear Expediente</DialogTitle>
          <DialogDescription>
            Sube una imagen del expediente y N8N extraerá los datos automáticamente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="caseImage">Imagen del Expediente</Label>
            <Input
              id="caseImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Vision API extraerá número de expediente, título, descripción, etc.
            </p>
          </div>

          {file && (
            <div className="text-sm text-muted-foreground">
              Archivo seleccionado: {file.name}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleScan} disabled={isScanning || !file}>
              <Upload className="h-4 w-4 mr-2" />
              {isScanning ? "Escaneando..." : "Escanear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
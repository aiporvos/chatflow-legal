import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, FileText, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export const GenerateDocumentDialog = () => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Genérico
  const [genericForm, setGenericForm] = useState({
    documentType: "",
    description: "",
  });

  // Específico - Crear plantilla
  const [templateForm, setTemplateForm] = useState({
    name: "",
    image: null as File | null,
  });

  const handleGenerateGeneric = async () => {
    const webhookUrl = localStorage.getItem("n8n_generate_document_webhook");
    if (!webhookUrl) {
      toast({
        title: "Error de configuración",
        description: "Configura el webhook de generación de documentos en Configuración",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${localStorage.getItem("n8n_base_url")}${webhookUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generic",
          documentType: genericForm.documentType,
          description: genericForm.description,
        }),
      });

      if (response.ok) {
        toast({
          title: "Documento en proceso",
          description: "N8N está generando tu documento. Te pedirá los datos necesarios.",
        });
        setOpen(false);
        setGenericForm({ documentType: "", description: "" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la generación del documento",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateForm.image) {
      toast({
        title: "Imagen requerida",
        description: "Debes subir una imagen de la plantilla",
        variant: "destructive",
      });
      return;
    }

    const visionWebhook = localStorage.getItem("n8n_vision_api_webhook");
    if (!visionWebhook) {
      toast({
        title: "Error de configuración",
        description: "Configura el webhook de Vision API en Configuración",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("image", templateForm.image);
      formData.append("templateName", templateForm.name);
      formData.append("action", "create_template");

      const response = await fetch(`${localStorage.getItem("n8n_base_url")}${visionWebhook}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Plantilla en proceso",
          description: "Vision API está analizando la imagen para extraer campos variables",
        });
        setOpen(false);
        setTemplateForm({ name: "", image: null });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la plantilla",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="h-4 w-4 mr-2" />
          Generar Documento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generar Documento Legal</DialogTitle>
          <DialogDescription>
            N8N te ayudará a crear documentos personalizados
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="generic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generic">
              <FileText className="h-4 w-4 mr-2" />
              Genérico
            </TabsTrigger>
            <TabsTrigger value="template">
              <Upload className="h-4 w-4 mr-2" />
              Desde Plantilla
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generic" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select
                  value={genericForm.documentType}
                  onValueChange={(value) => setGenericForm({ ...genericForm, documentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carta_documento">Carta Documento</SelectItem>
                    <SelectItem value="intimacion">Intimación</SelectItem>
                    <SelectItem value="demanda">Demanda</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="poder">Poder</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descripción del Documento</Label>
                <Textarea
                  id="description"
                  placeholder="Describe qué necesitas en este documento. Ej: Carta documento por mora en el pago de alquiler"
                  rows={5}
                  value={genericForm.description}
                  onChange={(e) => setGenericForm({ ...genericForm, description: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  N8N te preguntará los datos necesarios para redactar el documento
                </p>
              </div>

              <Button
                onClick={handleGenerateGeneric}
                disabled={isGenerating || !genericForm.documentType || !genericForm.description}
                className="w-full"
              >
                {isGenerating ? "Procesando..." : "Iniciar Generación"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="templateName">Nombre de la Plantilla</Label>
                <Input
                  id="templateName"
                  placeholder="Ej: carta_documento_mora"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="templateImage">Imagen de la Plantilla</Label>
                <Input
                  id="templateImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setTemplateForm({ ...templateForm, image: file });
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Sube una imagen del documento. Vision API extraerá los campos variables automáticamente
                </p>
              </div>

              {templateForm.image && (
                <div className="text-sm text-muted-foreground">
                  Archivo seleccionado: {templateForm.image.name}
                </div>
              )}

              <Button
                onClick={handleCreateTemplate}
                disabled={isGenerating || !templateForm.name || !templateForm.image}
                className="w-full"
              >
                {isGenerating ? "Analizando..." : "Crear Plantilla con Vision API"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
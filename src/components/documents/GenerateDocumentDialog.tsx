import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, FileText, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    templateKey: "",
    notes: "",
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
          description:
            "N8N está generando tu documento. Te pedirá los datos necesarios.",
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
    const webhookUrl = localStorage.getItem("n8n_generate_document_webhook");
    if (!webhookUrl) {
      toast({
        title: "Error de configuración",
        description:
          "Configura el webhook de generación de documentos en Configuración",
        variant: "destructive",
      });
      return;
    }

    if (!templateForm.templateKey) {
      toast({
        title: "Selecciona una plantilla",
        description: "Elige la plantilla base que deseas utilizar",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        `${localStorage.getItem("n8n_base_url")}${webhookUrl}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "template",
            templateKey: templateForm.templateKey,
            notes: templateForm.notes,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Plantilla seleccionada",
          description:
            "N8N iniciará el diálogo para completar los campos variables y generar el documento.",
        });
        setOpen(false);
        setTemplateForm({ templateKey: "", notes: "" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la generación desde plantilla",
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
              <ClipboardList className="h-4 w-4 mr-2" />
              Usar Plantilla
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
                <Label htmlFor="templateKey">Plantilla disponible</Label>
                <Select
                  value={templateForm.templateKey}
                  onValueChange={(value) =>
                    setTemplateForm((prev) => ({ ...prev, templateKey: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intimacion">Intimación</SelectItem>
                    <SelectItem value="carta_documento">Carta Documento</SelectItem>
                    <SelectItem value="demanda">Demanda</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="poder">Poder</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Las plantillas se obtienen de tu carpeta de Google Drive. N8N se encargará
                  de solicitar los datos necesarios para completar los campos variables.
                </p>
              </div>

              <div>
                <Label htmlFor="templateNotes">Contexto adicional</Label>
                <Textarea
                  id="templateNotes"
                  placeholder="Agrega instrucciones o información relevante para el documento."
                  rows={4}
                  value={templateForm.notes}
                  onChange={(e) =>
                    setTemplateForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>

              <Button
                onClick={handleCreateTemplate}
                disabled={isGenerating || !templateForm.templateKey}
                className="w-full"
              >
                {isGenerating ? "Procesando..." : "Generar desde plantilla"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
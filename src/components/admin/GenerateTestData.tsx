import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const GenerateTestData = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateTestData = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      // 1. Crear expedientes de prueba
      const testCases = [
        {
          case_number: "EXP-001",
          title: "Demanda Laboral - Despido Injustificado",
          description: "Cliente despedido sin causa. Reclamación de indemnización por despido injustificado.",
          status: "in_progress" as const,
          client_id: user.id,
          lawyer_id: user.id,
        },
        {
          case_number: "EXP-002",
          title: "Divorcio Contencioso",
          description: "Trámite de divorcio con disputa por tenencia de hijos y división de bienes.",
          status: "new" as const,
          client_id: user.id,
          lawyer_id: user.id,
        },
        {
          case_number: "EXP-003",
          title: "Reclamo por Accidente de Tránsito",
          description: "Daños materiales y lesiones por colisión. Reclamo a seguro.",
          status: "pending_review" as const,
          client_id: user.id,
          lawyer_id: user.id,
        },
      ];

      const { data: insertedCases, error: casesError } = await supabase
        .from("cases")
        .insert(testCases)
        .select();

      if (casesError) throw casesError;

      // 2. Crear mensajes de prueba vinculados a expedientes
      const testMessages = [
        {
          message_id: `TEST_${Date.now()}_1`,
          chat_id: "5492604844952@s.whatsapp.net",
          from_number: "5492604000001",
          to_number: "5492604844952",
          message_content: `Hola, necesito consultar sobre el expediente ${testCases[0].case_number}. ¿Cuál es el estado actual?`,
          message_type: "text",
          status: "delivered" as const,
          case_id: insertedCases?.[0]?.id,
        },
        {
          message_id: `TEST_${Date.now()}_2`,
          chat_id: "5492604844952@s.whatsapp.net",
          from_number: "5492604844952",
          to_number: "5492604000001",
          message_content: "Tu expediente está en proceso. Te enviaremos actualizaciones pronto.",
          message_type: "text",
          status: "read" as const,
          case_id: insertedCases?.[0]?.id,
        },
        {
          message_id: `TEST_${Date.now()}_3`,
          chat_id: "5492605000002@s.whatsapp.net",
          from_number: "5492605000002",
          to_number: "5492604844952",
          message_content: `Consulta sobre ${testCases[1].case_number} - Divorcio. ¿Qué documentos necesito presentar?`,
          message_type: "text",
          status: "sent" as const,
          case_id: insertedCases?.[1]?.id,
        },
        {
          message_id: `TEST_${Date.now()}_4`,
          chat_id: "5492606000003@s.whatsapp.net",
          from_number: "5492606000003",
          to_number: "5492604844952",
          message_content: "Buenos días, me gustaría hacer seguimiento del caso de accidente de tránsito.",
          message_type: "text",
          status: "delivered" as const,
          case_id: insertedCases?.[2]?.id,
        },
        {
          message_id: `TEST_${Date.now()}_5`,
          chat_id: "5492607000004@s.whatsapp.net",
          from_number: "5492607000004",
          to_number: "5492604844952",
          message_content: "Hola, quisiera agendar una cita para consultar sobre un tema laboral.",
          message_type: "text",
          status: "sent" as const,
          case_id: null, // Sin vincular
        },
      ];

      const { error: messagesError } = await supabase
        .from("whatsapp_messages")
        .insert(testMessages);

      if (messagesError) throw messagesError;

      // Invalidar caché para refrescar datos
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["whatsappMessages"] });

      toast({
        title: "¡Datos de prueba generados!",
        description: `Se crearon ${testCases.length} expedientes y ${testMessages.length} mensajes de prueba`,
      });
    } catch (error) {
      console.error("Error generating test data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo generar datos de prueba",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generateTestData}
      disabled={isGenerating}
      variant="outline"
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Generar Datos de Prueba
        </>
      )}
    </Button>
  );
};

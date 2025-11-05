import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";

interface CaseMessagesCountProps {
  caseId: string;
}

export const CaseMessagesCount = ({ caseId }: CaseMessagesCountProps) => {
  const { data: messages } = useWhatsAppMessages(caseId);
  const count = messages?.length || 0;

  if (count === 0) return null;

  return (
    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
      <MessageSquare className="h-3 w-3 mr-1" />
      {count} mensaje{count !== 1 ? "s" : ""}
    </Badge>
  );
};

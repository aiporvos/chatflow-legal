import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCases } from "@/hooks/useCases";
import { Search, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCaseDialog } from "@/components/cases/CreateCaseDialog";
import { EditCaseDialog } from "@/components/cases/EditCaseDialog";
import { DeleteCaseDialog } from "@/components/cases/DeleteCaseDialog";
import { ScanCaseDialog } from "@/components/cases/ScanCaseDialog";
import { CaseMessagesCount } from "@/components/cases/CaseMessagesCount";

const Cases = () => {
  const { data: cases, isLoading } = useCases();
  const [search, setSearch] = useState("");

  const filteredCases = cases?.filter(
    (case_) =>
      case_.title.toLowerCase().includes(search.toLowerCase()) ||
      case_.case_number.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "in_progress":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "pending_review":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "closed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: "Nuevo",
      in_progress: "En Progreso",
      pending_review: "Pendiente de Revisión",
      closed: "Cerrado",
      archived: "Archivado",
    };
    return labels[status] || status;
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o número de expediente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <ScanCaseDialog />
            <CreateCaseDialog />
          </div>
        </div>

        {/* Cases List */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full bg-card" />
            ))}
          </div>
        ) : filteredCases && filteredCases.length > 0 ? (
          <div className="grid gap-4">
            {filteredCases.map((case_) => (
              <Card key={case_.id} className="bg-card border-border hover-scale transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        {case_.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Expediente: {case_.case_number}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <CaseMessagesCount caseId={case_.id} />
                      <Badge variant="outline" className={getStatusColor(case_.status)}>
                        {getStatusLabel(case_.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {case_.description && (
                      <p className="text-sm text-muted-foreground">
                        {case_.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Cliente:</span>{" "}
                        <span className="text-muted-foreground">
                          {case_.client?.full_name || case_.client?.email || "No asignado"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Abogado:</span>{" "}
                        <span className="text-muted-foreground">
                          {case_.lawyer?.full_name || case_.lawyer?.email || "No asignado"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Creado:</span>{" "}
                        <span className="text-muted-foreground">
                          {new Date(case_.created_at).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <EditCaseDialog case_={case_} />
                      <DeleteCaseDialog
                        caseId={case_.id}
                        caseTitle={case_.title}
                        caseNumber={case_.case_number}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No se encontraron expedientes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search
                  ? "Intenta con otra búsqueda"
                  : "Comienza creando un nuevo expediente"}
              </p>
              {!search && <CreateCaseDialog />}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Cases;

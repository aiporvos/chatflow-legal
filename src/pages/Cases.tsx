import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCases } from "@/hooks/useCases";
import { Plus, Search, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pending_review":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "closed":
        return "bg-green-100 text-green-700 border-green-200";
      case "archived":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expedientes</h1>
            <p className="text-muted-foreground">
              Gestiona todos los expedientes legales
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Expediente
          </Button>
        </div>

        {/* Search */}
        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título o número de expediente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredCases && filteredCases.length > 0 ? (
          <div className="grid gap-4 animate-fade-in">
            {filteredCases.map((case_) => (
              <Card key={case_.id} className="hover-scale transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        {case_.title}
                      </CardTitle>
                      <CardDescription>
                        Expediente: {case_.case_number}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(case_.status)}>
                      {getStatusLabel(case_.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {case_.description && (
                      <p className="text-sm text-muted-foreground">
                        {case_.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-medium">Cliente:</span>{" "}
                        <span className="text-muted-foreground">
                          {case_.client?.full_name || "No asignado"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Abogado:</span>{" "}
                        <span className="text-muted-foreground">
                          {case_.lawyer?.full_name || "No asignado"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Creado:</span>{" "}
                        <span className="text-muted-foreground">
                          {new Date(case_.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="animate-fade-in">
            <CardContent className="py-12 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No se encontraron expedientes</h3>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Intenta con otra búsqueda"
                  : "Comienza creando un nuevo expediente"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Cases;

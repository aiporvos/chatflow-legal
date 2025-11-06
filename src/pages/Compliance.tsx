import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, FileCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Compliance = () => {
  const complianceItems = [
    {
      title: "Cifrado E2E",
      status: "active",
      description: "Todos los datos están cifrados de extremo a extremo",
      icon: Lock,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "GDPR Compliance",
      status: "active",
      description: "Cumplimiento con regulaciones de protección de datos",
      icon: FileCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Backup Automático",
      status: "active",
      description: "Respaldos automáticos cada 24 horas",
      icon: Shield,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Auditoría de Accesos",
      status: "pending",
      description: "Registro de todos los accesos al sistema",
      icon: AlertTriangle,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cumplimiento y Seguridad</h1>
            <p className="text-muted-foreground mt-1">
              Estado de seguridad y cumplimiento normativo
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Estado General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sistemas operativos</span>
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                    100%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Último backup</span>
                  <span className="text-sm font-medium">Hoy, 03:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cifrado</span>
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                    Activo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Alertas de Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay alertas de seguridad pendientes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Elementos de Cumplimiento</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {complianceItems.map((item) => (
              <Card key={item.title} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg ${item.bg} p-3`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <Badge 
                          className={
                            item.status === "active" 
                              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" 
                              : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                          }
                        >
                          {item.status === "active" ? "Activo" : "Pendiente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Registro de Auditoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              No hay eventos de auditoría registrados
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Compliance;

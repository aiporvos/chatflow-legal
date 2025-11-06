import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Inicio",
  cases: "Expedientes",
  messages: "Mensajes",
  documents: "Documentos",
  contacts: "Contactos",
  calendar: "Agenda",
  admin: "Administración",
  settings: "Configuración",
  emails: "Correos",
  rag: "RAG Jurídico",
  analytics: "Analytics",
  compliance: "Cumplimiento",
};

export const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);
  const extraSegments = segments.filter((segment) => segment !== "dashboard");

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {extraSegments.length > 0 ? (
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Inicio</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>Inicio</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {extraSegments.map((segment, index) => {
              const path = `/${["dashboard", ...extraSegments.slice(0, index + 1)].join("/")}`;
              const label = breadcrumbLabels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
              const isLast = index === extraSegments.length - 1;
              return (
                <Fragment key={path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={path}>{label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <FileText className="mr-2 h-4 w-4" />
            Crear Documento
          </Button>
          <Button variant="outline" className="border-border hover:bg-muted">
            <Search className="mr-2 h-4 w-4" />
            Buscar Normativa
          </Button>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 hover:bg-muted">
            <div className="text-right">
              <p className="text-sm font-medium">Bienvenida, {user?.email?.split('@')[0] || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground">Panel de Control</p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

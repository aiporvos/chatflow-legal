import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ConfigError = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Error de Configuración</CardTitle>
            </div>
            <CardDescription>
              Faltan variables de entorno necesarias para ejecutar la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Variables de Entorno Faltantes</AlertTitle>
              <AlertDescription>
                La aplicación requiere las siguientes variables de entorno para funcionar correctamente:
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="font-semibold">Variables Requeridas:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code className="bg-muted px-1 py-0.5 rounded">VITE_SUPABASE_URL</code></li>
                <li><code className="bg-muted px-1 py-0.5 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code></li>
                <li><code className="bg-muted px-1 py-0.5 rounded">VITE_SUPABASE_PROJECT_ID</code></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Cómo Configurar:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>En Dokploy:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Ve a la configuración de tu aplicación</li>
                  <li>Sección "Environment Variables"</li>
                  <li>Agrega las variables requeridas</li>
                  <li>Redeploy la aplicación</li>
                </ol>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground mt-4">
                <p>
                  <strong>Para desarrollo local:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Crea un archivo <code className="bg-muted px-1 py-0.5 rounded">.env</code> en la raíz del proyecto</li>
                  <li>Agrega las variables con tus credenciales de Supabase</li>
                  <li>Reinicia el servidor de desarrollo</li>
                </ol>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Para más información, consulta la documentación:
              </p>
              <a
                href="https://github.com/aiporvos/chatflow-legal/blob/main/docs/DOCKER_DEPLOYMENT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Guía de Deployment
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


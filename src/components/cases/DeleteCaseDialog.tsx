import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useCaseMutations } from "@/hooks/useCaseMutations";

interface DeleteCaseDialogProps {
  caseId: string;
  caseTitle: string;
  caseNumber: string;
}

export const DeleteCaseDialog = ({
  caseId,
  caseTitle,
  caseNumber,
}: DeleteCaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const { deleteCase } = useCaseMutations();

  const handleDelete = async () => {
    await deleteCase.mutateAsync(caseId);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Esta acción no se puede deshacer. Eliminará permanentemente el expediente:
            </p>
            <div className="rounded-lg bg-muted p-3">
              <p className="font-semibold">{caseTitle}</p>
              <p className="text-sm text-muted-foreground">
                Expediente: {caseNumber}
              </p>
            </div>
            <p className="text-destructive font-medium">
              También se eliminarán todos los documentos y registros asociados a este
              expediente.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCase.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteCase.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteCase.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar Expediente"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import LoadingSpinner from "@/components/loading-spinner";

import {useConfirm} from "@/hooks/use-confirm";
import {useOpenUpdateDoctor} from "../hooks/use-open-update-doctor";
import {useBulkDeleteDoctors} from "../api/use-bulk-delete-doctors";
import {useGetDoctor} from "../api/use-get-doctor";
import {useUpdateDoctor} from "../api/use-update-doctor";
import {useGetUser} from "@/features/user/api/use-get-user";
import {useUpdateUser} from "@/features/user/api/use-update-user";

import {DoctorWithUserDTO} from "@/models/Doctor";
import DoctorsForm from "./doctors-form";

import {toast} from "sonner";

export default function UpdatePatientSheet() {
  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Esta ação é irreversível. Ao deletar os registros, eles serão permanentemente removidos e não poderão ser recuperados.",
  );
  const {id, isOpen, onClose} = useOpenUpdateDoctor();
  const deleteDoctorsQuery = useBulkDeleteDoctors();
  const updateDoctorsQuery = useUpdateDoctor();
  const doctorQuery = useGetDoctor(id);
  const userQuery = useGetUser(doctorQuery.data?.userId!, {
    enabled: !!doctorQuery.data?.userId,
  });

  const updateUserQuery = useUpdateUser();

  const defaultValues: DoctorWithUserDTO = {
    user: {
      name: userQuery.data?.name!,
      email: userQuery.data?.email!,
      password: "",
      role: "doctor",
    },
    doctor: {
      userId: doctorQuery.data?.userId!,
      jobFunction: doctorQuery.data?.jobFunction!,
      crm: doctorQuery.data?.crm!,
    },
  };

  const onDelete = async () => {
    if (id === undefined) return;

    const ok = await confirm();
    if (ok) {
      deleteDoctorsQuery.mutate([id], {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  async function onSubmit(values: DoctorWithUserDTO) {
    await updateUserQuery.mutateAsync({
      id: userQuery.data?.id!,
      payload: {
        ...values.user,
      },
    });

    await updateDoctorsQuery.mutateAsync({
      id: id!,
      data: {
        ...values.doctor,
      },
    });

    if (!updateUserQuery.isError && !updateDoctorsQuery.isError) {
      onClose();
    }
  }

  if (doctorQuery.isError) {
    toast.error(doctorQuery.error.message ?? "Algo deu errado.");
    onClose();
    return;
  }

  if (userQuery.isError) {
    toast.error(userQuery.error.message ?? "Algo deu errado.");
    onClose();
    return;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <ConfirmDialog />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Atualizar paciente</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo com as informações detalhadas do paciente.
          </SheetDescription>
        </SheetHeader>
        {doctorQuery.isPending || userQuery.isPending ? (
          <LoadingSpinner />
        ) : (
          <DoctorsForm
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            disabled={
              updateDoctorsQuery.isPending ||
              deleteDoctorsQuery.isPending ||
              updateUserQuery.isPending
            }
            onDelete={onDelete}
            editMode
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

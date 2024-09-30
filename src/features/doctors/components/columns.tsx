import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {Edit, MoreHorizontal} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import {Doctor} from "@/models/Doctor";
import {useOpenUpdateDoctor} from "../hooks/use-open-update-doctor";
import {useAuthStore} from "@/features/auth/hooks/use-auth-store";

export const doctorCols: ColumnDef<Doctor>[] = [
  {
    id: "select",
    header: ({table}) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user = useAuthStore().user;
      const isAdmin = user?.role === "admin";
      return isAdmin ? (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ) : null;
    },
    cell: ({row}) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user = useAuthStore().user;
      const isAdmin = user?.role === "admin";
      return isAdmin ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ) : null;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({row}) => {
      const {id, name} = row.original;
      return (
        <Link href={`/doctors/${id}`} className="text-primary">
          {name}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "crm",
    header: "CRM",
  },
  {
    accessorKey: "jobFunction",
    header: "Função",
  },
  {
    id: "actions",
    cell: ({row}) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const {onOpen} = useOpenUpdateDoctor();

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user = useAuthStore().user;
      const isAdmin = user?.role === "admin";
      return isAdmin ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onOpen(row.original.id)}>
              <Edit className="size-4 mr-2" />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null;
    },
  },
];

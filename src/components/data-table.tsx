import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDelete,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Esta ação é irreversível. Ao deletar os registros, eles serão permanentemente removidos e não poderão ser recuperados.",
  );
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      onDelete(selectedRows);
      table.resetRowSelection();
    }
  };

  return (
    <div className="rounded-md border px-6">
      <ConfirmDialog />
      <div className="flex justify-between items-center py-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            disabled={disabled ?? false}
            size="sm"
            variant={"outline"}
            className="ml-auto font-normal text-xs"
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Remove ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
      </div>
      {disabled ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} registro(s) selecionados.
          </div>
        </>
      )}
    </div>
  );
}

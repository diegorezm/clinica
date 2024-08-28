import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Loader2 } from "lucide-react";
import { useGetPatientsReferrals } from "../api/use-get-patient-referrals";
import { patientReferralCols } from "./columns";
import { useBulkDeletePatientsReferrals } from "../api/use-bulk-delete-patients-referrals";

export default function PatientsRefarralsTable({
  q,
  page,
  patientId,
}: {
  q?: string;
  page: number;
  patientId: number;
}) {
  const getPatientReferrals = useGetPatientsReferrals({
    patientId,
    q,
    page,
    size: 8,
  });
  const deleteReferrals = useBulkDeletePatientsReferrals();

  const isDisabled = getPatientReferrals.isPending;

  if (getPatientReferrals.error)
    return <div>Error! {getPatientReferrals.error.message}</div>;

  if (getPatientReferrals.isPlaceholderData || getPatientReferrals.isPending)
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      <DataTable
        columns={patientReferralCols}
        data={getPatientReferrals.data.data}
        disabled={isDisabled}
        onDelete={(rows) => {
          const ids: number[] = rows.map((row) => row.original.id);
          deleteReferrals.mutate(ids);
        }}
      />
      <DataTablePagination
        page={page}
        numberOfPages={getPatientReferrals.data.numberOfPages}
        hasNextPage={getPatientReferrals.data.hasNextPage}
      />
    </div>
  );
}

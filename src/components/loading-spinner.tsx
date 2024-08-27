import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-24">
      <Loader2 className="animate-spin" />
    </div>
  );
}

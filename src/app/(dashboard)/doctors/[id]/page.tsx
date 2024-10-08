const DEBOUNCE_DELAY = 500;

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    q?: string;
    page?: string;
  };
};

export default function DoctorPage({params, searchParams}: Props) {
  const id = Number(params.id);
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;
  return <div>{id}</div>;
}

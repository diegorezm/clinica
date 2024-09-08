type SearchProps = {
  q?: string;
  page?: string;
};

export default function DoctorsPage({
  searchParams,
}: {
  searchParams?: SearchProps;
}) {
  const q = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;
  return <div>Doctors</div>;
}

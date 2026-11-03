import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from '../lib/fetchClient';

type Unit = {
  id: string;
  title: string;
  description: string;
};

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending } = useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: () => fetchClient("/api/units"),
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <section id="center">
        {data && data.map((d) => (
          <>
            <Link to="/units/$unitId" params={{ unitId: d.id }}>
              <p>{d.title}</p>
            </Link>
          </>
        ))}
      </section>
    </>
  );
}

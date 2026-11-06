import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchClient } from '../lib/fetchClient';

type Unit = {
  id: string;
  title: string;
  description: string;
};

const unitsQueryOptions = queryOptions({
  queryKey: ["units"],
  queryFn: () => fetchClient<Unit[]>("/api/units"),
});

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(unitsQueryOptions),
  pendingComponent: () => (
    <>
      <p>Loading...</p>
      <p>サーバーを起動しています（1分ほどかかるかもしれません🙇‍♂️）</p>
    </>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(unitsQueryOptions);

  return (
    <>
      <section id="center">
        {data.map((d) => (
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

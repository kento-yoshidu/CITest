import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { fetchClient } from '../../lib/fetchClient';
import styles from "./-unitId.module.css";

type Choice = {
  id: string;
  label: string;
  body: string;
};

type Question = {
  id: string;
  body: string;
  choices: Choice[];
};

export const Route = createFileRoute('/units/$unitId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(startQueryOptions(params.unitId)),
  component: RouteComponent,
});

const startQueryOptions = (unitId: string) =>
  queryOptions({
    queryKey: ["units", unitId, "start"],
    queryFn: () => fetchClient<Question>(`/api/units/${unitId}/start`),
  });

function RouteComponent() {
  const { unitId } = Route.useParams();

  const { data } = useSuspenseQuery(startQueryOptions(unitId));

  return (
    <>
      <h2>{data.body}</h2>

      <div className={styles.choices}>
        {data.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={styles.choice}
          >
            <span>{choice.label}</span>
            <span>{choice.body}</span>
          </button>
        ))}
      </div>
    </>
  );
}

import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query';
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

type AnswerResponse = {
  correct: boolean;
  next_question: Question | null;
  unit_completed: boolean;
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

const postAnswer = (questionId: string, choiceId: string) =>
  fetchClient<AnswerResponse>(`/api/questions/${questionId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ choice_id: choiceId }),
  });

function RouteComponent() {
  const { unitId } = Route.useParams();

  const { data } = useSuspenseQuery(startQueryOptions(unitId));

  const answer = useMutation({
    mutationFn: (choiceId: string) => postAnswer(data.id, choiceId),
  });

  return (
    <>
      <h2>{data.body}</h2>

      <div className={styles.choices}>
        {data.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={styles.choice}
            onClick={() => answer.mutate(choice.id)}
          >
            <span>{choice.label}</span>
            <span>{choice.body}</span>
          </button>
        ))}

        {answer.data && (
          <p>{answer.data.correct ? "正解" : "不正解" }</p>
        )}
      </div>
    </>
  );
}

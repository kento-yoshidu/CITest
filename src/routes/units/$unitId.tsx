import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { fetchClient } from '../../lib/fetchClient';
import styles from "./-unitId.module.css";
import { useState } from 'react';

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

type AnswerResult = {
  choiceId: string;
  correct: boolean;
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

  const [questions, setQuestions] = useState<Question[]>([data]);
  const [results, setResults] = useState<Record<string, AnswerResult>>({});

  const current = questions[questions.length - 1];

  const answer = useMutation({
    mutationFn: (choiceId: string) => postAnswer(current.id, choiceId),
    onSuccess: (res, choiceId) => {
      setResults((prev) => ({
        ...prev,
        [current.id]: {
          choiceId,
          correct: res.correct,
        }
      }));

      if (res.next_question) {
        setQuestions((prev) => [...prev, res.next_question!]);
      }
    }
  });

  return (
    <>
      {questions.map((q) => (
        <section key={q.id}>
          <h2>{q.body}</h2>
          <div className={styles.choices}>
            {q.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={styles.choice}
                disabled={q.id !== current.id}
                onClick={() => answer.mutate(choice.id)}
              >
                <span>{choice.label}</span>
                <span>{choice.body}</span>
              </button>
            ))}
          </div>

          {results[q.id] && (
            <p>{results[q.id].correct ? "正解" : "不正解"}</p>
          )}
        </section>
      ))}
    </>
  );
}

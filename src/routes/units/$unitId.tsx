import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { fetchClient } from '../../lib/fetchClient';
import styles from "./-unitId.module.css";
import { Fragment, useState } from 'react';

type Choice = {
  id: string;
  label: string;
  body: string;
};

type Question = {
  id: string;
  body: string;
  is_branch: boolean;
  choices: Choice[];
};

type AnswerResponse = {
  correct: boolean;
  next_question: Question | null;
  branch_question: Question | null;
  unit_completed: boolean;
};

type AnswerResult = {
  choiceId: string;
  correct: boolean;
};

type AnswerVars = { questionId: string; choiceId: string; parentId?: string }; // 補足の問題なら parentId を付ける

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

  const [mainQuestions, setMainQuestions] = useState<Question[]>([data]);
  const [branches, setBranches] = useState<Record<string, Question[]>>({});
  const [results, setResults] = useState<Record<string, AnswerResult>>({});

  const answer = useMutation({
    mutationFn: ({ questionId, choiceId }: AnswerVars) => postAnswer(questionId, choiceId),
    onSuccess: (res, { questionId, choiceId, parentId }) => {
      setResults((prev) => ({
        ...prev,
        [questionId]: {
          choiceId,
          correct: res.correct,
        }
      }));

      if (!res.correct) {
        return;
      }

      if (parentId) {
        if (res.next_question) {
          setBranches((prev) => ({
            ...prev,
            [parentId]: [...(prev[parentId] ?? []), res.next_question!],
          }));
        }
      } else {
        if (res.next_question) {
          setMainQuestions((prev) => [...prev, res.next_question!]);
        }

        if (res.branch_question) {
          setBranches((prev) => ({
            ...prev,
            [questionId]: [res.branch_question!],
          }));
        }
      }
    }
  });

  const renderQuestion = (q: Question, parentId?: string) => (
    <section key={q.id}>
      <h2>{q.body}</h2>

      <div className={styles.choices}>
        {q.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={styles.choice}
            disabled={results[q.id]?.correct}
            onClick={() => answer.mutate({
              questionId: q.id,
              choiceId: choice.id,
              parentId,
            })}
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
  );

  const renderBranch = (parentId: string) => {
    const list = branches[parentId];

    if (!list) {
      return null;
    }

    const last = list[list.length - 1];
    const ended = results[last.id]?.correct === true;

    return (
      <aside className={styles.branch}>
        <p className={styles.branchLabel}>補足</p>
        {list.map((q) => renderQuestion(q, parentId))}
        {ended && <p className={styles.branchLabel}>補足おわり</p>}
      </aside>
    )
  }
  const lastMain = mainQuestions[mainQuestions.length - 1];
  const unitCompleted = results[lastMain.id]?.correct === true;

  return (
    <div className={styles.flow}>
      {mainQuestions.map((q, i) => (
        <Fragment key={q.id}>
          <div>{renderQuestion(q)}</div>
          <div className={styles.side}>
            {i > 0 && renderBranch(mainQuestions[i - 1].id)}
          </div>
        </Fragment>
      ))}

      {unitCompleted && (
        <>
          <div><p>完了</p></div>
          <div className={styles.side}>{renderBranch(lastMain.id)}</div>
        </>
      )}
    </div>
  );
}

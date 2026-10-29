import type { Answer, Progress, Task } from "./domain";
import { isAnswerFilled } from "./domain";

type ReviewProps = {
  tasks: Task[];
  answers: Record<string, Answer>;
  progress: Progress;
  onRestart: () => void;
};

function describeAnswer(task: Task, answer: Answer | undefined): string {
  if (answer === undefined || !isAnswerFilled(answer)) {
    return "Пропущено";
  }
  if (task.kind === "single-choice" && answer.kind === "single-choice") {
    const option = task.options.find((item) => item.id === answer.optionId);
    return option === undefined ? answer.optionId : `${option.id}) ${option.label}`;
  }
  if (answer.kind === "short-text") {
    return answer.text;
  }
  return "Пропущено";
}

export function Review({ tasks, answers, progress, onRestart }: ReviewProps) {
  return (
    <section className="review">
      <h2>Попытка завершена</h2>
      <p>
        Заполнено: {progress.answered} из {progress.total}
      </p>
      <ol>
        {tasks.map((task) => (
          <li key={task.id}>
            <p>
              <strong>{task.id}:</strong> {task.prompt}
            </p>
            <p className="review-answer">{describeAnswer(task, answers[task.id])}</p>
          </li>
        ))}
      </ol>
      <button type="button" className="finish" onClick={onRestart}>
        Начать новую попытку
      </button>
    </section>
  );
}

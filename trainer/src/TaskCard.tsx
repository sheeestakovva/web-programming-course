import type { Task } from "./domain";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="task-card">
      <p>Тема: {task.topic}</p>
      <h2>{task.prompt}</h2>

      {task.code !== undefined && <pre>{task.code}</pre>}

      {task.kind === "single-choice" ? (
        <ul>
          {task.options.map((option) => (
            <li key={option.id}>
              {option.id}) {option.label}
            </li>
          ))}
        </ul>
      ) : (
        <p>Это задание с текстовым ответом.</p>
      )}
    </article>
  );
}

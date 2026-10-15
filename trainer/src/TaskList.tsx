import type { Task } from "./domain";

type TaskListProps = {
  tasks: Task[];
  selectedId: string;
  onSelect: (taskId: string) => void;
};

export function TaskList({ tasks, selectedId, onSelect }: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <button
            type="button"
            aria-pressed={task.id === selectedId}
            onClick={() => onSelect(task.id)}
          >
            {task.id}: {task.prompt}
          </button>
        </li>
      ))}
    </ul>
  );
}

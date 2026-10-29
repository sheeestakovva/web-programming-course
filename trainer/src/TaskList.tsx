import type { Task } from "./domain";

type TaskListProps = {
  tasks: Task[];
  selectedId: string;
  missingIds: string[];
  onSelect: (taskId: string) => void;
};

export function TaskList({ tasks, selectedId, missingIds, onSelect }: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <button
            type="button"
            aria-pressed={task.id === selectedId}
            onClick={() => onSelect(task.id)}
          >
           <span>
              {task.id}: {task.prompt}
              <span className="status">
                {missingIds.includes(task.id) ? "не заполнено" : "заполнено ✓"}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

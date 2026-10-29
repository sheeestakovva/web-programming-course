import type { Progress as ProgressValue, Task } from "./domain";

type ProgressProps = {
  progress: ProgressValue;
  missingTasks: Task[];
};

export function Progress({ progress, missingTasks }: ProgressProps) {
  return (
    <div className="progress">
      <p>
        Заполнено: {progress.answered} из {progress.total}
      </p>
      {missingTasks.length > 0 ? (
        <p>Не заполнены: {missingTasks.map((task) => task.id).join(", ")}</p>
      ) : (
        <p>Все задания заполнены</p>
      )}
    </div>
  );
}

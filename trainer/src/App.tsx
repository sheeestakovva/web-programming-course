import { useState } from "react";
import { findTaskById } from "./domain";
import { webBasics } from "./data";
import { TaskList } from "./TaskList";
import { TaskCard } from "./TaskCard";

export default function App() {
  const set = webBasics;
  const [selectedId, setSelectedId] = useState<string>(set.tasks[0]?.id ?? "");

  const selectedTask = findTaskById(set, selectedId);

  return (
    <main>
      <h1>
        {set.title}
      </h1>
      <p>Заданий: {set.tasks.length}</p>

      {set.tasks.length === 0 ? (
        <p>В модуле пока нет заданий.</p>
      ) : (
        <>
          <TaskList
            tasks={set.tasks}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          {selectedTask === undefined ? (
            <p>Задание не выбрано.</p>
          ) : (
            <TaskCard task={selectedTask} />
          )}
        </>
      )}
    </main>
  );
}
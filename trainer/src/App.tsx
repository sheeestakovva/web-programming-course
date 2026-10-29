import { useState } from "react";
import type { Answer } from "./domain";
import { calculateProgress, findTaskById, isAnswerFilled } from "./domain";
import { webBasics } from "./data";
import { TaskList } from "./TaskList";
import { TaskCard } from "./TaskCard";
import { Progress } from "./Progress";
import { Review } from "./Review";

type Status = "in-progress" | "confirming" | "submitted";

export default function App() {
  const set = webBasics;
  const firstId = set.tasks[0]?.id ?? "";

  const [selectedId, setSelectedId] = useState<string>(firstId);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [status, setStatus] = useState<Status>("in-progress");

  const progress = calculateProgress(set, Object.values(answers));
  const missingTasks = set.tasks.filter((task) => {
    const answer = answers[task.id];
    return answer === undefined || !isAnswerFilled(answer);
  });

  const selectedTask = findTaskById(set, selectedId);
  const index = set.tasks.findIndex((task) => task.id === selectedId);
  const prevTask = set.tasks[index - 1];
  const nextTask = set.tasks[index + 1];

  function saveAnswer(answer: Answer) {
    setAnswers((prev) => ({ ...prev, [answer.taskId]: answer }));
  }

  function requestFinish() {
    setStatus(missingTasks.length > 0 ? "confirming" : "submitted");
  }

  function startNewAttempt() {
    setAnswers({});
    setSelectedId(firstId);
    setStatus("in-progress");
  }

    if (set.tasks.length === 0) {
    return (
      <main>
        <h1>{set.title}</h1>
        <p>В модуле пока нет заданий.</p>
      </main>
    );
  }

  if (status === "submitted") {
    return (
      <main>
        <h1>{set.title}</h1>
        <Review
          tasks={set.tasks}
          answers={answers}
          progress={progress}
          onRestart={startNewAttempt}
        />
      </main>
    );
  }

  return (
    <main>
      <h1>{set.title}</h1>
      <p>Заданий: {set.tasks.length}</p>

      <aside className="sidebar">
        <Progress progress={progress} missingTasks={missingTasks} />
        <TaskList
          tasks={set.tasks}
          selectedId={selectedId}
          missingIds={missingTasks.map((task) => task.id)}
          onSelect={setSelectedId}
        />
      </aside>

      <section className="workspace">
        {selectedTask === undefined ? (
          <p>Задание не выбрано.</p>
        ) : (
          <TaskCard
            task={selectedTask}
            answer={answers[selectedTask.id]}
            onAnswer={saveAnswer}
          />
        )}

        <div className="nav">
          <button
            type="button"
            disabled={prevTask === undefined}
            onClick={() => prevTask && setSelectedId(prevTask.id)}
          >
            ← Назад
          </button>
          <button
            type="button"
            disabled={nextTask === undefined}
            onClick={() => nextTask && setSelectedId(nextTask.id)}
          >
            Далее →
          </button>
        </div>

        {status === "confirming" ? (
          <div className="warning" role="alert">
            {missingTasks.length > 0 ? (
              <p>
                Не заполнены задания:{" "}
                {missingTasks.map((task) => task.id).join(", ")}. Завершить
                попытку?
              </p>
            ) : (
              <p>Все задания заполнены. Завершить попытку?</p>
            )}
            <button type="button" onClick={() => setStatus("submitted")}>
              Да, завершить
            </button>
            <button type="button" onClick={() => setStatus("in-progress")}>
              Вернуться к заданиям
            </button>
          </div>
        ) : (
          <button type="button" className="finish" onClick={requestFinish}>
            Завершить попытку
          </button>
        )}
      </section>
    </main>
  );
}
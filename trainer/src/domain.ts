// Типы данных тренажёра по контракту курса (версия формата 1).

export type Option = {
  id: string;
  label: string;
};

// Поля, общие для всех заданий.
type TaskBase = {
  id: string;
  topic: string; // произвольная строка, не закрытый union
  prompt: string;
  code?: string; // текст для показа, не исполняется
};

export type SingleChoiceTask = TaskBase & {
  kind: "single-choice";
  options: Option[];
};

export type ShortTextTask = TaskBase & {
  kind: "short-text";
};

export type Task = SingleChoiceTask | ShortTextTask;

export type TrainingSet = {
  id: string;
  title: string;
  tasks: Task[];
};

export type SingleChoiceAnswer = {
  taskId: string;
  kind: "single-choice";
  optionId: string;
};

export type ShortTextAnswer = {
  taskId: string;
  kind: "short-text";
  text: string;
};

export type Answer = SingleChoiceAnswer | ShortTextAnswer;

export type Progress = {
  answered: number;
  total: number;
};

// Поиск задания по id. Если задания нет, возвращает undefined.
export function findTaskById(
  set: TrainingSet,
  taskId: string,
): Task | undefined {
  return set.tasks.find((task) => task.id === taskId);
}

// Задания с указанной темой. Всегда новый массив, возможно пустой.
export function filterTasksByTopic(set: TrainingSet, topic: string): Task[] {
  return set.tasks.filter((task) => task.topic === topic);
}

// Заполнен ли ответ. Текст из одних пробелов не считается заполненным.
export function isAnswerFilled(answer: Answer): boolean {
  switch (answer.kind) {
    case "single-choice":
      return answer.optionId !== "";
    case "short-text":
      return answer.text.trim() !== "";
  }
}

// Прогресс: сколько заданий набора имеют заполненный ответ, из общего числа.
// Ответы на задания из другого набора (чужой taskId) не учитываются.
export function calculateProgress(
  set: TrainingSet,
  answers: readonly Answer[],
): Progress {
  const answered = set.tasks.filter((task) =>
    answers.some(
      (answer) => answer.taskId === task.id && isAnswerFilled(answer),
    ),
  ).length;

  return { answered, total: set.tasks.length };
}

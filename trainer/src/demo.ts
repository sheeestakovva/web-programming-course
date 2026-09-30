import type { Answer, TrainingSet } from "./domain";
import {
  calculateProgress,
  filterTasksByTopic,
  findTaskById,
} from "./domain";

// --- Входные данные ---

// Задания ts-1 и react-1 из course/data/training-set.json со всеми полями.
const webBasics: TrainingSet = {
  id: "web-basics",
  title: "Основы веб-программирования",
  tasks: [
    {
      id: "ts-1",
      kind: "single-choice",
      topic: "typescript",
      prompt: "Что выведет этот JavaScript-код?",
      code: 'console.log("10" * 5);',
      options: [
        { id: "a", label: "105" },
        { id: "b", label: "50" },
        { id: "c", label: "Ошибка" },
      ],
    },
    {
      id: "react-1",
      kind: "short-text",
      topic: "react",
      prompt: "Объясните, чем props компонента отличаются от его состояния.",
    },
  ],
};

// Второй набор с другими id и другой темой.
const httpBasics: TrainingSet = {
  id: "http-basics",
  title: "Основы HTTP",
  tasks: [
    {
      id: "http-1",
      kind: "short-text",
      topic: "http",
      prompt: "Что нужно проверить в ответе fetch перед использованием JSON?",
    },
    {
      id: "http-2",
      kind: "single-choice",
      topic: "http",
      prompt: "Какой код ответа означает «не найдено»?",
      options: [
        { id: "a", label: "200" },
        { id: "b", label: "404" },
        { id: "c", label: "500" },
      ],
    },
  ],
};

const emptySet: TrainingSet = {
  id: "empty",
  title: "Пустой набор",
  tasks: [],
};

// Ответы.
const noAnswers: Answer[] = [];

const oneAnswer: Answer[] = [
  { taskId: "ts-1", kind: "single-choice", optionId: "b" },
];

const fullAnswers: Answer[] = [
  { taskId: "ts-1", kind: "single-choice", optionId: "b" },
  { taskId: "react-1", kind: "short-text", text: "Props приходят снаружи" },
];

const blankTextAnswers: Answer[] = [
  { taskId: "ts-1", kind: "single-choice", optionId: "a" },
  { taskId: "react-1", kind: "short-text", text: "   " },
];

// Ответ на задание из другого набора (чужой taskId).
const foreignAnswers: Answer[] = [
  { taskId: "http-1", kind: "short-text", text: "Проверить response.ok" },
];

// --- Вспомогательный вывод ---

function show(label: string, value: unknown): void {
  console.log(`${label}:`, JSON.stringify(value));
}

function formatProgress(p: { answered: number; total: number }): string {
  return `${p.answered} из ${p.total}`;
}

// Снимки входов до вызовов функций, чтобы доказать отсутствие мутаций.
const setBefore = JSON.stringify(webBasics);
const answersBefore = JSON.stringify(fullAnswers);

// --- Поиск по id ---
console.log("=== Поиск задания по id ===");

const foundTs = findTaskById(webBasics, "ts-1");
show("ts-1", foundTs?.prompt);

const foundReact = findTaskById(webBasics, "react-1");
show("react-1", foundReact?.prompt);

const missing = findTaskById(webBasics, "no-such-id");
console.log("no-such-id:", missing); // undefined
console.log(
  "Ветка отсутствия:",
  missing === undefined ? "задание не найдено" : missing.prompt,
);

console.log("Поиск в пустом наборе:", findTaskById(emptySet, "ts-1"));

// Сужение по kind: options доступны только после проверки.
if (foundTs !== undefined && foundTs.kind === "single-choice") {
  show(
    "Варианты ts-1",
    foundTs.options.map((option) => option.label),
  );
  console.log("Код ts-1 (только текст):", foundTs.code);
}

// --- Фильтр по теме ---
console.log("\n=== Фильтр по topic ===");
show(
  "typescript",
  filterTasksByTopic(webBasics, "typescript").map((t) => t.id),
);
show("react", filterTasksByTopic(webBasics, "react").map((t) => t.id));
show("http во втором наборе", filterTasksByTopic(httpBasics, "http").map((t) => t.id));
show("css (нет совпадений)", filterTasksByTopic(webBasics, "css"));
show("пустой набор", filterTasksByTopic(emptySet, "typescript"));

// --- Прогресс ---
console.log("\n=== Прогресс ===");
console.log("Пустой набор:", formatProgress(calculateProgress(emptySet, noAnswers)));
console.log("Без ответов:", formatProgress(calculateProgress(webBasics, noAnswers)));
console.log("Один ответ:", formatProgress(calculateProgress(webBasics, oneAnswer)));
console.log("Полный набор:", formatProgress(calculateProgress(webBasics, fullAnswers)));
console.log(
  "Текст из пробелов:",
  formatProgress(calculateProgress(webBasics, blankTextAnswers)),
);
console.log(
  "Чужой taskId:",
  formatProgress(calculateProgress(webBasics, foreignAnswers)),
);
console.log(
  "Тот же ответ для второго набора:",
  formatProgress(calculateProgress(httpBasics, foreignAnswers)),
);

// --- Неизменность входов ---
console.log("\n=== Неизменность входов ===");
console.log("Набор не изменился:", JSON.stringify(webBasics) === setBefore);
console.log("Ответы не изменились:", JSON.stringify(fullAnswers) === answersBefore);

/**
 * ADQuiz - TypeScript Type Definitions
 * Cung cấp type hints cho IDE và type checking
 */

// ═══════════════════════════════════════════════════════════════════════════
// ► INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface QuizQuestion {
  id: number;
  q: string;
  img: string;
  explanation: string;
  c: number;
  a: QuizAnswer[];
}

export interface QuizAnswer {
  text: string;
  img: string;
  correct: boolean;
}

export interface QuizResult {
  isCorrect: boolean;
  selectedIndex: number;
  selectedText: string;
  correctText: string;
  explanation: string;
  answeredAt: number;
}

export interface QuizData {
  q: string;
  img: string;
  explanation: string;
  c: number;
  a: (string | { text: string; img?: string })[];
}

export interface QuizSettings {
  name?: string;
  isRandomSen?: boolean;
  isRandomAns?: boolean;
  time?: number;
  limit?: number;
}

export interface QuizDataExport {
  quiz: string[];
  ans: QuizAnswer[][];
  img: string[];
  exp: string[];
  cor: number[];
}

export interface StorageData {
  results: Record<number, QuizResult>;
  index: number;
  time: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// ► CLASSES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QuizState - Quản lý toàn bộ state của quiz
 */
export class QuizState {
  name: string;
  index: number;
  quiz: QuizQuestion[];
  quizzes: QuizQuestion[];
  isRandomSen: boolean;
  isRandomAns: boolean;
  results: Record<number, QuizResult>;
  isSubmitted: boolean;
  limit: number;
  timer: NodeJS.Timeout | null;
  time: number;
  onlyWrong: boolean;
  bookmarks: Set<number>;

  constructor(data?: QuizData[], setting?: QuizSettings);
  setSetting(setting: QuizSettings): void;
  setLimit(value: number): void;
  resetRandom(): void;
  _initSetting(setting: QuizSettings): void;
  _applyRandom(): void;
}

/**
 * QuizComputed - Cung cấp computed properties
 */
export class QuizComputed {
  constructor(state: QuizState);

  get canNext(): boolean;
  get canPrev(): boolean;
  get isFinished(): boolean;
  get firstUnanswered(): QuizQuestion | undefined;
  get averageTime(): number;
  get uiTime(): string;
  get lenSen(): number;
  get lenAns(): number;
  get data(): QuizDataExport;
  get currentQuestion(): QuizQuestion;
  get score(): string;
  set score(value: number);
  get progress(): number;
  get answeredCount(): number;
  get unansweredCount(): number;
  get unansweredPercent(): number;
  get wrongCount(): number;
  get correctCount(): number;
  get correctPercent(): number;
  get wrongPercent(): number;
}

/**
 * QuizAnswer - Xử lý câu trả lời
 */
export class QuizAnswer {
  constructor(state: QuizState);

  selectAnswer(ansIndex: number): void;
  getResult(id: number): QuizResult | null;
  isAnswered(id: number): boolean;
  clearAnswer(id: number): void;
  isCorrect(id: number): boolean;
  isWrong(id: number): boolean;
  isUnanswered(id: number): boolean;
}

/**
 * QuizTimer - Quản lý bộ đếm thời gian
 */
export class QuizTimer {
  onTime: () => void;

  constructor(state: QuizState);

  startTime(seconds: number): void;
  stopTime(): void;
  pauseTime(): void;
  resumeTime(): void;
  restartTime(seconds?: number): void;
}

/**
 * QuizNavigation - Điều hướng giữa các câu hỏi
 */
export class QuizNavigation {
  constructor(state: QuizState);

  first(): void;
  last(): void;
  jumpToUnanswered(): void;
  next(): void;
  prev(): void;
  go(index: number): void;
}

/**
 * QuizStorage - Lưu/tải dữ liệu
 */
export class QuizStorage {
  constructor(state: QuizState);

  clearStorage(): void;
  save(): void;
  load(): void;
}

/**
 * ADQuiz - Class chính kết hợp tất cả module
 */
export class ADQuiz {
  state: QuizState;
  computed: QuizComputed;
  answer: QuizAnswer;
  timer: QuizTimer;
  navigation: QuizNavigation;
  storage: QuizStorage;

  // State Properties
  name: string;
  index: number;
  quiz: QuizQuestion[];
  quizzes: QuizQuestion[];
  isRandomSen: boolean;
  isRandomAns: boolean;
  results: Record<number, QuizResult>;
  isSubmitted: boolean;
  limit: number;
  time: number;
  bookmarks: Set<number>;
  onlyWrong: boolean;

  // Computed Getters
  readonly canNext: boolean;
  readonly canPrev: boolean;
  readonly isFinished: boolean;
  readonly firstUnanswered: QuizQuestion | undefined;
  readonly averageTime: number;
  readonly uiTime: string;
  readonly lenSen: number;
  readonly lenAns: number;
  readonly data: QuizDataExport;
  readonly currentQuestion: QuizQuestion;
  score: string;
  readonly progress: number;
  readonly answeredCount: number;
  readonly unansweredCount: number;
  readonly unansweredPercent: number;
  readonly wrongCount: number;
  readonly correctCount: number;
  readonly correctPercent: number;
  readonly wrongPercent: number;

  constructor(data?: QuizData[], setting?: QuizSettings);

  // Answer Methods
  selectAnswer(ansIndex: number): void;
  getResult(id: number): QuizResult | null;
  isAnswered(id: number): boolean;
  clearAnswer(id: number): void;
  isCorrect(id: number): boolean;
  isWrong(id: number): boolean;
  isUnanswered(id: number): boolean;

  // Timer Methods
  startTime(seconds: number): void;
  stopTime(): void;
  pauseTime(): void;
  resumeTime(): void;
  restartTime(seconds?: number): void;

  // Navigation Methods
  first(): void;
  last(): void;
  jumpToUnanswered(): void;
  next(): void;
  prev(): void;
  go(index: number): void;

  // Storage Methods
  clearStorage(): void;
  save(): void;
  load(): void;

  // Settings & Control
  toggleRandomSen(): void;
  toggleRandomAns(): void;
  resetRandom(): void;
  setLimit(value: number): void;
  setSetting(setting: QuizSettings): void;
  submit(): void;
  reset(): void;
  toggleBookmark(id: number): void;
  isBookmarked(id: number): boolean;
  toggleOnlyWrong(): void;
  search(text: string): QuizQuestion[];
}

// ═══════════════════════════════════════════════════════════════════════════
// ► UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chuẩn hóa dữ liệu quiz
 */
export function normalizeQuiz(data: QuizData[]): QuizQuestion[];

/**
 * Xáo trộn mảng
 */
export function shuffle<T>(array: T[]): T[];

// ═══════════════════════════════════════════════════════════════════════════
// ► BACKWARD COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Alias cho backward compatibility
 */
export type QuizStore = ADQuiz;

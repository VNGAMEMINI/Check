import { makeAutoObservable } from "https://esm.sh/mobx@6"; // Đảm bảo import makeAutoObservable
import { QuizState } from "./QuizState.js";
import { QuizComputed } from "./QuizComputed.js";
import { QuizAnswer } from "./QuizAnswer.js";
import { QuizTimer } from "./QuizTimer.js";
import { QuizNavigation } from "./QuizNavigation.js";
import { QuizStorage } from "./QuizStorage.js";
// import { shuffle } from "./utils.js";

/**
 * Lớp chính quản lý toàn bộ logic Quiz
 * Kết hợp tất cả các module con
 */
export class ADQuiz {
  constructor(data = [], setting = {}) {
    // Khởi tạo state
    this.state = new QuizState(data, setting);

    // Khởi tạo các module
    this.computed = new QuizComputed(this.state);
    this.answer = new QuizAnswer(this.state);
    this.timer = new QuizTimer(this.state);
    this.navigation = new QuizNavigation(this.state);
    this.storage = new QuizStorage(this.state);

    makeAutoObservable(this, {
      state: false,
      computed: false,
      answer: false,
      timer: false,
      navigation: false,
      storage: false,
    });

    // Apply random settings nếu cần
    this.state._applyRandom();

    // Bind methods to preserve `this` context
    this.selectAnswer = this.selectAnswer.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.toggleRandomAns = this.toggleRandomAns.bind(this);
    this.toggleRandomSen = this.toggleRandomSen.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  // ============================================================
  // STATE PROXY - Delegate trực tiếp các state properties
  // ============================================================

  get setting() {
    return this.state.setting;
  }

  get name() {
    return this.state.name;
  }
  set name(value) {
    this.state.name = value;
  }

  get index() {
    return this.state.index;
  }
  set index(value) {
    this.state.index = value;
  }

  get quiz() {
    return this.state.quiz;
  }

  get quizzes() {
    return this.state.quizzes;
  }

  get isRandomSen() {
    return this.state.isRandomSen;
  }

  get isRandomAns() {
    return this.state.isRandomAns;
  }

  get results() {
    return this.state.results;
  }

  get isSubmitted() {
    return this.state.isSubmitted;
  }

  get limit() {
    return this.state.limit;
  }

  get time() {
    return this.state.time;
  }
  set time(value) {
    this.state.time = value;
  }

  get timeTotal() {
    return this.state.timeTotal;
  }
  set timeTotal(value) {
    this.state.timeTotal = value;
  }

  get timePassed() {
    return this.state.timePassed;
  }
  set timePassed(value) {
    this.state.timePassed = value;
  }

  get mode() {
    return this.state.mode;
  }
  set mode(value) {
    if (["free", "exam"].includes(value)) {
      this.state.mode = value;
    }
  }

  get autoNext() {
    return this.state.autoNext;
  }
  set autoNext(value) {
    if (typeof value === "object" && value !== null) {
      this.state.autoNext = {
        enabled: Boolean(value.enabled),
        delay: Math.min(3, Math.max(0, Number(value.delay) || 0)),
      };
    }
  }

  get onlyWrong() {
    return this.state.onlyWrong;
  }
  set onlyWrong(value) {
    this.state.onlyWrong = value;
  }

  get bookmarks() {
    return this.state.bookmarks;
  }

  get _score() {
    return this.state._score;
  }
  set _score(value) {
    this.state._score = value;
  }

  get _scoreFixed() {
    return this.state._scoreFixed;
  }
  set _scoreFixed(value) {
    this.state._scoreFixed = value;
  }

  // ============================================================
  // COMPUTED PROXY
  // ============================================================

  get canNext() {
    return this.computed.canNext;
  }

  get canPrev() {
    return this.computed.canPrev;
  }

  get isFinished() {
    return this.computed.isFinished;
  }

  get firstUnanswered() {
    return this.computed.firstUnanswered;
  }

  get averageTime() {
    return this.computed.averageTime;
  }

  get uiTime() {
    return this.computed.uiTime;
  }

  get lenSen() {
    return this.computed.lenSen;
  }

  get lenAns() {
    return this.computed.lenAns;
  }

  get data() {
    return this.computed.data;
  }

  get currentQuestion() {
    return this.computed.currentQuestion;
  }

  get score() {
    return this.computed.score;
  }
  set score(value) {
    this.computed.score = value;
  }

  get progress() {
    return this.computed.progress;
  }

  get answeredCount() {
    return this.computed.answeredCount;
  }

  get unansweredCount() {
    return this.computed.unansweredCount;
  }

  get unansweredPercent() {
    return this.computed.unansweredPercent;
  }

  get wrongCount() {
    return this.computed.wrongCount;
  }

  get correctCount() {
    return this.computed.correctCount;
  }

  get correctPercent() {
    return this.computed.correctPercent;
  }

  get wrongPercent() {
    return this.computed.wrongPercent;
  }

  get displayName() {
    return this.computed.displayName;
  }

  get timeRemaining() {
    return this.computed.timeRemaining;
  }

  get timeRemainingUI() {
    return this.computed.timeRemainingUI;
  }

  get elapsedTimeUI() {
    return this.computed.elapsedTimeUI;
  }

  get elapsedPercent() {
    return this.computed.elapsedPercent;
  }

  get isAutoNextEnabled() {
    return this.computed.isAutoNextEnabled;
  }

  get autoNextDelay() {
    return this.computed.autoNextDelay;
  }

  get isExamMode() {
    return this.computed.isExamMode;
  }

  get isFreeMod() {
    return this.computed.isFreeMod;
  }

  // ============================================================
  // ANSWER PROXY
  // ============================================================

  selectAnswer(ansIndex) {
    this.answer.selectAnswer(ansIndex);
  }

  getResult(id) {
    return this.answer.getResult(id);
  }

  isAnswered(id) {
    return this.answer.isAnswered(id);
  }

  clearAnswer(id) {
    this.answer.clearAnswer(id);
  }

  isCorrect(id) {
    return this.answer.isCorrect(id);
  }

  isWrong(id) {
    return this.answer.isWrong(id);
  }

  isUnanswered(id) {
    return this.answer.isUnanswered(id);
  }

  // ============================================================
  // TIMER PROXY
  // ============================================================

  startTime(seconds) {
    this.timer.startTime(seconds);
    this.answer.resetAnswerTimer();
  }

  stopTime() {
    this.timer.stopTime();
  }

  pauseTime() {
    this.timer.pauseTime();
  }

  resumeTime() {
    this.timer.resumeTime();
  }

  restartTime(seconds) {
    this.timer.restartTime(seconds);
  }

  setOnTime(callback) {
    this.timer.onTime = callback;
  }

  // ============================================================
  // NAVIGATION PROXY
  // ============================================================

  first() {
    this.navigation.first();
  }

  last() {
    this.navigation.last();
  }

  jumpToUnanswered() {
    this.navigation.jumpToUnanswered();
  }

  next() {
    this.navigation.next();
  }

  prev() {
    this.navigation.prev();
  }

  go(index) {
    this.navigation.go(index);
  }

  // ============================================================
  // STORAGE PROXY
  // ============================================================

  clearStorage() {
    this.storage.clearStorage();
  }

  save() {
    this.storage.save();
  }

  load() {
    this.storage.load();
  }

  // ============================================================
  // RANDOM & SETTINGS
  // ============================================================

  toggleRandomSen() {
    this.state.isRandomSen = !this.state.isRandomSen;
    this.state._applyRandom();
  }

  toggleRandomAns() {
    this.state.isRandomAns = !this.state.isRandomAns;
    this.state._applyRandom();
  }

  setLimit(value) {
    this.state.setLimit(value);
  }

  resetRandom() {
    this.state.resetRandom();
  }

  setSetting(setting) {
    this.state.setSetting(setting);
  }

  // ============================================================
  // OTHER LOGIC
  // ============================================================

  submit() {
    this.state.isSubmitted = true;
    this.timer.stopTime();
  }

  toggleBookmark(id) {
    if (this.state.bookmarks.has(id)) {
      this.state.bookmarks.delete(id);
    } else {
      this.state.bookmarks.add(id);
    }
  }

  isBookmarked(id) {
    return this.state.bookmarks.has(id);
  }

  toggleOnlyWrong() {
    this.state.onlyWrong = !this.state.onlyWrong;
  }

  search(text) {
    return this.state.quizzes.filter(q =>
      (q.q || "").toLowerCase().includes(text.toLowerCase()),
    );
  }

  reset() {
    this.state.index = 0;
    this.state.results = {};
    this.state.isSubmitted = false;
    this.state.timePassed = 0;
    this.state.time = this.state.timeTotal;
    this.timer.stopTime();
    this.state.quizzes = this.state.quiz.map(q => ({ ...q, a: [...q.a] }));

    if (this.state.isRandomSen || this.state.isRandomAns) {
      this.state._applyRandom();
    }
  }

  // ============================================================
  // TIME & MODE MANAGEMENT
  // ============================================================

  setTimeTotal(seconds) {
    this.timer.setTimeTotal(seconds);
  }

  resetTimePassed() {
    this.timer.resetTimePassed();
  }

  setMode(mode) {
    if (["free", "exam"].includes(mode)) {
      this.state.mode = mode;
    }
  }

  toggleMode() {
    this.state.mode = this.state.mode === "free" ? "exam" : "free";
  }

  setAutoNext(enabled, delay = 0) {
    this.state.autoNext = {
      enabled: Boolean(enabled),
      delay: Math.min(3, Math.max(0, Number(delay) || 0)),
    };
  }

  toggleAutoNext() {
    this.state.autoNext.enabled = !this.state.autoNext.enabled;
  }

  /** Auto-move to next question sau delay (nếu autoNext enabled) */
  autoNextQuestion() {
    if (this.isAutoNextEnabled && this.canNext) {
      setTimeout(() => {
        if (this.isAutoNextEnabled) this.next();
      }, this.autoNextDelay * 1000);
    }
  }
}

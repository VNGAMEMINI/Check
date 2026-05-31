import { makeAutoObservable } from "https://esm.sh/mobx@6";
import { normalizeQuiz, shuffle } from "./utils.js";

/**
 * Quản lý state của quiz
 */
export class QuizState {
  name = "";
  index = 0;
  quiz = []; // bản gốc đã chuẩn hóa, không thay đổi
  quizzes = []; // bản làm việc có thể xáo trộn, lọc, v.v.
  isRandomSen = false;
  isRandomAns = false;
  randomSenOrder = [];
  results = {}; // { [questionIndex]: { correct, wrong, explanation, index, select } }
  isSubmitted = false;
  limit = 0;
  timer = null;
  time = 0; // thời gian còn lại
  timeTotal = 0; // tổng thời gian cho phép
  timePassed = 0; // thời gian đã trôi qua
  onlyWrong = false;
  mode = "free"; // "free" (tự do) hoặc "exam" (kiểm tra)
  autoNext = { enabled: false, delay: 0 }; // { enabled: boolean, delay: seconds (max 3s) }

  _score = 10;
  _scoreFixed = 1;

  bookmarks = new Set();

  constructor(data = [], setting = {}) {
    makeAutoObservable(this, {
      timer: false,
    });
    const normalize = normalizeQuiz(data);
    this.quiz = normalize;
    this.quizzes = normalize.map(q => ({ ...q, a: [...q.a] }));

    this._initSetting(setting);
  }

  _initSetting(setting = {}) {
    const {
      name,
      isRandomSen,
      isRandomAns,
      time,
      timeTotal,
      timePassed,
      limit,
      mode,
      autoNext,
    } = setting;

    if (name != null) {
      this.name = String(name).trim();
    }
    if (isRandomSen != null) {
      this.isRandomSen = Boolean(isRandomSen);
    }
    if (isRandomAns != null) {
      this.isRandomAns = Boolean(isRandomAns);
    }
    if (time != null) {
      this.time = Math.max(0, Number(time) || 0);
    }
    if (timeTotal != null) {
      this.timeTotal = Math.max(0, Number(timeTotal) || 0);
      if (this.timeTotal > 0 && !this.time) {
        this.time = this.timeTotal;
      }
    }
    if (timePassed != null) {
      this.timePassed = Math.max(0, Number(timePassed) || 0);
    }
    if (limit != null) {
      this.limit = Math.max(0, Number(limit) || 0);
    }
    if (mode != null && ["free", "exam"].includes(mode)) {
      this.mode = mode;
    }
    if (autoNext != null) {
      if (typeof autoNext === "object" && autoNext !== null) {
        this.autoNext = {
          enabled: Boolean(autoNext.enabled),
          delay: Math.min(3, Math.max(0, Number(autoNext.delay) || 0)),
        };
      }
    }
  }

  get setting() {
    return {
      name: this.name,
      isRandomSen: this.isRandomSen,
      isRandomAns: this.isRandomAns,
      time: this.time,
      timeTotal: this.timeTotal,
      timePassed: this.timePassed,
      limit: this.limit,
      mode: this.mode,
      autoNext: this.autoNext,
    };
  }

  setSetting(setting) {
    this._initSetting(setting);
  }

  _applyRandomSen(data) {
    if (!this.isRandomSen) {
      this.randomSenOrder = [];
      return data;
    }

    if (!this.randomSenOrder.length) {
      this.randomSenOrder = shuffle(data.map(q => q.id));
    }

    const map = Object.fromEntries(data.map(q => [q.id, q]));
    return this.randomSenOrder
      .map(id => {
        const item = map[id];
        return item ? { ...item, a: [...item.a] } : null;
      })
      .filter(Boolean);
  }

  _applyRandomAns(data) {
    if (!this.isRandomAns) return data;

    return data.map(q => ({
      ...q,
      a: shuffle([...q.a]),
    }));
  }

  _applyRandom() {
    let data = this.quiz.map(q => ({
      ...q,
      a: [...q.a],
    }));

    data = this._applyRandomSen(data);
    data = this._applyRandomAns(data);

    if (this.limit > 0) {
      data = data.slice(0, this.limit);
    }

    this.quizzes = data;
  }

  setLimit(value) {
    this.limit = Math.max(0, Number(value) || 0);
    this._applyRandom();
  }

  resetRandom() {
    this.isRandomSen = false;
    this.isRandomAns = false;
    this.randomSenOrder = [];
    this.quizzes = this.quiz.map(q => ({ ...q, a: [...q.a] }));
  }
}

/**
 * Quản lý các computed properties (getters)
 */
export class QuizComputed {
  constructor(state) {
    this.state = state;
  }

  get canNext() {
    return this.state.index < this.state.quizzes.length - 1;
  }

  get canPrev() {
    return this.state.index > 0;
  }

  get isFinished() {
    return this.answeredCount === this.state.quizzes.length;
  }

  get firstUnanswered() {
    return this.state.quizzes.find(q => !(q.id in this.state.results));
  }

  get averageTime() {
    const arr = Object.values(this.state.results);
    if (!arr.length) return 0;
    return arr.reduce((sum, r) => sum + (r.time || 0), 0) / arr.length;
  }

  /** Trả về thời gian còn lại dưới định dạng HH:MM:SS */
  get uiTime() {
    const s = this.state.time;
    const h = (s / 3600) | 0;
    const m = ((s % 3600) / 60) | 0;
    const sec = s % 60;
    return [h, m, sec].map(v => String(v).padStart(2, "0")).join(":");
  }

  /** Trả về số lượng câu hỏi */
  get lenSen() {
    return this.state.quizzes.length;
  }

  /** Trả về số lượng câu trả lời */
  get lenAns() {
    return this.state.quizzes.reduce((sum, q) => sum + q.a.length, 0);
  }

  /** Trả về dữ liệu bài kiểm tra */
  get data() {
    return {
      quiz: this.state.quizzes.map(q => q.q),
      ans: this.state.quizzes.map(q => q.a),
      img: this.state.quizzes.map(q => q.img || "default"),
      exp: this.state.quizzes.map(q => q.explanation),
      cor: this.state.quizzes.map(q => q.a.findIndex(a => a.correct)),
    };
  }

  /** Trả về câu hỏi hiện tại */
  get currentQuestion() {
    return (
      this.state.quizzes[this.state.index] || {
        q: "",
        a: [],
        explanation: "",
        img: "",
      }
    );
  }

  /** Tính điểm số dựa trên thang điểm 10 */
  get score() {
    if (!this.state.quizzes.length) return "0.0";
    const correct = Object.values(this.state.results).filter(
      r => r.isCorrect,
    ).length;
    return ((correct / this.state.quizzes.length) * this.state._score).toFixed(
      1,
    );
  }

  set score(value) {
    this.state._score = value;
  }

  /** Tính phần trăm tiến độ hoàn thành bài thi */
  get progress() {
    return this.state.quizzes.length
      ? Math.round((this.answeredCount / this.state.quizzes.length) * 100)
      : 0;
  }

  /** Số lượng câu hỏi đã trả lời */
  get answeredCount() {
    return Object.keys(this.state.results).length;
  }

  /** Số lượng câu hỏi trả lời sai */
  get wrongCount() {
    return Object.values(this.state.results).filter(r => !r.isCorrect).length;
  }

  /** Số lượng câu hỏi trả lời đúng */
  get correctCount() {
    return Object.values(this.state.results).filter(r => r.isCorrect).length;
  }

  /** Phần trăm câu đúng trên tổng số câu đã làm */
  get correctPercent() {
    return this.answeredCount
      ? Math.round((this.correctCount / this.answeredCount) * 100)
      : 0;
  }

  /** Phần trăm câu sai trên tổng số câu đã làm */
  get wrongPercent() {
    return this.answeredCount
      ? Math.round((this.wrongCount / this.answeredCount) * 100)
      : 0;
  }

  /** Số lượng câu hỏi trả lời nguội (chưa trả lời, bỏ qua, hoặc undefined) */
  get unansweredCount() {
    return this.state.quizzes.filter(q => !(q.id in this.state.results)).length;
  }

  /** Phần trăm câu trả lời nguội */
  get unansweredPercent() {
    return this.state.quizzes.length
      ? Math.round((this.unansweredCount / this.state.quizzes.length) * 100)
      : 0;
  }

  /** Tên hiển thị - nếu không có tên thì "Bạn" */
  get displayName() {
    return this.state.name || "Bạn";
  }

  /** Thời gian còn lại (tính từ timeTotal) */
  get timeRemaining() {
    return this.state.time;
  }

  /** Thời gian còn lại dưới định dạng HH:MM:SS */
  get timeRemainingUI() {
    return this.uiTime;
  }

  /** Thời gian đã trôi qua dưới định dạng HH:MM:SS */
  get elapsedTimeUI() {
    const s = this.state.timePassed;
    const h = (s / 3600) | 0;
    const m = ((s % 3600) / 60) | 0;
    const sec = s % 60;
    return [h, m, sec].map(v => String(v).padStart(2, "0")).join(":");
  }

  /** Phần trăm thời gian đã trôi qua (nếu có timeTotal) */
  get elapsedPercent() {
    if (!this.state.timeTotal) return 0;
    return Math.round((this.state.timePassed / this.state.timeTotal) * 100);
  }

  /** Kiểm tra nếu autoNext được kích hoạt */
  get isAutoNextEnabled() {
    return this.state.autoNext.enabled;
  }

  /** Độ trễ autoNext (giây) */
  get autoNextDelay() {
    return this.state.autoNext.delay;
  }

  /** Kiểm tra chế độ là "exam" */
  get isExamMode() {
    return this.state.mode === "exam";
  }

  /** Kiểm tra chế độ là "free" */
  get isFreeMod() {
    return this.state.mode === "free";
  }
}

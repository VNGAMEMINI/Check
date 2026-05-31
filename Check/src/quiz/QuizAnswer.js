/**
 * Quản lý xử lý câu trả lời
 */
export class QuizAnswer {
  constructor(state) {
    this.state = state;
    this.lastAnsweredAt = Date.now();
  }

  selectAnswer(ansIndex) {
    const q = this.state.quizzes[this.state.index];
    if (this.state.results[q.id] || this.state.isSubmitted) return;

    const selected = q.a[ansIndex];
    if (!selected) return;

    const correctAns = q.a.find(a => a.correct);
    const isCorrect = selected.correct;

    const now = Date.now();
    const timeSpent = Math.round((now - this.lastAnsweredAt) / 1000);

    this.state.results[q.id] = {
      isCorrect,
      selectedIndex: ansIndex,
      selectedText: selected.text,
      correctText: correctAns?.text || "",
      explanation: q.explanation,
      time: timeSpent,
      answeredAt: Date.now(),
    };
    this.lastAnsweredAt = now;
  }

  resetAnswerTimer() {
    this.lastAnsweredAt = Date.now();
  }

  getResult(id) {
    return this.state.results[id] || null;
  }

  isAnswered(id) {
    return id in this.state.results;
  }

  clearAnswer(id) {
    delete this.state.results[id];
  }

  isCorrect(id) {
    return this.state.results[id]?.isCorrect || false;
  }

  isWrong(id) {
    return id in this.state.results && !this.state.results[id].isCorrect;
  }

  isUnanswered(id) {
    return !(id in this.state.results);
  }
}

/**
 * Quản lý điều hướng giữa các câu hỏi
 */
export class QuizNavigation {
  constructor(state) {
    this.state = state;
  }

  first() {
    this.state.index = 0;
  }

  last() {
    this.state.index = this.state.quizzes.length - 1;
  }

  jumpToUnanswered() {
    const index = this.state.quizzes.findIndex(
      q => !(q.id in this.state.results),
    );

    if (index !== -1) {
      this.state.index = index;
    }
  }

  /** Chuyển sang câu hỏi kế tiếp */
  next() {
    if (this.state.index < this.state.quizzes.length - 1) {
      this.state.index++;
    }
  }

  /** Quay lại câu hỏi trước đó */
  prev() {
    if (this.state.index > 0) {
      this.state.index--;
    }
  }

  /** Nhảy đến một chỉ số câu hỏi cụ thể */
  go(index) {
    if (index >= 0 && index < this.state.quizzes.length) {
      this.state.index = index;
    }
  }
}

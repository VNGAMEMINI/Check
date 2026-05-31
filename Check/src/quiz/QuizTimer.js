/**
 * Quản lý đếm thời gian
 */
export class QuizTimer {
  constructor(state) {
    this.state = state;
  }

  startTime(seconds) {
    this.stopTime();
    this.state.time = Math.max(0, Number(seconds) || 0);
    this.state.timePassed = 0;
    this.state.timer = setInterval(() => this._tick(), 1000);
  }

  stopTime() {
    if (this.state.timer !== null) {
      clearInterval(this.state.timer);
      this.state.timer = null;
    }
  }

  /** Logic chạy sau mỗi giây */
  _tick = () => {
    if (this.state.time > 0) {
      this.state.time--;
      this.state.timePassed++;
    } else {
      this.stopTime();
      this.onTime();
    }
  };

  /** Callback khi hết thời gian */
  onTime = () => {};

  /** Tạm dừng đếm thời gian */
  pauseTime() {
    this.stopTime();
  }

  /** Tiếp tục đếm thời gian */
  resumeTime() {
    if (this.state.time > 0 && this.state.timer === null) {
      this.state.timer = setInterval(() => this._tick(), 1000);
    }
  }

  restartTime(seconds = this.state.time) {
    this.startTime(seconds);
  }

  /** Reset timePassed counter */
  resetTimePassed() {
    this.state.timePassed = 0;
  }

  /** Set timeTotal and sync with time if needed */
  setTimeTotal(seconds) {
    this.state.timeTotal = Math.max(0, Number(seconds) || 0);
    if (this.state.timeTotal > 0 && !this.state.time) {
      this.state.time = this.state.timeTotal;
    }
  }
}

/**
 * Quản lý lưu trữ dữ liệu
 */
export class QuizStorage {
  constructor(state) {
    this.state = state;
  }

  /** Xóa dữ liệu đã lưu trong localStorage */
  clearStorage() {
    localStorage.removeItem(this.state.name);
  }

  /** Lưu trạng thái hiện tại vào localStorage */
  save() {
    localStorage.setItem(
      this.state.name,
      JSON.stringify({
        results: this.state.results,
        index: this.state.index,
        time: this.state.time,
        bookmarks: Array.from(this.state.bookmarks),
        randomSenOrder: this.state.randomSenOrder,
        isRandomSen: this.state.isRandomSen,
        isRandomAns: this.state.isRandomAns,
      }),
    );
  }

  /** Tải lại trạng thái từ localStorage */
  load() {
    const raw = localStorage.getItem(this.state.name);
    if (!raw) return;

    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      console.warn("QuizStorage.load: invalid saved data", error);
      return;
    }

    if (!data || typeof data !== "object") return;

    this.state.results = data.results || {};
    this.state.index = data.index ?? 0;
    this.state.time = data.time ?? 0;
    this.state.bookmarks = new Set(data.bookmarks || []);
    this.state.randomSenOrder = data.randomSenOrder || [];
    this.state.isRandomSen = data.isRandomSen ?? this.state.isRandomSen;
    this.state.isRandomAns = data.isRandomAns ?? this.state.isRandomAns;
    this.state._applyRandom();
  }
}

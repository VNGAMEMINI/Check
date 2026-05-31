# ADQuiz - Hướng Dẫn Sử Dụng

## 📋 Giới Thiệu

ADQuiz là một hệ thống quản lý bài kiểm tra trắc nghiệm được thiết kế với kiến trúc modular. Mỗi module có trách nhiệm riêng biệt, dễ mở rộng và bảo trì.

## 🏗️ Kiến Trúc

```
ADQuiz (Main Class)
├── QuizState      - Quản lý state của bài quiz
├── QuizComputed   - Computed properties (getters)
├── QuizAnswer     - Xử lý câu trả lời
├── QuizTimer      - Đếm thời gian
├── QuizNavigation - Điều hướng câu hỏi
└── QuizStorage    - Lưu trữ dữ liệu
```

---

## 🚀 Cách Sử Dụng Cơ Bản

### Khởi Tạo

```javascript
import { ADQuiz } from "./ADQuiz.js";

// Dữ liệu quiz
const quizData = [
  {
    q: "1 + 1 = ?",
    img: "math1.png",
    explanation: "Đây là phép cộng cơ bản",
    c: 1, // Đáp án đúng (index 1)
    a: ["1", "2", "3", "4"],
  },
  {
    q: "2 + 2 = ?",
    c: 1,
    a: ["3", "4", "5", "6"],
  },
];

// Cài đặt
const settings = {
  name: "math_quiz", // Tên quiz (dùng cho localStorage)
  isRandomSen: false, // Xáo trộn câu hỏi?
  isRandomAns: false, // Xáo trộn đáp án?
  time: 300, // Thời gian (giây)
  limit: 10, // Giới hạn câu hỏi
};

// Tạo instance
const quiz = new ADQuiz(quizData, settings);
```

---

## 📊 QuizState - Quản Lý State

Lưu trữ toàn bộ dữ liệu bài quiz.

### Properties

```javascript
quiz.name; // Tên quiz
quiz.index; // Câu hỏi hiện tại (0-based)
quiz.quiz; // Dữ liệu gốc (readonly)
quiz.quizzes; // Dữ liệu làm việc (có thể xáo trộn)
quiz.isRandomSen; // Bật xáo trộn câu hỏi?
quiz.isRandomAns; // Bật xáo trộn đáp án?
quiz.results; // Kết quả { [questionId]: result }
quiz.isSubmitted; // Đã nộp bài?
quiz.limit; // Giới hạn câu hỏi
quiz.time; // Thời gian còn lại (giây)
quiz.bookmarks; // Set các câu đã đánh dấu
```

### Methods

```javascript
// Cập nhật cài đặt
quiz.setSetting({
  isRandomSen: true,
  isRandomAns: true,
  limit: 5,
});

// Đặt giới hạn câu hỏi
quiz.setLimit(10);

// Reset cài đặt random
quiz.resetRandom();
```

---

## 🧮 QuizComputed - Computed Properties

Cung cấp các giá trị tính toán từ state.

### Getters

```javascript
// Điều hướng
quiz.canNext; // boolean - Còn câu hỏi tiếp theo?
quiz.canPrev; // boolean - Có câu hỏi trước?
quiz.isFinished; // boolean - Hoàn thành bài?

// Thông tin câu hỏi
quiz.currentQuestion; // object - Câu hỏi hiện tại
quiz.firstUnanswered; // object - Câu chưa trả lời đầu tiên
quiz.lenSen; // number - Tổng câu hỏi
quiz.lenAns; // number - Tổng câu trả lời

// Điểm số & tiến độ
quiz.score; // string - Điểm (0.0-10.0)
quiz.progress; // number - % hoàn thành (0-100)
quiz.answeredCount; // number - Câu đã trả lời
quiz.correctCount; // number - Câu đúng
quiz.wrongCount; // number - Câu sai
quiz.correctPercent; // number - % câu đúng
quiz.wrongPercent; // number - % câu sai

// Dữ liệu
quiz.data; // object - Dữ liệu bài quiz
quiz.uiTime; // string - Thời gian (HH:MM:SS)
quiz.averageTime; // number - Thời gian trung bình

// Setter
quiz.score = 20; // Đổi thang điểm (mặc định 10)
```

### Ví Dụ

```javascript
console.log(quiz.score); // "8.5"
console.log(quiz.progress); // 75
console.log(quiz.uiTime); // "00:05:30"
console.log(quiz.canNext); // true/false
console.log(quiz.currentQuestion); // { q: "...", a: [...], ... }
```

---

## ✅ QuizAnswer - Xử Lý Câu Trả Lời

Quản lý việc chọn và kiểm tra câu trả lời.

### Methods

```javascript
// Chọn đáp án (index: 0-3)
quiz.selectAnswer(1); // Chọn đáp án thứ 2

// Kiểm tra trạng thái
quiz.isAnswered(questionId); // Câu này đã trả lời?
quiz.isUnanswered(questionId); // Câu này chưa trả lời?
quiz.isCorrect(questionId); // Trả lời đúng?
quiz.isWrong(questionId); // Trả lời sai?

// Lấy kết quả
quiz.getResult(questionId); // { isCorrect, selectedText, correctText, ... }

// Xóa câu trả lời
quiz.clearAnswer(questionId); // Hủy trả lời (cho phép trả lời lại)
```

### Result Object

```javascript
{
  isCorrect: true,           // Đúng hay sai?
  selectedIndex: 1,          // Index đáp án được chọn
  selectedText: "2",         // Nội dung đáp án
  correctText: "2",          // Nội dung đáp án đúng
  explanation: "...",        // Giải thích
  answeredAt: 1234567890     // Thời gian trả lời (timestamp)
}
```

### Ví Dụ

```javascript
// Chọn câu trả lời
quiz.selectAnswer(2);

// Kiểm tra
if (quiz.isCorrect(0)) {
  console.log("✓ Câu 1 đúng");
} else {
  console.log("✗ Câu 1 sai");
  console.log("Giải thích:", quiz.getResult(0).explanation);
}

// Cho phép chọn lại
quiz.clearAnswer(0);
quiz.selectAnswer(1);
```

---

## ⏱️ QuizTimer - Đếm Thời Gian

Quản lý bộ đếm thời gian.

### Methods

```javascript
// Bắt đầu đếm
quiz.startTime(300); // Bắt đầu với 300 giây

// Dừng/Tạm dừng
quiz.stopTime(); // Dừng hoàn toàn
quiz.pauseTime(); // Tạm dừng
quiz.resumeTime(); // Tiếp tục

// Khởi động lại
quiz.restartTime(); // Khởi động lại với thời gian cũ
quiz.restartTime(600); // Khởi động lại với 600 giây
```

### Callback

```javascript
// Khi hết thời gian (Sử dụng setOnTime để hook)
quiz.setOnTime(() => {
  console.log("Hết thời gian!");
  quiz.submit();
});

// Bắt đầu đếm
quiz.startTime(60);
```

### Ví Dụ

```javascript
// Hiển thị thời gian
console.log(quiz.uiTime); // "00:01:00"

// Tạm dừng khi người dùng rời khỏi trang
quiz.pauseTime();

// Tiếp tục khi quay lại
quiz.resumeTime();

// Cài đặt hành động khi hết thời gian
quiz.setOnTime(() => {
  alert("Hết thời gian!");
});
```

---

## 🧭 QuizNavigation - Điều Hướng

Quản lý việc di chuyển giữa các câu hỏi.

### Methods

```javascript
// Chuyển động
quiz.next(); // Câu tiếp theo
quiz.prev(); // Câu trước đó
quiz.go(index); // Nhảy đến câu (0-based)
quiz.first(); // Đến câu đầu tiên
quiz.last(); // Đến câu cuối cùng

// Điều hướng thông minh
quiz.jumpToUnanswered(); // Nhảy đến câu chưa trả lời đầu tiên
```

### Ví Dụ

```javascript
// Các nút điều hướng
if (quiz.canNext) quiz.next();
if (quiz.canPrev) quiz.prev();

// Nhảy về câu đầu
quiz.first();

// Nhảy đến câu chưa trả lời
quiz.jumpToUnanswered();

// Nhảy đến câu cụ thể (trong danh sách câu hỏi)
quiz.go(3); // Câu 4 (index 3)
```

---

## 💾 QuizStorage - Lưu Trữ

Quản lý lưu/tải dữ liệu từ localStorage.

### Methods

```javascript
// Lưu trạng thái hiện tại
quiz.save(); // Lưu: { results, index, time }

// Tải trạng thái trước đó
quiz.load(); // Lấy dữ liệu từ localStorage

// Xóa dữ liệu
quiz.clearStorage(); // Xóa toàn bộ dữ liệu lưu
```

### Dữ Liệu Lưu Trữ

```javascript
{
  results: { /* kết quả câu trả lời */ },
  index: 5,           // Câu hiện tại
  time: 180           // Thời gian còn lại
}
```

### Ví Dụ

```javascript
// Khi người dùng rời khỏi trang
window.addEventListener("beforeunload", () => {
  quiz.save();
});

// Khi quay trở lại
window.addEventListener("load", () => {
  quiz.load();
});

// Xóa khi kết thúc
quiz.clearStorage();
```

---

## 🎛️ Các Tính Năng Khác

### Random & Shuffle

```javascript
// Bật/tắt xáo trộn
quiz.toggleRandomSen(); // Xáo trộn câu hỏi
quiz.toggleRandomAns(); // Xáo trộn đáp án

// Reset về bản gốc
quiz.resetRandom();
```

### Bookmarks (Đánh Dấu)

```javascript
// Đánh dấu câu hỏi
quiz.toggleBookmark(questionId);

// Kiểm tra
quiz.isBookmarked(questionId); // true/false
```

### Tìm Kiếm

```javascript
// Tìm câu hỏi theo nội dung
const results = quiz.search("1 + 1");
```

### Submit & Reset

```javascript
// Nộp bài (dừng timer, ngăn chỉnh sửa)
quiz.submit();

// Bắt đầu lại
quiz.reset(); // Xóa kết quả, reset index, xóa time
```

---

## 📝 Ví Dụ Hoàn Chỉnh

```javascript
import { ADQuiz } from "./ADQuiz.js";

// 1. Dữ liệu
const quizData = [
  {
    q: "HTML là gì?",
    c: 0,
    a: ["Ngôn ngữ markup", "Ngôn ngữ lập trình", "Database"],
  },
  {
    q: "CSS là gì?",
    c: 2,
    a: ["Markup", "Lập trình", "Stylesheet"],
  },
];

// 2. Tạo quiz
const quiz = new ADQuiz(quizData, {
  name: "web_basics",
  isRandomAns: true,
  time: 600,
});

// 3. Bắt đầu
quiz.startTime(quiz.time);

// 4. Người dùng trả lời
quiz.selectAnswer(0); // Câu 1, đáp án 1
console.log(quiz.score); // "5.0"

// 5. Di chuyển
if (quiz.canNext) quiz.next();

// 6. Trả lời câu 2
quiz.selectAnswer(2);
console.log(quiz.score); // "10.0"

// 7. Kết thúc
quiz.submit();
console.log(quiz.uiTime); // Thời gian dừng

// 8. Lưu kết quả
quiz.save();

// 9. Tái tạo (lần sau)
const newQuiz = new ADQuiz(quizData, { name: "web_basics" });
newQuiz.load(); // Lấy dữ liệu lưu
console.log(newQuiz.score); // Kết quả cũ
```

---

## 🔧 MobX Integration

Toàn bộ state được quản lý bằng MobX (`makeAutoObservable`), cho phép:

- **Reactive updates**: UI tự động cập nhật khi state thay đổi
- **Fine-grained tracking**: Chỉ component cần cập nhật được re-render
- **Optimized performance**: Không cần manual memoization

```javascript
import { observer } from "mobx-react-lite";

const QuizComponent = observer(({ quiz }) => {
  return (
    <div>
      <h1>{quiz.currentQuestion.q}</h1>
      <p>Tiến độ: {quiz.progress}%</p>
      <p>Thời gian: {quiz.uiTime}</p>
    </div>
  );
});
```

---

## 📚 File Modules

| File                | Mục đích                              |
| ------------------- | ------------------------------------- |
| `utils.js`          | Hàm tiện ích (normalizeQuiz, shuffle) |
| `QuizState.js`      | State properties                      |
| `QuizComputed.js`   | Computed getters                      |
| `QuizAnswer.js`     | Xử lý câu trả lời                     |
| `QuizTimer.js`      | Đếm thời gian                         |
| `QuizNavigation.js` | Điều hướng                            |
| `QuizStorage.js`    | Lưu trữ                               |
| `ADQuiz.js`         | Class chính (facade)                  |
| `QuizStore.js`      | Export (backward compatible)          |

---

## ✨ Best Practices

1. **Khởi tạo 1 lần**: Tạo 1 instance ADQuiz cho mỗi bài quiz
2. **Lưu thường xuyên**: Gọi `quiz.save()` định kỳ
3. **Xử lý hết thời gian**: Set callback cho `quiz.timer.onTime`
4. **Validate trước submit**: Kiểm tra `quiz.isFinished` trước khi nộp
5. **Cleanup**: Gọi `quiz.stopTime()` trước khi destroy component

---

## 🐛 Troubleshooting

**Q: Thay đổi state nhưng UI không update?**

- A: Đảm bảo component được wrap với `observer` (MobX)

**Q: Timer không dừng?**

- A: Gọi `quiz.stopTime()` hoặc `quiz.submit()`

**Q: Không tìm thấy dữ liệu đã lưu?**

- A: Kiểm tra `quiz.name` có trùng với lần lưu trước không

**Q: localStorage không khả dụng?**

- A: Thêm try-catch quanh `quiz.save()` và `quiz.load()`

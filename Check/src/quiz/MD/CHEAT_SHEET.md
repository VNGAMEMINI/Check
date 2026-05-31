# Quiz System - API Cheat Sheet

## 🎯 Khởi Tạo

```javascript
import { ADQuiz } from "./ADQuiz.js";

const quiz = new ADQuiz(quizData, {
  name: "quiz_name",
  isRandomSen: false,
  isRandomAns: false,
  time: 300,
  limit: 0,
});
```

---

## 📊 STATE PROPERTIES

```javascript
// Cơ bản
quiz.index; // number - Câu hiện tại (0-based)
quiz.name; // string - Tên quiz
quiz.time; // number - Thời gian còn lại (giây)
quiz.isSubmitted; // boolean - Đã nộp?

// Dữ liệu
quiz.quiz; // array - Dữ liệu gốc (readonly)
quiz.quizzes; // array - Dữ liệu làm việc

// Cài đặt
quiz.isRandomSen; // boolean - Xáo trộn câu?
quiz.isRandomAns; // boolean - Xáo trộn đáp án?
quiz.limit; // number - Giới hạn câu

// Kết quả
quiz.results; // object - { [id]: result }
quiz.bookmarks; // Set - Câu đánh dấu
```

---

## 🧮 COMPUTED GETTERS

```javascript
// Câu hỏi
quiz.currentQuestion; // object - Câu hiện tại
quiz.firstUnanswered; // object - Câu chưa trả lời đầu tiên
quiz.lenSen; // number - Tổng câu hỏi
quiz.lenAns; // number - Tổng đáp án

// Điều hướng
quiz.canNext; // boolean - Có câu tiếp theo?
quiz.canPrev; // boolean - Có câu trước?
quiz.isFinished; // boolean - Hoàn thành?

// Điểm & Tiến độ
quiz.score; // string - Điểm (0.0-10.0)
quiz.progress; // number - % hoàn thành (0-100)
quiz.answeredCount; // number - Câu đã trả lời
quiz.correctCount; // number - Câu đúng
quiz.wrongCount; // number - Câu sai
quiz.correctPercent; // number - % câu đúng
quiz.wrongPercent; // number - % câu sai

// Khác
quiz.uiTime; // string - Thời gian (HH:MM:SS)
quiz.averageTime; // number - Thời gian trung bình
quiz.data; // object - Dữ liệu bài quiz
```

---

## ✅ ANSWER METHODS

```javascript
// Chọn đáp án
quiz.selectAnswer(index); // Chọn đáp án

// Kiểm tra trạng thái
quiz.isAnswered(id); // Câu này đã trả lời?
quiz.isUnanswered(id); // Câu này chưa trả lời?
quiz.isCorrect(id); // Trả lời đúng?
quiz.isWrong(id); // Trả lời sai?

// Quản lý kết quả
quiz.getResult(id); // Lấy kết quả
quiz.clearAnswer(id); // Xóa (cho phép trả lời lại)
quiz.answer.resetAnswerTimer(); // Reset mốc tính thời gian câu hỏi
```

---

## ⏱️ TIMER METHODS

```javascript
// Điều khiển
quiz.startTime(seconds); // Bắt đầu
quiz.stopTime(); // Dừng
quiz.pauseTime(); // Tạm dừng
quiz.resumeTime(); // Tiếp tục
quiz.restartTime(seconds); // Khởi động lại

// Callback
quiz.timer.onTime = () => {}; // Khi hết thời gian
```

---

## 🧭 NAVIGATION METHODS

```javascript
// Di chuyển
quiz.next(); // Câu tiếp theo
quiz.prev(); // Câu trước
quiz.go(index); // Nhảy tới

// Điểm neo
quiz.first(); // Câu đầu
quiz.last(); // Câu cuối
quiz.jumpToUnanswered(); // Câu chưa trả lời đầu tiên
```

---

## 💾 STORAGE METHODS

```javascript
quiz.save(); // Lưu state
quiz.load(); // Tải state
quiz.clearStorage(); // Xóa dữ liệu lưu
```

---

## 🎛️ SETTINGS & CONTROL

```javascript
// Random
quiz.toggleRandomSen(); // Bật/tắt xáo trộn câu
quiz.toggleRandomAns(); // Bật/tắt xáo trộn đáp án
quiz.resetRandom(); // Reset về bản gốc
quiz.setLimit(value); // Đặt giới hạn câu
quiz.setSetting(obj); // Cập nhật cài đặt

// Bookmarks
quiz.toggleBookmark(id); // Đánh dấu câu
quiz.isBookmarked(id); // Kiểm tra đánh dấu

// Tìm kiếm
quiz.search(text); // Tìm kiếm câu

// Hoàn thành/Reset
quiz.submit(); // Nộp bài
quiz.reset(); // Khởi động lại
```

---

## 📌 QUICK EXAMPLES

### Ví Dụ 1: Bài Quiz Cơ Bản

```javascript
const quiz = new ADQuiz(data, { name: "quiz1", time: 600 });

// Callback hết giờ
quiz.timer.onTime = () => quiz.submit();

// Bắt đầu
quiz.startTime(quiz.time);

// Câu hỏi hiện tại
const q = quiz.currentQuestion;

// Chọn đáp án
quiz.selectAnswer(1);

// Tiếp tục
quiz.next();

// Nộp bài
quiz.submit();
console.log(quiz.score);
```

### Ví Dụ 2: Lưu Tự Động

```javascript
const quiz = new ADQuiz(data, { name: "quiz2" });

// Lưu mỗi 10 giây
const interval = setInterval(() => quiz.save(), 10000);

// Dừng khi nộp
quiz.timer.onTime = () => {
  clearInterval(interval);
  quiz.submit();
  quiz.save();
};
```

### Ví Dụ 3: React Component

```javascript
import { observer } from "mobx-react-lite";

const Quiz = observer(() => {
  const [quiz] = useState(() => new ADQuiz(data));

  const question = quiz.currentQuestion;

  return (
    <div>
      <h2>{question.q}</h2>
      <p>
        Điểm: {quiz.score} | Tiến độ: {quiz.progress}%
      </p>
      <button onClick={() => quiz.selectAnswer(0)}>A</button>
      <button onClick={() => quiz.next()} disabled={!quiz.canNext}>
        Tiếp
      </button>
    </div>
  );
});
```

### Ví Dụ 4: Xáo Trộn & Lọc

```javascript
const quiz = new ADQuiz(data);

// Xáo trộn câu hỏi
quiz.toggleRandomSen();

// Xáo trộn đáp án
quiz.toggleRandomAns();

// Giới hạn 10 câu đầu tiên
quiz.setLimit(10);

// Reset về bản gốc
quiz.resetRandom();
```

---

## 🔍 RESULT OBJECT

```javascript
quiz.getResult(questionId);
// {
//   isCorrect: true,
//   selectedIndex: 1,
//   selectedText: "2",
//   correctText: "2",
//   explanation: "...",
//   answeredAt: 1234567890
// }
```

---

## 📊 DATA OBJECT

```javascript
quiz.data;
// {
//   quiz: [...],          // Nội dung câu
//   ans: [...],           // Đáp án
//   img: [...],           // Ảnh
//   exp: [...],           // Giải thích
//   cor: [...]            // Đáp án đúng (index)
// }
```

---

## ⚙️ CONFIGURATION EXAMPLE

```javascript
const quiz = new ADQuiz(quizData, {
  name: "final_exam", // Tên (bắt buộc)
  isRandomSen: true, // Xáo trộn câu
  isRandomAns: true, // Xáo trộn đáp án
  time: 3600, // 1 giờ
  limit: 50, // 50 câu
});
```

---

## 🛡️ ERROR HANDLING

```javascript
try {
  quiz.load();
} catch (e) {
  console.error("Load failed:", e);
}

try {
  quiz.save();
} catch (e) {
  console.error("Save failed:", e);
}
```

---

## 🎯 COMMON PATTERNS

### Tự Động Lưu

```javascript
useEffect(() => {
  const interval = setInterval(() => quiz.save(), 10000);
  return () => clearInterval(interval);
}, []);
```

### Xử Lý Rời Khỏi Trang

```javascript
useEffect(() => {
  const handler = () => quiz.save();
  window.addEventListener("beforeunload", handler);
  return () => window.removeEventListener("beforeunload", handler);
}, []);
```

### Validate Trước Submit

```javascript
if (quiz.isFinished) {
  quiz.submit();
} else {
  const first = quiz.firstUnanswered;
  quiz.go(first.id);
}
```

### Hiển Thị Kết Quả

```javascript
Object.entries(quiz.results).forEach(([id, result]) => {
  const status = result.isCorrect ? "✓" : "✗";
  console.log(`${status} Câu ${id}: ${result.selectedText}`);
});
```

---

## 📚 REFERENCES

- [QUIZ_GUIDE.md](QUIZ_GUIDE.md) - Hướng dẫn đầy đủ
- [README_ADQuiz.md](README_ADQuiz.md) - Class chính
- [INDEX.md](INDEX.md) - Danh sách tài liệu

---

**Cập nhật:** 2024  
**Phiên bản:** 1.0

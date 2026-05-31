# QuizStorage.js

## 📝 Mô Tả

Module quản lý lưu/tải dữ liệu bài quiz vào localStorage. Cho phép người dùng tiếp tục bài quiz nửa chừng.

## 🔧 Khởi Tạo

```javascript
import { QuizStorage } from "./QuizStorage.js";

const storage = new QuizStorage(state);

// Hoặc qua ADQuiz
const quiz = new ADQuiz(data);
quiz.save();
```

## 💾 Methods

### Lưu & Tải

```javascript
storage.save(); // Lưu trạng thái hiện tại
storage.load(); // Tải trạng thái đã lưu
storage.clearStorage(); // Xóa dữ liệu lưu
```

## 📊 Dữ Liệu Lưu Trữ

Dữ liệu lưu dưới key = `state.name`:

```javascript
{
  results: { /* kết quả trả lời */ },
  index: 5,           // Câu hiện tại
  time: 180           // Thời gian còn lại (giây)
}
```

**Không lưu:**

- `quiz` (dữ liệu gốc)
- `quizzes` (có thể xáo trộn, nên tái tạo)
- `isRandomSen`, `isRandomAns` (nên lưu riêng nếu cần)

## 📌 Ví Dụ

### Lưu & Tải Cơ Bản

```javascript
import { ADQuiz } from "./ADQuiz.js";

// Tạo quiz
const quiz = new ADQuiz(data, { name: "math_test" });

// Người dùng làm bài
quiz.selectAnswer(1);
quiz.next();
quiz.selectAnswer(0);

// Lưu khi người dùng rời khỏi
window.addEventListener("beforeunload", () => {
  quiz.save();
});

// ========== Lần sau ==========

// Tạo quiz mới (cùng dữ liệu)
const newQuiz = new ADQuiz(data, { name: "math_test" });

// Tải dữ liệu trước đó
newQuiz.load();

// Trạng thái khôi phục
console.log(newQuiz.index); // 1
console.log(newQuiz.answeredCount); // 2
```

### Tự Động Lưu Định Kỳ

```javascript
const quiz = new ADQuiz(data, { name: "quiz1" });

// Lưu mỗi 10 giây
const autoSaveInterval = setInterval(() => {
  quiz.save();
  console.log("Quiz đã lưu");
}, 10000);

// Dừng lưu khi nộp bài
quiz.timer.onTime = () => {
  clearInterval(autoSaveInterval);
  quiz.submit();
  quiz.save();
};
```

### Kiểm Tra Dữ Liệu Lưu

```javascript
import { ADQuiz } from "./ADQuiz.js";

const quiz = new ADQuiz(data, { name: "quiz_demo" });

// Trả lời 3 câu
quiz.selectAnswer(0);
quiz.next();
quiz.selectAnswer(1);
quiz.next();
quiz.selectAnswer(2);

// Lưu
quiz.save();

// Xem dữ liệu trong localStorage
const saved = JSON.parse(localStorage.getItem("quiz_demo"));
console.log(saved);
// Output:
// {
//   results: {
//     0: { isCorrect: true, selectedIndex: 0, ... },
//     1: { isCorrect: false, selectedIndex: 1, ... },
//     2: { isCorrect: true, selectedIndex: 2, ... }
//   },
//   index: 2,
//   time: 250
// }
```

### Xử Lý Rời Khỏi Trang

```javascript
const quiz = new ADQuiz(data, { name: "active_quiz" });

quiz.startTime(quiz.time);

// Lưu khi rời khỏi trang
window.addEventListener("beforeunload", e => {
  quiz.save();
  // Chrome yêu cầu returnValue để hiển thị thông báo
  e.returnValue = "Dữ liệu sẽ được lưu...";
});

// Lưu khi tab bị đóng
document.addEventListener("visibilitychange", () => {
  if (document.hidden && !quiz.isSubmitted) {
    quiz.save();
  }
});
```

### Xóa Dữ Liệu Sau Nộp Bài

```javascript
const quiz = new ADQuiz(data, { name: "exam_2024" });

// ... làm bài ...

// Nộp bài
quiz.submit();

// Gửi kết quả lên server
const result = await submitToServer(quiz.results);

// Xóa dữ liệu lưu nếu thành công
if (result.success) {
  quiz.clearStorage();
  console.log("Dữ liệu đã xóa");
}
```

### Migration: Chuyển Dữ Liệu

```javascript
// Lấy dữ liệu từ quiz cũ
const oldQuiz = new ADQuiz(oldData, { name: "old_quiz" });
oldQuiz.load();

// Tạo quiz mới
const newQuiz = new ADQuiz(newData, { name: "new_quiz" });

// Sao chép kết quả (nếu cấu trúc tương thích)
newQuiz.state.results = oldQuiz.state.results;
newQuiz.state.index = oldQuiz.state.index;
newQuiz.state.time = oldQuiz.state.time;

// Lưu với key mới
newQuiz.save();

// Xóa cũ (tùy chọn)
oldQuiz.clearStorage();
```

## 🛡️ Error Handling

```javascript
const quiz = new ADQuiz(data, { name: "my_quiz" });

try {
  quiz.load();
} catch (error) {
  console.error("Lỗi tải dữ liệu:", error);
  // Tạo mới nếu không tải được
}

try {
  quiz.save();
} catch (error) {
  console.error("Lỗi lưu dữ liệu:", error);
  // Có thể do localStorage đầy
}
```

## 🔍 Debugging

```javascript
const quiz = new ADQuiz(data, { name: "debug_quiz" });

// Xem dữ liệu lưu
const saved = localStorage.getItem("debug_quiz");
console.log("Saved:", JSON.parse(saved));

// Xem dữ liệu hiện tại
console.log("Current index:", quiz.index);
console.log("Current time:", quiz.time);
console.log("Results:", quiz.results);

// So sánh
const savedData = JSON.parse(saved);
console.log(
  "Match?",
  savedData.index === quiz.index && savedData.time === quiz.time,
);
```

## ⚠️ Lưu Ý

- **Key name**: Dữ liệu lưu với key = `state.name`
- **localStorage limit**: Thường ~5MB, kiểm tra quota nếu cần
- **Bảo mật**: localStorage không bảo mật, không lưu sensitive data
- **Xóa browser**: Xóa browser cache sẽ xóa localStorage
- **Load()** không xóa `results` cũ, nên gọi `reset()` trước nếu cần

## 🐛 Troubleshooting

**Không tìm thấy dữ liệu?**

- Kiểm tra `quiz.name` có đúng không
- Kiểm tra browser dev tools → Application → localStorage
- Kiểm tra localStorage bị xóa chưa

**localStorage đầy?**

- Kiểm tra quota: `navigator.storage.estimate()`
- Xóa dữ liệu cũ không cần
- Nén dữ liệu nếu có nhiều kết quả

**Dữ liệu corrupt?**

- Xóa manual: `localStorage.removeItem("quiz_name")`
- Hoặc: `quiz.clearStorage()` → tạo mới

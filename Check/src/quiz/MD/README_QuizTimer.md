# QuizTimer.js

## 📝 Mô Tả

Module quản lý bộ đếm thời gian. Hỗ trợ bắt đầu, dừng, tạm dừng, và tiếp tục.

## 🔧 Khởi Tạo

```javascript
import { QuizTimer } from "./QuizTimer.js";

const timer = new QuizTimer(state);

// Hoặc qua ADQuiz
const quiz = new ADQuiz(data);
quiz.startTime(300);
```

## ⏱️ Methods

### Điều Khiển

```javascript
timer.startTime(seconds); // Bắt đầu đếm (giây)
timer.stopTime(); // Dừng hoàn toàn
timer.pauseTime(); // Tạm dừng (giữ thời gian)
timer.resumeTime(); // Tiếp tục từ nơi dừng
timer.restartTime(); // Khởi động lại với thời gian cũ
timer.restartTime(600); // Khởi động lại với thời gian mới
```

### Callbacks

```javascript
timer.onTime = () => {
  console.log("Hết thời gian!");
  // Gọi khi thời gian = 0
};
```

## 📊 Hiển Thị

```javascript
// State tự động cập nhật
state.time; // Thời gian còn lại (giây, integer)

// Computed format
state.uiTime; // Định dạng "HH:MM:SS"
```

## 📌 Ví Dụ

### Bắt Đầu & Dừng

```javascript
import { ADQuiz } from "./ADQuiz.js";

const quiz = new ADQuiz(data, { time: 300 });

// Đăng ký hành động khi hết thời gian
quiz.setOnTime(() => {
  alert("Hết thời gian!");
  quiz.submit();
});

// Bắt đầu
quiz.startTime(quiz.time);

// Sau 10 giây, tạm dừng
setTimeout(() => {
  quiz.pauseTime();
  console.log(quiz.uiTime); // "00:04:50"
}, 10000);

// Sau 5 giây, tiếp tục
setTimeout(() => {
  quiz.resumeTime();
}, 15000);

// Dừng hoàn toàn
quiz.stopTime();
```

### Hiển Thị Countdown

```javascript
import { observer } from "mobx-react-lite";

const Timer = observer(({ quiz }) => {
  const timeLeft = quiz.time;
  const isWarning = timeLeft < 60;

  return (
    <div className={isWarning ? "warning" : ""}>
      Thời gian còn: <strong>{quiz.uiTime}</strong>
    </div>
  );
});
```

### Xử Lý Rời Khỏi Trang

```javascript
// Tạm dừng khi rời khỏi
window.addEventListener("blur", () => {
  if (!quiz.isSubmitted) {
    quiz.pauseTime();
  }
});

// Tiếp tục khi quay lại
window.addEventListener("focus", () => {
  if (!quiz.isSubmitted && quiz.time > 0) {
    quiz.resumeTime();
  }
});

// Lưu khi rời khỏi trang
window.addEventListener("beforeunload", () => {
  quiz.save();
});
```

### Hết Thời Gian Tự Động Nộp

```javascript
const quiz = new ADQuiz(data, { time: 600 });

quiz.setOnTime(() => {
  console.log("Thời gian kết thúc!");
  quiz.submit();
  // Gửi kết quả lên server
  submitQuizResults(quiz.results);
});

quiz.startTime(quiz.time);
```

## ⚠️ Lưu Ý

- Timer sử dụng `setInterval(1000)`, tính toán chính xác đến 1 giây
- `pauseTime()` dừng interval nhưng giữ giá trị `state.time`
- `resumeTime()` khởi động interval mới
- Gọi `stopTime()` trước khi destroy component để tránh memory leak
- `state.time` giảm **1** mỗi giây, không dùng Date.now()

## 🐛 Troubleshooting

**Timer không giảm?**

- Kiểm tra `startTime()` đã được gọi
- Kiểm tra `pauseTime()` có được gọi trước đó

**onTime callback không gọi?**

- Đảm bảo `timer.onTime =` được set trước `startTime()`

**Thời gian không lưu?**

- Gọi `quiz.save()` để lưu `state.time`
- Gọi `quiz.load()` để khôi phục

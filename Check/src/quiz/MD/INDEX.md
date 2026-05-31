# Quiz System - Tài Liệu & Hướng Dẫn

## 📚 Danh Sách Tài Liệu

### 🌟 Bắt Đầu Nhanh

1. **[QUIZ_GUIDE.md](QUIZ_GUIDE.md)** - Hướng dẫn toàn diện
   - Giới thiệu & kiến trúc
   - Cách sử dụng cơ bản
   - Ví dụ hoàn chỉnh
   - Best practices & troubleshooting

### 📖 Tài Liệu Chi Tiết Từng Module

| Module             | File                                                 | Mục Đích             |
| ------------------ | ---------------------------------------------------- | -------------------- |
| **ADQuiz**         | [README_ADQuiz.md](README_ADQuiz.md)                 | Class chính (Facade) |
| **QuizState**      | [README_QuizState.md](README_QuizState.md)           | Quản lý state        |
| **QuizComputed**   | [README_QuizComputed.md](README_QuizComputed.md)     | Computed properties  |
| **QuizAnswer**     | [README_QuizAnswer.md](README_QuizAnswer.md)         | Xử lý câu trả lời    |
| **QuizTimer**      | [README_QuizTimer.md](README_QuizTimer.md)           | Đếm thời gian        |
| **QuizNavigation** | [README_QuizNavigation.md](README_QuizNavigation.md) | Điều hướng câu       |
| **QuizStorage**    | [README_QuizStorage.md](README_QuizStorage.md)       | Lưu trữ dữ liệu      |

---

## 🚀 Bắt Đầu Nhanh

### 1️⃣ Cài Đặt

```javascript
import { ADQuiz } from "./ADQuiz.js";

const quiz = new ADQuiz(quizData, {
  name: "my_quiz",
  time: 300,
});
```

### 2️⃣ Callback Hết Thời Gian

```javascript
quiz.setOnTime(() => {
  quiz.submit();
});
```

### 3️⃣ Bắt Đầu

```javascript
quiz.startTime(quiz.time);
```

### 4️⃣ Xử Lý Chọn Đáp Án

```javascript
quiz.selectAnswer(1); // Đáp án index 1
```

### 5️⃣ Di Chuyển

```javascript
quiz.next(); // Câu tiếp theo
quiz.prev(); // Câu trước
```

### 6️⃣ Kết Thúc

```javascript
quiz.submit();
console.log(quiz.score); // Điểm
console.log(quiz.results); // Kết quả
```

---

## 📊 API Quick Reference

### Properties

| Property      | Type    | Mô Tả                  |
| ------------- | ------- | ---------------------- |
| `index`       | number  | Câu hiện tại (0-based) |
| `score`       | string  | Điểm (0.0-10.0)        |
| `progress`    | number  | % hoàn thành           |
| `uiTime`      | string  | Thời gian (HH:MM:SS)   |
| `results`     | object  | Kết quả trả lời        |
| `isSubmitted` | boolean | Đã nộp?                |

### Methods

| Method                        | Mô Tả                    |
| ----------------------------- | ------------------------ |
| `selectAnswer(idx)`           | Chọn đáp án              |
| `next()` / `prev()`           | Di chuyển                |
| `go(idx)`                     | Nhảy tới                 |
| `startTime(s)` / `stopTime()` | Điều khiển timer         |
| `save()` / `load()`           | Lưu/tải                  |
| `submit()` / `reset()`        | Hoàn thành/khởi động lại |

---

## 🎯 Common Use Cases

### ✅ Hiển Thị Câu Hỏi

```javascript
const q = quiz.currentQuestion;
console.log(q.q); // Nội dung câu
console.log(q.a); // Danh sách đáp án
```

### ✅ Kiểm Tra Câu Trả Lời

```javascript
if (quiz.isCorrect(id)) console.log("✓ Đúng");
if (quiz.isWrong(id)) console.log("✗ Sai");
```

### ✅ Lưu Tự Động

```javascript
setInterval(() => quiz.save(), 10000);
```

### ✅ Xáo Trộn

```javascript
quiz.toggleRandomSen(); // Xáo trộn câu
quiz.toggleRandomAns(); // Xáo trộn đáp án
```

### ✅ Nhảy Về Câu Chưa Trả Lời

```javascript
quiz.jumpToUnanswered();
```

---

## 🏗️ Kiến Trúc

```
ADQuiz
├── QuizState        - State (properties)
├── QuizComputed     - Getters (computed values)
├── QuizAnswer       - Answer handling
├── QuizTimer        - Timer management
├── QuizNavigation   - Navigation
└── QuizStorage      - Storage (localStorage)
```

**Mỗi module có trách nhiệm riêng** → Dễ test, maintain, extend.

---

## 📱 React Integration

```javascript
import { observer } from "mobx-react-lite";

const Quiz = observer(({ quiz }) => {
  return (
    <div>
      <h2>{quiz.currentQuestion.q}</h2>
      <p>{quiz.progress}% hoàn thành</p>
    </div>
  );
});
```

---

## 🛡️ Best Practices

### 1. Khởi Tạo 1 Lần

```javascript
// ✅ Đúng
const [quiz] = useState(() => new ADQuiz(data));

// ❌ Sai
const quiz = new ADQuiz(data); // Tạo mỗi lần render
```

### 2. Lưu Thường Xuyên

```javascript
// ✅ Đúng
setInterval(() => quiz.save(), 10000);

// ❌ Sai
quiz.save(); // 1 lần
```

### 3. Set Callback Trước Bắt Đầu

```javascript
// ✅ Đúng
quiz.timer.onTime = () => {
  /* ... */
};
quiz.startTime(600);

// ❌ Sai
quiz.startTime(600);
quiz.timer.onTime = () => {
  /* ... */
};
```

### 4. Cleanup

```javascript
useEffect(() => {
  return () => {
    quiz.stopTime();
    quiz.save();
  };
}, []);
```

### 5. Validate Trước Submit

```javascript
if (quiz.isFinished) {
  quiz.submit();
} else {
  quiz.jumpToUnanswered();
}
```

---

## 🐛 Troubleshooting

| Vấn Đề                         | Giải Pháp            |
| ------------------------------ | -------------------- |
| UI không cập nhật              | Dùng `observer()`    |
| Timer không giảm               | Gọi `startTime()`    |
| Không tìm dữ liệu lưu          | Kiểm tra `quiz.name` |
| localStorage đầy               | Xóa dữ liệu cũ       |
| State bị thay đổi ngoài ý muốn | Dùng `clearAnswer()` |

---

## 📚 Học Thêm

- [MobX Documentation](https://mobx.js.org/)
- [React Hooks](https://react.dev/reference/react)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## 📞 Liên Hệ & Hỗ Trợ

Có câu hỏi? Kiểm tra:

1. Tài liệu tương ứng (README\_\*.md)
2. [QUIZ_GUIDE.md](QUIZ_GUIDE.md) - Hướng dẫn đầy đủ
3. Ví dụ trong từng file

---

**Phiên bản:** 1.0  
**Cập nhật:** 2024  
**Tác giả:** ADQuiz Team

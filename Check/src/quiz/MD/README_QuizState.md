# QuizState.js

## 📝 Mô Tả

Module quản lý toàn bộ state của bài quiz. Sử dụng MobX để reactive state management.

## 🔧 Khởi Tạo

```javascript
import { QuizState } from "./QuizState.js";

const quizData = [
  { q: "...", c: 0, a: [...] },
  { q: "...", c: 1, a: [...] }
];

const state = new QuizState(quizData, {
  name: "my_quiz",
  isRandomSen: false,
  isRandomAns: false,
  time: 300,
  limit: 0
});
```

## 📊 Properties

### Cơ Bản

- `name` - Tên quiz (dùng cho localStorage)
- `index` - Câu hỏi hiện tại (0-based)
- `time` - Thời gian còn lại (giây)

### Dữ Liệu

- `quiz` - Dữ liệu gốc, không thay đổi
- `quizzes` - Dữ liệu làm việc, có thể xáo trộn/lọc

### Cài Đặt

- `isRandomSen` - Xáo trộn câu hỏi?
- `isRandomAns` - Xáo trộn đáp án?
- `limit` - Giới hạn câu hỏi (0 = tất cả)

### Kết Quả

- `results` - `{ [questionId]: resultObject }`
- `isSubmitted` - Đã nộp bài?

### Khác

- `bookmarks` - Set các câu đánh dấu
- `onlyWrong` - Chỉ hiển thị câu sai?
- `timer` - Reference timer interval
- `_score` - Thang điểm (mặc định 10)
- `_scoreFixed` - Số lẻ thập phân của điểm

## 🎯 Methods

### Cài Đặt

```javascript
state.setSetting({
  isRandomSen: true,
  isRandomAns: true,
  limit: 5,
});
```

### Random

```javascript
state.setLimit(10); // Giới hạn 10 câu
state.resetRandom(); // Reset về bản gốc
state._applyRandom(); // Apply lại random settings
```

## 📌 Ví Dụ

```javascript
// Kiểm tra dữ liệu
console.log(state.quiz.length); // Tổng câu
console.log(state.quizzes.length); // Câu hiện tại
console.log(state.index); // Câu số ?

// Thay đổi dữ liệu
state.index = 5;
state.time = 120;

// Random
state.isRandomSen = true;
state._applyRandom();
```

## ⚠️ Lưu Ý

- `quiz` là bản gốc, không bao giờ thay đổi
- `quizzes` là bản làm việc, thay đổi khi xáo trộn/lọc
- Luôn gọi `_applyRandom()` sau khi thay đổi random settings

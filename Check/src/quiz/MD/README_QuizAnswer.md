# QuizAnswer.js

## 📝 Mô Tả

Module xử lý việc chọn câu trả lời, kiểm tra đúng/sai, và quản lý kết quả.

## 🔧 Khởi Tạo

```javascript
import { QuizAnswer } from "./QuizAnswer.js";

const answer = new QuizAnswer(state);

// Hoặc qua ADQuiz
const quiz = new ADQuiz(data);
quiz.answer.selectAnswer(1);
```

## 📋 Result Object

Kết quả được lưu trong `state.results[questionId]`:

```javascript
{
  isCorrect: true,           // Đúng?
  selectedIndex: 1,          // Index đáp án được chọn
  selectedText: "2",         // Nội dung đáp án
  correctText: "2",          // Nội dung đáp án đúng
  explanation: "...",        // Giải thích
  answeredAt: 1234567890     // Timestamp
}
```

## 🎯 Methods

### Chọn Đáp Án

```javascript
answer.selectAnswer(1); // Chọn đáp án index 1

// Không thể chọn nếu:
// - Câu này đã trả lời
// - Bài đã nộp (isSubmitted = true)
// - Index không hợp lệ
```

### Kiểm Tra Trạng Thái

```javascript
answer.isAnswered(questionId); // Câu này đã trả lời?
answer.isUnanswered(questionId); // Câu này chưa trả lời?
answer.isCorrect(questionId); // Đúng?
answer.isWrong(questionId); // Sai?
```

### Lấy/Xóa Kết Quả

```javascript
const result = answer.getResult(questionId); // Lấy kết quả
answer.clearAnswer(questionId); // Xóa (cho phép trả lời lại)
```

## 📌 Ví Dụ

```javascript
import { ADQuiz } from "./ADQuiz.js";

const quiz = new ADQuiz(data);

// Câu hỏi hiện tại
const q = quiz.currentQuestion;
console.log(q.q); // Nội dung câu hỏi
console.log(q.a); // Danh sách đáp án

// Người dùng chọn đáp án thứ 2
quiz.selectAnswer(1);

// Kiểm tra
if (quiz.isCorrect(q.id)) {
  console.log("✓ Đúng!");
} else {
  const result = quiz.getResult(q.id);
  console.log("✗ Sai!");
  console.log("Đáp án của bạn:", result.selectedText);
  console.log("Đáp án đúng:", result.correctText);
  console.log("Giải thích:", result.explanation);
}

// Cho phép chọn lại
quiz.clearAnswer(q.id);

// Chọn lại
quiz.selectAnswer(2);

// Danh sách câu sai
Object.entries(quiz.results).forEach(([id, result]) => {
  if (!result.isCorrect) {
    console.log(`Câu ${id}: ${result.selectedText} (sai)`);
  }
});
```

## 🛡️ Flow Kiểm Tra

```
selectAnswer(index)
  ├─ Kiểm tra câu đã trả lời? → return
  ├─ Kiểm tra bài đã nộp? → return
  ├─ Kiểm tra index hợp lệ? → return
  └─ Lưu kết quả
    ├─ selectedIndex
    ├─ selectedText
    ├─ correctText
    ├─ isCorrect (true/false)
    └─ explanation
```

## 🎨 UI Integration

```javascript
import { observer } from "mobx-react-lite";

const AnswerButton = observer(({ quiz, index }) => {
  const q = quiz.currentQuestion;
  const answer = q.a[index];
  const isSelected = quiz.results[q.id]?.selectedIndex === index;
  const isCorrect = answer.correct;

  return (
    <button
      onClick={() => quiz.selectAnswer(index)}
      className={`
        ${isSelected ? "selected" : ""}
        ${quiz.isSubmitted && isCorrect ? "correct" : ""}
        ${quiz.isSubmitted && isSelected && !isCorrect ? "wrong" : ""}
      `}
      disabled={quiz.isAnswered(q.id) || quiz.isSubmitted}
    >
      {answer.text}
    </button>
  );
});
```

## ⚠️ Lưu Ý

- Không thể chọn lại sau khi nộp bài
- Phải xóa kết quả trước khi chọn lại
- Result object tự động tạo, không cần tạo thủ công

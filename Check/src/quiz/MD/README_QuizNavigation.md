# QuizNavigation.js

## 📝 Mô Tả

Module quản lý việc di chuyển giữa các câu hỏi. Hỗ trợ điều hướng tuần tự, nhảy, và đến câu chưa trả lời.

## 🔧 Khởi Tạo

```javascript
import { QuizNavigation } from "./QuizNavigation.js";

const nav = new QuizNavigation(state);

// Hoặc qua ADQuiz
const quiz = new ADQuiz(data);
quiz.next();
```

## 🧭 Methods

### Điều Hướng Cơ Bản

```javascript
nav.next(); // Câu tiếp theo (nếu có)
nav.prev(); // Câu trước (nếu có)
nav.go(index); // Nhảy đến câu cụ thể
nav.first(); // Câu đầu tiên
nav.last(); // Câu cuối cùng
```

### Điều Hướng Thông Minh

```javascript
nav.jumpToUnanswered(); // Nhảy đến câu chưa trả lời đầu tiên
```

## 🎯 State Properties

```javascript
state.index; // Câu hiện tại (0-based)
```

## ✅ Checks

```javascript
quiz.canNext; // boolean - Còn câu tiếp theo?
quiz.canPrev; // boolean - Có câu trước?
quiz.isFinished; // boolean - Hoàn thành bài?
```

## 📌 Ví Dụ

### Điều Hướng Cơ Bản

```javascript
import { ADQuiz } from "./ADQuiz.js";

const quiz = new ADQuiz(data);

// Kiểm tra trước khi di chuyển
if (quiz.canNext) {
  quiz.next();
} else {
  console.log("Đã ở câu cuối cùng");
}

// Di chuyển về trước
if (quiz.canPrev) {
  quiz.prev();
}

// Nhảy đến câu cụ thể (0-based)
quiz.go(5); // Câu thứ 6

// Đầu & cuối
quiz.first();
quiz.last();
```

### Nút Điều Hướng

```javascript
import { observer } from "mobx-react-lite";

const NavigationButtons = observer(({ quiz }) => {
  return (
    <div>
      <button onClick={() => quiz.prev()} disabled={!quiz.canPrev}>
        ← Trước
      </button>

      <span>
        {quiz.index + 1} / {quiz.lenSen}
      </span>

      <button onClick={() => quiz.next()} disabled={!quiz.canNext}>
        Tiếp →
      </button>
    </div>
  );
});
```

### Nhảy Đến Câu Chưa Trả Lời

```javascript
const quiz = new ADQuiz(data);

// Trả lời câu 1
quiz.selectAnswer(1);

// Trả lời câu 2
quiz.next();
quiz.selectAnswer(0);

// Bỏ qua câu 3, đến câu 4
quiz.next();
quiz.next();

// Quay lại câu chưa trả lời đầu tiên (câu 3)
quiz.jumpToUnanswered();
console.log(quiz.index); // 2
```

### Danh Sách Câu Hỏi (Quick Jump)

```javascript
import { observer } from "mobx-react-lite";

const QuestionList = observer(({ quiz }) => {
  return (
    <div>
      {quiz.quizzes.map((question, idx) => (
        <button
          key={question.id}
          onClick={() => quiz.go(idx)}
          className={`
            ${quiz.index === idx ? "active" : ""}
            ${quiz.isAnswered(question.id) ? "answered" : ""}
            ${quiz.isCorrect(question.id) ? "correct" : "wrong"}
          `}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
});
```

### Điều Hướng Thông Minh

```javascript
const quiz = new ADQuiz(data);

// Nếu câu hiện tại đã trả lời, đi câu tiếp theo
if (quiz.isAnswered(quiz.currentQuestion.id)) {
  if (quiz.canNext) {
    quiz.next();
  } else {
    // Nộp bài nếu hết câu
    quiz.submit();
  }
} else {
  // Nếu chưa trả lời, nhảy đến câu chưa trả lời tiếp theo
  quiz.jumpToUnanswered();
}
```

### Keyboard Navigation

```javascript
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && quiz.canPrev) {
    quiz.prev();
  } else if (e.key === "ArrowRight" && quiz.canNext) {
    quiz.next();
  }
});
```

## 🛡️ Validation

```javascript
// go() tự động validate
quiz.go(-1); // Không có hiệu lực
quiz.go(999); // Không có hiệu lực
quiz.go(5); // OK (nếu index 5 tồn tại)

// next/prev tự động kiểm tra
quiz.next(); // Không di chuyển nếu ở cuối
quiz.prev(); // Không di chuyển nếu ở đầu
```

## ⚠️ Lưu Ý

- `index` là 0-based (câu đầu = 0)
- `currentQuestion` lấy từ `state.quizzes[state.index]`
- `go(index)` kiểm tra hợp lệ trước khi di chuyển
- `jumpToUnanswered()` không làm gì nếu tất cả đã trả lời

## 🎨 UI Integration

```javascript
import { observer } from "mobx-react-lite";

const QuizView = observer(({ quiz }) => {
  const question = quiz.currentQuestion;

  return (
    <div>
      <div className="question">
        <h2>
          {quiz.index + 1}. {question.q}
        </h2>
        <div>
          {question.a.map((ans, idx) => (
            <button
              key={idx}
              onClick={() => quiz.selectAnswer(idx)}
              disabled={quiz.isAnswered(question.id)}
            >
              {ans.text}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation">
        <button onClick={() => quiz.prev()} disabled={!quiz.canPrev}>
          Trước
        </button>
        <button onClick={() => quiz.next()} disabled={!quiz.canNext}>
          Tiếp
        </button>
      </div>
    </div>
  );
});
```

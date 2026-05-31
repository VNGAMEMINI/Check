# ADQuiz.js

## 📝 Mô Tả

ADQuiz là class chính kết hợp tất cả các module con thành một facade duy nhất. Cung cấp API thống nhất để quản lý toàn bộ bài quiz.

## 🏗️ Kiến Trúc

```
ADQuiz (Main Facade)
├── this.state      → QuizState (state management)
├── this.computed   → QuizComputed (getters)
├── this.answer     → QuizAnswer (answer handling)
├── this.timer      → QuizTimer (timer control)
├── this.navigation → QuizNavigation (navigation)
└── this.storage    → QuizStorage (persistence)
```

Tất cả properties và methods được **proxy** từ các module con.

## 🔧 Khởi Tạo

```javascript
import { ADQuiz } from "./ADQuiz.js";

const quizData = [
  {
    q: "1 + 1 = ?",
    img: "math1.png",
    explanation: "Đây là phép cộng cơ bản",
    c: 1, // Đáp án đúng (index)
    a: ["1", "2", "3", "4"], // Các đáp án
  },
];

const settings = {
  name: "math_quiz",
  isRandomSen: false,
  isRandomAns: false,
  time: 300,
  limit: 0,
};

const quiz = new ADQuiz(quizData, settings);
```

## 📋 API Overview

### State Properties (từ QuizState)

```javascript
quiz.name              quiz.index             quiz.time
quiz.isRandomSen       quiz.isRandomAns       quiz.isSubmitted
quiz.results           quiz.bookmarks         quiz.limit
```

### Computed Getters (từ QuizComputed)

```javascript
quiz.currentQuestion    quiz.score             quiz.progress
quiz.canNext            quiz.canPrev           quiz.isFinished
quiz.answeredCount      quiz.correctCount      quiz.wrongCount
quiz.correctPercent     quiz.uiTime            quiz.data
```

### Answer Methods (từ QuizAnswer)

```javascript
quiz.selectAnswer(idx)      quiz.getResult(id)
quiz.isAnswered(id)         quiz.isCorrect(id)
quiz.isWrong(id)            quiz.clearAnswer(id)
```

### Timer Methods (từ QuizTimer)

```javascript
quiz.startTime(sec)     quiz.stopTime()
quiz.pauseTime()        quiz.resumeTime()      quiz.setOnTime(cb)
quiz.restartTime()
```

### Navigation Methods (từ QuizNavigation)

```javascript
quiz.next()             quiz.prev()            quiz.go(idx)
quiz.first()            quiz.last()            quiz.jumpToUnanswered()
```

### Storage Methods (từ QuizStorage)

```javascript
quiz.save()             quiz.load()            quiz.clearStorage()
```

### Other Methods

```javascript
quiz.toggleRandomSen()    quiz.toggleRandomAns()
quiz.resetRandom()        quiz.setLimit(value)
quiz.setSetting(obj)      quiz.submit()
quiz.reset()              quiz.search(text)
quiz.toggleBookmark(id)   quiz.isBookmarked(id)
```

## 📌 Ví Dụ Đầy Đủ

### 1. Khởi Tạo & Bắt Đầu

```javascript
const quiz = new ADQuiz(quizData, {
  name: "test_2024",
  time: 600,
});

// Callback khi hết thời gian
quiz.timer.onTime = () => {
  console.log("Hết thời gian!");
  quiz.submit();
};

// Bắt đầu
quiz.startTime(quiz.time);
```

### 2. Hiển Thị Câu & Tùy Chọn

```javascript
const question = quiz.currentQuestion;
console.log(`Câu ${quiz.index + 1}/${quiz.lenSen}: ${question.q}`);

question.a.forEach((answer, idx) => {
  console.log(`  ${idx + 1}. ${answer.text}`);
});
```

### 3. Xử Lý Chọn Đáp Án

```javascript
// Người dùng chọn đáp án
quiz.selectAnswer(1);

// Kiểm tra
if (quiz.isCorrect(question.id)) {
  console.log("✓ Đúng!");
} else {
  const result = quiz.getResult(question.id);
  console.log("✗ Sai!");
  console.log("Giải thích:", result.explanation);
}
```

### 4. Di Chuyển & Tiếp Tục

```javascript
// Kiểm tra có câu tiếp theo?
if (quiz.canNext) {
  quiz.next();
} else {
  // Hoàn thành bài
  console.log(`Hoàn thành! Điểm: ${quiz.score}`);
  quiz.submit();
}
```

### 5. Lưu & Nộp

```javascript
// Lưu tự động
quiz.save();

// Khi hoàn thành
if (quiz.isFinished) {
  quiz.submit();

  // Gửi lên server
  const payload = {
    name: quiz.name,
    results: quiz.results,
    score: quiz.score,
    correctCount: quiz.correctCount,
    totalCount: quiz.lenSen,
  };

  await fetch("/api/submit-quiz", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Xóa dữ liệu lưu
  quiz.clearStorage();
}
```

## 🎨 React Integration

```javascript
import { observer } from "mobx-react-lite";
import { ADQuiz } from "./ADQuiz.js";

const QuizApp = observer(() => {
  const [quiz] = React.useState(() => new ADQuiz(quizData, settings));

  React.useEffect(() => {
    // Khởi tạo
    quiz.load(); // Tải dữ liệu trước đó nếu có
    quiz.startTime(quiz.time);

    return () => {
      quiz.stopTime();
      quiz.save();
    };
  }, []);

  const question = quiz.currentQuestion;

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="header">
        <h1>Bài Quiz</h1>
        <p>Tiến độ: {quiz.progress}%</p>
        <p>Thời gian: {quiz.uiTime}</p>
      </div>

      {/* Question */}
      <div className="question">
        <h2>
          Câu {quiz.index + 1}/{quiz.lenSen}: {question.q}
        </h2>

        {/* Answers */}
        <div className="answers">
          {question.a.map((answer, idx) => (
            <button
              key={idx}
              onClick={() => quiz.selectAnswer(idx)}
              className={`
                ${quiz.results[question.id]?.selectedIndex === idx ? "selected" : ""}
              `}
              disabled={quiz.isAnswered(question.id)}
            >
              {answer.text}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {quiz.isAnswered(question.id) && (
          <div className="explanation">
            <p>
              <strong>Giải thích:</strong> {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button onClick={() => quiz.prev()} disabled={!quiz.canPrev}>
          ← Trước
        </button>
        <button onClick={() => quiz.next()} disabled={!quiz.canNext}>
          Tiếp →
        </button>
        {quiz.canNext === false && (
          <button onClick={() => quiz.submit()}>Nộp Bài</button>
        )}
      </div>

      {/* Score */}
      <div className="score">
        <p>
          Đúng: {quiz.correctCount}/{quiz.answeredCount}
        </p>
        <p>Điểm: {quiz.score}/10</p>
      </div>
    </div>
  );
});
```

## 🔄 Lifecycle

```
new ADQuiz()
  ↓
(load nếu có dữ liệu cũ)
  ↓
startTime()
  ↓
[Người dùng làm bài]
  selectAnswer() → next()/prev() → save()
  ↓
submit() / (hết thời gian → onTime callback)
  ↓
(hiển thị kết quả)
  ↓
clearStorage() → reset() → tạo quiz mới
```

## ⚙️ Configuration

```javascript
// Mặc định
const quiz = new ADQuiz(data);

// Tùy chỉnh
const quiz = new ADQuiz(data, {
  name: "quiz_name", // Tên (bắt buộc cho storage)
  isRandomSen: true, // Xáo trộn câu?
  isRandomAns: true, // Xáo trộn đáp án?
  time: 600, // Thời gian (giây)
  limit: 20, // Giới hạn câu (-1 = tất cả)
});
```

## 🎛️ Advanced Features

### Custom Scoring

```javascript
// Đổi thang điểm
quiz.score = 100;
console.log(quiz.score); // "80.0" (tính lại)
```

### Search & Filter

```javascript
// Tìm kiếm
const results = quiz.search("HTML");

// Bookmarks
quiz.toggleBookmark(questionId);
if (quiz.isBookmarked(questionId)) {
  console.log("Đã đánh dấu");
}
```

### Xáo Trộn Động

```javascript
// Bật xáo trộn
quiz.toggleRandomSen(); // Xáo trộn câu
quiz.toggleRandomAns(); // Xáo trộn đáp án

// Reset
quiz.resetRandom(); // Về bản gốc
```

## 🐛 Troubleshooting

**State không cập nhật trong React?**

- Dùng `observer()` từ mobx-react-lite
- Không gọi từ constructor

**Timer không giảm?**

- Gọi `startTime()` với giá trị > 0
- Kiểm tra `pauseTime()` có gọi trước

**Dữ liệu không lưu?**

- Kiểm tra `quiz.name` có set
- Gọi `save()` trước khi unload
- Kiểm tra localStorage không đầy

**Quiz không reset?**

- Gọi `reset()` sau `submit()`
- Hoặc tạo instance mới

## 📚 Xem Thêm

- [README_QuizState.md](README_QuizState.md)
- [README_QuizComputed.md](README_QuizComputed.md)
- [README_QuizAnswer.md](README_QuizAnswer.md)
- [README_QuizTimer.md](README_QuizTimer.md)
- [README_QuizNavigation.md](README_QuizNavigation.md)
- [README_QuizStorage.md](README_QuizStorage.md)
- [QUIZ_GUIDE.md](QUIZ_GUIDE.md) - Hướng dẫn đầy đủ

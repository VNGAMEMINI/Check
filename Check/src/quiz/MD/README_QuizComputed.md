# QuizComputed.js

## 📝 Mô Tả

Module cung cấp các computed properties (getters) dựa trên state hiện tại. Tất cả giá trị được tính toán động, không lưu trữ.

## 🔧 Khởi Tạo

```javascript
import { QuizComputed } from "./QuizComputed.js";

const computed = new QuizComputed(state);

// Hoặc qua ADQuiz
const quiz = new ADQuiz(data);
quiz.computed.currentQuestion;
```

## 🧮 Getters

### Điều Hướng

```javascript
computed.canNext; // boolean - Còn câu tiếp theo?
computed.canPrev; // boolean - Có câu trước?
computed.isFinished; // boolean - Hoàn thành bài?
```

### Câu Hỏi

```javascript
computed.currentQuestion; // object - Câu hiện tại
computed.firstUnanswered; // object - Câu chưa trả lời đầu tiên
computed.lenSen; // number - Tổng câu hỏi
computed.lenAns; // number - Tổng câu trả lời
```

### Điểm Số

```javascript
computed.score; // string - "0.0" to "10.0"
computed.answeredCount; // number - Câu đã trả lời
computed.correctCount; // number - Câu đúng
computed.wrongCount; // number - Câu sai
computed.correctPercent; // number - % câu đúng (0-100)
computed.wrongPercent; // number - % câu sai (0-100)
```

### Tiến Độ & Thời Gian

```javascript
computed.progress; // number - % hoàn thành (0-100)
computed.uiTime; // string - "HH:MM:SS"
computed.averageTime; // number - Thời gian trung bình/câu
```

### Dữ Liệu

```javascript
computed.data; // object {quiz, ans, img, exp, cor}
```

### Setter

```javascript
computed.score = 20; // Thay đổi thang điểm
```

## 📌 Ví Dụ

```javascript
import { ADQuiz } from "./ADQuiz.js";

const quiz = new ADQuiz(data);

// Kiểm tra tiến độ
console.log(quiz.progress); // 50
console.log(quiz.answeredCount); // 5
console.log(quiz.correctCount); // 4
console.log(quiz.correctPercent); // 80

// Kiểm tra thời gian
console.log(quiz.uiTime); // "00:05:30"

// Lấy câu hiện tại
const question = quiz.currentQuestion;
console.log(question.q); // Nội dung câu hỏi

// Đổi thang điểm
quiz.score = 100;
console.log(quiz.score); // "80.0" (tính lại)

// Kiểm tra điều hướng
if (quiz.canNext) quiz.next();
if (quiz.canPrev) quiz.prev();

// Tìm câu chưa trả lời
const first = quiz.firstUnanswered;
if (first) quiz.go(first.id);
```

## 🎯 Reactive với MobX

```javascript
import { observer } from "mobx-react-lite";

const ScoreBoard = observer(({ quiz }) => {
  return (
    <div>
      <p>Điểm: {quiz.score}</p>
      <p>Tiến độ: {quiz.progress}%</p>
      <p>
        Đúng: {quiz.correctCount}/{quiz.answeredCount}
      </p>
    </div>
  );
});
// Tự động cập nhật khi quiz.score thay đổi
```

## ⚠️ Lưu Ý

- Tất cả giá trị được tính toán **động**, không lưu trữ
- Hiệu suất tối ưu với MobX fine-grained tracking
- `score` setter thay đổi `_score`, getter tính toán lại điểm

import { memo, useState, useReducer, useCallback } from "react";
import { useQuiz } from "./_manage";
import "./poser.scss";

// ─── CONFIGURATION & CONSTANTS ──────────────────────────────────────────────

/**
 * Định nghĩa các class CSS tương ứng với cấu trúc giao diện.
 * Việc sử dụng hằng số giúp dễ dàng đổi tên class CSS mà không cần tìm kiếm thủ công trong code.
 */
const UI_CLASSES = {
  CONTAINER: "poser",
  TITLE: "title",
  /** PROGRESS.CONTAINER: progress */
  PROGRESS: {
    CONTAINER: "progress",
    STATS: "progress__a",
    INFO: "progress__b",
    BAR: "progress-bar",
    FILL: "progress-fill",
  },
  /** QUESTION.CONTAINER: question */
  QUESTION: {
    CONTAINER: "question",
    SENTENCE: "question__sentence",
    S_SENTENCE: "strong",
    E_SENTENCE: "em",
    IMG_SENTENCE: "question__img-sentence",
  },
  /** ANSWER.CONTAINER: answer */
  ANSWER: {
    CONTAINER: "answer",
    CORRECT: "yes",
    WRONG: "no",
  },
  BTN_GROUP: "btn-group",
  BTN: "btn",
};

/**
 * Component hiển thị nội dung câu hỏi và hình ảnh minh họa.
 * @param {number} index - Thứ tự câu hỏi hiện tại.
 * @param {string} q - Nội dung văn bản của câu hỏi.
 * @param {string} img - Tên file ảnh minh họa.
 */
const Question = memo(({ index, q, img }) => (
  <div className={UI_CLASSES.QUESTION.CONTAINER}>
    <div className={UI_CLASSES.QUESTION.SENTENCE}>
      <strong className={UI_CLASSES.QUESTION.S_SENTENCE}>
        Câu {index + 1}:
      </strong>
      <em className={UI_CLASSES.QUESTION.E_SENTENCE}> {q}</em>
    </div>
    <img
      className={UI_CLASSES.QUESTION.IMG_SENTENCE}
      src={`${import.meta.env.BASE_URL}img/${img}`}
      onError={e => {
        e.target.style.display = "none";
      }}
    />
  </div>
));

/**
 * Component hiển thị danh sách các đáp án lựa chọn.
 * @param {Array} a - Danh sách các đối tượng đáp án.
 * @param {number|null} selectedIndex - Vị trí đáp án người dùng đã chọn (null nếu chưa chọn).
 * @param {Function} onAnswer - Hàm xử lý khi người dùng click chọn đáp án.
 */
const Answer = memo(({ a, selectedIndex, onAnswer }) => (
  <div className={UI_CLASSES.ANSWER.CONTAINER}>
    {a.map((ans, i) => {
      let className = "";
      if (selectedIndex !== null) {
        if (ans.correct) className = UI_CLASSES.ANSWER.CORRECT;
        else if (i === selectedIndex) className = UI_CLASSES.ANSWER.WRONG;
      }

      return (
        <span key={i} className={className}>
          <button disabled={selectedIndex !== null} onClick={() => onAnswer(i)}>
            {ans.text}
          </button>
          <img
            src={`${import.meta.env.BASE_URL}img/${ans.img}`}
            onError={e => (e.target.style.display = "none")}
          />
        </span>
      );
    })}
  </div>
));

/**
 * Component hiển thị thanh tiến độ và thống kê kết quả đúng/sai.
 * @param {number} index - Chỉ số câu hỏi hiện tại.
 * @param {number} total - Tổng số câu hỏi.
 * @param {Object} result - Đối tượng chứa số câu đúng và sai.
 */
const Progress = memo(({ index, total, result }) => {
  const progressPercent = Math.round(((index + 1) / total) * 100);
  return (
    <div className={UI_CLASSES.PROGRESS.CONTAINER}>
      <div className={UI_CLASSES.PROGRESS.STATS}>
        <p>
          Câu {index + 1} / {total}
        </p>
        <p>Đúng: {result.correct}</p>
        <p>Sai: {result.wrong}</p>
      </div>
      <div className={UI_CLASSES.PROGRESS.INFO}>
        <p>tiến độ</p>
        <p>{progressPercent}%</p>
      </div>
      <div className={UI_CLASSES.PROGRESS.BAR}>
        <div
          className={UI_CLASSES.PROGRESS.FILL}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
});

/**
 * Nút bấm dùng chung cho các chức năng điều hướng và xáo trộn.
 */
const RandomBtn = memo(({ onClick, label }) => (
  <button className={UI_CLASSES.BTN} onClick={onClick}>
    {label}
  </button>
));

/**
 * Component chính của module Poser.
 * Phối hợp logic từ useQuiz và giao diện để hiển thị trọn bộ bài trắc nghiệm.
 */
function Poser({ data = [], title_h1, title_p }) {
  const quizState = useQuiz(data);

  return (
    <main className={UI_CLASSES.CONTAINER}>
      <div className={UI_CLASSES.TITLE}>
        <h1>{title_h1}</h1>
        <p>{title_p}</p>
      </div>

      <Progress
        index={quizState.index}
        total={quizState.viewQuiz.length}
        result={quizState.result}
      />

      <Question
        index={quizState.index}
        q={quizState.currentQuestion.q}
        img={quizState.currentQuestion.img}
      />

      <Answer
        a={quizState.currentQuestion.a || []}
        selectedIndex={quizState.selectedIndex}
        onAnswer={quizState.selectAnswer}
      />

      <div className={UI_CLASSES.BTN_GROUP}>
        <div>
          <RandomBtn onClick={quizState.handleRandomAnswer} label="Xáo trộn" />
          <RandomBtn onClick={quizState.handleRandomAll} label="Tất cả" />
        </div>

        <div>
          <RandomBtn onClick={quizState.previous} label="<=" />
          <RandomBtn onClick={quizState.next} label="=>" />
        </div>
      </div>
    </main>
  );
}

export default memo(Poser);

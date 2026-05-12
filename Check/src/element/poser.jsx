import { memo, useState } from "react";
import { rdArr } from "../setting/setting.js";
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
 * Các tham số cấu hình chung cho ứng dụng.
 */
const APP_CONFIG = {
  AUTO_NEXT_DELAY: 1500, // Thời gian trễ (ms) trước khi tự động chuyển câu sau khi chọn đáp án
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
 * Chuẩn hóa dữ liệu thô từ JSON sang định dạng ứng dụng yêu cầu.
 * Xử lý linh hoạt trường hợp đáp án là chuỗi hoặc đối tượng có ảnh.
 * @param {Array} data - Mảng dữ liệu câu hỏi thô.
 * @returns {Array} Mảng dữ liệu đã qua xử lý.
 */
function normalizeQuiz(data) {
  return data.map(q => ({
    ...q,
    a: q.a.map((ans, idx) => ({
      text: typeof ans === "object" ? ans.text : ans,
      img: typeof ans === "object" ? ans.img : `${idx}-${q.img}`,
      correct: idx === q.c,
    })),
  }));
}

// ─── CUSTOM HOOK FOR LOGIC ──────────────────────────────────────────────────

/**
 * Custom Hook quản lý toàn bộ trạng thái và logic xử lý của bài trắc nghiệm.
 * @param {Array} initialData - Dữ liệu câu hỏi gốc.
 */
function useQuiz(initialData) {
  const [quiz] = useState(() => normalizeQuiz(initialData)); // Dữ liệu đã chuẩn hóa
  const [viewQuiz, setViewQuiz] = useState(quiz); // Dữ liệu hiện thị (có thể xáo trộn)
  const [index, setIndex] = useState(0); // Vị trí câu hiện tại
  const [userSelections, setUserSelections] = useState({}); // Lưu đáp án người dùng đã chọn
  const [result, setResult] = useState({
    correct: 0,
    wrong: 0,
  });

  const currentQuestion = viewQuiz[index] || { a: [] }; // Câu hỏi hiện tại
  const selectedIndex = userSelections[index] ?? null; // Lựa chọn của người dùng tại câu hiện tại

  // Hàm xáo trộn đáp án trong câu hỏi đang xem
  const handleRandomAnswer = () => {
    const newQuiz = [...viewQuiz];
    newQuiz[index] = {
      ...newQuiz[index],
      a: rdArr([...newQuiz[index].a]),
    };
    setViewQuiz(newQuiz);
  };

  // Hàm xáo trộn toàn bộ bộ đề, reset lại từ câu đầu tiên
  const handleRandomAll = () => {
    const shuffledQuiz = rdArr([...quiz]).map(q => ({
      ...q,
      a: rdArr([...q.a]),
    }));

    setViewQuiz(shuffledQuiz);
    setIndex(0);
    setResult({ correct: 0, wrong: 0 });
    setUserSelections({});
  };

  // Điều hướng: Quay lại câu trước
  const previous = () => setIndex(i => Math.max(0, i - 1));
  // Điều hướng: Chuyển sang câu sau
  const next = () => setIndex(i => Math.min(viewQuiz.length - 1, i + 1));

  // Xử lý khi chọn đáp án
  const selectAnswer = i => {
    if (selectedIndex !== null) return;

    setUserSelections(prev => ({ ...prev, [index]: i }));
    const ans = currentQuestion.a[i];
    if (ans.correct) {
      setResult(r => ({ ...r, correct: r.correct + 1 }));
    } else {
      setResult(r => ({ ...r, wrong: r.wrong + 1 }));
    }
    // Tự động chuyển câu sau một khoảng trễ đã cấu hình
    setTimeout(next, APP_CONFIG.AUTO_NEXT_DELAY);
  };

  return {
    index,
    currentQuestion,
    viewQuiz,
    result,
    selectedIndex,
    handleRandomAnswer,
    handleRandomAll,
    previous,
    next,
    selectAnswer,
  };
}

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

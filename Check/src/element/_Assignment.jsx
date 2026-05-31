//? ------------------------------------------------------------
import React, { memo, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { QUIZ_MODES, TEXT, CSS } from "./config/constants.js";
import "./_Assignment.scss";
//? ------------------------------------------------------------


/**
 * Lưới hiển thị trạng thái các câu hỏi
 */
const TagGrid = observer(({ quiz }) => {
  const styles = CSS.ASSIGNMENT;

  const handleTagClick = idx => {
    // Cho phép nhảy câu tự do ở cả 2 chế độ
    quiz.go(idx);

    // Nếu là chế độ Kiểm tra, thực hiện cuộn mượt đến câu hỏi tương ứng
    if (quiz.isExamMode) {
      const element = document.getElementById(`q-${idx}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={styles.TAG_GRID}>
      {quiz.quizzes.map((item, idx) => {
        const result = quiz.results[item.id];
        const isActive = quiz.index === idx;
        const isMarked = quiz.isBookmarked(item.id);

        return (
          <div
            key={item.id}
            className={`${styles.TAG_ITEM} 
              ${isActive ? styles.TAG_ACTIVE : ""} 
              ${isMarked ? styles.TAG_BOOKMARK : ""} 
              ${result ? styles.TAG_ANSWERED : ""}`}
            onClick={() => handleTagClick(idx)}
          >
            <span className={styles.TAG_NUMBER}>{idx + 1}</span>
            {result && (
              <span className={styles.TAG_LABEL}>
                {String.fromCharCode(65 + result.selectedIndex)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

/**
 * Hiển thị nội dung và đáp án của một câu hỏi
 */
const QuestionItem = observer(({ quiz, question, index, isExam }) => {
  const styles = CSS.ASSIGNMENT;
  const result = quiz.results[question.id];
  const isAnswered = quiz.isAnswered(question.id);
  // Loại bỏ logic khóa câu hỏi tuần tự theo yêu cầu "giống y vậy"
  const isLocked = false;

  const handleSelect = ansIdx => {
    if (!isExam && isAnswered) return;

    if (quiz.index !== index) quiz.go(index);
    if (isExam && isAnswered) quiz.clearAnswer(question.id);

    quiz.selectAnswer(ansIdx);

    if (quiz.state.autoNext?.enabled) {
      if (isExam) {
        quiz.next();
      } else {
        setTimeout(() => quiz.next(), 300);
      }
    }
  };

  return (
    <section
      className={`${styles.QUESTION_SECTION} ${isLocked ? styles.LOCKED || "is-locked" : ""}`}
      id={`q-${index}`}
      style={isLocked ? { opacity: 0.5, pointerEvents: "none" } : {}}
    >
      <h3 className={styles.QUESTION_TEXT}>
        {TEXT.ASSIGNMENT.QUESTION} {index + 1}: {question.q}
      </h3>
      {question.img && (
        <img src={question.img} className={styles.QUESTION_IMAGE} alt="" />
      )}

      <div className={styles.ANSWER_LIST}>
        {question.a.map((ans, idx) => {
          const isSelected = result?.selectedIndex === idx;
          let feedbackClass = "";

          if (!isExam && isAnswered) {
            if (isSelected)
              feedbackClass = quiz.isCorrect(question.id)
                ? "is-correct"
                : "is-wrong";
            else if (ans.correct) feedbackClass = "is-correct";
          }

          return (
            <label
              key={idx}
              className={`${styles.ANSWER_ITEM} ${isSelected ? styles.SELECTED : ""} ${feedbackClass}`}
            >
              <input
                type="radio"
                checked={isSelected}
                name={`q-${question.id}`}
                onChange={() => handleSelect(idx)}
                disabled={isLocked}
              />
              <span className={styles.ANSWER_INDEX}>
                {String.fromCharCode(65 + idx)}.
              </span>
              <span className={styles.ANSWER_TEXT}>{ans.text}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
});

/**
 * Layout chung cho header của bài làm
 */
const AssignmentHeader = observer(({ quiz }) => {
  const styles = CSS.ASSIGNMENT;
  const labels = TEXT.ASSIGNMENT;
  return (
    <header className={styles.HEADER}>
      <div className={styles.STATS_BAR}>
        <span>
          {labels.TOTAL_TIME}: {quiz.uiTime}
        </span>
        <span>
          {labels.PROGRESS}: {quiz.progress}%
        </span>
      </div>
      {!quiz.isExamMode && (
        <div className={styles.STATS_BAR}>
          <span>
            {labels.QUESTION} {quiz.index + 1}/{quiz.lenSen}
          </span>
          <span className={styles.TEXT_SUCCESS}>
            {labels.CORRECT}: {quiz.correctCount}
          </span>
          <span className={styles.TEXT_DANGER}>
            {labels.WRONG}: {quiz.wrongCount}
          </span>
          <span className={styles.TEXT_MUTED}>
            {labels.PENDING}: {quiz.unansweredCount}
          </span>
        </div>
      )}
    </header>
  );
});

const Free = observer(({ quiz, onComplete }) => {
  const styles = CSS.ASSIGNMENT;
  const labels = TEXT.ASSIGNMENT;
  const q = quiz.quizzes[quiz.index];
  const isCurrentAnswered = quiz.isAnswered(q.id);

  return (
    <main className={styles.CONTAINER}>
      <AssignmentHeader quiz={quiz} />

      {/* TagGrid đưa lên trên */}
      <TagGrid quiz={quiz} />

      <QuestionItem
        quiz={quiz}
        question={q}
        index={quiz.index}
        isExam={false}
      />

      <footer className={styles.FOOTER_NAV}>
        <button
          className={styles.BTN_NAV}
          onClick={() => quiz.prev()}
          disabled={!quiz.canPrev}
        >
          {labels.PREV}
        </button>
        <button
          className={styles.BTN_BOOKMARK}
          onClick={() => quiz.toggleBookmark(q.id)}
        >
          {quiz.isBookmarked(q.id) ? labels.UNMARK : labels.MARK}
        </button>
        <button
          className={styles.BTN_NAV}
          onClick={() => quiz.next()}
          disabled={!quiz.canNext}
        >
          {labels.NEXT}
        </button>
        <button
          className={styles.BTN_SUBMIT}
          onClick={onComplete}
          disabled={quiz.unansweredCount > 0}
        >
          {labels.SUBMIT}{" "}
          {quiz.unansweredCount > 0
            ? `(${quiz.answeredCount}/${quiz.lenSen})`
            : ""}
        </button>
      </footer>
    </main>
  );
});

const Exam = observer(({ quiz, onComplete }) => {
  const styles = CSS.ASSIGNMENT;
  return (
    <main className={styles.CONTAINER}>
      <AssignmentHeader quiz={quiz} />
      <div className={styles.SCROLL_VIEW || "exam-scroll-view"}>
        <TagGrid quiz={quiz} />
        {quiz.quizzes.map((item, idx) => (
          <QuestionItem
            key={item.id}
            quiz={quiz}
            question={item}
            index={idx}
            isExam={true}
          />
        ))}
      </div>
      <footer className={styles.FOOTER_NAV}>
        <button
          className={styles.BTN_SUBMIT}
          style={{ width: "100%" }}
          onClick={onComplete}
          disabled={quiz.unansweredCount > 0}
        >
          {TEXT.ASSIGNMENT.SUBMIT}{" "}
          {quiz.unansweredCount > 0
            ? `(${quiz.answeredCount}/${quiz.lenSen})`
            : ""}
        </button>
      </footer>
    </main>
  );
});

const Assignment = observer(({ quiz, onComplete }) => {
  useEffect(() => {
    quiz.setOnTime(() => {
      quiz.submit();
      onComplete();
    });
  }, [quiz, onComplete]);

  return quiz.isExamMode ? (
    <Exam quiz={quiz} onComplete={onComplete} />
  ) : (
    <Free quiz={quiz} onComplete={onComplete} />
  );
});

export default memo(Assignment);

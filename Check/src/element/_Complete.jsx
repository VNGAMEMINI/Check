//? ------------------------------------------------------------
import React, { memo } from "react";
import { observer } from "mobx-react-lite";
import { TEXT, CSS } from "./config/constants.js";
import "./_Complete.scss";
//? ------------------------------------------------------------

/**
 * Giao diện kết quả bài thi
 */
const Complete = observer(({ quiz, onStep }) => {
  const labels = TEXT.COMPLETE;
  const styles = CSS.COMPLETE;

  const scoreValue = parseFloat(quiz.score);
  const isPassed = scoreValue >= 5;
  const name = quiz.state.name || "Bạn";

  const handleRestart = () => {
    quiz.reset?.();
    onStep();
  };

  return (
    <main className={styles.CONTAINER}>
      <div className={styles.CARD}>
        <h1
          className={`${styles.STATUS} ${isPassed ? styles.SUCCESS : styles.DANGER}`}
        >
          {isPassed ? labels.PASS : labels.FAIL}
        </h1>

        <p className={styles.MESSAGE}>
          {isPassed
            ? `${labels.CONGRATS} ${name}`
            : `${labels.GOODBYE} ${name}`}
        </p>

        <div className={styles.SCORE_VAL}>
          {labels.SCORE}: <span>{quiz.score}</span>
        </div>

        <div className={styles.STATS_GRID}>
          <div className={styles.SUCCESS}>
            {TEXT.ASSIGNMENT.CORRECT}: {quiz.correctPercent}%
          </div>
          <div className={styles.DANGER}>
            {TEXT.ASSIGNMENT.WRONG}: {quiz.wrongPercent}%
          </div>
        </div>

        <section className={styles.DETAIL_LIST}>
          <h3>{labels.RESULT_TITLE}</h3>
          <div className="detail-list-wrapper">
            {quiz.quizzes.map((q, idx) => {
              const isCorrect = quiz.isCorrect(q.id);
              const isWrong = quiz.isWrong(q.id);
              const result = quiz.getResult(q.id);

              const statusLabel = isCorrect
                ? labels.CORRECT
                : isWrong
                  ? labels.WRONG
                  : labels.PENDING;
              const statusClass = isCorrect
                ? styles.SUCCESS
                : isWrong
                  ? styles.DANGER
                  : styles.MUTED;

              return (
                <div
                  key={q.id}
                  className={`${styles.DETAIL_ITEM} ${statusClass}`}
                >
                  <span className="item-status">{`Câu ${idx + 1}: ${statusLabel}`}</span>
                  <div
                    className="item-question-text"
                    style={{ margin: "8px 0", fontWeight: "500" }}
                  >
                    {q.q}
                  </div>
                  {isWrong && result && (
                    <div className={styles.WRONG_INFO}>
                      <small>
                        • {labels.YOUR_ANS}:{" "}
                        <strong>{result.selectedText}</strong>
                      </small>
                      <br />
                      <small>
                        • {labels.CORRECT_ANS}:{" "}
                        <strong>{result.correctText}</strong>
                      </small>
                    </div>
                  )}
                  {idx < quiz.lenSen - 1 && <hr className="item-divider" />}
                </div>
              );
            })}
          </div>
        </section>
        <button className={styles.BTN_RESTART} onClick={handleRestart}>
          {labels.RESTART}
        </button>
      </div>
    </main>
  );
});

export default memo(Complete);

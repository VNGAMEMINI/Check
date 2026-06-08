//? ------------------------------------------------------------
import React, { useState, useEffect } from "react";
import { QUIZ_MODES, DEFAULT_SETTINGS, TEXT, CSS } from "./config/constants.js";
import { observer } from "mobx-react-lite";
import "./_Establish.scss";
//? ------------------------------------------------------------

/**
 * Giao diện thiết lập thông số bài thi
 */
const Establish = observer(({ quiz, onStep }) => {
  const [mode, setMode] = useState(QUIZ_MODES.FREE);
  const [name, setName] = useState("");
  const [config, setConfig] = useState(DEFAULT_SETTINGS[QUIZ_MODES.FREE]);

  const labels = TEXT.ESTABLISH;
  const styles = CSS.ESTABLISH;

  // Thay đổi chế độ và cập nhật cấu hình mặc định tương ứng
  const handleModeChange = newMode => {
    setMode(newMode);
    setConfig(DEFAULT_SETTINGS[newMode]);
  };

  const updateConfig = (key, value) => {
    // Đảm bảo các giá trị số được lưu đúng kiểu Number
    const finalValue =
      key === "limit" || key === "timeTotal" ? Number(value) : value;
    setConfig(prev => ({ ...prev, [key]: finalValue }));
  };

  const handleStart = () => {
    // Cập nhật thông tin vào instance quiz
    quiz.state.name = name.trim() || "Bạn";
    quiz.state.mode = mode;

    // 1. Xác định cấu hình dựa trên chế độ
    const isExam = mode === QUIZ_MODES.EXAM;
    const finalConfig = {
      isRandomSen: isExam ? true : config.randomSen,
      isRandomAns: isExam ? true : config.randomAns,
      autoNext: isExam ? true : config.autoNext,
      limit: Number(config.limit) || 0,
      time: config.timeTotal > 0 ? config.timeTotal * 60 : 0,
    };

    // 2. Cập nhật trực tiếp vào state để đảm bảo tính đồng bộ cho ADQuiz
    quiz.state.isRandomSen = finalConfig.isRandomSen;
    quiz.state.isRandomAns = finalConfig.isRandomAns;
    quiz.state.limit = finalConfig.limit;
    quiz.state.time = finalConfig.time;

    // 3. Quan trọng: Kích hoạt xáo trộn để tạo mảng quiz.quizzes mới
    if (quiz.state._applyRandom) {
      quiz.state._applyRandom();
    } else if (quiz._applyRandom) {
      quiz._applyRandom();
    }

    // 4. Bắt đầu đếm ngược nếu có thời gian
    if (quiz.state.time > 0) {
      quiz.startTime?.(quiz.state.time);
    }

    quiz.state.autoNext = { enabled: finalConfig.autoNext, delay: 0 };

    onStep(); // Chuyển sang bước Assignment
  };

  return (
    <main className={styles.CONTAINER}>
      <div className={styles.CARD}>
        <h1 className={styles.TITLE}>{labels.TITLE}</h1>
        <p className={styles.SUBTITLE}>{labels.SUBTITLE}</p>

        {/* Nhập tên */}
        <div className={styles.FORM_GROUP}>
          <label className={styles.HINT}>{labels.NAME_LABEL}</label>
          <input
            type="text"
            className={styles.INPUT_NAME}
            placeholder={labels.NAME_PLACEHOLDER}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Chọn chế độ */}
        <div className={styles.MODE_SELECTOR}>
          <button
            className={`${styles.MODE_TAB} ${mode === QUIZ_MODES.FREE ? styles.ACTIVE : ""}`}
            onClick={() => handleModeChange(QUIZ_MODES.FREE)}
          >
            {labels.MODE_FREE}
          </button>
          <button
            className={`${styles.MODE_TAB} ${mode === QUIZ_MODES.EXAM ? styles.ACTIVE : ""}`}
            onClick={() => handleModeChange(QUIZ_MODES.EXAM)}
          >
            {labels.MODE_EXAM}
          </button>
        </div>

        {/* Tùy chọn bài thi */}
        <section className={styles.SETTINGS_SECTION}>
          <h3 className={styles.HINT}>{labels.SECTION_QUIZ}</h3>
          <div className={styles.SETTING_ITEM}>
            <label>{labels.LIMIT_LABEL}</label>
            <input
              type="number"
              min="0"
              value={config.limit}
              onChange={e => updateConfig("limit", e.target.value)}
              placeholder="0 = tối đa"
            />
            {Number(config.limit) === 0 && (
              <span className={styles.HINT}> (Mặc định: Tối đa)</span>
            )}
          </div>

          <div className={styles.CHECKBOX_GROUP}>
            <label>
              <input
                type="checkbox"
                checked={mode === QUIZ_MODES.EXAM ? true : config.randomSen}
                disabled={mode === QUIZ_MODES.EXAM}
                onChange={e => updateConfig("randomSen", e.target.checked)}
              />{" "}
              {labels.RANDOM_SEN} {mode === QUIZ_MODES.EXAM && "(Khóa)"}
            </label>

            <label>
              <input
                type="checkbox"
                checked={mode === QUIZ_MODES.EXAM ? true : config.randomAns}
                disabled={mode === QUIZ_MODES.EXAM}
                onChange={e => updateConfig("randomAns", e.target.checked)}
              />{" "}
              {labels.RANDOM_ANS} {mode === QUIZ_MODES.EXAM && "(Khóa)"}
            </label>

            <label>
              <input
                type="checkbox"
                checked={mode === QUIZ_MODES.EXAM ? true : config.autoNext}
                disabled={mode === QUIZ_MODES.EXAM}
                onChange={e => updateConfig("autoNext", e.target.checked)}
              />{" "}
              {labels.AUTO_NEXT}
            </label>
          </div>
        </section>

        {/* Tùy chọn thời gian */}
        <section className={styles.SETTINGS_SECTION}>
          <h3 className={styles.HINT}>{labels.SECTION_TIME}</h3>
          <div className={styles.SETTING_ITEM}>
            <label>{labels.TIME_TOTAL}</label>
            <input
              type="number"
              min="0"
              value={config.timeTotal}
              onChange={e => updateConfig("timeTotal", e.target.value)}
            />
            {config.timeTotal === 0 && (
              <span className={styles.HINT}>{labels.TIME_UNLIMITED}</span>
            )}
          </div>
        </section>

        <button className={styles.BTN_START} onClick={handleStart}>
          {labels.BTN_START}
        </button>
      </div>
    </main>
  );
});

export default Establish;

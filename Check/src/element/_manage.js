import { useState, useReducer, useCallback } from "react";
import { rdArr } from "../setting/setting.js";

/**
 * Các tham số cấu hình chung cho ứng dụng.
 */
const APP_CONFIG = {
  AUTO_NEXT_DELAY: 1500, // Thời gian trễ (ms) trước khi tự động chuyển câu sau khi chọn đáp án
};

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

/**
 * Reducer quản lý trạng thái tập trung.
 * Việc sử dụng Reducer giúp dễ dàng thêm các hành động mới (ví dụ: RESET_QUIZ, TOGGLE_TIMER)
 * mà không làm rối mã nguồn.
 */
function quizReducer(state, action) {
  switch (action.type) {
    case "SELECT": {
      const { qIndex, aIndex } = action.payload;
      // Ngăn chặn chọn lại nếu đã có đáp án cho câu này
      if (state.userSelections[qIndex] !== undefined) return state;

      const isCorrect = state.viewQuiz[qIndex].a[aIndex].correct;
      return {
        ...state,
        userSelections: { ...state.userSelections, [qIndex]: aIndex },
        result: {
          correct: state.result.correct + (isCorrect ? 1 : 0),
          wrong: state.result.wrong + (isCorrect ? 0 : 1),
        },
      };
    }
    case "NEXT":
      return {
        ...state,
        index: Math.min(state.viewQuiz.length - 1, state.index + 1),
      };
    case "PREV":
      return { ...state, index: Math.max(0, state.index - 1) };
    case "SHUFFLE_CURRENT": {
      const newView = [...state.viewQuiz];
      newView[state.index] = {
        ...newView[state.index],
        a: rdArr([...newView[state.index].a]),
      };
      return { ...state, viewQuiz: newView };
    }
    case "SHUFFLE_ALL": {
      const shuffled = rdArr([...state.quiz]).map(q => ({
        ...q,
        a: rdArr([...q.a]),
      }));
      return {
        ...state,
        viewQuiz: shuffled,
        index: 0,
        userSelections: {},
        result: { correct: 0, wrong: 0 },
      };
    }
    case "GO_TO":
      return { ...state, index: action.payload };
    default:
      return state;
  }
}

const initQuizState = data => {
  const normalized = normalizeQuiz(data);
  return {
    quiz: normalized,
    viewQuiz: normalized,
    index: 0,
    userSelections: {},
    result: { correct: 0, wrong: 0 },
  };
};

/**
 * Custom Hook quản lý toàn bộ trạng thái và logic xử lý của bài trắc nghiệm.
 * @param {Array} initialData - Dữ liệu câu hỏi gốc.
 */
export function useQuiz(initialData) {
  const [state, dispatch] = useReducer(quizReducer, initialData, initQuizState);

  const currentQuestion = state.viewQuiz[state.index] || { a: [] };
  const selectedIndex = state.userSelections[state.index] ?? null;

  const selectAnswer = useCallback(
    aIndex => {
      if (selectedIndex !== null) return;
      dispatch({ type: "SELECT", payload: { qIndex: state.index, aIndex } });
      setTimeout(() => dispatch({ type: "NEXT" }), APP_CONFIG.AUTO_NEXT_DELAY);
    },
    [state.index, selectedIndex],
  );

  return {
    ...state,
    currentQuestion,
    selectedIndex,
    handleRandomAnswer: () => dispatch({ type: "SHUFFLE_CURRENT" }),
    handleRandomAll: () => dispatch({ type: "SHUFFLE_ALL" }),
    previous: () => dispatch({ type: "PREV" }),
    next: () => dispatch({ type: "NEXT" }),
    selectAnswer,
  };
}

/**
 * UTILITIES - Các hàm tiện ích chung dùng xuyên suốt ứng dụng
 * Tất cả các hàm phải là PURE FUNCTIONS (không side effects)
 */

import { VALIDATION, SCORING, TIME_CONFIG } from "./constants.js";

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

/**
 * Kiểm tra tên người dùng hợp lệ
 * @param {string} name - Tên cần kiểm tra
 * @returns {object} { isValid: boolean, error: string|null }
 */
export function validateName(name) {
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Tên không được để trống" };
  }

  const trimmed = name.trim();
  if (trimmed.length < VALIDATION.NAME_MIN_LENGTH) {
    return { isValid: false, error: "Tên quá ngắn" };
  }

  if (trimmed.length > VALIDATION.NAME_MAX_LENGTH) {
    return { isValid: false, error: "Tên quá dài" };
  }

  return { isValid: true, error: null };
}

/**
 * Kiểm tra giới hạn câu hỏi hợp lệ
 * @param {number} limit - Giới hạn cần kiểm tra
 * @param {number} maxQuestions - Tổng số câu hỏi
 * @returns {object} { isValid: boolean, error: string|null }
 */
export function validateQuestionLimit(limit, maxQuestions) {
  const num = Number(limit) || 0;

  if (num < 0) {
    return { isValid: false, error: "Giới hạn không được âm" };
  }

  if (num > maxQuestions) {
    return { isValid: false, error: `Giới hạn không vượt quá ${maxQuestions}` };
  }

  return { isValid: true, error: null };
}

/**
 * Kiểm tra thời gian giới hạn hợp lệ
 * @param {number} time - Thời gian (giây)
 * @returns {object} { isValid: boolean, error: string|null }
 */
export function validateTimeLimit(time) {
  const num = Number(time) || 0;

  if (num <= 0) {
    return { isValid: false, error: "Thời gian phải lớn hơn 0" };
  }

  return { isValid: true, error: null };
}

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

/**
 * Tính toán tiến độ (phần trăm)
 * @param {number} current - Câu hỏi hiện tại (0-indexed)
 * @param {number} total - Tổng số câu hỏi
 * @returns {number} Phần trăm (0-100)
 */
export function calculateProgress(current, total) {
  if (total === 0) return 0;
  return Math.round(((current + 1) / total) * 100);
}

/**
 * Tính điểm số
 * @param {number} correct - Số câu đúng
 * @param {number} total - Tổng số câu
 * @returns {number} Điểm (0-10)
 */
export function calculateScore(correct, total) {
  if (total === 0) return 0;
  const score = (correct / total) * SCORING.PERFECT_SCORE;
  return (
    Math.round(score * Math.pow(10, SCORING.SCORE_DECIMALS)) /
    Math.pow(10, SCORING.SCORE_DECIMALS)
  );
}

/**
 * Tính toán kết quả chi tiết
 * @param {object[]} selections - Mảng các lựa chọn
 * @param {object[]} quiz - Dữ liệu quiz
 * @returns {object} { correct, wrong, skipped, score, passed }
 */
export function calculateResults(selections = [], quiz = []) {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  selections.forEach((selection, index) => {
    if (selection === null || selection === undefined) {
      skipped++;
    } else if (quiz[index]?.correct === selection) {
      correct++;
    } else {
      wrong++;
    }
  });

  const score = calculateScore(correct, quiz.length);
  const passed = score >= SCORING.PASSING_SCORE;

  return { correct, wrong, skipped, score, passed };
}

/**
 * Định dạng thời gian (giây -> MM:SS)
 * @param {number} seconds - Số giây
 * @returns {string} Chuỗi thời gian (MM:SS)
 */
export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Chuyển đổi phút thành giây
 * @param {number} minutes - Số phút
 * @returns {number} Số giây
 */
export function minutesToSeconds(minutes) {
  return Math.max(0, Number(minutes) || 0) * 60;
}

/**
 * Chuyển đổi giây thành phút
 * @param {number} seconds - Số giây
 * @returns {number} Số phút
 */
export function secondsToMinutes(seconds) {
  return Math.round((seconds || 0) / 60);
}

// ============================================================
// STRING UTILITIES
// ============================================================

/**
 * Chuẩn hóa tên (trim và capitalize từ đầu)
 * @param {string} name - Tên cần chuẩn hóa
 * @returns {string} Tên đã chuẩn hóa
 */
export function normalizeName(name) {
  if (!name || typeof name !== "string") return "";

  return name
    .trim()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Hệ thống perc percent (phần trăm)
 * @param {number} correct - Số câu đúng
 * @param {number} total - Tổng câu
 * @returns {number} Phần trăm (0-100)
 */
export function calculatePercentage(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// ============================================================
// ARRAY UTILITIES
// ============================================================

/**
 * Xáo trộn mảng (Fisher-Yates algorithm)
 * @param {any[]} array - Mảng cần xáo trộn
 * @returns {any[]} Mảng mới đã xáo trộn
 */
export function shuffleArray(array) {
  if (!Array.isArray(array)) return [];

  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Lấy item từ mảng một cách an toàn
 * @param {any[]} array - Mảng
 * @param {number} index - Chỉ số
 * @param {any} defaultValue - Giá trị mặc định nếu không tìm thấy
 * @returns {any} Giá trị tại index hoặc defaultValue
 */
export function safeArrayGet(array, index, defaultValue = null) {
  if (!Array.isArray(array)) return defaultValue;
  if (index < 0 || index >= array.length) return defaultValue;
  return array[index] ?? defaultValue;
}

// ============================================================
// OBJECT UTILITIES
// ============================================================

/**
 * Deep merge hai object
 * @param {object} target - Object đích
 * @param {object} source - Object nguồn
 * @returns {object} Object đã merge
 */
export function mergeObjects(target = {}, source = {}) {
  const result = { ...target };

  Object.keys(source).forEach(key => {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = mergeObjects(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  });

  return result;
}

// ============================================================
// ERROR HANDLING
// ============================================================

/**
 * Tạo Error object an toàn
 * @param {string} message - Thông báo lỗi
 * @param {string} code - Mã lỗi
 * @returns {object} Error object
 */
export function createError(message, code = "UNKNOWN_ERROR") {
  return {
    message,
    code,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Xử lý lỗi an toàn
 * @param {Error|string} error - Lỗi cần xử lý
 * @returns {object} Error object chuẩn hóa
 */
export function handleError(error) {
  if (error instanceof Error) {
    return createError(error.message, "ERROR");
  }

  if (typeof error === "string") {
    return createError(error, "ERROR");
  }

  return createError("Đã xảy ra lỗi không xác định", "UNKNOWN_ERROR");
}

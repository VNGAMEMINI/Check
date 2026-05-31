/**
 * Chuẩn hóa dữ liệu quiz từ định dạng input thành định dạng chuẩn
 * @param {Array} data - Dữ liệu quiz từ JSON
 * @returns {Array} Mảng các quiz với định dạng chuẩn
 *
 * Format input:
 * { q: "text", img?: "file.png", a: ["ans1", "ans2"] or [{text, img, correct}], c: 0, explanation?: "text" }
 *
 * Format output:
 * { id, q, img, explanation, c, a: [{text, img, correct}] }
 */
export const normalizeQuiz = data => {
  return data.map((q, qIdx) => {
    // Xác định đáp án đúng từ field 'c' (index) hoặc field 'correct' (boolean)
    const rawCorrectIndex = q.a.findIndex(
      a => typeof a === "object" && a !== null && a.correct,
    );
    const correctIndex =
      q.c != null ? Number(q.c) : rawCorrectIndex >= 0 ? rawCorrectIndex : 0;

    return {
      id: qIdx,
      q: q.q || "",
      img: q.img || "",
      explanation: q.explanation || "Chưa có giải thích cho câu hỏi này.",
      c: correctIndex,
      a: q.a.map((ans, idx) => {
        // Xử lý cả format string và object
        const isObject = typeof ans === "object" && ans !== null;
        const answerImg = isObject ? ans.img : null;

        return {
          text: isObject ? ans.text || "" : String(ans),
          // Nếu không có img từ object, tạo tên ảnh tự động từ question img
          img: answerImg || (q.img ? `${idx}-${q.img}` : ""),
          correct: idx === correctIndex,
        };
      }),
    };
  });
};

/**
 * Xáo trộn mảng sử dụng Fisher-Yates shuffle
 */
export const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

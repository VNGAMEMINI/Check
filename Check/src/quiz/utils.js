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
export const normalizeQuiz = (data = []) => {
  if (!Array.isArray(data)) return [];

  return data.map((item, qIdx) => {
    const q = item && typeof item === "object" ? item : {};
    const answers = Array.isArray(q.a) ? q.a : [];

    let correctIndex = Number(q.c);

    if (
      Number.isNaN(correctIndex) ||
      correctIndex < 0 ||
      correctIndex >= answers.length
    ) {
      correctIndex = 0;
    }

    return {
      id: q.id ?? qIdx,
      q: q.q ?? "",
      img: q.img ?? "",
      e: q.e ?? "",
      c: correctIndex,

      a: answers.map((answer, idx) => ({
        text: answer == null ? "" : String(answer),

        // 0-html.png, 1-html.png, 2-html.png...
        img: q.img && typeof q.img === "string" ? `${idx}-${q.img}` : "",

        correct: idx === correctIndex,
      })),
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

export const QUIZ_STATES = {
  establish: "establish",
  assignment: "assignment",
  complete: "complete",
};

export const QUIZ_MODES = {
  FREE: "free",
  EXAM: "exam",
};

export const DEFAULT_SETTINGS = {
  [QUIZ_MODES.FREE]: {
    limit: 0,
    randomSen: false,
    randomAns: false,
    autoNext: true,
    timeTotal: 0,
  },
  [QUIZ_MODES.EXAM]: {
    limit: 0,
    randomSen: true,
    randomAns: true,
    autoNext: true,
    timeTotal: 45,
  },
};

export const CSS = {
  ESTABLISH: {
    CONTAINER: "establish-container",
    CARD: "card",
    TITLE: "title",
    SUBTITLE: "subtitle",
    FORM_GROUP: "form-group",
    INPUT_NAME: "input-name",
    MODE_SELECTOR: "mode-selector",
    MODE_TAB: "mode-tab",
    ACTIVE: "is-active",
    SETTINGS_SECTION: "settings-section",
    SETTING_ITEM: "setting-item",
    CHECKBOX_GROUP: "checkbox-group",
    HINT: "hint",
    BTN_START: "btn-start",
  },
  ASSIGNMENT: {
    CONTAINER: "assignment-container",
    HEADER: "assignment-header", // Header chứa thông tin chung
    STATS_BAR: "stats-bar", // Thanh hiển thị thống kê (đúng, sai, nguội)
    TEXT_SUCCESS: "text-success", // Màu chữ cho số câu đúng
    TEXT_DANGER: "text-danger", // Màu chữ cho số câu sai
    TEXT_MUTED: "text-muted", // Màu chữ cho số câu nguội
    PROGRESS_CONTAINER: "progress-container", // Container của thanh tiến độ
    PROGRESS_BAR: "progress-bar", // Thanh tiến độ
    TIMER_BAR: "timer-bar", // Thanh hiển thị thời gian
    QUESTION_SECTION: "question-section", // Phần chứa nội dung câu hỏi
    QUESTION_TEXT: "question-text", // Văn bản câu hỏi
    QUESTION_IMAGE: "question-image", // Hình ảnh câu hỏi
    ANSWER_LIST: "answer-list", // Danh sách các đáp án
    ANSWER_ITEM: "answer-item", // Mỗi đáp án
    SELECTED: "is-selected", // Class khi đáp án được chọn
    ANSWER_INDEX: "answer-index", // Chỉ số (A, B, C...) của đáp án
    ANSWER_TEXT: "answer-text", // Văn bản của đáp án
    TAG_GRID: "tag-grid", // Lưới các tag câu hỏi
    TAG_ITEM: "tag-item", // Mỗi tag câu hỏi
    TAG_ACTIVE: "is-active", // Tag của câu hỏi hiện tại
    TAG_BOOKMARK: "is-bookmarked", // Tag của câu hỏi đã đánh dấu
    TAG_ANSWERED: "is-answered", // Tag của câu hỏi đã trả lời
    TAG_NUMBER: "tag-number", // Số thứ tự trên tag
    TAG_LABEL: "tag-label", // Chữ cái đáp án đã chọn trên tag
    FOOTER_NAV: "footer-nav", // Thanh điều hướng dưới cùng
    BTN_NAV: "btn-nav", // Nút điều hướng (Trước, Tiếp)
    BTN_BOOKMARK: "btn-bookmark", // Nút đánh dấu/bỏ đánh dấu
    BTN_SUBMIT: "btn-submit", // Nút nộp bài
  },
  COMPLETE: {
    CONTAINER: "complete-container",
    CARD: "complete-card",
    STATUS: "status-text",
    MESSAGE: "message-text",
    SCORE_VAL: "score-value",
    STATS_GRID: "stats-grid",
    DETAIL_LIST: "detail-list",
    DETAIL_ITEM: "detail-item",
    SUCCESS: "is-success",
    DANGER: "is-danger",
    MUTED: "is-muted",
    WRONG_INFO: "wrong-info",
    BTN_RESTART: "btn-restart",
  },
};

export const TEXT = {
  ESTABLISH: {
    TITLE: "Thiết lập bài kiểm tra",
    SUBTITLE: "* Thiết lập thông tin trước khi vào bài kiểm tra",
    NAME_LABEL: "Tên của bạn:",
    NAME_PLACEHOLDER: "Nhập tên để lưu kết quả...",
    MODE_FREE: "TỰ DO",
    MODE_EXAM: "KIỂM TRA",
    SECTION_QUIZ: "* Tùy chọn bài thi",
    SECTION_TIME: "* Thời gian",
    LIMIT_LABEL: "Giới hạn câu hỏi (0 = tối đa):",
    RANDOM_SEN: "Xáo trộn câu hỏi",
    RANDOM_ANS: "Xáo trộn đáp án",
    AUTO_NEXT: "Tự động sang câu tiếp",
    TIME_TOTAL: "Tổng thời gian (phút):",
    TIME_UNLIMITED: "Không giới hạn",
    BTN_START: "BẮT ĐẦU LÀM BÀI",
  },
  ASSIGNMENT: {
    QUESTION: "Câu", // Thêm nhãn cho số câu hỏi
    CORRECT: "Đúng", // Đổi tên từ STATS_CORRECT
    WRONG: "Sai", // Đổi tên từ STATS_WRONG
    PENDING: "Nguội", // Đổi tên từ STATS_SKIPPED
    TOTAL_TIME: "Tổng thời gian",
    Q_TIME: "Thời gian câu", // Đổi tên từ QUESTION_TIME
    PREV: "Câu trước", // Đổi tên từ BTN_PREV
    NEXT: "Câu tiếp", // Đổi tên từ BTN_NEXT
    MARK: "Đánh dấu", // Đổi tên từ BOOKMARK
    UNMARK: "Bỏ đánh dấu", // Thêm nhãn bỏ đánh dấu
    SUBMIT: "Nộp bài", // Đổi tên từ BTN_SUBMIT
  },
  COMPLETE: {
    PASS: "ĐẠT",
    FAIL: "CHƯA ĐẠT",
    CONGRATS: "Chúc mừng bạn",
    GOODBYE: "Tạm biệt bạn",
    SCORE: "Điểm số",
    RESTART: "Bắt đầu lại",
    CORRECT: "đúng",
    WRONG: "sai",
    PENDING: "nguội",
    RESULT_TITLE: "Kết quả chi tiết",
    YOUR_ANS: "Bạn chọn",
    CORRECT_ANS: "Đáp án đúng",
  },
};

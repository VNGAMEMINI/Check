/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * O(n) time complexity
 */
function rdArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Normalize quiz data structure
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
 * Poser Quiz Application
 */
class Poser {
  constructor(container, data, titleH1, titleP) {
    this.container = container;
    this.data = normalizeQuiz(data);
    this.titleH1 = titleH1;
    this.titleP = titleP;

    // State
    this.quiz = [...this.data];
    this.index = 0;
    this.userSelections = {};
    this.result = { correct: 0, wrong: 0 };

    this.render();
  }

  handleRandomAnswer = () => {
    const newQuiz = [...this.quiz];
    newQuiz[this.index] = {
      ...newQuiz[this.index],
      a: rdArr([...newQuiz[this.index].a]),
    };
    this.quiz = newQuiz;
    this.render();
  };

  handleRandomAll = () => {
    this.quiz = rdArr([...this.data]).map(q => ({
      ...q,
      a: rdArr([...q.a]),
    }));
    this.index = 0;
    this.result = { correct: 0, wrong: 0 };
    this.userSelections = {};
    this.render();
  };

  previous = () => {
    this.index = Math.max(0, this.index - 1);
    this.render();
  };

  next = () => {
    this.index = Math.min(this.quiz.length - 1, this.index + 1);
    this.render();
  };

  handleAnswer = i => {
    const selectedIndex = this.userSelections[this.index];
    if (selectedIndex !== undefined) return;

    this.userSelections[this.index] = i;
    const ans = this.quiz[this.index].a[i];

    if (ans.correct) {
      this.result.correct++;
    } else {
      this.result.wrong++;
    }

    this.render();
    setTimeout(() => this.next(), 1500);
  };

  render() {
    const question = this.quiz[this.index] || { a: [] };
    const selectedIndex = this.userSelections[this.index] ?? null;
    const progressPercent = Math.round(
      ((this.index + 1) / this.quiz.length) * 100,
    );

    this.container.innerHTML = `
      <main class="poser">
        <div class="title">
          <h1 class="h1">${this.titleH1}</h1>
          <p>${this.titleP}</p>
        </div>

        <div class="progress">
          <div class="progress__a">
            <p>Câu ${this.index + 1} / ${this.quiz.length}</p>
            <p>Đúng: ${this.result.correct}</p>
            <p>Sai: ${this.result.wrong}</p>
          </div>
          <div class="progress__b">
            <p>tiến độ</p>
            <p>${progressPercent}%</p>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <div class="question">
          <h2 class="h2">
            <strong class="strong">Câu ${this.index + 1}:</strong>
            <em class="em"> ${question.q}</em>
          </h2>
          <div>
            <img src="./src/img/${question.img}" onerror="this.style.display='none'" />
          </div>
        </div>

        <div class="answer">
          ${question.a
            .map((ans, i) => {
              let className = "";
              if (selectedIndex !== null) {
                if (ans.correct) className = "is-correct";
                else if (i === selectedIndex) className = "is-wrong";
              }
              return `
              <span class="${className}">
                <button ${selectedIndex !== null ? "disabled" : ""}>
                  ${ans.text}
                </button>
                <img src="./src/img/${ans.img}" onerror="this.style.display='none'" />
              </span>
            `;
            })
            .join("")}
        </div>

        <div class="btn-group">
          <div>
            <button class="btn btn--random">xáo chộn</button>
            <button class="btn btn--random">Tất cả</button>
          </div>
          <div>
            <button class="btn">&lt;=</button>
            <button class="btn btn--nav">=&gt;</button>
          </div>
        </div>
      </main>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const answerButtons = this.container.querySelectorAll(".answer button");
    answerButtons.forEach((btn, i) => {
      btn.addEventListener("click", () => this.handleAnswer(i));
    });

    const btns = this.container.querySelectorAll(".btn-group .btn");
    btns[0].addEventListener("click", this.handleRandomAnswer);
    btns[1].addEventListener("click", this.handleRandomAll);
    btns[2].addEventListener("click", this.previous);
    btns[3].addEventListener("click", this.next);
  }
}

// Initialize
async function initApp() {
  const response = await fetch("./src/json/test.json");
  const data = await response.json();

  const app = document.getElementById("app");
  new Poser(app, data, "ngôn ngữ lập trình web", "có 3 câu hỏi");
}

document.addEventListener("DOMContentLoaded", initApp);

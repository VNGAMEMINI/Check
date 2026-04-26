import { memo } from "preact/compat";
import { useState } from "preact/hooks";
import { rdArr } from "../setting/setting.js";
import "./poser.scss";

// ─── Sub-components nên nằm ngoài để tránh re-create khi parent render ───

const Question = memo(({ index, q, img }) => (
  <div className="question">
    <h2 className="h2">
      <strong className="strong">Câu {index + 1}:</strong>
      <em className="em"> {q}</em>
    </h2>
    <div>
      <img
        src={`./src/img/${img}`}
        onError={e => {
          e.target.style.display = "none";
        }}
      />
    </div>
  </div>
));

const Answer = memo(({ a, selectedIndex, onAnswer }) => (
  <div className="answer">
    {a.map((ans, i) => {
      let className = "";
      if (selectedIndex !== null) {
        if (ans.correct) className = "yes";
        else if (i === selectedIndex) className = "no";
      }

      return (
        <span key={i} className={className}>
          <button disabled={selectedIndex !== null} onClick={() => onAnswer(i)}>
            {ans.text}
          </button>
          <img
            src={`./src/img/${ans.img}`}
            onError={e => (e.target.style.display = "none")}
          />
        </span>
      );
    })}
  </div>
));

const Progress = memo(({ index, total, result }) => {
  const progressPercent = Math.round(((index + 1) / total) * 100);
  return (
    <div className="progress">
      <div className="progress__a">
        <p>
          Câu {index + 1} / {total}
        </p>
        <p>Đúng: {result.correct}</p>
        <p>Sai: {result.wrong}</p>
      </div>
      <div className="progress__b">
        <p>tiến độ</p>
        <p>{progressPercent}%</p>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
});

const RandomBtn = memo(({ onClick, label }) => (
  <button className="btn" onClick={onClick}>
    {label}
  </button>
));

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

function Poser({ data, title_h1, title_p }) {
  /** */
  const [quiz] = useState(normalizeQuiz(data));
  /** */
  const [viewQuiz, setViewQuiz] = useState(quiz);
  /** */
  const [index, setIndex] = useState(0);
  /** */
  const question = viewQuiz[index] || { a: [] };
  /** */
  const [userSelections, setUserSelections] = useState({});
  /** */
  const selectedIndex = userSelections[index] ?? null;
  /** */
  const [result, setResult] = useState({
    correct: 0,
    wrong: 0,
  });

  const handleRandomAnswer = () => {
    const newQuiz = [...viewQuiz];
    newQuiz[index] = {
      ...newQuiz[index],
      a: rdArr([...newQuiz[index].a]),
    };
    setViewQuiz(newQuiz);
  };
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
  const previous = () => {
    setIndex(i => Math.max(0, i - 1));
  };
  const next = () => {
    setIndex(i => Math.min(viewQuiz.length - 1, i + 1));
  };

  const handleAnswer = i => {
    if (selectedIndex !== null) return;
    setUserSelections(prev => ({ ...prev, [index]: i }));
    const ans = question.a[i];
    if (ans.correct) {
      setResult(r => ({ ...r, correct: r.correct + 1 }));
    } else {
      setResult(r => ({ ...r, wrong: r.wrong + 1 }));
    }
    setTimeout(next, 1000);
  };

  return (
    <main className="poser">
      <div className="title">
        <h1 className="h1">{title_h1}</h1>
        <p>{title_p}</p>
      </div>

      <Progress index={index} total={viewQuiz.length} result={result} />

      <Question index={index} q={question.q} img={question.img} />

      <Answer
        a={question.a || []}
        selectedIndex={selectedIndex}
        onAnswer={handleAnswer}
      />

      <div className="btn-group">
        <div>
          <RandomBtn onClick={handleRandomAnswer} label="xáo chộn" />
          <RandomBtn onClick={handleRandomAll} label="Tất cả" />
        </div>

        <div>
          <RandomBtn onClick={previous} label="<=" />
          <RandomBtn onClick={next} label="=>" />
        </div>
      </div>
    </main>
  );
}

export default memo(Poser);

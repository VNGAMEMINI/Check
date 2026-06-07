//? ------------------------------------------------------------
import { memo, useState, useMemo, useCallback } from "react";
import { ADQuiz } from "../quiz/ADQuiz.js";
import { QUIZ_STATES } from "./config/constants.js";
import Establish from "./_Establish.jsx";
import Assignment from "./_Assignment.jsx";
import Complete from "./_Complete.jsx";
//? ------------------------------------------------------------

function Poser({ data = [] }) {
  const quiz = useMemo(() => new ADQuiz(data), [data]);
  const [step, setStep] = useState(QUIZ_STATES.establish);

  if (step === QUIZ_STATES.establish) {
    return (
      <Establish quiz={quiz} onStep={() => setStep(QUIZ_STATES.assignment)} />
    );
  }

  if (step === QUIZ_STATES.assignment) {
    return (
      <Assignment
        quiz={quiz}
        onComplete={() => setStep(QUIZ_STATES.complete)}
      />
    );
  }

  if (step === QUIZ_STATES.complete) {
    return (
      <Complete quiz={quiz} onStep={() => setStep(QUIZ_STATES.establish)} />
    );
  }

  return null;
}

export default memo(Poser);
Poser.displayName = "Poser";

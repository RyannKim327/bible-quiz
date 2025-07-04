import { useEffect, useState } from "react";
import core, { gather, type quiz } from "../utils/core";

export default function Base() {
  const totalTime = 90;

  const [questions, setQuestions] = useState<quiz[]>([]);
  const [pattern, setPattern] = useState<number[]>([]);
  const [n, setNumber] = useState<number>(-1);
  const [question, setQuestion] = useState<quiz>();
  const [qAnswer, setqAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [toggleLoad, setToggleLoad] = useState(0);
  const [time, setTime] = useState(totalTime);

  const reset = () => {
    console.log("Reset");
    if (time < totalTime) setTime((prev) => (prev >= 5 ? prev - 5 : 0));
    return;
  };

  useEffect(() => {
    const isVis = () => {
      if (document.hidden || !window.focus) {
        reset();
      }
    };
    document.addEventListener("visibilitychange", isVis);
    return () => {
      document.removeEventListener("visibilitychange", isVis);
    };
  }, [document.hidden]);

  useEffect(() => {
    (async () => {
      const q = await gather();
      setQuestions(q);
    })();
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    const p: number[] = [];
    for (let i = 0; i < questions.length; i++) {
      let x = Math.floor(Math.random() * questions.length);
      while (p.includes(x)) {
        x = Math.floor(Math.random() * questions.length);
      }
      p.push(x);
    }
    setPattern(p);
  }, [questions, toggleLoad]);

  useEffect(() => {
    setTimeout(() => {
      if (pattern.length && n === -1) {
        setNumber(0);
        setQuestion(questions[pattern[0]]);
      }
    }, 10000);
  }, [pattern]);

  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms * 1000));

  useEffect(() => {
    // TODO: Time Control

    if (n < 0) return;

    if (pattern.length <= n) {
      setGameover(true);
      setTime(0);
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameover(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [n, toggleLoad, pattern]);

  const answer = () => {
    // TODO: To clear all stuffs
    if (gameover && pattern.length) {
      setPattern([]);
      setNumber(0);
      setqAnswer("");
      setScore(0);
      setTime(totalTime);
      setGameover(false);
      setToggleLoad(Math.floor(Math.random() * 999999999) + 1);
      return;
    }

    // TODO: Check if the answer is correct or not
    if (n < pattern.length && question) {
      const verif = core(question, qAnswer, questions);

      if (verif) {
        setScore((prev) => prev + 1);
      }
      if (n < pattern.length) {
        if (qAnswer.length > 5 && time < totalTime) {
          setTime((prev) => prev + 2);
        }
        const next = n + 1;
        setNumber(next);

        if (questions[pattern[next]]) {
          setQuestion(questions[pattern[next]]);
        }
      } else {
        setGameover(true);
      }
    }
    setqAnswer("");
  };

  return (
    <div
      // onBlur={reset}
      className="flex flex-col md:w-3/4 md:h-3/4 w-full h-full dark:text-white dark:bg-slate-700 dark:bg-linear-br dark:bg-linear-300 dark:from-slate-900 dark:to-slate-700 dark:shadow-slate-700 to-150% rounded-md shadow-2xl shadow-gray-300 p-4"
    >
      <div className="flex justify-between">
        <h3 className="text-center text-xl">
          {n >= 0 ? `Question #${n + 1} ` : "Bible Quiz Game"}
        </h3>
        <h3 className="text-center text-xl">Time: {time}</h3>
      </div>
      <div className="flex flex-col p-10 md:p-0 h-full w-full justify-center items-center box-border">
        <h3 className="text-xl md:text-3xl text-center">
          {!gameover
            ? (question?.qe ?? "Please Read")
            : `Your Score: ${score} `}
        </h3>
        <h3 className="text-md md:text-lg italic text-center">
          {!gameover
            ? (question?.qt ??
              `This was an identification Bible Game, the english translation was based on KJV and, the tagalog is based on Magandang Balita Bibliya with some modification which based on the translation from the KJV, I have personal reason why, its something related to bible also, which you may notice.If the answers are noun, please answer based on the actual characters, it is case sensitive.You only have ${totalTime} seconds, and may deducted based on your behaviour.Also, the system may add some time randomly as consideration for answers.Please don't cheat. By the way If ever you have some complains about the game, you may message us on facebook.com/MPOP.2016.`)
            : ""}
        </h3>
      </div>
      <div className="flex w-full border-white border-2 border-solid rounded-xl overflow-hidden">
        <input
          disabled={gameover || n >= pattern.length}
          value={qAnswer}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setqAnswer(e.currentTarget.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              answer();
            }
          }}
          type="text"
          className="px-2 md:text-md py-2 outline-none box-sizing w-full"
          placeholder="Answer"
        />
        <button
          onClick={answer}
          className="bg-slate-700 text-white dark:text-black dark:bg-white px-2  md:text-xl w-50"
        >
          {gameover ? "Try Again" : qAnswer.length > 0 ? "Answer" : "Next"}
        </button>
      </div>
      <input
        className="w-full h-2 bg-slate-700 rounded-lg range-sm my-2"
        readOnly={true}
        value={(time / totalTime) * 100}
        type="range"
      />
    </div>
  );
}

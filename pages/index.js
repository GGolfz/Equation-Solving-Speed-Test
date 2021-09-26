import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [start, setStart] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  let labels = ["X", "Y", "Z", "W"];
  const [state, setState] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    getDataRange();
  }, []);
  useEffect(() => {
    if (start) {
      let x = setInterval(() => {
        setTime((time) => time + 0.1);
      }, 100);
      setTimer(x);
    } else {
      clearInterval(timer);
      setTimer(null);
    }
  }, [start]);
  const getDataRange = () => {
    let arr = [];
    for (let i = -5; i <= 5; i += 0.25) {
      if (Number.isInteger(i)) {
        arr.push(i);
        arr.push(i);
        arr.push(i);
        arr.push(i);
      }
      arr.push(i);
    }
    setData(arr);
  };
  const generateQuestion = () => {
    setShowSolution(false);
    setStart(true);
    setTime(0);
    let solutions = [];
    let dimension = Math.floor(Math.random() * 100) % 10;
    if (dimension % 3 == 0) {
      dimension = 2;
    } else if (dimension % 5 == 0) {
      dimension = 4;
    } else {
      dimension = 3;
    }
    for (let i = 0; i < dimension; i++) {
      solutions.push(data[Math.floor(Math.random() * 100) % data.length]);
    }
    let questions = [];
    for (let i = 0; i < dimension; i++) {
      let temp = [];
      let answer = 0;
      for (let j = 0; j < dimension; j++) {
        let v = (Math.floor(Math.random() * 100) % 11) - 5;
        temp.push(v);
        answer += v * solutions[j];
      }
      temp.push(answer);
      questions.push(temp);
    }
    setQuestions(questions);
    console.log(solutions);
    setSolutions(solutions);
  };
  const renderQuestionsMatrix = () => {
    let renderer = [];
    for (let i = 0; i < questions.length; i++) {
      let temp = [];
      for (let j = 0; j < questions[i].length; j++) {
        temp.push(<td key={"questions-" + i + "," + j}>{questions[i][j]}</td>);
      }
      renderer.push(<tr key={"questions-" + i}>{temp}</tr>);
    }
    return (
      <table>
        <tbody>{renderer}</tbody>
      </table>
    );
  };
  const renderSolutionForm = () => {
    let renderer = [];
    for (let i = 0; i < questions.length; i++) {
      renderer.push(
        <div key={"solution-" + labels[i]}>
          {labels[i]}: <input type="text" id={labels[i]} name={labels[i]} />
        </div>
      );
    }
    renderer.push(
      <div key="buttons">
        <button onClick={submitSolution}>Submit</button>
        <button onClick={toggleShowSolution}>Show Solution</button>
      </div>
    );
    return renderer;
  };
  const renderSolutions = () => {
    let renderer = [];
    for (let i = 0; i < questions.length; i++) {
      renderer.push(
        <div key={"solution-key-" + labels[i]}>
          {labels[i]}: {solutions[i]}
        </div>
      );
    }
    return renderer;
  };
  const toggleShowSolution = () => {
    setStart(false);
    setShowSolution(true);
    setState("solution");
  };
  const submitSolution = () => {
    setStart(false);
    let check = true;
    for (let i = 0; i < questions.length; i++) {
      let label = labels[i];
      let value = document.getElementById(label).value;
      document.getElementById(label).value = "";
      if (value != solutions[i]) {
        check = false;
        break;
      }
    }
    if (check) {
      setState(true);
      setScore((score) => score + 1);
    } else {
      setState(false);
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Linear Speed Test</title>
        <meta name="description" content="Linear Speed Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Equation Solving Speed Test !</h1>
        <h3>Score: {score}</h3>
        <h3>Time: {time.toFixed(1)}</h3>
        {!start ? (
          <Fragment>
            {state != null ? (
              <Fragment>
                {renderQuestionsMatrix()}
                {state == "solution" ? null : (
                  <h4>{state == true ? "Correct" : "Wrong"}</h4>
                )}
                <div>{renderSolutions()}</div>
              </Fragment>
            ) : null}
            <button onClick={generateQuestion}>generate</button>
          </Fragment>
        ) : (
          <Fragment>
            {questions.length > 0 ? (
              <Fragment>
                {renderQuestionsMatrix()}
                {!showSolution ? renderSolutionForm() : renderSolutions()}
              </Fragment>
            ) : null}
          </Fragment>
        )}
      </main>
    </div>
  );
}

import React, { useRef, useEffect, useState, type FC, useReducer } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheckSquare,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Question {
  id: string;
  question: string;
  options: Option[];
}
interface Option {
  option: string;
  isCorrect: boolean;
}

type ReducerTypes =
  | { type: "set"; payload: Question[] }
  | { type: "addQuestion"; payload?: number } // doesn't need payload
  | { type: "removeQuestion"; payload: number }
  | { type: "setQuestion"; payload: [number, string] }
  | { type: "upQuestion"; payload: number }
  | { type: "downQuestion"; payload: number }
  | { type: "addOption"; payload: number }
  | { type: "removeOption"; payload: [number, number] }
  | { type: "setOption"; payload: [number, number, string] }
  | { type: "toggleIsCorrectOption"; payload: [number, number] };

const Question: FC<{
  question: Question;
  idx: number;
  dispatch: React.Dispatch<ReducerTypes>;
  canDelete: boolean;
}> = ({ question, idx, dispatch, canDelete }) => {
  const [parent] = useAutoAnimate();

  return (
    <div className="divide-y divide-gray-300 rounded-xl bg-gray-200 p-2 shadow-sm">
      <div className="flex items-center gap-2 p-2">
        <h1 className="text-xl font-bold">{idx + 1}</h1>
        <label
          htmlFor="question"
          className="hidden text-xl font-bold md:inline"
        >
          Question:
        </label>
        <input
          value={question.question}
          onChange={(e) =>
            dispatch({ type: "setQuestion", payload: [idx, e.target.value] })
          }
          id="question"
          placeholder="Enter question..."
          className="w-full grow bg-transparent text-xl focus:outline-none"
        />
        <div className="flex gap-2 md:gap-8">
          {canDelete && (
            <button
              onClick={() => dispatch({ type: "removeQuestion", payload: idx })}
            >
              <FaTrashAlt />
            </button>
          )}

          <button
            onClick={() => dispatch({ type: "upQuestion", payload: idx })}
          >
            <FaArrowDown />
          </button>
          <button
            onClick={() => dispatch({ type: "downQuestion", payload: idx })}
          >
            <FaArrowUp />
          </button>
        </div>
      </div>
      <div ref={parent} className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
        {question.options.map((option, optionIdx) => (
          <div
            key={optionIdx}
            className={`flex gap-4 rounded-md bg-gray-300 p-4 ring ring-inset transition-all ${
              option.isCorrect ? "ring-green-600" : "ring-transparent"
            }`}
          >
            <button
              onClick={() =>
                dispatch({
                  type: "toggleIsCorrectOption",
                  payload: [idx, optionIdx],
                })
              }
            >
              <FaCheckSquare
                className={`h-full w-auto transition-colors  ${
                  option.isCorrect ? "fill-green-600" : ""
                }`}
              />
            </button>

            <input
              onChange={(e) =>
                dispatch({
                  type: "setOption",
                  payload: [idx, optionIdx, e.target.value],
                })
              }
              value={question.options[optionIdx]?.option}
              placeholder="Enter option..."
              className="w-full grow bg-transparent text-xl focus:outline-none"
            />
            {optionIdx > 1 && (
              <button
                onClick={() =>
                  dispatch({ type: "removeOption", payload: [idx, optionIdx] })
                }
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        ))}
        {question.options.length < 4 && (
          <button
            onClick={() => dispatch({ type: "addOption", payload: idx })}
            className="flex justify-center rounded-md bg-gray-300 p-5"
          >
            <FaPlus />
          </button>
        )}
      </div>
    </div>
  );
};

interface createForm {
  title: string;
  desc: string;
  questions: Question[];
}
const Create = () => {
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [parent] = useAutoAnimate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [questions, dispatch] = useReducer(
    (state: Question[], { type, payload }: ReducerTypes): Question[] => {
      switch (type) {
        case "set":
          return payload;
        case "addQuestion":
          return [
            ...state,
            {
              id: new Date().getTime().toString(),
              question: "",
              options: [
                { option: "", isCorrect: false },
                { option: "", isCorrect: false },
              ],
            },
          ];
        case "removeQuestion":
          return state.filter((_, i) => i !== payload);
        case "setQuestion":
          return state.map((question, i) => {
            if (i === payload[0]) {
              return {
                ...question,
                question: payload[1],
              };
            }
            return question;
          });
        case "upQuestion":
          if (!state[payload + 1] || !state[payload]) return state;
          const newState2 = [...state];
          const temp2 = newState2[payload] as Question;
          newState2[payload] = newState2[payload + 1] as Question;
          newState2[payload + 1] = temp2;
          return newState2;
        case "downQuestion":
          if (!state[payload - 1] || !state[payload]) return state;
          const newState = [...state];
          const temp = newState[payload] as Question;
          newState[payload] = newState[payload - 1] as Question;
          newState[payload - 1] = temp;
          return newState;
        case "addOption":
          return state.map((question, i) => {
            if (i === payload) {
              return {
                ...question,
                options: [
                  ...question.options,
                  { option: "", isCorrect: false },
                ],
              };
            }
            return question;
          });
        case "removeOption":
          return state.map((question, i) => {
            if (i === payload[0]) {
              return {
                ...question,
                options: question.options.filter((_, i) => i !== payload[1]),
              };
            }
            return question;
          });
        case "setOption":
          return state.map((question, i) => {
            if (i === payload[0]) {
              return {
                ...question,
                options: question.options.map((option, j) => {
                  if (j === payload[1]) {
                    return {
                      ...option,
                      option: payload[2],
                    };
                  }
                  return option;
                }),
              };
            }
            return question;
          });
        case "toggleIsCorrectOption":
          return state.map((question, i) => {
            if (i === payload[0]) {
              return {
                ...question,
                options: question.options.map((option, j) => {
                  if (j === payload[1]) {
                    return {
                      ...option,
                      isCorrect: !option.isCorrect,
                    };
                  }
                  return option;
                }),
              };
            }
            return question;
          });

        default:
          return state;
      }
    },
    [
      {
        id: new Date().getTime().toString(),
        question: "",
        options: [
          { option: "", isCorrect: false },
          { option: "", isCorrect: false },
        ],
      },
    ]
  );

  useEffect(() => {
    if (sessionStorage.getItem("quizityCreateForm")) {
      const createForm = JSON.parse(
        sessionStorage.getItem("quizityCreateForm") as string
      ) as createForm;
      setTitle(createForm.title);
      setDesc(createForm.desc);
      dispatch({ type: "set", payload: createForm.questions });
    }
  }, []);
  useEffect(() => {
    if (
      title === "" &&
      desc === "" &&
      questions.length === 1 &&
      questions[0]?.question === ""
    ) {
      return;
    }
    sessionStorage.setItem(
      "quizityCreateForm",
      JSON.stringify({ title, desc, questions })
    );
  }, [title, desc, questions]);
  useEffect(() => {
    if (descRef.current) {
      descRef.current.style.height = "0px";
      descRef.current.style.height =
        descRef.current.scrollHeight.toString() + "px";
    }
  }, [desc]);

  return (
    <div className="space-y-16">
      <h1 className="text-4xl font-bold md:text-5xl">Create new quiz</h1>
      <div className="w-[min(600px,100%)] space-y-8">
        <div className="flex flex-col gap-4">
          <label htmlFor="title" className="text-xl font-bold">
            Title
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            id="title"
            placeholder="Enter a title"
            className="border-b-2 bg-transparent text-xl transition-colors focus:border-indigo-600 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="description" className="text-xl font-bold">
            Description
          </label>
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            value={desc}
            ref={descRef}
            id="description"
            placeholder="Enter a description"
            className="resize-none overflow-hidden border-b-2 bg-transparent text-xl transition-colors focus:border-indigo-600 focus:outline-none"
          />
        </div>
      </div>
      <h1 className="text-4xl font-bold md:text-5xl">Questions:</h1>
      <div ref={parent} className="flex flex-col gap-8">
        {questions.map((question, idx) => (
          <Question
            key={question.id}
            idx={idx}
            question={question}
            dispatch={dispatch}
            canDelete={questions.length > 3}
          />
        ))}
        <button
          onClick={() => dispatch({ type: "addQuestion" })}
          className="mx-auto rounded-full bg-indigo-600 p-4 hover:bg-indigo-500"
        >
          <FaPlus className="fill-white" />
        </button>
        <button className="my-8 mb-16 rounded-xl bg-indigo-600 p-4 font-bold text-white hover:bg-indigo-500 md:ml-auto md:w-1/3">
          Create
        </button>
      </div>
    </div>
  );
};

export default Create;

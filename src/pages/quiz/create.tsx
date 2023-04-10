/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef, useEffect, useState, type FC, useReducer } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheckSquare,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api } from "~/utils/api";
import { z } from "zod";
import Loading from "~/components/UI/Loading";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

interface Question {
  key: number;
  question: string;
  options: Option[];
  error: string | null;
}
interface Option {
  key: number;
  option: string;
  isCorrect: boolean;
  error: string | null;
}

type ReducerTypes =
  | { type: "set"; payload: formState }
  | { type: "setTitle"; payload: string }
  | { type: "setDescription"; payload: string }
  | { type: "addQuestion"; payload?: number } // doesn't need payload
  | { type: "removeQuestion"; payload: number }
  | { type: "setQuestion"; payload: [number, string] }
  | { type: "upQuestion"; payload: number }
  | { type: "downQuestion"; payload: number }
  | { type: "addOption"; payload: number }
  | { type: "removeOption"; payload: [number, number] }
  | { type: "setOption"; payload: [number, number, string] }
  | { type: "toggleIsCorrectOption"; payload: [number, number] }
  | {
      type: "setQuestionErrors";
      payload: { path: [number, number?]; message: string }[];
    };

const Question: FC<{
  question: Question;
  idx: number;
  dispatch: React.Dispatch<ReducerTypes>;
  canDelete: boolean;
}> = ({ question, idx, dispatch, canDelete }) => {
  const [parent] = useAutoAnimate();

  return (
    <div>
      <div className="divide-y divide-gray-300 rounded-xl border bg-gray-200 p-2 shadow-sm">
        <div className="flex items-center gap-2 p-2">
          <h1 className="text-xl font-bold">{idx + 1}</h1>
          <label
            htmlFor={"question" + idx.toString()}
            className="hidden text-xl font-bold md:inline"
          >
            Question:
          </label>
          <input
            value={question.question}
            onChange={(e) =>
              dispatch({ type: "setQuestion", payload: [idx, e.target.value] })
            }
            id={"question" + idx.toString()}
            placeholder="Enter question..."
            className="w-full grow bg-transparent text-xl focus:outline-none"
          />
          <div className="flex gap-2 md:gap-8">
            {canDelete && (
              <button
                onClick={() =>
                  dispatch({ type: "removeQuestion", payload: idx })
                }
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
              key={option.key}
              className={`flex h-12 items-center gap-4 rounded-md bg-gray-300 px-4 ring ring-inset transition-all ${
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
                  className={`h-full transition-colors ${
                    option.isCorrect ? "fill-green-600" : "ring-transparent"
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
                className={`w-full bg-transparent text-xl placeholder:text-gray-500 focus:outline-none ${
                  option.error
                    ? "border-b-2 border-red-500 placeholder:text-red-500"
                    : ""
                }`}
              />

              {question.options.length > 2 && (
                <button
                  onClick={() =>
                    dispatch({
                      type: "removeOption",
                      payload: [idx, optionIdx],
                    })
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
              className="flex h-12 items-center justify-center rounded-md bg-gray-300 px-4"
            >
              <FaPlus />
            </button>
          )}
        </div>
      </div>
      <span className="block p-2 text-red-500">{question.error}</span>
    </div>
  );
};

interface formState {
  title: string;
  description: string;
  questions: Question[];
}
const Create = () => {
  const descRef = useRef<HTMLTextAreaElement>(null);
  const { data: sessionData } = useSession();
  const [parent] = useAutoAnimate();
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [formState, dispatch] = useReducer(
    (state: formState, { type, payload }: ReducerTypes): formState => {
      state = {
        ...state,
        questions: state.questions.map((question): Question => {
          return {
            ...question,
            error: null,
            options: question.options.map((option): Option => {
              return { ...option, error: null };
            }),
          };
        }),
      };
      switch (type) {
        case "set":
          return payload;
        case "setTitle":
          setTitleError(null);
          return { ...state, title: payload };
        case "setDescription":
          setDescError(null);
          return { ...state, description: payload };
        case "addQuestion":
          return {
            ...state,
            questions: [
              ...state.questions,
              {
                key: new Date().getTime(),
                question: "",
                error: null,
                options: [
                  {
                    option: "",
                    isCorrect: false,
                    key: new Date().getTime() + 1,
                    error: null,
                  },
                  {
                    option: "",
                    isCorrect: false,
                    key: new Date().getTime(),
                    error: null,
                  },
                ],
              },
            ],
          };
        case "removeQuestion":
          return {
            ...state,
            questions: state.questions.filter((_, i) => i !== payload),
          };
        case "setQuestion":
          return {
            ...state,
            questions: state.questions.map((question, i) => {
              if (i === payload[0]) {
                return {
                  ...question,
                  question: payload[1],
                };
              }
              return question;
            }),
          };
        case "upQuestion":
          if (!state.questions[payload + 1] || !state.questions[payload])
            return state;
          const newQuestions2 = [...state.questions];
          const temp2 = newQuestions2[payload] as Question;
          newQuestions2[payload] = newQuestions2[payload + 1] as Question;
          newQuestions2[payload + 1] = temp2;
          return { ...state, questions: newQuestions2 };
        case "downQuestion":
          if (!state.questions[payload - 1] || !state.questions[payload])
            return state;
          const newQuestions = [...state.questions];
          const temp = newQuestions[payload] as Question;
          newQuestions[payload] = newQuestions[payload - 1] as Question;
          newQuestions[payload - 1] = temp;
          return { ...state, questions: newQuestions };
        case "addOption":
          return {
            ...state,
            questions: state.questions.map((question, i) => {
              if (i === payload) {
                return {
                  ...question,
                  error: null,
                  options: [
                    ...question.options,
                    {
                      option: "",
                      key: new Date().getTime(),
                      isCorrect: false,
                      error: null,
                    },
                  ],
                };
              }
              return question;
            }),
          };
        case "removeOption":
          return {
            ...state,
            questions: state.questions.map((question, i) => {
              if (i === payload[0]) {
                return {
                  ...question,
                  options: question.options.filter((_, i) => i !== payload[1]),
                };
              }
              return question;
            }),
          };
        case "setOption":
          return {
            ...state,
            questions: state.questions.map((question, i) => {
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
            }),
          };
        case "toggleIsCorrectOption":
          return {
            ...state,
            questions: state.questions.map((question, i) => {
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
            }),
          };
        case "setQuestionErrors":
          const newQuestions3 = { ...state };
          payload.forEach((error) => {
            if (
              error.path.length === 1 &&
              newQuestions3.questions[error.path[0]]
            ) {
              newQuestions3.questions[error.path[0]]!.error = error.message;
            } else if (
              error.path.length === 2 &&
              newQuestions3.questions[error.path[0]]!.options[error.path[1]!]!
            ) {
              newQuestions3.questions[error.path[0]]!.options[
                error.path[1]!
              ]!.error = error.message;
            }
          });
          return newQuestions3;

        default:
          return state;
      }
    },
    {
      title: "",
      description: "",
      questions: [1, 2, 3].map((_, idx) => ({
        key: new Date().getTime() + idx,
        question: "",
        error: null,
        options: [
          {
            option: "",
            isCorrect: false,
            key: new Date().getTime() + 1,
            error: null,
          },
          {
            option: "",
            isCorrect: false,
            key: new Date().getTime(),
            error: null,
          },
        ],
      })),
    }
  );
  const router = useRouter();
  useEffect(() => {
    if (descRef.current) {
      descRef.current.style.height = "0px";
      descRef.current.style.height =
        descRef.current.scrollHeight.toString() + "px";
    }
  }, [formState.description]);
  const { mutateAsync: create, isLoading } = api.quiz.create.useMutation();

  const createHandler = async () => {
    const parsedForm = z
      .object({
        title: z.string().min(5, "Title must contain at least 5 characters"),
        description: z
          .string()
          .min(5, "Description must contain at least 5 characters"),
        questions: z
          .array(
            z.object({
              question: z.string().min(1, "Question title is missing"),
              options: z
                .array(
                  z.object({
                    option: z.string().min(1, "Option title is missing"),
                    isCorrect: z.boolean(),
                  })
                )
                .min(2, "Question must contain at least 2 options")
                .refine(
                  (options) => options.some((option) => option.isCorrect),
                  {
                    message: "At least one option must be correct",
                  }
                ),
            })
          )
          .min(3, "Quiz must contain at least 3 questions"),
      })
      .safeParse(formState);
    if (parsedForm.success) {
      const res = await create(parsedForm.data);
      void router.replace(`/quiz/${res.id}`);
    } else {
      const questionErrors: {
        path: [number, number?];
        message: string;
      }[] = [];
      parsedForm.error.issues.forEach((issue) => {
        issue.path[0] === "title" && setTitleError(issue.message);
        issue.path[0] === "description" && setDescError(issue.message);
        issue.path[0] === "questions" &&
          questionErrors.push({
            path: issue.path.filter((p) => typeof p === "number") as [
              number,
              number?
            ],
            message: issue.message,
          });
      });
      window.scrollTo(0, 0);
      dispatch({ type: "setQuestionErrors", payload: questionErrors });
    }
  };

  if (sessionData === undefined) return <div />;
  if (sessionData === null) return signIn();
  return (
    <div className="space-y-16">
      <h1 className="text-4xl font-bold md:text-5xl">Create new quiz</h1>
      <div className="w-[min(600px,100%)] space-y-8">
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-4 text-xl font-bold">
            Title
          </label>
          <input
            onChange={(e) =>
              dispatch({ type: "setTitle", payload: e.target.value })
            }
            value={formState.title}
            type="text"
            id="title"
            placeholder="Enter a title"
            className={`border-b-2 bg-transparent text-xl transition-colors focus:outline-none ${
              titleError ? "border-red-500" : "focus:border-indigo-600"
            }`}
          />
          <span className="text-red-500">{titleError}</span>
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-4 text-xl font-bold">
            Description
          </label>
          <textarea
            onChange={(e) =>
              dispatch({ type: "setDescription", payload: e.target.value })
            }
            onKeyDown={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            value={formState.description}
            ref={descRef}
            id="description"
            placeholder="Enter a description"
            className={`resize-none overflow-hidden border-b-2 bg-transparent text-xl transition-colors  focus:outline-none ${
              descError ? "border-red-500" : "focus:border-indigo-600"
            } `}
          />
          <span className="text-red-500">{descError}</span>
        </div>
      </div>
      <h1 className="text-4xl font-bold md:text-5xl">Questions:</h1>
      <div ref={parent} className="flex flex-col gap-8">
        {formState.questions.map((question, idx) => (
          <Question
            key={question.key}
            idx={idx}
            question={question}
            dispatch={dispatch}
            canDelete={formState.questions.length > 3}
          />
        ))}
        <button
          onClick={() => dispatch({ type: "addQuestion" })}
          className="mx-auto rounded-full bg-indigo-600 p-4 hover:bg-indigo-500"
        >
          <FaPlus className="fill-white" />
        </button>
        <button
          className="my-8 mb-16 rounded-xl bg-indigo-600 p-4 font-bold text-white hover:bg-indigo-500 md:ml-auto md:w-1/3"
          onClick={() => void createHandler()}
        >
          {isLoading ? <Loading className="mx-auto h-8" /> : "Create"}
        </button>
      </div>
    </div>
  );
};

export default Create;

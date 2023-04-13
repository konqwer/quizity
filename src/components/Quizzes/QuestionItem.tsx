import React, { type FC } from "react";

const QuestionItem: FC<{
  question: {
    question: string;
    options: { option: string; isCorrect?: boolean; isPicked?: boolean }[];
  };
}> = ({ question }) => {
  return (
    <div className="divide-y divide-gray-300 rounded-md p-4 ring-4 ring-inset ring-gray-200">
      <h1 className="px-2 text-2xl font-bold">{question.question}</h1>
      <div className="grid grid-rows-2 gap-2 p-2">
        {question.options.map((option, idx) => (
          <div key={option.option + idx.toString()}>
            <h2>
              <span className="mr-2 font-bold">
                {["A", "B", "C", "D"][idx]}.
              </span>
              <span
                className={`text-xl font-semibold  ${
                  option.isCorrect
                    ? "text-green-500 underline"
                    : "text-gray-600"
                } ${
                  option.isPicked && !option.isCorrect ? "text-red-500" : ""
                }`}
              >
                {option.option}
              </span>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionItem;

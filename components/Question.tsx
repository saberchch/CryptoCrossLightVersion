'use client';

import React from 'react';
import { Question as QuestionType } from '../lib/quiz';

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
  showResult?: boolean;
  onNext?: () => void;
  progress?: number;
  isSubmitting?: boolean; // <-- added prop
}

export default function Question({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  onNext,
  progress = 0,
  isSubmitting = false // <-- default false
}: QuestionProps) {
  const isAnswered = selectedAnswer !== undefined;
  const progressPercentage = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="bg-[#1a1a23] rounded-xl shadow-lg p-6 space-y-6 transition-all">
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-yellow-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-gray-300 text-sm font-medium">{`Question ${questionNumber} of ${totalQuestions}`}</p>

      {/* Question */}
      <h2 className="text-xl font-semibold text-white">{question.question}</h2>
      <p className="text-gray-400 text-sm">Select the best answer</p>

      {/* Options */}
      <div className="grid gap-4 mt-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showResult && index === question.correctAnswer;
          const isWrong = showResult && isSelected && selectedAnswer !== question.correctAnswer;

          return (
            <button
              key={index}
              onClick={() => !showResult && onAnswerSelect(question.id, index)}
              disabled={showResult || isSubmitting}
              className={`
                w-full text-left px-4 py-3 rounded-lg border transition
                ${isSelected && !showResult ? 'border-yellow-500 bg-yellow-500/20' : 'border-gray-600 bg-[#14141c]'}
                ${isCorrect ? 'bg-green-600/30 border-green-500 text-white font-semibold' : ''}
                ${isWrong ? 'bg-red-600/30 border-red-500 text-white font-semibold' : ''}
                hover:!bg-yellow-500/20 hover:!border-yellow-500
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Submit / Next Button */}
      {onNext && (
        <div className="flex justify-end mt-4">
          <button
              onClick={onNext}
              disabled={!isAnswered || isSubmitting} // <-- only disable when true
              className={`
                px-5 py-2 rounded-lg font-semibold transition
                ${isAnswered ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}
              `}
            >
              {isSubmitting
                ? 'Submitting...'
                : questionNumber === totalQuestions
                ? 'Finish Quiz'
                : 'Next Question'}
            </button>

        </div>
      )}

      {/* Explanation */}
      {showResult && (
        <div className="mt-4 p-4 bg-[#14141c] rounded-lg border border-gray-700">
          <h4 className="text-white font-semibold mb-2">Explanation</h4>
          <p className="text-gray-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

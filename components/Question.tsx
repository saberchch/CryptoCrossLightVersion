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
}

export default function Question({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showResult = false
}: QuestionProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isAnswered = selectedAnswer !== undefined;

  return (
    <div className="card mb-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-crypto-primary">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            {question.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          let optionClass = "w-full p-4 text-left border rounded-lg transition-colors duration-200 ";
          
          if (showResult) {
            if (index === question.correctAnswer) {
              optionClass += "bg-green-50 border-green-300 text-green-800 ";
            } else if (index === selectedAnswer && !isCorrect) {
              optionClass += "bg-red-50 border-red-300 text-red-800 ";
            } else {
              optionClass += "bg-gray-50 border-gray-200 text-gray-600 ";
            }
          } else {
            if (index === selectedAnswer) {
              optionClass += "bg-crypto-primary text-white border-crypto-primary ";
            } else {
              optionClass += "bg-white border-gray-300 hover:border-crypto-primary hover:bg-blue-50 ";
            }
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => !showResult && onAnswerSelect(question.id, index)}
              disabled={showResult}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  showResult 
                    ? (index === question.correctAnswer ? 'bg-green-500 border-green-500' : 
                       index === selectedAnswer ? 'bg-red-500 border-red-500' : 'border-gray-300')
                    : (index === selectedAnswer ? 'bg-white border-white' : 'border-gray-300')
                }`}>
                  {index === selectedAnswer && !showResult && (
                    <div className="w-full h-full rounded-full bg-crypto-primary"></div>
                  )}
                  {showResult && index === question.correctAnswer && (
                    <div className="w-full h-full rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-medium">{option}</span>
                {showResult && index === question.correctAnswer && (
                  <svg className="w-5 h-5 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {showResult && index === selectedAnswer && !isCorrect && (
                  <svg className="w-5 h-5 ml-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

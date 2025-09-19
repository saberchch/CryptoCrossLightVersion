'use client';

import React, { useState, useEffect } from 'react';
import ResultSummary from '/home/saberch/CryptoCross_lightv/components/ResultSummary';
import Question from '/home/saberch/CryptoCross_lightv/components/Question';
import { QuizResult } from '/home/saberch/CryptoCross_lightv/lib/quiz';

interface DashboardQuizResultProps {
  quizId: string;
  onGenerateCertificate: () => void; // callback to show certificate
}

export default function ResultPage({ quizId, onGenerateCertificate }: DashboardQuizResultProps) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Load quiz data
        const resQuiz = await fetch('/api/quizzes');
        const quizzes = await resQuiz.json();
        const quizData = quizzes.find((q: any) => q.id === quizId);
        if (!quizData) throw new Error('Quiz not found');
        setQuiz(quizData);

        // Load result
        const resultData = localStorage.getItem(`quiz-result-${quizId}`);
        if (!resultData) throw new Error('No result found');

        setResult(JSON.parse(resultData));
      } catch (err: any) {
        setError(err.message || 'Failed to load result');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [quizId]);

  if (isLoading) return <p>Loading result...</p>;
  if (error || !result || !quiz) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <ResultSummary result={result} quizTitle={quiz.title} />
      {result.passed && (
        <button
          className="btn-primary mt-4"
          onClick={onGenerateCertificate}
        >
          Generate Certificate
        </button>
      )}
    </div>
  );
}

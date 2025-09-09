'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ResultSummary from '../../../../components/ResultSummary';
import Question from '../../../../components/Question';
import { loadQuiz, QuizResult } from '../../../../lib/quiz';
import { useAuth } from '../../../../components/AuthProvider';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load quiz data
        const response = await fetch('/api/quizzes');
        const quizzes = await response.json();
        const quizData = quizzes.find((q: any) => q.id === params.id);
        
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        setQuiz(quizData);

        // Load result from server for this user and quiz
        if (!user?.email) {
          setError('Please sign in to view your results.');
          return;
        }
        const res = await fetch(`/api/results?email=${encodeURIComponent(user.email)}&quizId=${encodeURIComponent(params.id as string)}`, { cache: 'no-store' });
        const list = await res.json();
        if (!Array.isArray(list) || list.length === 0) {
          setError('No quiz result found.');
          return;
        }
        const latest = list[list.length - 1];
        latest.completedAt = new Date(latest.completedAt);
        setResult(latest);
      } catch (err) {
        setError('Failed to load quiz results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz || !result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-medium">{error || 'Results not found'}</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ResultSummary result={result} quizTitle={quiz.title} />
      
      {/* Detailed Results Toggle */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="text-center mb-6">
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="btn-secondary"
          >
            {showDetailedResults ? 'Hide' : 'Show'} Detailed Results
          </button>
        </div>

        {/* Detailed Results */}
        {showDetailedResults && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Question-by-Question Review
            </h2>
            
            {quiz.questions.map((question: any, index: number) => {
              const userAnswer = result.answers.find(a => a.questionId === question.id);
              return (
                <Question
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                  totalQuestions={quiz.questions.length}
                  selectedAnswer={userAnswer?.selectedAnswer}
                  onAnswerSelect={() => {}} // No-op for review mode
                  showResult={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

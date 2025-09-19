'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { loadQuizzes, Quiz } from '@/lib/quiz';

interface DashboardQuizzesListProps {
  onSelectQuiz: (quizId: string) => void; // callback instead of router.push
}

export default function DashboardQuizzesList({ onSelectQuiz }: DashboardQuizzesListProps) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const all = await loadQuizzes();
        setQuizzes(all);
      } catch (err) {
        console.error(err);
        setError('Failed to load quizzes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-crypto-primary mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-300">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Available Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-[#1a1a23] p-6 rounded-xl shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
              <p className="text-gray-400 mt-2">{quiz.description}</p>
              <p className="mt-2 text-sm text-gray-500">Difficulty: {quiz.difficulty}</p>
              <p className="mt-1 text-sm text-gray-500">Duration: {quiz.duration} min</p>
            </div>

            <div className="mt-4">
              {user ? (
                <button
                  onClick={() => onSelectQuiz(quiz.id)}
                  className="w-full px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400"
                >
                  Start Quiz
                </button>
              ) : (
                <button
                  onClick={() => alert('Please log in to start the quiz')} // or show modal
                  className="w-full px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600"
                >
                  Sign in to Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

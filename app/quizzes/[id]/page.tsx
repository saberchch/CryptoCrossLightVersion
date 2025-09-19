'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Question from '../../../components/Question';
import { loadQuizById, Quiz, calculateScore } from '../../../lib/quiz';
import { useAuth } from '../../../components/AuthProvider';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) {
        setError('Quiz ID not found');
        setIsLoading(false);
        return;
      }

      try {
        const q = await loadQuizById(id);
        if (!q || !q.questions || q.questions.length === 0) {
          setError('Quiz not found or has no questions');
        } else {
          setQuiz(q);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (isSubmitting) return; // prevent changes while submitting
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = async () => {
    if (!quiz) return;

    // Go to next question
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    // Finish quiz
    if (!user) {
      alert('You must be signed in to submit the quiz.');
      return;
    }

    setIsSubmitting(true);

    const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId: Number(questionId),
      selectedAnswer,
    }));

    const scoreData = calculateScore(quiz, answersArray);

    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          studentEmail: user.email,
          studentName: user.name || 'Anonymous',
          score: scoreData.score,
          passed: scoreData.passed,
          answers: answersArray,
          completedAt: new Date().toISOString(),
        }),
      });

      router.push(`/quiz/${quiz.id}/result`);
    } catch (err) {
      console.error('Failed to save result', err);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-crypto-primary mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-300">Loading quiz...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      {/* Quiz Header */}
      <div className="bg-[#1a1a23] rounded-lg shadow-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
          <p className="text-gray-400 mt-1">{quiz.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-yellow-500 text-black font-semibold px-3 py-1 rounded-full text-sm">
            {quiz.difficulty}
          </span>
          <span className="text-gray-300 text-sm">Duration: {quiz.duration} min</span>
        </div>
      </div>

      {/* Quiz Content */}
      {quiz.questions && (
        <Question
          question={quiz.questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={quiz.questions.length}
          selectedAnswer={answers[quiz.questions[currentIndex].id]}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          progress={Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Question from '../../../components/Question';
import { loadQuizById, Quiz, calculateScore } from '../../../lib/quiz';
import { useAuth } from '../../../components/AuthProvider';

interface DashboardQuizProps {
  quizId: string;
  onFinish: () => void; // callback after finishing quiz
}

export default function QuizPage({ quizId, onFinish }: DashboardQuizProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const q = await loadQuizById(quizId);
        if (!q) setError('Quiz not found');
        else setQuiz(q);
      } catch {
        setError('Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleNext = async () => {
    if (!quiz) return;

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
          studentName: user.name ?? 'Anonymous',
          score: scoreData.score,
          passed: scoreData.passed,
          answers: answersArray,
          completedAt: new Date().toISOString(),
        }),
      });

      // Notify DashboardMain to show result
      onFinish();
    } catch (err) {
      console.error(err);
      alert('Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading quiz...</p>;
  if (error || !quiz) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
      <Question
        question={quiz.questions[currentIndex]}
        questionNumber={currentIndex + 1}
        totalQuestions={quiz.questions.length}
        selectedAnswer={answers[quiz.questions[currentIndex].id]}
        onAnswerSelect={(qid, ans) => setAnswers(prev => ({ ...prev, [qid]: ans }))}
        onNext={handleNext}
        progress={Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

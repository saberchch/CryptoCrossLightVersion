'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Question from '../../../components/Question';
import { loadQuiz, calculateScore, Quiz, QuizResult } from '../../../lib/quiz';
import { useAuth } from '../../../components/AuthProvider';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const sp = useSearchParams();
  const { user, addXp, replaceUser } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; selectedAnswer: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await loadQuiz(params.id as string);
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        if (quizData.privacy === 'private') {
          const sessionId = sp.get('session');
          if (!sessionId) {
            setError('This quiz is private. Join via a session code.');
            return;
          }
        }
        setQuiz(quizData);
        setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
      } catch (err) {
        setError('Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id, sp]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quiz) {
      // Time's up - submit quiz
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId, selectedAnswer: answerIndex };
        return newAnswers;
      } else {
        return [...prev, { questionId, selectedAnswer: answerIndex }];
      }
    });
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    const result = calculateScore(quiz, answers);
    const quizResult: QuizResult = {
      quizId: quiz.id,
      studentName: user?.name || 'Anonymous Student',
      studentEmail: user?.email || '',
      score: result.score,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      passed: result.passed,
      completedAt: new Date(),
      answers
    };

    // Persist result server-side for later access
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizResult),
      });
    } catch {}

    // Update JSON store; then replace local user with server state to avoid double append
    if (user?.email) {
      const historyEntry = { quizId: quiz.id, title: quiz.title, takenAt: new Date().toISOString(), score: result.score };
      try {
        await fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, addXp: result.passed ? 50 : 20, addHistory: historyEntry })
        }).then(async r => {
          if (r.ok) {
            const updated = await r.json();
            replaceUser(updated);
          }
        });
      } catch {}
    }
    
    // Record session result if in a session
    const sessionId = sp.get('session');
    if (sessionId && user?.email) {
      try {
        await fetch('/api/session-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, quizId: quiz.id, studentName: user.name, studentEmail: user.email, score: result.score, passed: result.passed, completedAt: new Date().toISOString() })
        });
      } catch {}
    }

    // Navigate to results page
    router.push(`/quiz/${quiz.id}/result`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-medium">{error || 'Quiz not found'}</p>
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

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allQuestionsAnswered = answers.length === quiz.questions.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <div className="text-right">
            <div className="text-sm text-gray-500">Time Remaining</div>
            <div className={`text-lg font-mono font-bold ${
              timeLeft < 60 ? 'text-red-500' : 'text-crypto-primary'
            }`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        <p className="text-gray-600">{quiz.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentQuestionIndex + 1} of {quiz.questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-crypto-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <Question
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        selectedAnswer={currentAnswer?.selectedAnswer}
        onAnswerSelect={handleAnswerSelect}
      />

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-4">
          {!isLastQuestion ? (
            <button
              onClick={handleNextQuestion}
              className="btn-primary"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered}
              className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Answer Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Answer Summary</h3>
        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((_, index) => {
            const isAnswered = answers.some(a => a.questionId === quiz.questions[index].id);
            const isCurrent = index === currentQuestionIndex;
            
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  isCurrent 
                    ? 'bg-crypto-primary text-white' 
                    : isAnswered 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {answers.length} of {quiz.questions.length} questions answered
        </p>
      </div>
    </div>
  );
}

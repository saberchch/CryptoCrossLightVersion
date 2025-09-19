'use client';

import React, { useState, useEffect } from 'react';
import { generateCertificatePDF, generateCertificateId, CertificateData } from '@/lib/certificate';
import { QuizResult, Quiz } from '@/lib/quiz';
import { useAuth } from '@/components/AuthProvider';

interface DashboardCertificateProps {
  quizId: string;
}

export default function DashboardCertificate({ quizId }: DashboardCertificateProps) {
  const { user } = useAuth();

  const [result, setResult] = useState<QuizResult | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load quiz data
        const response = await fetch('/api/quizzes');
        const quizzes: Quiz[] = await response.json();
        const quizData = quizzes.find((q) => q.id === quizId);
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        setQuiz(quizData);

        // Load result from localStorage
        const resultData = localStorage.getItem(`quiz-result-${quizId}`);
        if (!resultData) {
          setError('No quiz result found. Please complete the quiz first.');
          return;
        }
        const parsedResult: QuizResult = JSON.parse(resultData);
        parsedResult.completedAt = new Date(parsedResult.completedAt);
        setResult(parsedResult);

        // Pre-fill student name/email if user exists
        if (user) {
          setStudentName(user.name || '');
          setStudentEmail(user.email || '');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load certificate data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [quizId, user]);

  const handleGenerateCertificate = async () => {
    if (!result || !quiz || !studentName.trim()) {
      alert('Please enter your name to generate the certificate.');
      return;
    }

    setIsGenerating(true);

    try {
      const certificateData: CertificateData = {
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim(),
        quizTitle: quiz.title,
        score: result.score,
        completedAt: result.completedAt,
        certificateId: generateCertificateId()
      };

      // Update result in localStorage
      const updatedResult = { ...result, studentName: certificateData.studentName, studentEmail: certificateData.studentEmail };
      localStorage.setItem(`quiz-result-${quizId}`, JSON.stringify(updatedResult));

      generateCertificatePDF(certificateData);
    } catch (err) {
      console.error('Error generating certificate:', err);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading certificate...</p>
      </div>
    );
  }

  if (error || !quiz || !result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-red-500 font-semibold">
        {error || 'Certificate not available'}
      </div>
    );
  }

  if (!result.passed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-lg font-semibold mb-2">Certificate Not Available</p>
        <p className="text-gray-600 mb-4">
          You need to pass the quiz (score {quiz.passingScore}% or higher) to receive a certificate.
          Your current score: {result.score}%
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => window.location.href = `/quiz/${quizId}`} className="btn-primary">Retake Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center">Certificate Generation</h1>
      <p className="text-center text-gray-600">Complete your information to generate your certificate</p>

      {/* Quiz Details */}
      <div className="card p-4 space-y-3">
        <p><strong>Quiz:</strong> {quiz.title}</p>
        <p><strong>Score:</strong> {result.score}%</p>
        <p><strong>Completed On:</strong> {result.completedAt.toLocaleDateString()}</p>
        <p><strong>Questions Correct:</strong> {result.correctAnswers} / {result.totalQuestions}</p>
      </div>

      {/* Student Info */}
      <div className="card p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crypto-primary focus:border-crypto-primary"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address (Optional)</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crypto-primary focus:border-crypto-primary"
            placeholder="Enter your email address"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleGenerateCertificate}
          disabled={!studentName.trim() || isGenerating}
          className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate & Download Certificate'}
        </button>
      </div>
    </div>
  );
}

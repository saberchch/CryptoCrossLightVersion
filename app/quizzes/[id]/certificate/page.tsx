'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateCertificatePDF, generateCertificateId, CertificateData } from '../../../../lib/certificate';
import { QuizResult } from '../../../../lib/quiz';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
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
        const quizzes = await response.json();
        const quizData = quizzes.find((q: any) => q.id === params.id);
        
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        setQuiz(quizData);

        // Load result from localStorage
        const resultData = localStorage.getItem(`quiz-result-${params.id}`);
        if (!resultData) {
          setError('No quiz result found. Please complete the quiz first.');
          return;
        }

        const parsedResult = JSON.parse(resultData);
        parsedResult.completedAt = new Date(parsedResult.completedAt);
        setResult(parsedResult);
      } catch (err) {
        setError('Failed to load certificate data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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

      // Update the result with student information
      const updatedResult = {
        ...result,
        studentName: certificateData.studentName,
        studentEmail: certificateData.studentEmail
      };
      
      localStorage.setItem(`quiz-result-${params.id}`, JSON.stringify(updatedResult));

      // Generate and download PDF
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
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
            <p className="text-lg font-medium">{error || 'Certificate not available'}</p>
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

  if (!result.passed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">Certificate Not Available</p>
            <p className="text-gray-600 mt-2">
              You need to pass the quiz (score {quiz.passingScore}% or higher) to receive a certificate.
              Your current score: {result.score}%
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => router.push('/')}
              className="btn-secondary"
            >
              Back to Home
            </button>
            <button 
              onClick={() => router.push(`/quiz/${params.id}`)}
              className="btn-primary"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Generation</h1>
        <p className="text-lg text-gray-600">Complete your information to generate your certificate</p>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Completion Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
            <div className="text-lg font-semibold text-crypto-primary">{quiz.title}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
            <div className="text-lg font-semibold text-green-600">{result.score}%</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
            <div className="text-lg font-semibold">
              {result.completedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Questions Answered</label>
            <div className="text-lg font-semibold">{result.correctAnswers} / {result.totalQuestions}</div>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crypto-primary focus:border-crypto-primary"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              id="studentEmail"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crypto-primary focus:border-crypto-primary"
              placeholder="Enter your email address"
            />
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <button
          onClick={handleGenerateCertificate}
          disabled={!studentName.trim() || isGenerating}
          className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Certificate...
            </div>
          ) : (
            'Generate & Download Certificate'
          )}
        </button>

        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => router.push(`/quiz/${params.id}/result`)}
            className="btn-secondary"
          >
            Back to Results
          </button>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Certificate Information:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your certificate will be generated as a PDF file</li>
              <li>The certificate includes a unique certificate ID for verification</li>
              <li>You can download and share your certificate</li>
              <li>Keep your certificate safe as proof of completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

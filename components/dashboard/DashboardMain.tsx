'use client';

import React, { useState } from 'react';
import QuizzesPage from './pages/DashboardQuizList';
import QuizPage from './pages/DashboardQuiz';
import ResultPage from './pages/DashboardQuizResult';
import CertificatePage from './pages/DashboardCertificate';

interface DashboardMainProps {
  activeItem: string;
  userName: string;
  walletBalance: string;
  subscriptionName: string;
  subscriptionPlan: string;
}

export default function DashboardMain({
  activeItem,
  userName,
  walletBalance,
  subscriptionName,
  subscriptionPlan,
}: DashboardMainProps) {

  // For simplicity, store quizId and view mode (quiz, result, certificate)
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'quiz' | 'result' | 'certificate'>('quiz');

  const renderContent = () => {
    switch(activeItem) {
      case 'dashboard':
        return <p>Main Dashboard Content Here</p>;

      case 'quizzes':
        if (!currentQuizId) {
          // Show list of available quizzes
          return <QuizzesPage onSelectQuiz={(id: string) => { 
            setCurrentQuizId(id); 
            setViewMode('quiz'); 
          }} />;
        } else {
          // Show selected quiz / result / certificate
          if (viewMode === 'quiz') return <QuizPage quizId={currentQuizId} onFinish={() => setViewMode('result')} />;
          if (viewMode === 'result') return <ResultPage quizId={currentQuizId} onGenerateCertificate={() => setViewMode('certificate')} />;
          if (viewMode === 'certificate') return <CertificatePage quizId={currentQuizId} />;
        }
        break;

      default:
        return <p>Content not available</p>;
    }
  };

  return (
    

      <div className="mt-6 flex-1 min-h-0">
        {renderContent()}
      </div>
    
  );
}

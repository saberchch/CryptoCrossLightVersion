import QuizCard from '../components/QuizCard';
import { loadQuizzes } from '../lib/quiz';

export default async function HomePage() {
  const quizzes = await loadQuizzes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Crypto Learning Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master cryptocurrency fundamentals through interactive quizzes. 
          Test your knowledge, earn certificates, and advance your crypto education.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Quizzes</h2>
        
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">No quizzes available yet.</p>
              <p className="text-sm">Check back later or contact an administrator.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-lg p-8 text-white text-center shadow-xl">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
        <p className="text-lg mb-6 opacity-90">
          Choose a quiz above to begin your crypto education journey. 
          Each quiz covers essential topics and awards certificates upon completion.
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Interactive Quizzes
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Digital Certificates
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant Results
          </div>
        </div>
      </div>
    </div>
  );
}

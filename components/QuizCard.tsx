import Link from 'next/link';
import { Quiz, formatDuration } from '../lib/quiz';

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'difficulty-beginner';
      case 'Intermediate':
        return 'difficulty-intermediate';
      case 'Advanced':
        return 'difficulty-advanced';
      default:
        return 'difficulty-beginner';
    }
  };

  return (
    <Link href={`/quiz/${quiz.id}`}>
      <div className="quiz-card">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
          <span className={`difficulty-badge ${getDifficultyClass(quiz.difficulty)}`}>
            {quiz.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{quiz.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(quiz.duration)}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {quiz.questions.length} questions
            </span>
          </div>
          <span className="text-crypto-primary font-medium">
            Pass: {quiz.passingScore}%
          </span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="btn-primary inline-block">
            Start Quiz
          </span>
        </div>
      </div>
    </Link>
  );
}

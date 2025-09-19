import Link from 'next/link';
import { Quiz, formatDuration } from '../lib/quiz';
import Card from './ui/Card';

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

  const placeholderImage = '/images/quiz-placeholder.png'; // Add a placeholder image in public/images/

  return (
    <Link href={`/quizzes/${quiz.id}`}>
      <Card className="quiz-card hover:shadow-lg transition-shadow duration-300"
        header={(
          <>
            <h3 className="card-title">{quiz.title || 'Untitled Quiz'}</h3>
            <span className={`difficulty-badge ${getDifficultyClass(quiz.difficulty || 'Beginner')}`}>
              {quiz.difficulty || 'Beginner'}
            </span>
          </>
        )}
        footer={(
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDuration(quiz.duration ?? 0)}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {quiz.questions?.length ?? 0} questions
              </span>
            </div>
            <span className="gold-accent font-medium">Pass: {quiz.passingScore ?? 0}%</span>
          </div>
        )}
      >
        {/* Quiz image */}
        <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400 text-sm overflow-hidden">
          <img
            src={quiz.image || placeholderImage}
            alt={quiz.title || 'Quiz Image'}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <p className="text-gray-700">{quiz.description || 'No description available'}</p>

        <div className="mt-4">
          <span className="btn-primary inline-flex items-center gap-2">
            <span>Start Quiz</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </div>
      </Card>
    </Link>
  );
}

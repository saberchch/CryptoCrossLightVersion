import { QuizResult } from '../lib/quiz';

interface ResultSummaryProps {
  result: QuizResult;
  quizTitle: string;
}

export default function ResultSummary({ result, quizTitle }: ResultSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPassStatus = (passed: boolean) => {
    return passed ? (
      <div className="flex items-center text-green-600">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold">Congratulations! You Passed!</span>
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold">Keep Learning! You'll do better next time.</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
        <p className="text-lg text-gray-600">{quizTitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Score Card */}
        <div className={`card ${getScoreBgColor(result.score)} border-2`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Score</h3>
            {getPassStatus(result.passed)}
          </div>
        </div>

        {/* Statistics Card */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quiz Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Answered:</span>
              <span className="font-semibold">{result.correctAnswers} / {result.totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Date:</span>
              <span className="font-semibold">
                {new Date(result.completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quiz ID:</span>
              <span className="font-mono text-sm">{result.quizId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {result.correctAnswers}
            </div>
            <div className="text-gray-600">Correct Answers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {result.totalQuestions - result.correctAnswers}
            </div>
            <div className="text-gray-600">Incorrect Answers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-crypto-primary mb-2">
              {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
            </div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-y-4">
        {result.passed && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center text-green-800 mb-2">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Certificate Available!</span>
              </div>
              <p className="text-green-700">
                You've successfully completed this quiz. Download your certificate to showcase your achievement.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary"
          >
            Back to Home
          </button>
          
          {result.passed && (
            <button
              onClick={() => window.location.href = `/quiz/${result.quizId}/certificate`}
              className="btn-success"
            >
              Download Certificate
            </button>
          )}
          
          <button
            onClick={() => window.location.href = `/quiz/${result.quizId}`}
            className="btn-primary"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

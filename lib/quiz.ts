export interface Question {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  passingScore: number; // percentage
  questions: Question[];
  privacy?: 'public' | 'private';
  status?: 'draft' | 'published';
  type?: 'certificate' | 'exam' | 'quick-test' | 'vote';
  creator?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt?: string;
}

export interface QuizResult {
  quizId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  completedAt: Date;
  answers: { questionId: number; selectedAnswer: number }[];
}

// Load all quizzes from individual files
export async function loadQuizzes(): Promise<Quiz[]> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.RENDER_EXTERNAL_URL || 'https://cryptocrosslightversion-1.onrender.com' 
      : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/quizzes`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    const quizzes = await response.json();
    return quizzes;
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return [];
  }
}

// Load a specific quiz by ID
export async function loadQuiz(id: string): Promise<Quiz | null> {
  const quizzes = await loadQuizzes();
  return quizzes.find(quiz => quiz.id === id) || null;
}

// Calculate quiz score
export function calculateScore(quiz: Quiz, answers: { questionId: number; selectedAnswer: number }[]): {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
} {
  let correctAnswers = 0;
  
  answers.forEach(answer => {
    const question = quiz.questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedAnswer) {
      correctAnswers++;
    }
  });
  
  const totalQuestions = quiz.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= quiz.passingScore;
  
  return {
    score,
    totalQuestions,
    correctAnswers,
    passed
  };
}

// Shuffle questions (optional feature)
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Format time duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

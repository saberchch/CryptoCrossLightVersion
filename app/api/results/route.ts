import { NextResponse } from 'next/server';
import { QuizResult } from '@/lib/quiz';

export async function POST(request: Request) {
  try {
    const result: QuizResult = await request.json();
    
    // Validate required fields
    if (!result.quizId || !result.studentName || result.score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real application, you would save this to a database
    // For MVP, we'll just return success
    console.log('Quiz result received:', {
      quizId: result.quizId,
      studentName: result.studentName,
      score: result.score,
      passed: result.passed,
      completedAt: result.completedAt
    });
    
    return NextResponse.json(
      { 
        message: 'Result saved successfully',
        resultId: `result-${Date.now()}` 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving result:', error);
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // In a real application, you would fetch results from a database
    // For MVP, we'll return a sample response
    return NextResponse.json({
      message: 'Results API endpoint',
      note: 'In MVP, results are stored in localStorage. In production, implement database storage.'
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');
    
    // Check if quizzes directory exists
    if (!fs.existsSync(quizzesDir)) {
      return NextResponse.json([]);
    }
    
    // Read all JSON files in the quizzes directory
    const files = fs.readdirSync(quizzesDir).filter(file => file.endsWith('.json'));
    const quizzes = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(quizzesDir, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const quiz = JSON.parse(fileContents);
        quizzes.push(quiz);
      } catch (fileError) {
        console.error(`Error reading quiz file ${file}:`, fileError);
        // Continue with other files even if one fails
      }
    }
    
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error reading quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to load quizzes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newQuiz = await request.json();
    
    // Validate required fields
    if (!newQuiz.id || !newQuiz.title || !newQuiz.questions) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, and questions are required' },
        { status: 400 }
      );
    }
    
    // Validate quiz structure
    if (!Array.isArray(newQuiz.questions) || newQuiz.questions.length === 0) {
      return NextResponse.json(
        { error: 'Quiz must have at least one question' },
        { status: 400 }
      );
    }
    
    // Validate each question
    for (const question of newQuiz.questions) {
      if (!question.id || !question.question || !question.options || question.correctAnswer === undefined) {
        return NextResponse.json(
          { error: 'Each question must have: id, question, options, and correctAnswer' },
          { status: 400 }
        );
      }
    }
    
    const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');
    
    // Create quizzes directory if it doesn't exist
    if (!fs.existsSync(quizzesDir)) {
      fs.mkdirSync(quizzesDir, { recursive: true });
    }
    
    const filePath = path.join(quizzesDir, `${newQuiz.id}.json`);
    
    // Check if quiz file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Quiz with this ID already exists' },
        { status: 400 }
      );
    }
    
    // Write quiz to individual file
    fs.writeFileSync(filePath, JSON.stringify(newQuiz, null, 2));
    
    return NextResponse.json(
      { message: 'Quiz added successfully', quiz: newQuiz },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding quiz:', error);
    return NextResponse.json(
      { error: 'Failed to add quiz' },
      { status: 500 }
    );
  }
}

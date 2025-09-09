import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('quizFile') as File;
    const creatorId = formData.get('creatorId') as string | null;
    const creatorName = formData.get('creatorName') as string | null;
    const creatorEmail = formData.get('creatorEmail') as string | null;
    const creatorRole = formData.get('creatorRole') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Check file type
    if (!file.name.endsWith('.json')) {
      return NextResponse.json(
        { error: 'Only JSON files are allowed' },
        { status: 400 }
      );
    }
    
    // Read file content
    const fileContent = await file.text();
    
    // Parse JSON
    let quizData;
    try {
      quizData = JSON.parse(fileContent);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }
    
    // Validate quiz structure
    if (!quizData.id || !quizData.title || !quizData.questions) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, and questions are required' },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      return NextResponse.json(
        { error: 'Quiz must have at least one question' },
        { status: 400 }
      );
    }
    
    // Validate each question
    for (const question of quizData.questions) {
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
    
    const filePath = path.join(quizzesDir, `${quizData.id}.json`);
    
    // Check if quiz file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Quiz with this ID already exists' },
        { status: 400 }
      );
    }
    
    // Attach creator metadata
    if (creatorId) {
      quizData.creator = {
        id: creatorId,
        name: creatorName,
        email: creatorEmail,
        role: creatorRole,
      };
    }
    quizData.createdAt = quizData.createdAt || new Date().toISOString();

    // Write quiz to file
    fs.writeFileSync(filePath, JSON.stringify(quizData, null, 2));
    
    return NextResponse.json(
      { 
        message: 'Quiz uploaded successfully', 
        quiz: {
          id: quizData.id,
          title: quizData.title,
          description: quizData.description,
          difficulty: quizData.difficulty,
          duration: quizData.duration,
          passingScore: quizData.passingScore,
          questionCount: quizData.questions.length
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading quiz:', error);
    return NextResponse.json(
      { error: 'Failed to upload quiz' },
      { status: 500 }
    );
  }
}



import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');
    
    // Check if quizzes directory exists
    if (!fs.existsSync(quizzesDir)) {
      return NextResponse.json([]);
    }
    
    // Read all JSON files in the quizzes directory
    const files = fs.readdirSync(quizzesDir).filter(file => file.endsWith('.json'));
    const quizzes = [] as any[];
    
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
    
    // Read requester from headers (set by client after login)
    const requesterId = request.headers.get('x-user-id');
    const requesterRole = request.headers.get('x-user-role');

    // Visibility rules:
    // - Anonymous or student: only published & public
    // - Professor: include own quizzes (any status/privacy) + published & public from others
    // - Admin: see all
    const filtered = quizzes.filter((q: any) => {
      const isOwner = requesterId && q.creator && q.creator.id === requesterId;
      const isPublishedPublic = q.status !== 'draft' && q.privacy !== 'private';

      if (requesterRole === 'admin') {
        return true;
      }
      if (requesterRole === 'professor') {
        return isOwner || isPublishedPublic;
      }
      // default: student or anonymous
      return isPublishedPublic;
    });
    return NextResponse.json(filtered);
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
    if (!newQuiz.title || !newQuiz.questions) {
      return NextResponse.json(
        { error: 'Missing required fields: title and questions are required' },
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
    
    // Build/provide an id if missing - professional, collision-safe slug
    function slugify(input: string) {
      return String(input)
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-')
        .slice(0, 60);
    }
    function shortStamp() {
      const t = Date.now().toString(36);
      const r = Math.random().toString(36).slice(2, 6);
      return `${t}-${r}`;
    }
    let quizId = newQuiz.id && typeof newQuiz.id === 'string' && newQuiz.id.trim().length > 0
      ? slugify(newQuiz.id)
      : `${slugify(newQuiz.title)}-${shortStamp()}`;
    
    // Ensure uniqueness with bounded retries
    let filePath = path.join(quizzesDir, `${quizId}.json`);
    let attempts = 0;
    while (fs.existsSync(filePath) && attempts < 5) {
      quizId = `${slugify(newQuiz.title)}-${shortStamp()}`;
      filePath = path.join(quizzesDir, `${quizId}.json`);
      attempts++;
    }
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Could not allocate unique quiz id. Try again.' },
        { status: 500 }
      );
    }
    
    // Attach creator metadata if missing
    if (!newQuiz.creator && request.headers.get('x-creator-id')) {
      newQuiz.creator = {
        id: request.headers.get('x-creator-id'),
        name: request.headers.get('x-creator-name'),
        email: request.headers.get('x-creator-email'),
        role: request.headers.get('x-creator-role'),
      };
      newQuiz.createdAt = newQuiz.createdAt || new Date().toISOString();
    }

    // Attach normalized id and defaults before write
    const quizToSave = {
      ...newQuiz,
      id: quizId,
      type: newQuiz.type || 'certificate',
      privacy: newQuiz.privacy || 'public',
      status: newQuiz.status || 'published',
    };

    // Write quiz to individual file
    fs.writeFileSync(filePath, JSON.stringify(quizToSave, null, 2));
    
    return NextResponse.json(
      { message: 'Quiz added successfully', quiz: quizToSave },
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

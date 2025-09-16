'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';

interface NewQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function CreatorPanel({ orgId }: { orgId?: string }) {
  const { user } = useAuth();
  const [quizId, setQuizId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'certificate' | 'exam' | 'quick-test' | 'vote'>('certificate');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('private');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [duration, setDuration] = useState<number>(10);
  const [passingScore, setPassingScore] = useState<number>(60);
  const [questions, setQuestions] = useState<NewQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [publishInfo, setPublishInfo] = useState<any | null>(null);

  const canSubmit = useMemo(() => {
    return title && questions.length > 0 && questions.every(q => q.question && q.options.length >= 2);
  }, [title, questions]);

  const addQuestion = () => {
    setQuestions(prev => ([
      ...prev,
      { id: prev.length + 1, question: '', type: 'multiple-choice', options: ['', ''], correctAnswer: 0, explanation: '' }
    ]));
  };

  const updateQuestion = (index: number, updates: Partial<NewQuestion>) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, options: q.options.map((o, j) => j === optIndex ? value : o) } : q));
  };

  const addOption = (qIndex: number) => {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, options: [...q.options, ''] } : q));
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, options: q.options.filter((_, j) => j !== optIndex) } : q));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const payload = {
        id: quizId,
        title,
        description,
        difficulty,
        duration,
        passingScore,
        creator: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : undefined,
        createdAt: new Date().toISOString(),
        type,
        privacy,
        status,
        questions: questions.map(q => ({
          id: q.id,
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
      };
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(orgId ? { 'x-org-id': orgId } : {}) },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create quiz');
      } else {
        setSuccess('Quiz created successfully');
        try {
          if (user?.email) {
            await fetch('/api/users', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email, addHistory: { quizId: data.quiz?.id || quizId, title, takenAt: new Date().toISOString(), type: 'created' } })
            });
          }
        } catch {}
        setQuizId('');
        setTitle('');
        setDescription('');
        setDifficulty('Beginner');
        setDuration(10);
        setPassingScore(60);
        setQuestions([]);
      }
    } catch (e) {
      setError('Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadMsg(null);
    try {
      const form = new FormData();
      form.append('quizFile', file);
      if (user) {
        form.append('creatorId', user.id);
        form.append('creatorName', user.name);
        form.append('creatorEmail', user.email);
        form.append('creatorRole', user.role);
      }
      const res = await fetch('/api/quizzes/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setUploadMsg(data.error || 'Upload failed');
      } else {
        setUploadMsg('Quiz uploaded successfully');
      }
    } catch {
      setUploadMsg('Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handlePublish = async () => {
    setError(null);
    setPublishInfo(null);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, ownerId: user?.id, privacy: 'private', durationMinutes: 30 })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to publish');
        return;
      }
      setPublishInfo(data);
    } catch {
      setError('Failed to publish');
    }
  };

  if (!user || user.role !== 'educator') return null;

  return (
    <div className="space-y-6" id="creator">
      <div className="mb-4 p-4 rounded border border-dashed">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold mb-1">Import Quiz JSON</div>
            <div className="text-sm text-gray-500">Upload a quiz file matching the existing template.</div>
          </div>
          <input type="file" accept=".json" onChange={handleUpload} disabled={isUploading} />
        </div>
        {uploadMsg && <div className="mt-2 text-sm">{uploadMsg}</div>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        {error && <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}
        {success && <div className="p-3 rounded bg-green-50 text-green-700 border border-green-200">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz ID (optional)</label>
            <input className="w-full border rounded px-3 py-2" value={quizId} onChange={e => setQuizId(e.target.value)} placeholder="leave blank to auto-generate" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select className="w-full border rounded px-3 py-2" value={difficulty} onChange={e => setDifficulty(e.target.value as any)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={duration} onChange={e => setDuration(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select className="w-full border rounded px-3 py-2" value={type} onChange={e => setType(e.target.value as any)}>
              <option value="certificate">Certificate</option>
              <option value="exam">Exam</option>
              <option value="quick-test">Quick Test</option>
              <option value="vote">Vote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
            <select className="w-full border rounded px-3 py-2" value={privacy} onChange={e => setPrivacy(e.target.value as any)}>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value as any)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button type="button" onClick={addQuestion} className="btn-primary">Add Question</button>
          </div>
          {questions.length === 0 && <p className="text-gray-500">No questions yet. Add your first question.</p>}
          {questions.map((q, qi) => (
            <div key={qi} className="border rounded p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <input className="w-full border rounded px-3 py-2" value={q.question} onChange={e => updateQuestion(qi, { question: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full border rounded px-3 py-2" value={q.type} onChange={e => updateQuestion(qi, { type: e.target.value as any })}>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True / False</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center space-x-2">
                      <input className="flex-1 border rounded px-3 py-2" value={opt} onChange={e => updateOption(qi, oi, e.target.value)} />
                      <button type="button" className="btn-secondary" onClick={() => removeOption(qi, oi)}>Remove</button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <button type="button" className="btn-secondary" onClick={() => addOption(qi)}>Add Option</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer Index</label>
                  <input type="number" className="w-full border rounded px-3 py-2" value={q.correctAnswer} onChange={e => updateQuestion(qi, { correctAnswer: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
                  <input className="w-full border rounded px-3 py-2" value={q.explanation} onChange={e => updateQuestion(qi, { explanation: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button type="submit" disabled={!canSubmit || isSubmitting} className="btn-success disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Create Quiz'}</button>
          <button type="button" onClick={handlePublish} disabled={!quizId} className="ml-3 btn-primary disabled:opacity-50">Publish (Create Session)</button>
        </div>
      </form>

      {publishInfo && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Session Published</h3>
          <p className="text-sm text-gray-600 mb-4">Share this code or link with your students.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500">Code</div>
              <div className="text-2xl font-bold">{publishInfo.code}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Link</div>
              <a className="text-crypto-primary underline break-all" href={publishInfo.joinUrl}>{publishInfo.joinUrl}</a>
            </div>
          </div>
          <div className="mt-4">
            <img alt="QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publishInfo.joinUrl)}`} />
          </div>
        </div>
      )}
    </div>
  );
}



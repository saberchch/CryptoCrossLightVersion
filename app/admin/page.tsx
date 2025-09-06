'use client';

import React, { useState, useEffect } from 'react';
import { loadQuizzes, Quiz } from '../../lib/quiz';

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewQuizForm, setShowNewQuizForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizData = await loadQuizzes();
        setQuizzes(quizData);
      } catch (error) {
        console.error('Error loading quizzes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('quizFile', file);

      const response = await fetch('/api/quizzes/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({ type: 'success', message: result.message });
        // Refresh quizzes list
        const quizData = await loadQuizzes();
        setQuizzes(quizData);
        setShowUploadForm(false);
        // Clear file input
        event.target.value = '';
      } else {
        setUploadStatus({ type: 'error', message: result.error });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Failed to upload quiz file' });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Manage quizzes and monitor platform activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Statistics Cards */}
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-crypto-primary rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">
                {quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Quiz Management</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="btn-success"
            >
              {showUploadForm ? 'Cancel Upload' : 'Upload Quiz File'}
            </button>
            <button
              onClick={() => setShowNewQuizForm(!showNewQuizForm)}
              className="btn-primary"
            >
              {showNewQuizForm ? 'Cancel' : 'Add New Quiz'}
            </button>
          </div>
        </div>
      </div>

      {/* New Quiz Form */}
      {showNewQuizForm && (
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Quiz</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Manual Quiz Addition</p>
                <p>In this MVP version, quizzes are managed through the JSON file. To add a new quiz:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Edit the <code className="bg-yellow-100 px-1 rounded">data/quizzes.json</code> file</li>
                  <li>Add your quiz following the existing format</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setShowNewQuizForm(false)}
              className="btn-secondary"
            >
              Close Form
            </button>
          </div>
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && (
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Quiz File</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="quizFile" className="block text-sm font-medium text-gray-700 mb-2">
                Select Quiz JSON File
              </label>
              <input
                type="file"
                id="quizFile"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-crypto-primary file:text-white hover:file:bg-crypto-secondary disabled:opacity-50"
              />
            </div>
            
            {uploadStatus && (
              <div className={`p-4 rounded-lg ${
                uploadStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  {uploadStatus.type === 'success' ? (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="font-medium">{uploadStatus.message}</span>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Quiz File Format:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>File must be a valid JSON format</li>
                    <li>Required fields: id, title, description, difficulty, duration, passingScore, questions</li>
                    <li>Each question must have: id, question, type, options, correctAnswer, explanation</li>
                    <li>Quiz ID must be unique (used as filename)</li>
                  </ul>
                  <div className="mt-3">
                    <a 
                      href="/quiz-template.json" 
                      download="quiz-template.json"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      📥 Download Quiz Template
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Current Quizzes</h2>
        
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">No quizzes found.</p>
              <p className="text-sm">Add quizzes to get started.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                  <span className={`difficulty-badge ${
                    quiz.difficulty === 'Beginner' ? 'difficulty-beginner' :
                    quiz.difficulty === 'Intermediate' ? 'difficulty-intermediate' :
                    'difficulty-advanced'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{quiz.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Questions:</span>
                    <span className="font-medium">{quiz.questions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{quiz.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Passing Score:</span>
                    <span className="font-medium">{quiz.passingScore}%</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={`/quiz/${quiz.id}`}
                    className="btn-primary text-sm flex-1 text-center"
                  >
                    Preview Quiz
                  </a>
                  <button className="btn-secondary text-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-12 card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Instructions</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Adding New Quizzes:</h4>
            <p>Currently, quizzes are managed through the <code className="bg-gray-100 px-1 rounded">data/quizzes.json</code> file. Follow these steps:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
              <li>Open the <code className="bg-gray-100 px-1 rounded">data/quizzes.json</code> file</li>
              <li>Add your quiz object following the existing format</li>
              <li>Include all required fields: id, title, description, difficulty, duration, passingScore, questions</li>
              <li>Save the file and restart the development server</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Quiz Structure:</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Each quiz needs a unique ID</li>
              <li>Questions can be multiple-choice or true/false</li>
              <li>Include explanations for educational value</li>
              <li>Set appropriate difficulty levels and time limits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('student');
  const [id, setId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id.trim()) return;

    onLogin({
      id: id.trim(),
      role,
      name: role === 'student' ? `Student ${id}` : `Office ${id}`
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FastPass</h1>
          <p className="text-gray-600 mt-2">Digital Enrollment Tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-3 rounded-lg font-medium transition-all ${
                  role === 'student'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('office')}
                className={`py-3 rounded-lg font-medium transition-all ${
                  role === 'office'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Office Staff
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {role === 'student' ? 'Student ID' : 'Office Name'}
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={role === 'student' ? 'Enter your student ID' : 'Enter office name'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>

          <button type="submit" className="w-full btn btn-primary">
            Continue
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Demo Mode - Use any ID to login
        </p>
      </div>
    </div>
  );
}

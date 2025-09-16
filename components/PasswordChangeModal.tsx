'use client';

import React, { useEffect, useState } from 'react';

interface PasswordChangeModalProps {
  user: any;
  replaceUser?: (u: any) => void;
  open: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({
  user,
  replaceUser,
  open,
  onClose
}: PasswordChangeModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset fields when modal closes
  useEffect(() => {
    if (!open) {
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccess(null);
      setIsSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, newPassword })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || 'Failed to change password');
        setIsSubmitting(false);
        return;
      }

      const updated = await res.json();
      replaceUser && replaceUser(updated);
      setSuccess('Password updated.');
      setIsSubmitting(false);
      onClose();

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('changePassword');
        window.history.replaceState(null, '', url.toString());
      }
    } catch {
      setError('Failed to change password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl border border-yellow-400 w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2">Set a new password</h2>
        <p className="text-sm text-gray-600 mb-4">
          For security, you must change your temporary password before continuing.
        </p>

        {error && <div className="p-2 mb-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">{error}</div>}
        {success && <div className="p-2 mb-3 bg-green-50 text-green-700 border border-green-200 rounded text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password"
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
            <input
              type="password"
              className="border rounded px-3 py-2 w-full"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || newPassword.length < 6 || newPassword !== confirmPassword}
            className={`w-full py-2 rounded-md font-semibold ${
              isSubmitting || newPassword.length < 6 || newPassword !== confirmPassword
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-yellow-500 hover:opacity-90 text-black'
            }`}
          >
            {isSubmitting ? 'Saving…' : 'Save password'}
          </button>
        </form>
      </div>
    </div>
  );
}

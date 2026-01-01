import { useState } from 'react';
import DecoyForm from '../components/decoy/DecoyForm';

export default function DecoyPage() {
  
  console.log("Rendering DecoyPage"); // Debug line
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (data: any) => {
    setStatus('submitting');
    
    try {
      // 1. Get session
      const clickRes = await fetch('http://localhost:8000/phishing/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!clickRes.ok) throw new Error('Session init failed');
      const { session_id } = await clickRes.json();

      // 2. Capture credentials
      const captureRes = await fetch('http://localhost:8000/phishing/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id,
          username: data.email,   // ⚠️ backend expects "username"
          password: data.password
        })
      });

      if (captureRes.ok) {
        alert(`✅ Attack logged!\nSession: ${session_id}`);
        setStatus('success');
      } else {
        const err = await captureRes.json().catch(() => ({}));
        throw new Error(err.detail || 'Capture failed');
      }
    } catch (e: any) {
      console.error(e);
      alert(`⚠️ ${e.message}`);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  console.log('DecoyPage render, status:', status);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <DecoyForm 
        onSubmit={handleSubmit} 
        isLoading={status === 'submitting'} 
      />
    </div>
  );
}
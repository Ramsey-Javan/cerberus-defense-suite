 export interface DecoyTriggerResponse {
  session_id: string;
  triggered_at: string;
  context: string;
  message: string;
}

export interface ErrorResponse {
  detail: string;
  status?: number;
}

/**
 * Submit decoy credentials to backend
 * No auth needed — this is a public endpoint
 */
export const triggerDecoy = async (
  credentials: { email: string; password: string; context: string }
): Promise<DecoyTriggerResponse> => {
  const url = '/api/decoy/trigger'; // Proxy via dev server (see package.json)
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error: ErrorResponse = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
};
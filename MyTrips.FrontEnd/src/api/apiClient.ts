// Get API URL from environment variable or use default for development
const BASE_URL = typeof import.meta.env.VITE_API_URL !== 'undefined' 
  ? import.meta.env.VITE_API_URL 
  : '/api';

// Session ID management
const SESSION_ID_KEY = 'mytrips_session_id';

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

export function setSessionId(sessionId: string): void {
  localStorage.setItem(SESSION_ID_KEY, sessionId);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_ID_KEY);
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Session-Id': getSessionId()
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    
    const errorText = await response.text().catch(() => "Unknown Error");
    throw new Error(errorText || `Error: ${response.status} ${response.statusText}`);
  }
  
  if (response.status === 204) return {} as T;
  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options?.headers
      }
    }).then(res => handleResponse<T>(res)),
    
  post: <T>(endpoint: string, data: any, options?: RequestInit) => 
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
      ...options
    }).then(res => handleResponse<T>(res)),

  put: <T>(endpoint: string, data: any, options?: RequestInit) => 
    fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
      ...options
    }).then(res => handleResponse<T>(res)),

  delete: (endpoint: string, options?: RequestInit) => 
    fetch(`${BASE_URL}${endpoint}`, { 
      method: "DELETE",
      headers: getHeaders(),
      ...options
    }).then(res => handleResponse<void>(res)),
};


  const BASE_URL = import.meta.env.VITE_API_URL

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
    fetch(`${BASE_URL}${endpoint}`, options).then(res => handleResponse<T>(res)),
    
  post: <T>(endpoint: string, data: any, options?: RequestInit) => 
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...options
    }).then(res => handleResponse<T>(res)),

  put: <T>(endpoint: string, data: any, options?: RequestInit) => 
    fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...options
    }).then(res => handleResponse<T>(res)),

  delete: (endpoint: string) => 
    fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" }).then(res => handleResponse<void>(res)),
};

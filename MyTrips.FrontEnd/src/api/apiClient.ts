const BASE_URL = "http://localhost:5234/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Intentamos extraer el mensaje de error del backend
    const errorText = await response.text().catch(() => "Unknown Error");
    throw new Error(errorText || `Error: ${response.status} ${response.statusText}`);
  }
  // Para respuestas 204 (No Content), no intentamos parsear JSON
  if (response.status === 204) return {} as T;
  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) => 
    fetch(`${BASE_URL}${endpoint}`).then(res => handleResponse<T>(res)),
    
  post: <T>(endpoint: string, data: any) => 
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => handleResponse<T>(res)),

  put: <T>(endpoint: string, data: any) => 
    fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => handleResponse<T>(res)),

  delete: (endpoint: string) => 
    fetch(`${BASE_URL}${endpoint}`, { method: "DELETE" }).then(res => handleResponse<void>(res)),
};
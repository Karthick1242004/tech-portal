interface ApiError {
  message: string;
  status: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Helper to get token from storage safely
  private getAuthHeader(): Record<string, string> {
    try {
      if (typeof window !== 'undefined') {
        const storage = localStorage.getItem('technician-session');
        if (storage) {
          const parsed = JSON.parse(storage);
          const token = parsed.state?.accessToken;
          if (token) {
            return { 'Authorization': `Bearer ${token}` };
          }
        }
      }
    } catch (e) {
      console.error('Error reading auth token', e);
    }
    return {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // If endpoint is absolute (starts with http), use it as is. Otherwise prepend baseUrl
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      // Important to include credentials if needed for cookies, though we use Bearer
      // credentials: 'include' 
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle 401 specifically? 
        if (response.status === 401) {
          // Optional: trigger logout event
        }

        // Try to parse error message from JSON
        let errorMessage = response.statusText;
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          // fallback to text
          const text = await response.text();
          if (text) errorMessage = text;
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
        };
        throw error;
      }

      // Check if response is empty
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Configurable base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export const apiClient = new ApiClient(API_URL);

// Job API functions
import type { Job } from './mock-jobs';
// Keep mockJobs import if needed for types, but we prefer shared types in a real app.
// For now, assuming API returns Job interface compatible structure.

export interface PaginatedJobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export async function getJobs(page: number = 1, limit: number = 10): Promise<PaginatedJobsResponse> {
  // Call real API
  // Note: Backend /api/jobs returns just an array of jobs for now, 
  // need to handle that or update backend to support pagination metadata.
  // The backend implementation:
  // router.get('/', authMiddleware, jobsController.getJobs); -> returns InternalJob[]

  // Fetching all for now because backend doesn't paginate yet
  const response = await apiClient.get<{ success: boolean; data: Job[] }>('/jobs');

  // Client-side pagination logic to match existing frontend expectations
  // This maintains the contract while we wait for backend pagination upgrades
  const allJobs = response.data || [];
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedJobs = allJobs.slice(startIndex, endIndex);

  return {
    jobs: paginatedJobs,
    total: allJobs.length,
    page,
    limit,
    hasMore: endIndex < allJobs.length,
  };
}

export async function getJobById(jobId: string): Promise<Job | null> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Job }>(`/jobs/${jobId}`);
    return response.data;
  } catch (e) {
    // If 404, return null? Or let it throw to show error page?
    // User asked: "if i click a job it will show api error and we already created a custom error page"
    // So we rethrow
    throw e;
  }
}

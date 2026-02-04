interface ApiError {
  message: string;
  status: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error: ApiError = {
          message: await response.text(),
          status: response.status,
        };
        throw error;
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

export const apiClient = new ApiClient();

// Job API functions
import type { Job } from './mock-jobs';
import { mockJobs } from './mock-jobs';

export interface PaginatedJobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export async function getJobs(page: number = 1, limit: number = 10): Promise<PaginatedJobsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const jobs = mockJobs.slice(startIndex, endIndex);
  const total = mockJobs.length;
  const hasMore = endIndex < total;
  
  return {
    jobs,
    total,
    page,
    limit,
    hasMore,
  };
}

export async function getJobById(jobId: string): Promise<Job | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const job = mockJobs.find(j => j.id === jobId);
  
  if (!job) {
    return null;
  }
  
  return job;
}

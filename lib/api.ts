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
        let errorData: any = {};

        try {
          const errorJson = await response.json();
          errorData = errorJson;
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          // fallback to text
          const text = await response.text();
          if (text) errorMessage = text;
        }

        const error: ApiError & { code?: string } = {
          message: errorMessage,
          status: response.status,
          ...(errorData.code && { code: errorData.code })
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

  async postFormData<T>(
    endpoint: string,
    data: FormData,
    options?: RequestInit
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    // Do not set Content-Type header for FormData, let browser set it with boundary
    const headers = {
      ...this.getAuthHeader(),
      ...options?.headers,
    };

    const config: RequestInit = {
      ...options,
      method: 'POST',
      headers,
      body: data,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          const text = await response.text();
          if (text) errorMessage = text;
        }

        throw {
          message: errorMessage,
          status: response.status,
        };
      }

      return response.json();
    } catch (error) {
      throw error;
    }
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
// Admin User Management API
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await apiClient.get<{ success: boolean; data: AdminUser[] }>('/admin/users');
  return response.data;
}

export async function createAdminUser(userData: { name: string; email: string; password: string }): Promise<AdminUser> {
  const response = await apiClient.post<{ success: boolean; data: AdminUser }>('/admin/users', userData);
  return response.data;
}

export async function resetAdminPassword(userId: string, newPassword: string): Promise<void> {
  await apiClient.post(`/admin/users/${userId}/reset-password`, { newPassword });
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await apiClient.delete(`/admin/users/${userId}`);
}

// Report Job API
import type { Equipment, ProcessFunction, WorkOrderType, ReportJobPayload, ReportJobResponse } from '@/types/report-job';

export async function getEquipment(): Promise<Equipment[]> {
  const response = await apiClient.get<{ success: boolean; data: any[] }>('/jobs/equipment');
  return response.data.map((item: any) => ({
    id: item.Id,
    description: item.Description,
    status: item.Status,
    context: item.Context
  }));
}

export async function getProcessFunctions(): Promise<ProcessFunction[]> {
  const response = await apiClient.get<{ success: boolean; data: any[] }>('/jobs/process-functions');
  return response.data.map((item: any) => ({
    id: item.Id,
    description: item.Description,
    status: item.Status,
    context: item.Context
  }));
}

export async function getWorkOrderTypes(): Promise<WorkOrderType[]> {
  const response = await apiClient.get<{ success: boolean; data: any[] }>('/jobs/work-order-types');
  return response.data.map((item: any) => ({
    id: item.Id,
    description: item.Description,
    status: item.Status,
    context: item.Context
  }));
}

export async function reportJob(payload: ReportJobPayload, images: File[] = []): Promise<ReportJobResponse> {
  // Transform frontend camelCase to backend format
  // Note: Context is an integer in backend, but we capture text. Appending text to Description.
  const descriptionWithContext = payload.context
    ? `${payload.description}\n\nContext: ${payload.context}`
    : payload.description;

  // Use FormData for multipart upload
  const formData = new FormData();

  // Add required fields
  formData.append('Description', descriptionWithContext);
  formData.append('ReportText', payload.reporterText);
  formData.append('EquipmentId', payload.equipmentId);
  formData.append('ProcessFunctionId', payload.processFunctionId);
  formData.append('WorkOrderTypeId', payload.workOrderTypeId);
  formData.append('ReportDate', payload.reportDate);

  // Add optional fields if they have values
  if (payload.siteId && payload.siteId.trim()) {
    formData.append('SiteId', payload.siteId);
  }
  if (payload.specId && payload.specId.trim()) {
    formData.append('SpaceId', payload.specId);
  }

  // Add images
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await apiClient.post<{ success: boolean; data: any }>('/jobs/report', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return {
    message: response.data.message,
    successStatus: response.data.successStatus,
    jobId: response.data.JobId
  };
}


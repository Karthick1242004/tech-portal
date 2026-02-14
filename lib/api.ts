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

export async function reportJob(payload: ReportJobPayload): Promise<ReportJobResponse> {
  // Transform frontend camelCase to backend format
  // Note: Context is an integer in backend, but we capture text. Appending text to Description.
  const descriptionWithContext = payload.context
    ? `${payload.description}\n\nContext: ${payload.context}`
    : payload.description;

  // Build payload with required fields
  const backendPayload: any = {
    Description: descriptionWithContext,
    ReportText: payload.reporterText, // Mapped to ReportText (Problem Description)
    EquipmentId: payload.equipmentId,
    ProcessFunctionId: payload.processFunctionId,
    WorkOrderTypeId: payload.workOrderTypeId,
    ReportDate: payload.reportDate,
  };

  // Only include SiteId and SpaceId if they have values (to avoid validation errors)
  if (payload.siteId && payload.siteId.trim()) {
    backendPayload.SiteId = payload.siteId;
  }
  if (payload.specId && payload.specId.trim()) {
    backendPayload.SpaceId = payload.specId;
  }

  // Include image fields if present
  if (payload.imageFile1) backendPayload.ImageFile1 = payload.imageFile1;
  if (payload.imageFile2) backendPayload.ImageFile2 = payload.imageFile2;
  if (payload.imageFile3) backendPayload.ImageFile3 = payload.imageFile3;
  if (payload.imageFile4) backendPayload.ImageFile4 = payload.imageFile4;
  if (payload.imageFile5) backendPayload.ImageFile5 = payload.imageFile5;
  if (payload.imageFile6) backendPayload.ImageFile6 = payload.imageFile6;
  if (payload.imageFileBase64_1) backendPayload.ImageFileBase64_1 = payload.imageFileBase64_1;
  if (payload.imageFileBase64_2) backendPayload.ImageFileBase64_2 = payload.imageFileBase64_2;
  if (payload.imageFileBase64_3) backendPayload.ImageFileBase64_3 = payload.imageFileBase64_3;
  if (payload.imageFileBase64_4) backendPayload.ImageFileBase64_4 = payload.imageFileBase64_4;
  if (payload.imageFileBase64_5) backendPayload.ImageFileBase64_5 = payload.imageFileBase64_5;
  if (payload.imageFileBase64_6) backendPayload.ImageFileBase64_6 = payload.imageFileBase64_6;
  if (payload.imageFileName1) backendPayload.ImageFileName1 = payload.imageFileName1;
  if (payload.imageFileName2) backendPayload.ImageFileName2 = payload.imageFileName2;
  if (payload.imageFileName3) backendPayload.ImageFileName3 = payload.imageFileName3;
  if (payload.imageFileName4) backendPayload.ImageFileName4 = payload.imageFileName4;
  if (payload.imageFileName5) backendPayload.ImageFileName5 = payload.imageFileName5;
  if (payload.imageFileName6) backendPayload.ImageFileName6 = payload.imageFileName6;

  const response = await apiClient.post<{ success: boolean; data: any }>('/jobs/report', backendPayload);
  return {
    message: response.data.message,
    successStatus: response.data.successStatus,
    jobId: response.data.JobId
  };
}


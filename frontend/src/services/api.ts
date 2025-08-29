import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore, isTokenExpired } from '@/stores/authStore';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    
    if (accessToken && !isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { refreshToken, updateTokens, logout } = useAuthStore.getState();
      
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
          updateTokens(newAccessToken, newRefreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          logout();
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      } else {
        logout();
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    }
    
    // Handle other errors
    if (error.response?.data?.error?.message) {
      toast.error(error.response.data.error.message);
    } else if (error.message) {
      toast.error(error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  message?: string;
}

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.get(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.post(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.put(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.delete(url, config),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> =>
    apiClient.patch(url, data, config),
};

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    subscriptionTier: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),
    
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data),
    
  logout: () =>
    api.post('/auth/logout'),
    
  getProfile: () =>
    api.get('/auth/me'),
    
  updateProfile: (data: { firstName?: string; lastName?: string; avatarUrl?: string }) =>
    api.put('/auth/profile', data),
    
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
};

// Companion API
export interface Companion {
  id: string;
  name: string;
  subjectDomain?: string;
  systemPrompt: string;
  voiceId?: string;
  speakingStyle?: string;
  isPublic: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  _count: {
    courses: number;
    sessions: number;
    knowledgeSources: number;
  };
}

export interface CreateCompanionRequest {
  name: string;
  subjectDomain?: string;
  systemPrompt: string;
  voiceId?: string;
  speakingStyle?: string;
  isPublic?: boolean;
}

export const companionApi = {
  getCompanions: (includePublic?: boolean) =>
    api.get<{ companions: Companion[] }>('/companions', {
      params: { includePublic },
    }),
    
  getCompanionById: (id: string) =>
    api.get<{ companion: Companion }>(`/companions/${id}`),
    
  createCompanion: (data: CreateCompanionRequest) =>
    api.post<{ companion: Companion }>('/companions', data),
    
  updateCompanion: (id: string, data: Partial<CreateCompanionRequest>) =>
    api.put<{ companion: Companion }>(`/companions/${id}`, data),
    
  deleteCompanion: (id: string) =>
    api.delete(`/companions/${id}`),
    
  searchCompanions: (query: string, includePublic?: boolean) =>
    api.get<{ companions: Companion[] }>('/companions/search', {
      params: { q: query, includePublic },
    }),
    
  testCompanion: (id: string, message: string) =>
    api.post(`/companions/${id}/test`, { message }),
};

// Course API
export interface Course {
  id: string;
  title: string;
  description?: string;
  subjectDomain?: string;
  difficultyLevel?: string;
  estimatedDuration?: number;
  isPublic: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  companion?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  chapters: Chapter[];
  documents: CourseDocument[];
  _count: {
    chapters: number;
    assessments: number;
    userProgress: number;
  };
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
  estimatedDuration?: number;
  voiceNarrationUrl?: string;
  narrationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDocument {
  id: string;
  originalFilename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  processingStatus: string;
  extractedContent?: string;
  createdAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  subjectDomain?: string;
  difficultyLevel?: string;
  estimatedDuration?: number;
  isPublic?: boolean;
  companionId?: string;
}

export interface GenerateCourseRequest {
  generateNarration?: boolean;
  generateAssessments?: boolean;
}

export const courseApi = {
  getCourses: (includePublic?: boolean) =>
    api.get<{ courses: Course[] }>('/courses', {
      params: { includePublic },
    }),
    
  getCourseById: (id: string) =>
    api.get<{ course: Course }>(`/courses/${id}`),
    
  createCourse: (data: CreateCourseRequest) =>
    api.post<{ course: Course }>('/courses', data),
    
  updateCourse: (id: string, data: Partial<CreateCourseRequest>) =>
    api.put<{ course: Course }>(`/courses/${id}`, data),
    
  deleteCourse: (id: string) =>
    api.delete(`/courses/${id}`),

  uploadDocuments: (courseId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('documents', file);
    });
    
    return api.post<{ documents: CourseDocument[] }>(`/courses/${courseId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  generateCourse: (courseId: string, options: GenerateCourseRequest = {}) =>
    api.post<{
      course: Course;
      chapters: Chapter[];
      assessments: any[];
    }>(`/courses/${courseId}/generate`, options),
};

// Analytics API (placeholder)
export const analyticsApi = {
  getDashboard: () =>
    api.get('/analytics/dashboard'),
};

export default api;

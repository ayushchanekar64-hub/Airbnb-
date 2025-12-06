// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Generic request method
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// API Endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    register: (userData: {
      name: string;
      email: string;
      password: string;
      role: 'guest' | 'host';
    }) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout', {}),
    refreshToken: () => apiClient.post('/auth/refresh', {}),
    verifyEmail: (token: string) => apiClient.post('/auth/verify-email', { token }),
    forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) =>
      apiClient.post('/auth/reset-password', { token, password }),
  },

  // User endpoints
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: any) => apiClient.put('/users/profile', data),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.put('/users/change-password', data),
    uploadAvatar: (formData: FormData) => {
      return apiClient.request('/users/avatar', {
        method: 'POST',
        body: formData,
        headers: {}, // Remove content-type to let browser set it for FormData
      });
    },
    getFavorites: () => apiClient.get('/users/favorites'),
    addToFavorites: (propertyId: string) =>
      apiClient.post('/users/favorites', { propertyId }),
    removeFromFavorites: (propertyId: string) =>
      apiClient.delete(`/users/favorites/${propertyId}`),
    getBookings: () => apiClient.get('/users/bookings'),
    getReviews: () => apiClient.get('/users/reviews'),
  },

  // Properties endpoints
  properties: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
      minPrice?: number;
      maxPrice?: number;
      location?: string;
      amenities?: string[];
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiClient.get(`/properties?${query}`);
    },
    getById: (id: string) => apiClient.get(`/properties/${id}`),
    create: (data: any) => apiClient.post('/properties', data),
    update: (id: string, data: any) => apiClient.put(`/properties/${id}`, data),
    delete: (id: string) => apiClient.delete(`/properties/${id}`),
    uploadImages: (propertyId: string, formData: FormData) => {
      return apiClient.request(`/properties/${propertyId}/images`, {
        method: 'POST',
        body: formData,
        headers: {},
      });
    },
    getReviews: (id: string) => apiClient.get(`/properties/${id}/reviews`),
    addReview: (id: string, data: {
      rating: number;
      title: string;
      content: string;
      categories: {
        cleanliness: number;
        accuracy: number;
        checkIn: number;
        communication: number;
        location: number;
        value: number;
      };
    }) => apiClient.post(`/properties/${id}/reviews`, data),
    getAvailability: (id: string, startDate: string, endDate: string) =>
      apiClient.get(`/properties/${id}/availability?startDate=${startDate}&endDate=${endDate}`),
    checkAvailability: (id: string, dates: { startDate: string; endDate: string }) =>
      apiClient.post(`/properties/${id}/check-availability`, dates),
  },

  // Bookings endpoints
  bookings: {
    create: (data: {
      propertyId: string;
      startDate: string;
      endDate: string;
      guests: number;
      totalPrice: number;
      specialRequests?: string;
    }) => apiClient.post('/bookings', data),
    getById: (id: string) => apiClient.get(`/bookings/${id}`),
    update: (id: string, data: any) => apiClient.put(`/bookings/${id}`, data),
    cancel: (id: string, reason?: string) =>
      apiClient.post(`/bookings/${id}/cancel`, { reason }),
    confirm: (id: string) => apiClient.post(`/bookings/${id}/confirm`, {}),
    reject: (id: string, reason?: string) =>
      apiClient.post(`/bookings/${id}/reject`, { reason }),
    complete: (id: string) => apiClient.post(`/bookings/${id}/complete`, {}),
    getUserBookings: (status?: 'pending' | 'confirmed' | 'cancelled' | 'completed') =>
      apiClient.get(`/bookings/user${status ? `?status=${status}` : ''}`),
    getHostBookings: (status?: 'pending' | 'confirmed' | 'cancelled' | 'completed') =>
      apiClient.get(`/bookings/host${status ? `?status=${status}` : ''}`),
  },

  // Messages endpoints
  messages: {
    getConversations: () => apiClient.get('/messages/conversations'),
    getMessages: (conversationId: string) =>
      apiClient.get(`/messages/conversations/${conversationId}`),
    sendMessage: (conversationId: string, data: { content: string; type?: 'text' | 'image' }) =>
      apiClient.post(`/messages/conversations/${conversationId}/messages`, data),
    createConversation: (userId: string, propertyId: string) =>
      apiClient.post('/messages/conversations', { userId, propertyId }),
    markAsRead: (conversationId: string) =>
      apiClient.post(`/messages/conversations/${conversationId}/read`, {}),
    deleteConversation: (conversationId: string) =>
      apiClient.delete(`/messages/conversations/${conversationId}`),
    uploadImage: (conversationId: string, formData: FormData) => {
      return apiClient.request(`/messages/conversations/${conversationId}/upload`, {
        method: 'POST',
        body: formData,
        headers: {},
      });
    },
  },

  // Reviews endpoints
  reviews: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      rating?: number;
      propertyId?: string;
      userId?: string;
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiClient.get(`/reviews?${query}`);
    },
    getById: (id: string) => apiClient.get(`/reviews/${id}`),
    update: (id: string, data: any) => apiClient.put(`/reviews/${id}`, data),
    delete: (id: string) => apiClient.delete(`/reviews/${id}`),
    markHelpful: (id: string) => apiClient.post(`/reviews/${id}/helpful`, {}),
    report: (id: string, reason: string) =>
      apiClient.post(`/reviews/${id}/report`, { reason }),
  },

  // Host endpoints
  host: {
    getDashboard: () => apiClient.get('/host/dashboard'),
    getProperties: () => apiClient.get('/host/properties'),
    getEarnings: (params?: {
      startDate?: string;
      endDate?: string;
      period?: 'day' | 'week' | 'month' | 'year';
    }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiClient.get(`/host/earnings?${query}`);
    },
    getAnalytics: () => apiClient.get('/host/analytics'),
    updateListingSettings: (propertyId: string, data: any) =>
      apiClient.put(`/host/properties/${propertyId}/settings`, data),
    respondToReview: (reviewId: string, content: string) =>
      apiClient.post(`/host/reviews/${reviewId}/respond`, { content }),
  },

  // Search endpoints
  search: {
    properties: (query: {
      location?: string;
      checkIn?: string;
      checkOut?: string;
      guests?: number;
      minPrice?: number;
      maxPrice?: number;
      propertyType?: string;
      amenities?: string[];
      page?: number;
      limit?: number;
    }) => {
      const searchQuery = new URLSearchParams(query as any).toString();
      return apiClient.get(`/search/properties?${searchQuery}`);
    },
    autocomplete: (query: string) =>
      apiClient.get(`/search/autocomplete?q=${encodeURIComponent(query)}`),
    getPopularDestinations: () => apiClient.get('/search/popular-destinations'),
  },

  // Notifications endpoints
  notifications: {
    getAll: (params?: { page?: number; limit?: number; unread?: boolean }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiClient.get(`/notifications?${query}`);
    },
    markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/read-all'),
    delete: (id: string) => apiClient.delete(`/notifications/${id}`),
    getPreferences: () => apiClient.get('/notifications/preferences'),
    updatePreferences: (preferences: any) =>
      apiClient.put('/notifications/preferences', preferences),
  },

  // Payment endpoints
  payments: {
    createPaymentIntent: (data: {
      bookingId: string;
      amount: number;
      currency?: string;
    }) => apiClient.post('/payments/create-intent', data),
    confirmPayment: (paymentIntentId: string) =>
      apiClient.post('/payments/confirm', { paymentIntentId }),
    getPaymentMethods: () => apiClient.get('/payments/methods'),
    addPaymentMethod: (data: any) => apiClient.post('/payments/methods', data),
    deletePaymentMethod: (methodId: string) =>
      apiClient.delete(`/payments/methods/${methodId}`),
    getTransactionHistory: (params?: { page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiClient.get(`/payments/history?${query}`);
    },
  },

  // Admin endpoints
  admin: {
    getUsers: (params?: { page?: number; limit?: number; role?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiClient.get(`/admin/users?${query}`);
    },
    updateUser: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
    getProperties: (params?: { page?: number; limit?: number; status?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiClient.get(`/admin/properties?${query}`);
    },
    updateProperty: (id: string, data: any) => apiClient.put(`/admin/properties/${id}`, data),
    deleteProperty: (id: string) => apiClient.delete(`/admin/properties/${id}`),
    getReports: () => apiClient.get('/admin/reports'),
    getAnalytics: () => apiClient.get('/admin/analytics'),
  },
};

// Export types for better TypeScript support
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default api;

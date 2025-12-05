import { useState, useEffect, useCallback } from 'react';
import { api, ApiResponse, PaginatedResponse } from '@/services/api';

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Properties hooks
export function useProperties(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  amenities?: string[];
}) {
  return useApi(
    () => api.properties.getAll(params),
    [JSON.stringify(params)]
  );
}

export function useProperty(id: string) {
  return useApi(() => api.properties.getById(id), [id]);
}

export function usePropertyReviews(id: string) {
  return useApi(() => api.properties.getReviews(id), [id]);
}

// Auth hooks
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      api.users.getProfile()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.auth.login(credentials) as { token: string; user: any };
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'guest' | 'host';
  }) => {
    try {
      const response = await api.auth.register(userData) as { token?: string; user: any };
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  return { user, loading, login, register, logout };
}

// Bookings hooks
export function useUserBookings(status?: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  return useApi(() => api.bookings.getUserBookings(status), [status]);
}

export function useHostBookings(status?: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  return useApi(() => api.bookings.getHostBookings(status), [status]);
}

export function useBooking(id: string) {
  return useApi(() => api.bookings.getById(id), [id]);
}

// Favorites hooks
export function useFavorites() {
  return useApi(() => api.users.getFavorites(), []);
}

export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFavorite = useCallback(async (propertyId: string, isCurrentlyFavorite: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isCurrentlyFavorite) {
        await api.users.removeFromFavorites(propertyId);
      } else {
        await api.users.addToFavorites(propertyId);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggleFavorite, loading, error };
}

// Messages hooks
export function useConversations() {
  return useApi(() => api.messages.getConversations(), []);
}

export function useMessages(conversationId: string) {
  return useApi(() => api.messages.getMessages(conversationId), [conversationId]);
}

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.messages.sendMessage(conversationId, { content });
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, loading, error };
}

export function useReviews(params?: {
  page?: number;
  limit?: number;
  rating?: number;
  propertyId?: string;
  userId?: string;
}) {
  return useApi(() => api.reviews.getAll(params), [JSON.stringify(params)]);
}

export function useCreateReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReview = useCallback(async (propertyId: string, reviewData: {
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
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.properties.addReview(propertyId, reviewData);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createReview, loading, error };
}

// Search hooks
export function useSearch(query: {
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
}) {
  return useApi(() => api.search.properties(query), [JSON.stringify(query)]);
}

export function useAutocomplete(query: string) {
  return useApi(() => api.search.autocomplete(query), [query]);
}

// Host hooks
export function useHostDashboard() {
  return useApi(() => api.host.getDashboard(), []);
}

export function useHostEarnings(params?: {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}) {
  return useApi(() => api.host.getEarnings(params), [JSON.stringify(params)]);
}

export function useHostAnalytics() {
  return useApi(() => api.host.getAnalytics(), []);
}

// Notifications hooks
export function useNotifications(unread?: boolean) {
  return useApi(() => api.notifications.getAll({ unread }), [unread]);
}

export function useMarkNotificationAsRead() {
  const [loading, setLoading] = useState(false);

  const markAsRead = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await api.notifications.markAsRead(id);
    } finally {
      setLoading(false);
    }
  }, []);

  return { markAsRead, loading };
}

// Payment hooks
export function useCreatePaymentIntent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (data: {
    bookingId: string;
    amount: number;
    currency?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.payments.createPaymentIntent(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment intent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPaymentIntent, loading, error };
}

// File upload hook
export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File,
    endpoint: 'avatar' | 'property-images' | 'message-image',
    additionalData?: any
  ) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
      }

      let response;
      switch (endpoint) {
        case 'avatar':
          response = await api.users.uploadAvatar(formData);
          break;
        case 'property-images':
          response = await api.properties.uploadImages(additionalData?.propertyId, formData);
          break;
        case 'message-image':
          response = await api.messages.uploadImage(additionalData?.conversationId, formData);
          break;
        default:
          throw new Error('Invalid upload endpoint');
      }

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadFile, loading, error };
}

// Real-time hook for WebSocket connections
export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setConnected(true);
      setSocket(ws);
    };

    ws.onclose = () => {
      setConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, connected]);

  return { socket, connected, lastMessage, sendMessage };
}

// Debounced search hook
export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await searchFunction(query);
        setResults(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, searchFunction, delay]);

  return { query, setQuery, results, loading, error };
}

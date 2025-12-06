export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'host' | 'admin';
  avatar?: string;
  phone?: string;
  bio?: string;
  isVerified?: boolean;
  walletBalance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  propertyType: string;
  amenities: string[];
  images: string[];
  host: User;
  rating: number;
  numReviews: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  listing: Listing;
  guest: User;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  listing: Listing;
  reviewer: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
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
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'host';
  phone?: string;
}

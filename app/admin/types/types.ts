// User types
export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  lost_items_count: number;
  found_items_count: number;
}

// Lost Item types
export interface LostItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  date_lost: string;
  contact_info: string;
  reward: string;
  image: string;
  created_at: string;
  status: 'active' | 'resolved' | 'closed';
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
}

// Found Item types
export interface FoundItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  date_found: string;
  contact_info: string;
  storage_location: string;
  image: string;
  created_at: string;
  status: 'active' | 'resolved' | 'closed';
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
}

// Match types
export interface Match {
  id: string;
  lostPost: {
    _id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;
    imageUrl: string | null;
    user: {
      name: string;
      email: string;
      phone: string;
    }
  };
  foundPost: {
    _id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;
    imageUrl: string | null;
    user: {
      name: string;
      email: string;
      phone: string;
    }
  };
  matchScore: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalLostItems: number;
  totalFoundItems: number;
  pendingMatches: number;
  activeLostItems: number;
  activeFoundItems: number;
  resolvedCases: number;
  verificationRate: number;
}

// Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
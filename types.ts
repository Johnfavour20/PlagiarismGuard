
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  university: string;
}

export interface Submission {
    _id: string;
    title: string;
    studentName: string;
    studentEmail: string;
    createdAt: string;
    similarityScore: number;
    status: 'verified' | 'pending' | 'flagged';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  updateProfile: (updates: any) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLecturer: boolean;
  isStudent: boolean;
}

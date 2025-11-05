
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  university: string;
  password?: string; // Add password for mock authentication
  createdAt: string; // ISO string
}

export interface PlagiarizedSource {
  documentId: string;
  documentTitle: string;
  authorName: string;
  similarity: number; // Percentage of matching paragraphs from this source
}

export interface Paragraph {
  text: string;
  hash: string;
  isPlagiarized: boolean;
  sourceDocumentId?: string;
}

export interface Submission {
  _id: string; 
  title: string;
  courseCode: string;
  documentType: string;
  description: string;
  
  authorId: string;
  authorName: string;
  
  university: string;

  createdAt: string; // ISO string
  
  fullText: string;
  paragraphs: Paragraph[];
  merkleRoot: string;
  
  similarityScore: number;
  status: 'verified' | 'pending' | 'flagged';
  plagiarismSources: PlagiarizedSource[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>;
  login: (email: string, password:string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  updateProfile: (updates: { name: string; university: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLecturer: boolean;
  isStudent: boolean;
}
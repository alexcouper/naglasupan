// Types generated from Django backend OpenAPI spec

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  kennitala: string;
  is_verified: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  website_url: string;
  github_url: string | null;
  demo_url: string | null;
  screenshot_urls: string[];
  tech_stack: string[];
  monthly_visitors: number;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  created_at: string;
  approved_at: string | null;
  owner: User;
  tags: Tag[];
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface ProjectCreate {
  url: string;
  description?: string;
  // Optional fields - will be filled by admin during review
  title?: string;
  long_description?: string;
  github_url?: string;
  demo_url?: string;
  screenshot_urls?: string[];
  tech_stack?: string[];
  tag_ids?: string[];
}

export interface ProjectUpdate {
  url?: string;
  description?: string;
  title?: string;
  long_description?: string;
  github_url?: string;
  demo_url?: string;
  screenshot_urls?: string[];
  tech_stack?: string[];
  tag_ids?: string[];
}

export interface AdminProject extends Project {
  rejection_reason: string | null;
  approved_by: User | null;
  submission_month: string;
}

export interface ProjectApproval {
  approved: boolean;
  rejection_reason?: string;
  is_featured?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  kennitala: string;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TagCreate {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface ProjectFilters {
  tags?: string[];
  tech_stack?: string[];
  sort_by?: 'created_at' | 'monthly_visitors' | 'title';
  sort_order?: 'asc' | 'desc';
  search?: string;
  page?: number;
  per_page?: number;
}
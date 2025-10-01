import { 
  Project, 
  ProjectListResponse, 
  ProjectCreate, 
  ProjectUpdate,
  Tag, 
  User, 
  LoginRequest, 
  UserCreate, 
  Token, 
  ProjectFilters,
  AdminProject,
  ProjectApproval
} from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      // Handle 401 Unauthorized - clear token and redirect to login
      if (response.status === 401) {
        this.clearToken()
        // Trigger a global logout event that components can listen to
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('unauthorized'))
        }
      }
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<Token> {
    const token = await this.request<Token>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    this.setToken(token.access_token)
    return token
  }

  async register(userData: UserCreate): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  async validateToken(): Promise<User | null> {
    try {
      if (!this.token) {
        return null
      }
      return await this.getCurrentUser()
    } catch (error) {
      // Token is invalid, clear it
      this.clearToken()
      return null
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Project methods
  async getProjects(filters?: ProjectFilters): Promise<ProjectListResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.tags?.length) params.append('tags', filters.tags.join(','))
      if (filters.tech_stack?.length) params.append('tech_stack', filters.tech_stack.join(','))
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.per_page) params.append('per_page', filters.per_page.toString())
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<ProjectListResponse>(`/projects${query}`)
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects/featured')
  }

  async getTrendingProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects/trending')
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`)
  }

  async getMyProjects(): Promise<Project[]> {
    return this.request<Project[]>('/my/projects')
  }

  async getUserProjects(): Promise<Project[]> {
    return this.request<Project[]>('/my/projects')
  }

  async createProject(projectData: ProjectCreate): Promise<Project> {
    return this.request<Project>('/my/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }

  async updateProject(id: string, projectData: ProjectUpdate): Promise<Project> {
    return this.request<Project>(`/my/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    })
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/my/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Tag methods
  async getTags(): Promise<Tag[]> {
    return this.request<Tag[]>('/tags')
  }

  // Admin methods
  async getAdminProjects(filters?: ProjectFilters): Promise<ProjectListResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.per_page) params.append('per_page', filters.per_page.toString())
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<ProjectListResponse>(`/admin/projects${query}`)
  }

  async approveProject(id: string, approval: ProjectApproval): Promise<AdminProject> {
    return this.request<AdminProject>(`/admin/projects/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(approval),
    })
  }

  async toggleProjectFeatured(id: string): Promise<AdminProject> {
    return this.request<AdminProject>(`/admin/projects/${id}/feature`, {
      method: 'PUT',
    })
  }
}

export const apiClient = new ApiClient()
export { ApiError }
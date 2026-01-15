import type { components } from "./api-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type TokenResponse = components["schemas"]["Token"];
type User = components["schemas"]["UserResponse"];
type Project = components["schemas"]["ProjectResponse"];
type ProjectCreate = components["schemas"]["ProjectCreate"];
type ProjectImage = components["schemas"]["ProjectImageResponse"];
type PresignedUploadResponse = components["schemas"]["PresignedUploadResponse"];
type ApiError = components["schemas"]["Error"];
type ReviewCompetitionListResponse =
  components["schemas"]["ReviewCompetitionListResponse"];
type ReviewCompetitionDetailResponse =
  components["schemas"]["ReviewCompetitionDetailResponse"];
type ReviewCompetition = components["schemas"]["ReviewCompetitionResponse"];
type ReviewProject = components["schemas"]["ReviewProjectResponse"];

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("access_token");
      this.refreshToken = localStorage.getItem("refresh_token");
    }
  }

  private setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
    }
  }

  private setAccessToken(access: string) {
    this.accessToken = access;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private async attemptTokenRefresh(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    // If already refreshing, wait for that to complete
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        });

        if (!response.ok) {
          return false;
        }

        const data = await response.json();
        this.setAccessToken(data.access_token);
        return true;
      } catch {
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && !isRetry) {
      const refreshed = await this.attemptTokenRefresh();
      if (refreshed) {
        return this.request<T>(endpoint, options, true);
      }

      this.clearTokens();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:logout"));
      }
      throw new Error("Unauthorized");
    }

    if (response.status === 401) {
      this.clearTokens();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:logout"));
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Request failed");
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    kennitala: string;
  }): Promise<User> {
    return this.request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        first_name: "",
        last_name: "",
      }),
    });
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setTokens(response.access_token, response.refresh_token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/api/auth/me");
  }

  // Project endpoints
  async createProject(data: ProjectCreate): Promise<Project> {
    return this.request<Project>("/api/my/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyProjects(): Promise<Project[]> {
    return this.request<Project[]>("/api/my/projects");
  }

  async getMyProject(id: string): Promise<Project> {
    return this.request<Project>(`/api/my/projects/${id}`);
  }

  async updateProject(
    id: string,
    data: {
      title?: string;
      description?: string;
      website_url?: string;
    }
  ): Promise<Project> {
    return this.request<Project>(`/api/my/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/api/my/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Image upload endpoints
  async getImageUploadUrl(
    projectId: string,
    filename: string,
    contentType: string,
    fileSize: number
  ): Promise<PresignedUploadResponse> {
    return this.request<PresignedUploadResponse>(
      `/api/my/projects/${projectId}/images/upload-url`,
      {
        method: "POST",
        body: JSON.stringify({
          filename,
          content_type: contentType,
          file_size: fileSize,
        }),
      }
    );
  }

  async completeImageUpload(
    projectId: string,
    imageId: string,
    dimensions?: { width: number; height: number }
  ): Promise<ProjectImage> {
    return this.request<ProjectImage>(
      `/api/my/projects/${projectId}/images/${imageId}/complete`,
      {
        method: "POST",
        body: JSON.stringify(dimensions || {}),
      }
    );
  }

  async deleteImage(projectId: string, imageId: string): Promise<void> {
    return this.request<void>(
      `/api/my/projects/${projectId}/images/${imageId}`,
      { method: "DELETE" }
    );
  }

  async setMainImage(projectId: string, imageId: string): Promise<ProjectImage> {
    return this.request<ProjectImage>(
      `/api/my/projects/${projectId}/images/main`,
      {
        method: "POST",
        body: JSON.stringify({ image_id: imageId }),
      }
    );
  }

  // Review endpoints
  async getMyReviewCompetitions(): Promise<ReviewCompetitionListResponse> {
    return this.request<ReviewCompetitionListResponse>(
      "/api/my-review/competitions"
    );
  }

  async getMyReviewCompetition(
    competitionId: string
  ): Promise<ReviewCompetitionDetailResponse> {
    return this.request<ReviewCompetitionDetailResponse>(
      `/api/my-review/competitions/${competitionId}`
    );
  }

  async updateRankings(
    competitionId: string,
    projectIds: string[]
  ): Promise<ReviewCompetitionDetailResponse> {
    return this.request<ReviewCompetitionDetailResponse>(
      `/api/my-review/competitions/${competitionId}/rankings`,
      {
        method: "PUT",
        body: JSON.stringify({ project_ids: projectIds }),
      }
    );
  }
}

export const apiClient = new ApiClient();
export type {
  User,
  Project,
  ProjectImage,
  TokenResponse,
  ReviewCompetition,
  ReviewProject,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  status: "pending" | "approved" | "rejected";
  is_featured: boolean;
  created_at: string;
  approved_at: string | null;
  owner: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    kennitala: string | null;
    is_verified: boolean;
    created_at: string;
  };
  tags: Array<{ id: string; name: string; slug: string; description: string | null; color: string | null }>;
}

interface ApiError {
  detail: string;
}

async function serverFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
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

export async function getMyProjectsServer(token: string): Promise<Project[]> {
  return serverFetch<Project[]>("/api/my/projects", token);
}

export async function getMyProjectServer(id: string, token: string): Promise<Project> {
  return serverFetch<Project>(`/api/my/projects/${id}`, token);
}

"use server";

import { getMyProjectsServer, getMyProjectServer } from "@/lib/api-server";
import type { Project } from "@/lib/api";

export async function fetchMyProjects(token: string): Promise<{ projects?: Project[]; error?: string }> {
  try {
    const projects = await getMyProjectsServer(token);
    return { projects };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to load projects" };
  }
}

export async function fetchMyProject(id: string, token: string): Promise<{ project?: Project; error?: string }> {
  try {
    const project = await getMyProjectServer(id, token);
    return { project };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to load project" };
  }
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ProjectLike = {
  project_origin?: string | null;
  status?: string | null;
  expires_at?: string | null;
};

export const isExternalProject = (project: ProjectLike) =>
  project?.project_origin === "external";

export const canApplyExternally = (project: ProjectLike) => {
  if (!isExternalProject(project)) {
    return false;
  }

  if (project.status !== "open") {
    return false;
  }

  if (!project.expires_at) {
    return true;
  }

  const now = new Date();
  const expiry = new Date(project.expires_at);

  if (Number.isNaN(expiry.getTime())) {
    return false;
  }

  return expiry.getTime() > now.getTime();
};

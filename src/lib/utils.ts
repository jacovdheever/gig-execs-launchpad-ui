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

/** When set (e.g. consultants on find-gigs), external apply requires Basic profile + active subscription (PRD §5.5). */
export type ExternalApplyAccessGate = {
  basicProfileComplete: boolean;
  subscriptionAccess: boolean;
};

export const isExternalProject = (project: ProjectLike) =>
  project?.project_origin === "external";

export const canApplyExternally = (
  project: ProjectLike,
  access?: ExternalApplyAccessGate
) => {
  if (!isExternalProject(project)) {
    return false;
  }

  if (project.status !== "open") {
    return false;
  }

  if (access) {
    if (!access.basicProfileComplete || !access.subscriptionAccess) {
      return false;
    }
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

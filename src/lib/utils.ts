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

/** When set (e.g. consultants on find-gigs), opening an external apply link requires Basic profile + active subscription. */
export type ExternalApplyAccessGate = {
  basicProfileComplete: boolean;
  subscriptionAccess: boolean;
};

export const isExternalProject = (project: ProjectLike) =>
  project?.project_origin === "external";

/** External apply control is shown when the gig is open and not expired (URL checked at call sites). Subscription/basic are enforced on click. */
export const canOfferExternalApplyControl = (project: ProjectLike) => {
  if (!isExternalProject(project) || project.status !== "open") {
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

export const canApplyExternally = (
  project: ProjectLike,
  access?: ExternalApplyAccessGate
) => {
  if (!canOfferExternalApplyControl(project)) {
    return false;
  }

  if (access) {
    if (!access.basicProfileComplete || !access.subscriptionAccess) {
      return false;
    }
  }

  return true;
};

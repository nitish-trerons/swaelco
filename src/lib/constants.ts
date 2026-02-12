export const ROLES = ["admin", "project_manager", "technician", "customer"] as const;

export const PROJECT_STATUSES = [
  "inquiry",
  "quoted",
  "approved",
  "in_progress",
  "inspection",
  "completed",
] as const;

export const PROJECT_TYPES = ["new_installation", "modernization", "repair"] as const;

export const TASK_STATUSES = ["pending", "in_progress", "done", "cancelled"] as const;

export const DOCUMENT_TYPES = ["blueprint", "permit", "contract", "inspection_report"] as const;

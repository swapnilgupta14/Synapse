export interface CreateOrganisationPayload {
    name: string;
    description?: string;
    ownerId: number;
  }
  
  export interface AddProjectPayload {
    name: string;
    description?: string;
    organisationId: number;
    projectManagerId: number;
    startDate?: string;
    endDate?: string;
  }
  
  export interface AddTeamPayload {
    name: string;
    projectId: number;
    teamManagerId: number;
    description?: string;
    teamId?: number;
  }
  
  export interface AddTaskPayload {
    title: string;
    description?: string;
    priority: "high" | "medium" | "low";
    category?: string;
    dueDate?: string;
    createdBy?: number;
    assignedTo?: number;
    teamId?: number;
  }
  
  export interface UpdateTaskPayload {
    id?: number;
    title?: string;
    description?: string;
    priority?: "high" | "medium" | "low";
    category?: string;
    dueDate?: string;
    status?: "pending" | "completed" | "in-progress";
    updatedAt?: string;
    lastModifiedBy?: number;
  }
  
  export interface BulkUpdatePayload {
    ids: number[];
    updates: Partial<Omit<Task, "id" | "teamId" | "createdAt">>;
  }
  
  export interface AdminTaskUpdatePayload {
    id: number;
    updates: Partial<Task>;
  }
export interface User {
  id: number;
  username: string;
  role:
    | "Admin"
    | "Organisation"
    | "Project Manager"
    | "Team Manager"
    | "Team Member";
  email: string;
  token: string;
  password?: string;
  createdAt?: string;
  organisationId?: number;
  teamId?: number[];
}

export type RoleType =
  | "Admin"
  | "Organisation"
  | "Project Manager"
  | "Team Manager"
  | "Team Member";

export interface Organisation extends User {
  organisationId: number;
  description?: string;
  ownerId: number;
  members?: User[];
  location?: string;
}

export interface Project {
  projectId: number;
  name: string;
  description?: string;
  organisationId: number;
  projectManagerId: number;
  teams: Team[];
  // teams: number[];
  createdAt: string;
  status: "active" | "archived" | "planning";
  startDate?: string;
  endDate?: string;
}

export interface Team {
  teamId: number;
  name: string;
  projectId: number;
  members: User[];
  teamManagerId: number;
  createdAt: string;
  description?: string;
}

export interface Task {
  taskId: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  dueDate: string;
  status: "completed" | "pending" | "in-progress";
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  assignedTo: number;
  teamId?: number;
  projectId?: number;
  organisationId?: number;
  createdBy: number;
  lastModifiedBy?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  currentOrganisation?: Organisation | null;
}

export interface TaskState {
  tasks: Task[];
  user: User;
  currentProject?: Project;
  currentOrganisation?: Organisation;
  statistics: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    highPriorityTasks: number;
    tasksPerTeam: Record<number, number>;
    tasksPerProject: Record<number, number>;
    tasksByCategory: { [key: string]: number };
    averageCompletionTime: number;
    overdueTasksCount: number;
  };
}

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

export interface DashboardContentProps {
  tasks: Task[];
}

export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasksCount: number;
}

export interface RootState {
  tasks: Task[];
  statistics: Statistics;
}

export interface AddTaskPayload {
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  category?: string;
  dueDate?: string;
  assignedTo?: number;
  teamId?: number;
}

export interface UpdateTaskPayload {
  id: number;
  title?: string;
  description?: string;
  priority?: "high" | "medium" | "low";
  category?: string;
  dueDate?: string;
  status?: "pending" | "completed";
}

export interface BulkUpdatePayload {
  ids: number[];
  updates: Partial<Omit<Task, "id" | "teamId" | "createdAt">>;
}

export interface AdminTaskUpdatePayload {
  id: number;
  updates: Partial<Task>;
}

export interface TaskAnalytics {
  startDate: string;
  endDate: string;
  teamId?: number;
}

export interface TeamsState {
  teams: Team[];
}

export interface ProjectsState {
  projects: Project[];
}

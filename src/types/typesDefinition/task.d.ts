export interface Task {
  taskId: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  dueDate: string;
  status: "completed" | "pending" | "in-progress" | "archieved";
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  assignedTo: number | undefined;
  teamId?: number;
  projectId?: number;
  organisationId?: number;
  createdBy: number;
  lastModifiedBy?: number;
  id?: number;
}

export interface TaskState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  statistics: TaskStatistics;
}

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  tasksPerTeam: Record<number, number>;
  tasksPerProject: Record<number, number>;
  tasksByCategory: { [key: string]: number };
  averageCompletionTime: number;
  overdueTasksCount: number;
}

export interface TaskAnalytics {
  startDate: string;
  endDate: string;
  teamId?: number;
}

export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasksCount: number;
}

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
    assignedTo: number | undefined;
    teamId?: number;
    projectId?: number;
    organisationId?: number;
    createdBy: number;
    lastModifiedBy?: number;
  }
  
  export interface TaskState {
    tasks: Task[];
    user: User;
    lastTaskTimestamp?: number;
    currentProject?: Project;
    currentOrganisation?: Organisation;
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
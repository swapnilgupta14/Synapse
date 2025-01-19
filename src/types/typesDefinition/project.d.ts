export interface Project {
    projectId: number;
    name: string;
    description?: string;
    organisationId: number;
    projectManagerId: number;
    teams: number[];
    createdAt: string;
    status: "active" | "archived" | "planning";
    startDate?: string;
    endDate?: string;
  }
  
  export interface ProjectsState {
    projects: Project[];
  }
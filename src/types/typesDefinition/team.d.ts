export interface Team {
    teamId: number;
    name: string;
    projectId: number;
    members: User[];
    teamManagerId: number;
    createdAt: string;
    description?: string;
  }
  
  export interface TeamsState {
    teams: Team[];
  }
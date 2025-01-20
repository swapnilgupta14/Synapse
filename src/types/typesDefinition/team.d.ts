export interface Team {
  id?: number;
  teamId: number;
  name: string;
  projectId: number;
  members: number[];
  organisationId: number;
  teamManagerId: number | null | undefined;
  createdAt?: string;
  description?: string;
}

export interface TeamsState {
  teams: Team[];
}

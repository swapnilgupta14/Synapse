export type RoleType =
  | "Admin"
  | "Organisation"
  | "Project Manager"
  | "Team Manager"
  | "Team Member";

export interface User {
  id: number;
  username: string;
  role: RoleType;
  email: string;
  token: string;
  password?: string;
  createdAt?: string;
  organisationId?: number;
  teamId?: number[];
}

export interface Organisation extends User {
  organisationId: number;
  description?: string;
  ownerId: number;
  members?: User[];
  location?: string;
}

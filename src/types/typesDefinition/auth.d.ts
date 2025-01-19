export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    currentOrganisation?: Organisation | null;
    isOrganisation: boolean;
  }
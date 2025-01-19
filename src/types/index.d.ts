export * from "./typesDefinition/user";
export * from "./typesDefinition/task";
export * from "./typesDefinition/project";
export * from "./typesDefinition/team";
export * from "./typesDefinition/auth";
export * from "./typesDefinition/payload";

export interface DashboardContentProps {
  tasks: Task[];
}

export interface RootState {
  tasks: Task[];
  statistics: Statistics;
}

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

export interface ArchiveDialogProps {
  showArchiveDialog: boolean;
  setShowArchiveDialog: (show: boolean) => void;
  archiveDate: Date;
  setArchiveDate: (date: Date) => void;
  selectedTasks: number[];
  handleArchiveTasks: () => Promise<void>;
}

export interface ReassignDialogProps {
  showReassignDialog: boolean;
  setShowReassignDialog: (show: boolean) => void;
  reassignData: {
    fromUserId: number;
    toUserId: number;
  };
  setReassignData: (data: { fromUserId: number; toUserId: number }) => void;
  selectedTasks: number[];
  handleReassignTasks: () => Promise<void>;
}

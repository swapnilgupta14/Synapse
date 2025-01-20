import axiosInstance from "../axiosInstance";
import { Task, AddTaskPayload, UpdateTaskPayload } from "../../types";
import { useAppSelector } from "../../redux/store";
// import { createUser } from "../fetch";

export const taskServices = {
  getAllTasks: async () => {
    const response = await axiosInstance.get("/tasks");
    return response.data;
  },

  addTask: async (taskData: AddTaskPayload) => {
    const idCustom = Date.now();
    const newTask = {
      ...taskData,
      id: idCustom,
      taskId: idCustom,
      status: "pending",
      createdAt: new Date().toISOString(),
      createdBy: taskData.createdBy,
      assignedTo: taskData.assignedTo,
    };
    const response = await axiosInstance.post("/tasks", newTask);
    return response.data;
  },

  editTask: async (taskId: number, updateData: UpdateTaskPayload) => {
    const existingTask = await axiosInstance.get(`/tasks/${taskId}`);
    const updatedTask = {
      ...existingTask.data,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    const response = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
    return response.data;
  },

  deleteTask: async (taskId: number) => {
    // const tasks = await axiosInstance.get("/tasks");
    // const task = tasks.data.find((t: Task) => t.taskId === taskId || t.taskId === taskId);

    // if (!task) {
    //   throw new Error(`Task with id ${taskId} not found`);
    // }

    await axiosInstance.delete(`/tasks/${taskId}`);
    return taskId;
  },

  toggleTaskStatus: async (taskId: number) => {
    const task = await axiosInstance.get(`/tasks/${taskId}`);
    const updatedStatus =
      task.data.status === "pending" ? "completed" : "pending";
    const updatedTask = {
      ...task.data,
      status: updatedStatus,
      updatedAt: new Date().toISOString(),
      completedAt:
        updatedStatus === "completed" ? new Date().toISOString() : null,
    };
    const response = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
    return response.data;
  },

  bulkUpdateTasks: async (ids: number[], updates: Partial<Task>) => {
    const updatePromises = ids.map(async (id) => {
      const existingTask = await axiosInstance.get(`/tasks/${id}`);
      const updatedTask = {
        ...existingTask.data,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return axiosInstance.put(`/tasks/${id}`, updatedTask);
    });
    const responses = await Promise.all(updatePromises);
    return responses.map((response) => response.data);
  },

  deleteCompletedTasks: async () => {
    const tasks = await axiosInstance.get("/tasks");
    const completedTaskIds = tasks.data
      .filter((task: Task) => task.status === "completed")
      .map((task: Task) => task.taskId);

    const deletePromises = completedTaskIds.map((id: number) =>
      axiosInstance.delete(`/tasks/${id}`)
    );
    await Promise.all(deletePromises);
    return completedTaskIds;
  },

  adminUpdateTask: async (taskId: number, updates: Partial<Task>) => {
    const existingTask = await axiosInstance.get(`/tasks/${taskId}`);
    const updatedTask = {
      ...existingTask.data,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const response = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
    return response.data;
  },

  reassignSelectedTasks: async (
    taskIds: number[],
    fromUserId: number,
    toUserId: number
  ) => {
    if (fromUserId === toUserId) {
      return [];
    }

    const tasks = await axiosInstance.get("/tasks");
    const selectedTasks = tasks.data.filter(
      (task: Task) =>
        taskIds.includes(task.taskId) && task.assignedTo === fromUserId
    );

    const updatePromises = selectedTasks.map(async (task: Task) => {
      const updatedTask = {
        ...task,
        assignedTo: toUserId,
        updatedAt: new Date().toISOString(),
        lastModifiedBy: toUserId,
      };
      return axiosInstance.put(`/tasks/${task.taskId}`, updatedTask);
    });

    const responses = await Promise.all(updatePromises);
    return responses.map((response) => response.data);
  },

  archiveTasks: async (taskIds?: number[]) => {
    const tasks = await axiosInstance.get("/tasks");
    const currentDate = new Date();
    const tasksToArchive = taskIds
      ? tasks.data.filter((task: Task) => taskIds.includes(task.taskId))
      : tasks.data.filter((task: Task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate < currentDate && task.status !== "archieved";
        });

    const archivePromises = tasksToArchive.map(async (task: Task) => {
      const updatedTask = {
        ...task,
        status: "archieved",
        updatedAt: new Date().toISOString(),
      };
      return axiosInstance.put(`/tasks/${task.taskId}`, updatedTask);
    });

    const responses = await Promise.all(archivePromises);
    return responses.map((response) => response.data);
  },

  autoArchiveTasks: async () => {
    return taskServices.archiveTasks();
  },

  generateTaskStatistics: async () => {
    try {
      const tasksResponse = await axiosInstance.get("/tasks");
      const tasks = tasksResponse.data;

      const { user } = useAppSelector((state) => state.auth);
      const currentUser = user;
      if (!currentUser) return;
      if (currentUser.role !== "Admin") {
        throw new Error("Unauthorized: Only Admins can access statistics.");
      }

      const now = new Date();

      const calculateAverageCompletionTime = (tasks: Task[]) => {
        const completedTasks = tasks.filter(
          (task) =>
            task.status === "completed" && task.completedAt && task.createdAt
        );

        if (completedTasks.length === 0) return 0;

        const totalTime = completedTasks.reduce((sum, task) => {
          const completionTime =
            new Date(task.completedAt!).getTime() -
            new Date(task.createdAt).getTime();
          return sum + completionTime;
        }, 0);

        return totalTime / completedTasks.length / (1000 * 60 * 60);
      };

      const statistics = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(
          (task: Task) => task.status === "completed"
        ).length,
        pendingTasks: tasks.filter((task: Task) => task.status === "pending")
          .length,
        highPriorityTasks: tasks.filter(
          (task: Task) => task.priority === "high"
        ).length,
        tasksPerTeam: tasks.reduce(
          (acc: Record<number, number>, task: Task) => {
            if (task.teamId) {
              acc[task.teamId] = (acc[task.teamId] || 0) + 1;
            }
            return acc;
          },
          {}
        ),
        tasksPerProject: tasks.reduce(
          (acc: Record<number, number>, task: Task) => {
            if (task.projectId) {
              acc[task.projectId] = (acc[task.projectId] || 0) + 1;
            }
            return acc;
          },
          {}
        ),
        tasksByCategory: tasks.reduce(
          (acc: Record<string, number>, task: Task) => {
            if (task.category) {
              acc[task.category] = (acc[task.category] || 0) + 1;
            }
            return acc;
          },
          {}
        ),
        averageCompletionTime: calculateAverageCompletionTime(tasks),
        overdueTasksCount: tasks.filter(
          (task: Task) =>
            task.dueDate &&
            new Date(task.dueDate) < now &&
            task.status === "pending"
        ).length,
        taskCompletionTrend: getTaskCompletionTrend(tasks),
      };

      return statistics;
    } catch (error) {
      console.error("Error generating statistics:", error);
      throw error;
    }
  },
};

const getTaskCompletionTrend = (tasks: Task[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  return last7Days.map((date) => ({
    date,
    completed: tasks.filter(
      (task) =>
        task.status === "completed" && task.completedAt?.split("T")[0] === date
    ).length,
    created: tasks.filter((task) => task.createdAt?.split("T")[0] === date)
      .length,
  }));
};

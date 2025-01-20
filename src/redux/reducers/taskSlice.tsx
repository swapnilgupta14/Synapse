// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { Task, AddTaskPayload, UpdateTaskPayload, AdminTaskUpdatePayload, TaskState } from '../../types';
// import { taskServices } from '../../api/services/taskServices';

// export const fetchTasks = createAsyncThunk(
//   'tasks/fetchTasks',
//   async () => {
//     return await taskServices.getAllTasks();
//   }
// );

// export const addTaskAsync = createAsyncThunk(
//   'tasks/addTask',
//   async (taskData: AddTaskPayload) => {
//     return await taskServices.addTask(taskData);
//   }
// );

// export const editTaskAsync = createAsyncThunk(
//   'tasks/editTask',
//   async ({ id, ...updateData }: UpdateTaskPayload) => {
//     return await taskServices.editTask(id, updateData);
//   }
// );

// export const deleteTaskAsync = createAsyncThunk(
//   'tasks/deleteTask',
//   async (taskId: number) => {
//     return await taskServices.deleteTask(taskId);
//   }
// );

// export const toggleTaskStatusAsync = createAsyncThunk(
//   'tasks/toggleStatus',
//   async (taskId: number) => {
//     return await taskServices.toggleTaskStatus(taskId);
//   }
// );

// export const bulkUpdateTasksAsync = createAsyncThunk(
//   'tasks/bulkUpdate',
//   async ({ ids, updates }: { ids: number[], updates: Partial<Task> }) => {
//     return await taskServices.bulkUpdateTasks(ids, updates);
//   }
// );

// export interface TaskState {
//     tasks: Task[];
//     status: 'idle' | 'loading' | 'succeeded' | 'failed';
//     error: string | null;
//     statistics: TaskStatistics;

//   }

// const initialState: TaskState = {
//   tasks: [],
//   status: 'idle',
//   error: null,
//   statistics: {
//     totalTasks: 0,
//     completedTasks: 0,
//     pendingTasks: 0,
//     highPriorityTasks: 0,
//     tasksPerTeam: {},
//     tasksByCategory: {},
//     averageCompletionTime: 0,
//     overdueTasksCount: 0,
//     tasksPerProject: {},
//   }
// };

// const taskSlice = createSlice({
//   name: 'tasks',
//   initialState,
//   reducers: {
//     resetTaskState: (state) => {
//       return initialState;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Tasks
//       .addCase(fetchTasks.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchTasks.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.tasks = action.payload;
//       })
//       .addCase(fetchTasks.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
      
//       // Add Task
//       .addCase(addTaskAsync.fulfilled, (state, action) => {
//         state.tasks.push(action.payload);
//       })
      
//       // Edit Task
//       .addCase(editTaskAsync.fulfilled, (state, action) => {
//         const index = state.tasks.findIndex(task => task.taskId === action.payload.taskId);
//         if (index !== -1) {
//           state.tasks[index] = action.payload;
//         }
//       })
      
//       // Delete Task
//       .addCase(deleteTaskAsync.fulfilled, (state, action) => {
//         state.tasks = state.tasks.filter(task => task.taskId !== action.payload);
//       })
      
//       // Toggle Task Status
//       .addCase(toggleTaskStatusAsync.fulfilled, (state, action) => {
//         const index = state.tasks.findIndex(task => task.taskId === action.payload.taskId);
//         if (index !== -1) {
//           state.tasks[index] = action.payload;
//         }
//       })
      
//       // Bulk Update Tasks
//       .addCase(bulkUpdateTasksAsync.fulfilled, (state, action) => {
//         const updatedTasks = action.payload;
//         updatedTasks.forEach(updatedTask => {
//           const index = state.tasks.findIndex(task => task.taskId === updatedTask.taskId);
//           if (index !== -1) {
//             state.tasks[index] = updatedTask;
//           }
//         });
//       });
//   },
// });

// export const { resetTaskState } = taskSlice.actions;
// export default taskSlice.reducer;




// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Task, User } from "../../types";
// import { AddTaskPayload, BulkUpdatePayload, UpdateTaskPayload, AdminTaskUpdatePayload, TaskState } from "../../types";
// import { loadFromLocalStorage } from '../../utils/localStorage';

// const initialState: TaskState = {
//     tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
//     user: JSON.parse(localStorage.getItem('userCurrent') || '{}') as User,
//     statistics: {
//         totalTasks: 0,
//         completedTasks: 0,
//         pendingTasks: 0,
//         highPriorityTasks: 0,
//         tasksPerTeam: {},
//         tasksByCategory: {},
//         averageCompletionTime: 0,
//         overdueTasksCount: 0,
//         tasksPerProject: {},
//     }
// };

// const taskSlice = createSlice({
//     name: 'tasks',
//     initialState,
//     reducers: {
//         addTask: (state, action: PayloadAction<AddTaskPayload>) => {
//             const currentUser = localStorage.getItem("userCurrent");
//             let id;
//             if (currentUser) {
//                 const parsed = JSON.parse(currentUser);
//                 id = parsed.id;
//             }

//             const generateUniqueId = () => Number(`${Date.now()}${Math.random().toString().slice(2, 8)}`);

//             let lastTimestamp = state.lastTaskTimestamp || 0;
//             let currentTimestamp = Date.now();
//             if (currentTimestamp <= lastTimestamp) {
//                 currentTimestamp = lastTimestamp + 1;
//             }
//             state.lastTaskTimestamp = currentTimestamp;

//             const newTask: Task = {
//                 taskId: generateUniqueId(),
//                 title: action.payload.title,
//                 description: action.payload.description || '',
//                 priority: action.payload.priority,
//                 category: action.payload.category || 'General',
//                 dueDate: action.payload.dueDate || '',
//                 status: 'pending',
//                 createdAt: new Date(currentTimestamp).toISOString(),
//                 assignedTo: action.payload.assignedTo || id,
//                 teamId: action.payload.teamId || undefined,
//                 createdBy: id,
//             };

//             state.tasks.push(newTask);
//             localStorage.setItem('tasks', JSON.stringify(state.tasks));
//         },


//         editTask: (state, action: PayloadAction<UpdateTaskPayload>) => {
//             const task = state.tasks.find(task => task.taskId === action.payload.id);
//             if (task) {
//                 const isPersonalTask = task.createdBy === state.user.id;
//                 const isAssignedTask = task.assignedTo === state.user.id;

//                 if (
//                     state.user.role === 'Admin' ||
//                     (state.user.role === 'Team Manager' && task.teamId === state.user.id) ||
//                     isPersonalTask ||
//                     isAssignedTask
//                 ) {
//                     Object.assign(task, action.payload, { updatedAt: new Date().toISOString() });
//                     localStorage.setItem('tasks', JSON.stringify(state.tasks));
//                 } else {
//                     throw new Error('Unauthorized: Cannot edit this task.');
//                 }
//             }
//         },

//         deleteTask: (state, action: PayloadAction<number>) => {
//             const task = state.tasks.find(task => task.taskId === action.payload);
//             if (task) {
//                 let currUser = loadFromLocalStorage("userCurrent", {} as User)
//                 const isPersonalTask = task.createdBy === task.assignedTo || task.createdBy === currUser?.id;

//                 if (
//                     state.user.role === 'Admin' ||
//                     isPersonalTask
//                 ) {
//                     state.tasks = state.tasks.filter(task => task.taskId !== action.payload);
//                     localStorage.setItem('tasks', JSON.stringify(state.tasks));
//                 } else {
//                     throw new Error('Unauthorized: Cannot delete this task.');
//                 }
//             }
//         },

//         toggleTaskStatus: (state, action: PayloadAction<number>) => {
//             const task = state.tasks.find(task => task.taskId === action.payload);
//             if (task) {
//                 let currUser = loadFromLocalStorage("userCurrent", {} as User)
//                 const isAssignedTask = task.assignedTo === task.createdBy || task.assignedTo === currUser?.id || task.createdBy === currUser?.id || state.user.role === "Team Manager";

//                 if (isAssignedTask) {
//                     task.status = task.status === 'pending' ? 'completed' : 'pending';
//                     task.updatedAt = new Date().toISOString();
//                     task.completedAt = task.status === 'completed' ? new Date().toISOString() : undefined;
//                     localStorage.setItem('tasks', JSON.stringify(state.tasks));
//                 } else {
//                     throw new Error('Unauthorized: Only assigned users can toggle task status.');
//                 }
//             }
//         },

//         bulkUpdateTasks: (state, action: PayloadAction<BulkUpdatePayload>) => {
//             if (state.user.role === 'Admin' || state.user.role === 'Team Manager') {
//                 state.tasks = state.tasks.map(task => {
//                     if (action.payload.ids.includes(task.taskId)) {
//                         return { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() };
//                     }
//                     return task;
//                 });
//                 localStorage.setItem('tasks', JSON.stringify(state.tasks));
//             } else {
//                 throw new Error('Unauthorized: Only Managers or Admins can update tasks in bulk.');
//             }
//         },

//         deleteCompletedTasks: (state) => {
//             if (state.user.role === 'Admin' || state.user.role === 'Team Manager') {
//                 state.tasks = state.tasks.filter(task => task.status !== 'completed');
//                 localStorage.setItem('tasks', JSON.stringify(state.tasks));
//             } else {
//                 throw new Error('Unauthorized: Only Managers or Admins can delete completed tasks.');
//             }
//         }, 
        
//         adminUpdateTask: (state, action: PayloadAction<AdminTaskUpdatePayload>) => {
//             if (state.user.role !== 'Admin') {
//                 throw new Error('Unauthorized: Only Admins can perform this action.');
//             }
//             const taskIndex = state.tasks.findIndex(task => task.taskId === action.payload.id);
//             if (taskIndex !== -1) {
//                 state.tasks[taskIndex] = {
//                     ...state.tasks[taskIndex],
//                     ...action.payload.updates,
//                     updatedAt: new Date().toISOString(),
//                     lastModifiedBy: state.user.id
//                 };
//                 localStorage.setItem('tasks', JSON.stringify(state.tasks));
//             }
//         },

//         reassignTasks: (state, action: PayloadAction<{ fromUserId: number; toUserId: number }>) => {
//             if (state.user.role === 'Team Member') {
//                 throw new Error('Unauthorized: Only Admins & Manager can reassign tasks.');
//             }

//             console.log(action, "action received")
//             state.tasks = state.tasks.map(task => {
//                 if (task.assignedTo === action.payload.fromUserId) {
//                     return {
//                         ...task,
//                         assignedTo: action.payload.toUserId,
//                         updatedAt: new Date().toISOString(),
//                         lastModifiedBy: state.user.id
//                     };
//                 }
//                 return task;
//             });
//             localStorage.setItem('tasks', JSON.stringify(state.tasks));
//         },

//         updateTaskPriorities: (state, action: PayloadAction<{ ids: number[]; priority: 'high' | 'medium' | 'low' }>) => {
//             if (state.user.role !== 'Admin') {
//                 throw new Error('Unauthorized: Only Admins can bulk update priorities.');
//             }
//             state.tasks = state.tasks.map(task => {
//                 if (action.payload.ids.includes(task.taskId)) {
//                     return {
//                         ...task,
//                         priority: action.payload.priority,
//                         updatedAt: new Date().toISOString(),
//                         lastModifiedBy: state.user.id
//                     };
//                 }
//                 return task;
//             });
//             localStorage.setItem('tasks', JSON.stringify(state.tasks));
//         },

//         archiveTasks: (state, action: PayloadAction<{ beforeDate: string }>) => {
//             if (state.user.role !== 'Admin') {
//                 throw new Error('Unauthorized: Only Admins can archive tasks.');
//             }

//             const archiveDate = new Date(action.payload.beforeDate);
//             const archivedTasks = state.tasks.filter(task =>
//                 task.status === 'completed' &&
//                 new Date(task.completedAt || '') < archiveDate
//             );

//             const existingArchive = JSON.parse(localStorage.getItem('archivedTasks') || '[]');
//             localStorage.setItem('archivedTasks', JSON.stringify([...existingArchive, ...archivedTasks]));

//             state.tasks = state.tasks.filter(task =>
//                 task.status !== 'completed' ||
//                 new Date(task.completedAt || '') >= archiveDate
//             );
//             localStorage.setItem('tasks', JSON.stringify(state.tasks));
//         },

//         generateTaskStatistics: (state) => {
//             const getCurrent = loadFromLocalStorage("userCurrent", {} as User);

//             if (state.user.role !== 'Admin' || (getCurrent && getCurrent.role !== "Admin")) {
//                 throw new Error('Unauthorized: Only Admins can access statistics.');
//             }

//             const now = new Date();
//             state.statistics = {
//                 totalTasks: state.tasks.length,

//                 completedTasks: state.tasks.filter(task => task.status === 'completed').length,

//                 pendingTasks: state.tasks.filter(task => task.status === 'pending').length,

//                 highPriorityTasks: state.tasks.filter(task => task.priority === 'high').length,

//                 tasksPerTeam: state.tasks.reduce((acc, task) => {
//                     if (task.teamId) {
//                         acc[task.teamId] = (acc[task.teamId] || 0) + 1;
//                     }
//                     return acc;
//                 }, {} as Record<number, number>),

//                 tasksPerProject: state.tasks.reduce((acc, task) => {
//                     if (task.projectId) {
//                         acc[task.projectId] = (acc[task.projectId] || 0) + 1;
//                     }
//                     return acc;
//                 }, {} as Record<number, number>),

//                 tasksByCategory: state.tasks.reduce((acc, task) => {
//                     acc[task.category] = (acc[task.category] || 0) + 1;
//                     return acc;
//                 }, {} as Record<string, number>),

//                 averageCompletionTime: calculateAverageCompletionTime(state.tasks),

//                 overdueTasksCount: state.tasks.filter(task =>
//                     task.dueDate && new Date(task.dueDate) < now && task.status === 'pending'
//                 ).length
//             };
//         },
//     },
// });

// function calculateAverageCompletionTime(tasks: Task[]): number {
//     const completedTasks = tasks.filter(task =>
//         task.status === 'completed' && task.completedAt && task.createdAt
//     );

//     if (completedTasks.length === 0) return 0;

//     const totalTime = completedTasks.reduce((sum, task) => {
//         const createdAt = new Date(task.createdAt).getTime();
//         const completedAt = new Date(task.completedAt!).getTime();
//         return sum + (completedAt - createdAt);
//     }, 0);

//     const averageTime = totalTime / completedTasks.length / (1000 * 60 * 60 * 24);
//     return averageTime;
// }


// export const {
//     addTask,
//     editTask,
//     deleteTask,
//     toggleTaskStatus,
//     bulkUpdateTasks,
//     deleteCompletedTasks,
//     adminUpdateTask,
//     reassignTasks,
//     updateTaskPriorities,
//     generateTaskStatistics,
//     archiveTasks,
// } = taskSlice.actions;

// export default taskSlice.reducer;

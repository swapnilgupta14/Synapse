import React from 'react';
import { useQuery } from 'react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import {
  Users, Briefcase, Building2, UserPlus,
  UserX, Crown, CheckCircle2, Clock, ListTodo
} from 'lucide-react';
import { Task, User } from '../../../types';
import axiosInstance from '../../../api/axiosInstance';
import { useAppSelector } from '../../../redux/store';
import teamServices from '../../../api/services/teamServices';
import projectServices from '../../../api/services/projectServices';
import userServices from '../../../api/services/userServices';

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  tasksPerTeam: Record<number, number>;
  tasksPerProject: Record<number, number>;
  tasksByCategory: Record<string, number>;
  averageCompletionTime: number;
  overdueTasksCount: number;
  taskCompletionTrend: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

const PRIORITY_COLORS = ['#FF6384', '#36A2EB', '#FFCE56'];

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
  <div className="border border-gray-200 rounded-xl p-2 px-3 hover:border-gray-300 transition-colors">
    <div className="flex items-center gap-2 py-1 mb-2">
      {icon}
      <span className="text-md text-gray-700">{label}</span>
    </div>
    <div className="text-gray-900 text-lg text-center font-medium truncate">
      {value}
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const getTaskCompletionTrend = (tasks: Task[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      completed: tasks.filter(task =>
        task.status === "completed" &&
        task.completedAt?.split('T')[0] === date
      ).length,
      created: tasks.filter(task =>
        task.createdAt?.split('T')[0] === date
      ).length,
    }));
  };

  const calculateAverageCompletionTime = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task =>
      task.status === "completed" &&
      task.completedAt &&
      task.createdAt
    );

    if (completedTasks.length === 0) return 0;

    const totalTime = completedTasks.reduce((sum, task) => {
      const completionTime = new Date(task.completedAt!).getTime() -
        new Date(task.createdAt).getTime();
      return sum + completionTime;
    }, 0);

    return Math.round(totalTime / completedTasks.length / (1000 * 60 * 60));
  };

  const generateTaskStatistics = async (tasks: Task[]): Promise<TaskStatistics> => {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized: Only Admins can access statistics.");
    }

    const now = new Date();

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === "completed").length,
      pendingTasks: tasks.filter(task => task.status === "pending").length,
      highPriorityTasks: tasks.filter(task => task.priority === "high").length,
      tasksPerTeam: tasks.reduce((acc, task) => {
        if (task.teamId) {
          acc[task.teamId] = (acc[task.teamId] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>),
      tasksPerProject: tasks.reduce((acc, task) => {
        if (task.projectId) {
          acc[task.projectId] = (acc[task.projectId] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>),
      tasksByCategory: tasks.reduce((acc, task) => {
        if (task.category) {
          acc[task.category] = (acc[task.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      averageCompletionTime: calculateAverageCompletionTime(tasks),
      overdueTasksCount: tasks.filter(task =>
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status === "pending"
      ).length,
      taskCompletionTrend: getTaskCompletionTrend(tasks),
    };
  };

  // React Query hooks
  const { data: tasksData, error: tasksError } = useQuery(
    'tasks',
    async () => {
      const response = await axiosInstance.get("/tasks");
      return response.data;
    }
  );

  const { data: teams = [] } = useQuery(
    'teams',
    () => teamServices.getAllTeams()
  );

  const { data: projects = [] } = useQuery(
    'projects',
    () => projectServices.getAllProjects()
  );

  const { data: users } = useQuery(
    'users',
    () => userServices.getAllUsers()
  );

  const { data: statistics } = useQuery(
    ['statistics', tasksData],
    () => generateTaskStatistics(tasksData),
    {
      enabled: !!tasksData,
    }
  );

  // Derived state
  const memberCount = {
    team_member: users?.filter((user: User) => user.role === "Team Member").length || 0,
    team_manager: users?.filter((user: User) => user.role === "Team Manager").length || 0,
  };

  const totalMembersInTeams = teams.reduce((acc, team) =>
    acc + (team?.members?.length || 0), 0
  );

  if (tasksError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {tasksError instanceof Error ? tasksError.message : 'An error occurred'}
      </div>
    );
  }

  const priorityPieData = statistics ? [
    { name: 'High', value: statistics.highPriorityTasks },
    { name: 'Medium', value: statistics.totalTasks - statistics.highPriorityTasks - statistics.pendingTasks },
    { name: 'Low', value: statistics.pendingTasks }
  ] : [];

  const completionRate = statistics
    ? Math.round((statistics.completedTasks / statistics.totalTasks) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Composition Overview */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Building2 className="mr-3 text-black" />
              Composition Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                icon={<Users className="w-4 h-4" />}
                label="Total Registered Users"
                value={memberCount.team_member + memberCount.team_manager}
              />
              <InfoCard
                icon={<Briefcase className="w-4 h-4" />}
                label="Total Projects"
                value={projects.length}
              />
              <InfoCard
                icon={<Building2 className="w-4 h-4" />}
                label="Total Teams"
                value={teams.length}
              />
              <InfoCard
                icon={<UserPlus className="w-4 h-4" />}
                label="Members in Teams"
                value={totalMembersInTeams}
              />
              <InfoCard
                icon={<UserX className="w-4 h-4" />}
                label="Unassigned Members"
                value={memberCount.team_member - totalMembersInTeams + memberCount.team_manager}
              />
              <InfoCard
                icon={<Crown className="w-4 h-4" />}
                label="Team Managers"
                value={memberCount.team_manager}
              />
            </div>
          </div>

          {/* Task Priority Distribution */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Task Priority Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Task Statistics */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <ListTodo className="mr-3 text-black" />
              Task Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                icon={<ListTodo className="w-4 h-4" />}
                label="Total Tasks"
                value={statistics?.totalTasks || 0}
              />
              <InfoCard
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Completed Tasks"
                value={statistics?.completedTasks || 0}
              />
              <InfoCard
                icon={<Clock className="w-4 h-4" />}
                label="Pending Tasks"
                value={statistics?.pendingTasks || 0}
              />
              <InfoCard
                icon={<Clock className="w-4 h-4" />}
                label="Completion Rate"
                value={`${completionRate}%`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Task Completion Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics?.taskCompletionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="created" fill="#8884d8" name="Tasks Created" />
              <Bar dataKey="completed" fill="#82ca9d" name="Tasks Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
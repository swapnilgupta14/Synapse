import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux/store';
import { generateTaskStatistics } from '../../../redux/reducers/taskSlice';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import {
  Users,
  Briefcase,
  Building2,
  UserPlus,
  UserX,
  Crown,
  CheckCircle2,
  Clock,
  ListTodo
} from 'lucide-react';
import { Task, User } from '../../../types';

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }): JSX.Element => (
  <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-400">{icon}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
    <div className="text-gray-900 text-lg text-center font-medium truncate">{value}</div>
  </div>
);

const Analytics = () => {
  const dispatch = useDispatch();
  // const statistics = useAppSelector((state) => (state.tasks as any)?.statistics || {});
  const tasks = useAppSelector((state) => state.tasks);
  const taskArr = (tasks as any)?.tasks || [];

  const [memberCount, setMemberCount] = useState({
    team_member: 0,
    team_manager: 0,
  });

  useEffect(() => {
    const res = localStorage.getItem("SignedUpUsers");
    if (res) {
      try {
        const parsedUsers = JSON.parse(res) || [];
        const managers = parsedUsers.filter((user: User) => user.role === "Team Manager").length;
        const members = parsedUsers.filter((user: User) => user.role === "Team Member").length;
        setMemberCount({
          team_member: members,
          team_manager: managers,
        });
      } catch (error) {
        console.error("Error parsing SignedUpUsers from localStorage:", error);
      }
    }
  }, []);

  const getCompletionTrendData = () => {
    if (!Array.isArray(taskArr)) return [];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map((date) => ({
      date,
      completed: taskArr.filter(
        (task: Task) => task.status === 'completed' && task.completedAt?.split('T')[0] === date
      ).length,
      created: taskArr.filter(
        (task: Task) => task.createdAt?.split('T')[0] === date
      ).length,
    }));
  };

  useEffect(() => {
    dispatch(generateTaskStatistics());
  }, [dispatch, taskArr]);

  const getPriorityDistribution = () => ({
    high: taskArr.filter((task: Task) => task.priority === 'high').length,
    medium: taskArr.filter((task: Task) => task.priority === 'medium').length,
    low: taskArr.filter((task: Task) => task.priority === 'low').length,
  });

  const priorityData = getPriorityDistribution();
  const completionTrendData = getCompletionTrendData();

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56'];

  const priorityPieData = [
    { name: 'High', value: priorityData.high },
    { name: 'Medium', value: priorityData.medium },
    { name: 'Low', value: priorityData.low },
  ];

  const completedTasksCount = taskArr.filter((task: Task) => task.status === 'completed').length;
  const pendingTasksCount = taskArr.filter((task: Task) => task.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-xl font-semibold text-black mb-6">Analytics Page</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Building2 className="mr-3 text-black" />
              Composition Overview
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                icon={<Users className="w-5 h-5" />}
                label="Total Users"
                value={2}
              />

              <InfoCard
                icon={<Briefcase className="w-5 h-5" />}
                label="Total Projects"
                value={5}
              />

              <InfoCard
                icon={<Building2 className="w-5 h-5" />}
                label="Total Teams"
                value={2}
              />

              <InfoCard
                icon={<UserPlus className="w-5 h-5" />}
                label="Members in Teams"
                value={memberCount.team_member}
              />

              <InfoCard
                icon={<UserX className="w-5 h-5" />}
                label="Unassigned Members"
                value={0}
              />

              <InfoCard
                icon={<Crown className="w-5 h-5" />}
                label="Team Managers"
                value={memberCount.team_manager}
              />
            </div>
          </div>

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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <ListTodo className="mr-3 text-black" />
              Task Statistics
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                icon={<ListTodo className="w-5 h-5" />}
                label="Total Tasks"
                value={taskArr.length}
              />

              <InfoCard
                icon={<CheckCircle2 className="w-5 h-5" />}
                label="Completed Tasks"
                value={completedTasksCount}
              />

              <InfoCard
                icon={<Clock className="w-5 h-5" />}
                label="Pending Tasks"
                value={pendingTasksCount}
              />

              <InfoCard
                icon={<Clock className="w-5 h-5" />}
                label="Completion Rate"
                value={`${Math.round((completedTasksCount / taskArr.length) * 100) || 0}%`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Task Completion Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionTrendData}>
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
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
import { Project, Team } from '../../../types/index';

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }): JSX.Element => (
  <div className="border border-gray-200 rounded-xl p-2 px-3 hover:border-gray-300 transition-colors">
    <div className="flex items-center gap-2 py-1 mb-2">
      <div className="flex items-center justify-center">
        {icon}
      </div>
      <div className="text-md text-gray-700 flex items-center">
        {label}
      </div>
    </div>
    <div className="text-gray-900 text-lg text-center font-medium truncate">{value}</div>
  </div>
);
const Analytics = () => {
  const dispatch = useDispatch();
  const tasks = useAppSelector((state) => state.tasks);
  const taskArr = (tasks as any)?.tasks || [];

  const projects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
  const teams: Team[] = JSON.parse(localStorage.getItem('teams') || '[]');

  const totalMembersInTeams: number = teams.reduce((acc, item) => {
    return acc = acc + item?.members?.length
  }, 0)


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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Building2 className="mr-3 text-black" />
              Composition Overview
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                icon={<Users className="w-4 h-4" />}
                label="Total Registered Users"
                value={memberCount.team_member}
              />

              <InfoCard
                icon={<Briefcase className="w-4 h-4" />}
                label="Total Projects"
                value={projects.length || 0}
              />

              <InfoCard
                icon={<Building2 className="w-4 h-4" />}
                label="Total Teams"
                value={teams.length || 0}
              />

              <InfoCard
                icon={<UserPlus className="w-4 h-4" />}
                label="Members in Teams"
                value={totalMembersInTeams || 2}
              />

              <InfoCard
                icon={<UserX className="w-4 h-4" />}
                label="Unassigned Members"
                value={memberCount.team_member - totalMembersInTeams + memberCount?.team_manager}
              />

              <InfoCard
                icon={<Crown className="w-4 h-4" />}
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
                icon={<ListTodo className="w-4 h-4" />}
                label="Total Tasks"
                value={taskArr.length}
              />

              <InfoCard
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Completed Tasks"
                value={completedTasksCount}
              />

              <InfoCard
                icon={<Clock className="w-4 h-4" />}
                label="Pending Tasks"
                value={pendingTasksCount}
              />

              <InfoCard
                icon={<Clock className="w-4 h-4" />}
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
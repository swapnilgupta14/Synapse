import { useState, useMemo } from 'react';
import { Calendar, Search, Grid, List, Plus, Clock, Tag, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import { ClipboardList, LogOut } from "lucide-react"
import ProfilePopup from '../../../component/popups/ProfilePopup';

import { useAppSelector, useAppDispatch } from '../../../redux/store';
import {
    addTask,
    deleteTask,
    toggleTaskStatus,
} from '../../../redux/taskSlice';
import { Task, Team, User } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/authSlice';

type selectedMember = User | null;

const UserDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { tasks } = useAppSelector(state => state.tasks);


    const currentUser = useMemo(() => {
        const storedUsers = localStorage.getItem("SignedUpUsers");
        if (storedUsers) {
            const storedUser = JSON.parse(storedUsers).find((it: User) => it.id === user?.id);
            return storedUser ? storedUser : null;
        }
    }, []);

    const workTeam = useMemo(() => {
        if (!currentUser) return [];
        const teams = JSON.parse(localStorage.getItem('teams') || '[]');
        const memberTeams = teams.filter((team: Team) =>
            team.members.some((member: User) => member.id === currentUser.id && member.role === "Team Member")
        );
        return memberTeams;
    }, []);


    const allTeams = useAppSelector((state) => state.teams.teams);
    const managedTeams = allTeams.filter((team: Team) => team?.teamManagerId === user?.id);

    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('list');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low' | 'all'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showAddTask, setShowAddTask] = useState<Boolean>(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [profile, openProfile] = useState(false);

    const [taskType, setTaskType] = useState('self');
    const [searchMemberQuery, setSearchMemberQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedMember, setSelectedMember] = useState<selectedMember>(null);

    const filteredTasks = useMemo(() => {
        if (!currentUser) return [];
        let tasksToFilter = [];
        if (currentUser.role === 'Team Member') {
            tasksToFilter = tasks.filter((item) => item.assignedTo == currentUser.id);
        } else if (currentUser.role === 'Team Manager') {
            tasksToFilter = tasks.filter((item) => item?.createdBy === currentUser.id);
        } else {
            tasksToFilter = tasks;
        }

        return tasksToFilter.filter(task => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesPriority =
                selectedPriority === 'all' || task.priority === selectedPriority;

            const matchesCategory =
                selectedCategory === 'all' || task.category === selectedCategory;

            return matchesSearch && matchesPriority && matchesCategory;
        });
    }, [
        tasks,
        currentUser,
        searchQuery,
        selectedPriority,
        selectedCategory
    ]);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'high' | 'medium' | 'low',
        category: 'General',
        dueDate: '',
    });

    const categories = ['General', 'Personal', 'Work', 'Shopping', 'Health', 'Study'];

    const priorities = [
        { value: 'low', color: 'bg-green-100 text-green-800', label: 'Low' },
        { value: 'medium', color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
        { value: 'high', color: 'bg-red-100 text-red-800', label: 'High' }
    ];

    const stats = useMemo(() => ({
        total: filteredTasks.length,
        completed: filteredTasks.filter(task => task.status === 'completed').length,
        highPriority: filteredTasks.filter(task => task.priority === 'high').length,
        dueSoon: filteredTasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) <= 3;
        }).length
    }), [filteredTasks]);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getMonthData = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const getTasksForDate = (day: number | null) => {
        if (!day) return [];

        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return filteredTasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate.getDate() === day &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear();
        });
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleAddTask = () => {
        try {
            if (currentUser) {
                const new_task: Task = {
                    ...newTask,
                    taskId: Date.now(),
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    createdBy: currentUser.id,
                    assignedTo: taskType === 'team' ? selectedMember?.id : currentUser.id
                };
                dispatch(addTask(new_task));

                setNewTask({
                    title: '',
                    description: '',
                    priority: 'medium',
                    category: 'General',
                    dueDate: '',
                });
                setShowAddTask(false);
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    const handleToggleStatus = (taskId: number) => {
        try {
            dispatch(toggleTaskStatus(taskId));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    const handleDeleteTask = (taskId: number) => {
        try {
            dispatch(deleteTask(taskId));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const renderCalendarView = () => {
        const monthData = getMonthData();
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-center font-medium text-gray-600 py-2">
                            {day}
                        </div>
                    ))}
                    {monthData.map((day, index) => {
                        const tasksForDay = getTasksForDate(day);
                        return (
                            <div
                                key={index}
                                className={`min-h-24 p-2 border rounded-lg ${day ? 'bg-white' : 'bg-gray-50'
                                    }`}
                            >
                                {day && (
                                    <>
                                        <div className="font-medium text-gray-700 mb-1">{day}</div>
                                        <div className="space-y-1">
                                            {tasksForDay.map(task => (
                                                <div
                                                    key={task.taskId}
                                                    className={`text-xs p-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    <div className="truncate">{task.title}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <header className="flex flex-col lg:flex-row w-full justify-between px-8 items-center py-4 pb-0 my-2">
                <div>
                    <p className="text-xl font-medium text-gray-800">
                        Welcome, <span className="text-black font-bold">{user?.username}</span>!
                    </p>
                    <p className="text-sm text-gray-500">Here’s what’s on your plate today</p>
                </div>

                <div className="flex items-center space-x-4">
                    {currentUser?.organisationId && <button
                        className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-gray-100 border border-black text-black px-4 py-2 rounded-3xl shadow-sm transition-colors text-sm"
                    >
                        Organisation: <span className='font-semibold'>{currentUser?.organisationId}</span>
                    </button>}
                    <button
                        onClick={() => openProfile(true)}
                        className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-gray-100 border border-black text-black px-4 py-2 rounded-3xl shadow-sm transition-colors text-sm"
                    >
                        Role: <span className='font-semibold'>{user?.role}</span>
                    </button>

                    <button
                        onClick={() => setShowAddTask(!showAddTask)}
                        className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-3xl shadow-sm transition-colors text-sm"
                    >
                        <Plus size={16} className="text-white" />
                        Add Task
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 bg-red-500 text-white text-sm px-4 py-2 hover:bg-red-600 transition rounded-3xl"
                    >
                        <LogOut size={16} className="text-white" />
                        Logout
                    </button>
                </div>
            </header>
            <div className='flex flex-col lg:flex-row-reverse items-start justify-between gap-3 p-3'>
                <div className="w-1/4 space-y-4 h-fit flex flex-col justify-start py-4 px-3 bg-white rounded-2xl">
                    <p className="text-md flex items-center gap-2 mb-2 bg-gray-200 text-gray-700 py-1 px-3 w-fit rounded-xl">
                        <ClipboardList className="w-4 h-4 text-gray-700" />
                        Statistics
                    </p>
                    <div className="bg-gray-50 border-gray-200 rounded-xl p-6 border transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.total}</p>
                                <p className="text-xs text-gray-500 mt-1">All active and completed tasks</p>
                            </div>
                            <div className="bg-blue-50/70 p-3 rounded-lg">
                                <List className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-gray-200 rounded-xl shadow p-6 border transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-600">Completed</p>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.completed}</p>
                                <p className="text-xs text-gray-500 mt-1">Tasks finished this period</p>
                            </div>
                            <div className="bg-emerald-50/70 p-3 rounded-lg">
                                <Tag className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-gray-200 rounded-xl shadow p-6 border  transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-rose-600">High Priority</p>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.highPriority}</p>
                                <p className="text-xs text-gray-500 mt-1">Tasks needing immediate attention</p>
                            </div>
                            <div className="bg-rose-50/70 p-3 rounded-lg">
                                <Flag className="w-6 h-6 text-rose-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-gray-200 rounded-xl shadow p-6 border  transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-600">Due Soon</p>
                                <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.dueSoon}</p>
                                <p className="text-xs text-gray-500 mt-1">Tasks due in next 48 hours</p>
                            </div>
                            <div className="bg-amber-50/70 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex-1 flex flex-col items-center justify-start gap-4 w-full">

                    {(user?.role === "Team Manager" && managedTeams.length > 0) ||
                        (user?.role === "Team Member" && workTeam.length > 0) ? (
                        <div className="flex-1 flex flex-col items-center justify-start gap-4 w-full">
                            <div className="flex-1 p-4 rounded-xl bg-white w-full">
                                <p className="text-md flex items-center gap-2 mb-4 bg-gray-200 text-gray-700 py-1 px-3 w-fit rounded-xl">
                                    <ClipboardList className="w-4 h-4 text-gray-700" />
                                    {user?.role === "Team Manager" ? `Teams Managed by You (${managedTeams.length})` : `Your Teams Which You are Part Of (${workTeam.length})`}
                                </p>

                                <div className="bg-transparent rounded-xl mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(user?.role === "Team Manager" ? managedTeams : workTeam).map((team: Team) => (
                                        <div
                                            key={team.teamId}
                                            className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm 
                                   h-full flex flex-col justify-between 
                                   transform transition-all duration-300 
                                   hover:shadow-lg"
                                        >
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[70%]">
                                                        {team.name}
                                                    </h2>
                                                    <span className="text-sm text-gray-500">
                                                        Team ID: {team.teamId}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                                    <div className="text-gray-600">Working on Project ID:</div>
                                                    <div className="text-right font-medium">{team.projectId}</div>

                                                    <div className="text-gray-600">Total Team Members:</div>
                                                    <div className="text-right">{team.members.length}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-xl w-full">
                            No teams found
                        </div>
                    )}



                    <div className='flex-1 p-4 rounded-xl bg-white w-full'>
                        <p className="text-md flex items-center gap-2 mb-4 bg-gray-200 text-gray-700 py-1 px-3 w-fit rounded-xl">
                            <ClipboardList className="w-4 h-4 text-gray-700" />
                            Task Manager
                        </p>

                        <div className="bg-transparent rounded-xl mb-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="relative">
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value as any)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        <option value="all">All Priorities</option>
                                        <option value="high">High Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="low">Low Priority</option>
                                    </select>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                    >
                                        <List size={20} className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                    >
                                        <Grid size={20} className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                    >
                                        <Calendar size={20} className="text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {viewMode === 'calendar' ? (
                            renderCalendarView()
                        ) : (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                {/* {JSON.stringify(currentUserTasks)} */}
                                {filteredTasks.map(task => (
                                    <div
                                        key={task.taskId}
                                        className="bg-gray-50 border-gray-200 rounded-xl shadow-sm border  p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                checked={task.status === 'completed'}
                                                onChange={() => handleToggleStatus(task.taskId)}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-black"
                                            />
                                            <div className="flex-grow">
                                                <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                                    {task.title}
                                                </h3>
                                                {/* {task.description && (
                                                <p className="text-gray-600 mt-1">{task.description}</p>
                                            )} */}
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium
                                            ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'}`}>
                                                        {task.priority}
                                                    </span>
                                                    {task.category && (
                                                        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-violet-100 text-violet-800">
                                                            {task.category}
                                                        </span>
                                                    )}
                                                    {
                                                        task.assignedTo === task.createdBy ? (
                                                            <span className='px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-300 text-black flex'>
                                                                Self Assigned Task
                                                            </span>
                                                        ) : (
                                                            <span className='px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-800 text-white'>
                                                                Assigned
                                                            </span>
                                                        )
                                                    }
                                                    {task.dueDate && (
                                                        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-200 text-orange-900">
                                                            Due {new Date(task.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(task.taskId)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${task.status === 'completed'
                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                                >
                                                    {task.status === 'completed' ? 'Undo' : 'Complete'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.taskId)}
                                                    className="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                {showAddTask && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 relative w-full max-w-xl">
                            <div className='flex justify-between items-center mb-3'>
                                <p>Add New Task</p>
                                <button
                                    onClick={() => setShowAddTask(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors text-2xl font-bold"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {user?.role === 'Team Manager' && (
                                    <div className="flex gap-4 mb-2">
                                        <button
                                            onClick={() => setTaskType('self')}
                                            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${taskType === 'self'
                                                ? 'bg-black text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Personal Task
                                        </button>
                                        <button
                                            onClick={() => setTaskType('team')}
                                            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${taskType === 'team'
                                                ? 'bg-black text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Team Task
                                        </button>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="Task title"
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Task description"
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <div className="flex gap-4 flex-wrap">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Priority</label>
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            {priorities.map(priority => (
                                                <button
                                                    key={priority.value}
                                                    onClick={() => setNewTask({ ...newTask, priority: priority.value as 'high' | 'medium' | 'low' })}
                                                    className={`px-4 py-2 rounded-full transition-colors ${priority.color} ${newTask.priority === priority.value && 'border-black border-2'
                                                        }`}
                                                >
                                                    {priority.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            {categories.map(category => (
                                                <button
                                                    key={category}
                                                    onClick={() => setNewTask({ ...newTask, category: category })}
                                                    className={`px-4 py-2 rounded-full transition-colors ${newTask.category === category
                                                        ? 'bg-violet-100 text-violet-800 ring-2 ring-violet-500'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>

                                {user?.role === 'Team Manager' && taskType === 'team' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Select Team</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedTeam?.teamId || ''}
                                                    onChange={(e) => {
                                                        const team = managedTeams.find(team => team.teamId === parseInt(e.target.value));
                                                        setSelectedTeam(team || null);
                                                        setSelectedMember(null);
                                                        setSearchMemberQuery('');
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                >
                                                    <option value="" >Select a team</option>
                                                    {managedTeams.map((team) => (
                                                        <option key={team.teamId} value={team.teamId}>
                                                            {team.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {selectedTeam && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Assign to Team Member</label>
                                                <div className="relative">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                        <input
                                                            type="text"
                                                            placeholder="Search team members..."
                                                            value={searchMemberQuery}
                                                            onChange={(e) => {
                                                                setSearchMemberQuery(e.target.value);
                                                                setShowSearchResults(true);
                                                            }}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                            disabled={!selectedTeam}
                                                        />
                                                    </div>

                                                    {showSearchResults && searchMemberQuery && (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                            {selectedTeam.members
                                                                .filter((member) =>
                                                                    member.username.toLowerCase().includes(searchMemberQuery.toLowerCase())
                                                                )
                                                                .map((member) => (
                                                                    <button
                                                                        key={member.id}
                                                                        onClick={() => {
                                                                            setSelectedMember(member);
                                                                            setSearchMemberQuery(member.username);
                                                                            setShowSearchResults(false);
                                                                        }}
                                                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                                                    >
                                                                        <span>{member.username}</span>
                                                                        <span className="text-sm text-gray-500">{member.role}</span>
                                                                    </button>
                                                                ))}
                                                            {selectedTeam.members.length === 0 && (
                                                                <div className="px-4 py-2 text-gray-500">No team members found</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}


                                <button
                                    onClick={handleAddTask}
                                    className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg shadow-sm transition-colors"
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ProfilePopup
                    profile={profile}
                    user={user}
                    openProfile={openProfile}
                />

            </div>
        </>
    )
}

export default UserDashboard;
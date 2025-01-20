import { useState, useMemo, useEffect } from 'react';
import { Calendar, Search, Grid, List, Plus, Clock, Tag, Flag, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { ClipboardList, LogOut } from "lucide-react"
import ProfilePopup from '../../../components/popups/ProfilePopup';
import TeamCard from '../../../components/ui/TeamCard';
import { Task, Team, User } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/reducers/authSlice';
import { useAppSelector, useAppDispatch } from '../../../redux/store';
import { taskServices } from '../../../api/services/taskServices';
import StatCard from '../../../components/ui/StatCard';
import TeamDetailsPopup from '../../../components/popups/TeamDetailPopup';
import TaskDetailPopup from '../../../components/popups/TaskDetailPopup';
import toast from 'react-hot-toast';
import teamServices from '../../../api/services/teamServices';
import userServices from '../../../api/services/userServices';

import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableTaskItem = ({ task, onTaskClick }: { task: Task, onTaskClick: (task: Task) => void }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { type: 'TASK', taskId: task.taskId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            onClick={() => onTaskClick(task)}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={`cursor-pointer text-xs p-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}
        >
            <div className="truncate">{task.title}</div>
        </div>
    );
};

const CalendarDay = ({ day, tasks, currentDate, onTaskDrop, onTaskClick }: { day: number | null, tasks: Task[], currentDate: Date, onTaskDrop: (taskId: number, newDate: Date) => void, onTaskClick: (task: Task) => void }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: (item: { taskId: number }) => {
            if (day) {
                const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                onTaskDrop(item.taskId, newDate);
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            className={`min-h-24 p-2 border rounded-lg ${day ? 'bg-white' : 'bg-gray-50'
                } ${isOver ? 'bg-blue-50' : ''}`}
        >
            {day && (
                <>
                    <div className="font-medium text-gray-700 mb-1">{day}</div>
                    <div className="space-y-1">
                        {tasks.map(task => (
                            <DraggableTaskItem
                                key={task.taskId}
                                task={task}
                                onTaskClick={onTaskClick}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

type selectedMember = User | null;

const UserDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [users, setUsers] = useState<User[]>([]);
    const [selected, setSelected] = useState<Team | null>(null);

    const [members, setMembers] = useState<User[]>([]);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [managedTeams, setManagedTeams] = useState<Team[]>([]);
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

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleTeamClick = (team: Team) => {
        setSelected(team);
    };

    const closeModal = () => {
        setSelected(null);
    };

    const currentUser = useAppSelector((state) => state.auth.user);
    const [workTeam, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchTeamsByUser = async () => {
            if (!currentUser?.id) return;

            console.log(currentUser);

            const teamIdArray = currentUser?.teamId || [];
            try {
                const teamsData = await Promise.all(
                    teamIdArray.map(async (item) => {
                        const team = await teamServices.getTeamById(item);
                        const members = await Promise.all(
                            team.members.map(async (memberId) => {
                                return userServices.getUserById(memberId);
                            })
                        );
                        return { ...team, members };
                    })
                );
                setTeams(teamsData);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };

        fetchTeamsByUser();
    }, [currentUser?.id]);

    useEffect(() => {
        const fetchAllusers = async () => {
            const res: User[] = await userServices?.getAllUsers();
            if (res) {
                setUsers(res);
            }
        }

        fetchAllusers();
    }, [])

    useEffect(() => {
        const fetchMembers = async () => {
            if (!selectedTeam) return;
            try {
                const fetchedMembers: User[] = await Promise.all(
                    selectedTeam.members.map(async (memberId) => {
                        const member = await userServices.getUserById(memberId);
                        return member;
                    })
                );
                setMembers(fetchedMembers);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchMembers();
    }, [selectedTeam]);

    const getTeams = async () => {
        const res = await teamServices.getAllTeams();
        if (res) {
            setAllTeams(res);
            console.log(res)
            setManagedTeams(allTeams.filter((team: Team) => team?.teamManagerId === user?.id))
        }
    }

    useEffect(() => {
        getTeams();
    }, []);

    const fetchTasks = async () => {
        try {
            const tasks = await taskServices.getAllTasks();
            setTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    console.log(currentUser)

    const filteredTasks = useMemo(() => {
        if (!currentUser) return [];
        let tasksToFilter = [];
        if (currentUser.role === 'Team Member') {
            tasksToFilter = tasks.filter((item) => item.assignedTo == currentUser.id);
            console.log(tasksToFilter, "HIiii")
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

    const handleAddTask = async () => {
        try {
            if (!currentUser) {
                throw new Error("User is not authenticated");
            }

            let baseTask = {
                ...newTask,
                status: 'pending',
                createdBy: currentUser.id,
                assignedTo: undefined,
            };

            if (taskType === 'team' && selectedTeam && !selectedMember) {
                const members = await Promise.all(
                    selectedTeam.members.map(async (memberId) => {
                        return userServices.getUserById(memberId);
                    })
                );
                const teamTasks = members
                    .filter(member => member.role !== "Team Manager")
                    .map(member => ({
                        ...baseTask,
                        assignedTo: member.id,
                        createdBy: currentUser.id,
                        teamId: selectedTeam.teamId,
                    }));

                await Promise.all(teamTasks.map(task => taskServices.addTask(task)));
                fetchTasks();
            } else {
                const individualTask = {
                    ...baseTask,
                    createdBy: currentUser.id,
                    assignedTo: currentUser.id,
                };

                await taskServices.addTask(individualTask);
                fetchTasks();
            }

            setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                category: 'General',
                dueDate: '',
            });
            setShowAddTask(false);
            toast.success('Task added successfully');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An unexpected error occurred');
            alert(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    const handleToggleStatus = async (taskId: number) => {
        try {
            await taskServices.toggleTaskStatus(taskId);
            fetchTasks();
            toast.success('Task status updated successfully');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An unexpected error occurred');
            alert(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await taskServices.deleteTask(taskId);
            toast.success('Task deleted successfully');
            fetchTasks();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An unexpected error occurred');
            alert(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleTaskDrop = async (taskId: number, newDate: Date) => {
        try {
            const task = tasks.find(t => t.taskId === taskId);
            if (!task) return;

            const { status, ...rest } = task;

            const adjustedDate = new Date(newDate);
            adjustedDate.setDate(adjustedDate.getDate() + 1);

            const updatedTask = {
                ...rest,
                dueDate: adjustedDate.toISOString().split('T')[0],
                status: status === 'archieved' ? 'pending' : status
            };

            await taskServices.editTask(taskId, updatedTask);
            toast.success('Task date updated successfully');
            fetchTasks();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };

    const renderCalendarView = () => {
        const monthData = getMonthData();
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <DndProvider backend={HTML5Backend}>
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
                        {monthData.map((day, index) => (
                            <CalendarDay
                                key={index}
                                day={day}
                                tasks={getTasksForDate(day)}
                                currentDate={currentDate}
                                onTaskDrop={handleTaskDrop}
                                onTaskClick={(task: Task) => {
                                    setSelectedTask(task);
                                    setIsPopupOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </DndProvider>
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
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 bg-red-500 text-white text-sm px-4 py-2 hover:bg-red-600 transition rounded-3xl"
                    >
                        <LogOut size={16} className="text-white" />
                        Logout
                    </button>
                </div>
            </header>
            <div className='flex flex-col lg:flex-row-reverse items-start justify-between gap-3 p-3'>

                {(user?.role === "Team Manager" && managedTeams.length > 0) ||
                    (user?.role === "Team Member" && workTeam.length > 0) ? (
                    <div className="w-1/4 space-y-4 min-h-screen flex flex-col justify-start py-4 px-3 bg-white rounded-2xl">
                        <div className="flex-1 flex flex-col items-center justify-start gap-4 w-full">
                            <div className="flex-1 p-2 rounded-xl bg-white w-full">
                                <p className="text-md flex items-center gap-2 mb-4 bg-gray-200 text-gray-700 py-1 px-3 w-fit rounded-xl">
                                    <ClipboardList className="w-4 h-4 text-gray-700" />
                                    {user?.role === "Team Manager" ? `Teams Managed by You (${managedTeams.length})` : `My Teams (${workTeam.length})`}
                                </p>

                                <div className="bg-transparent rounded-xl mb-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                                    {(user?.role === "Team Manager" ? managedTeams : workTeam).map((team: Team) => (
                                        <TeamCard key={team.teamId} team={team} handleTeamClick={handleTeamClick} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}



                <div className="flex-1 flex flex-col items-center justify-start gap-4 w-full">
                    <div className='w-full p-4 bg-white rounded-xl'>
                        <p className="text-md flex items-center gap-2 mb-4 bg-gray-200 text-gray-700 py-1 px-3 w-fit rounded-xl">
                            <ClipboardList className="w-4 h-4 text-gray-700" />
                            Statistics
                        </p>

                        <div className="flex gap-4">
                            <StatCard
                                title="Total Tasks"
                                value={stats.total}
                                description="All active and completed tasks"
                                icon={<List className="w-6 h-6 text-black" />}
                                bgColor="bg-blue-50/70"
                                textColor="text-gray-600"
                            />
                            <StatCard
                                title="Completed"
                                value={stats.completed}
                                description="Tasks finished this period"
                                icon={<Tag className="w-6 h-6 text-emerald-500" />}
                                bgColor="bg-emerald-50/70"
                                textColor="text-emerald-600"
                            />
                            <StatCard
                                title="High Priority"
                                value={stats.highPriority}
                                description="Tasks needing immediate attention"
                                icon={<Flag className="w-6 h-6 text-rose-500" />}
                                bgColor="bg-rose-50/70"
                                textColor="text-rose-600"
                            />
                            <StatCard
                                title="Due Soon"
                                value={stats.dueSoon}
                                description="Tasks due in next 48 hours"
                                icon={<Clock className="w-6 h-6 text-amber-500" />}
                                bgColor="bg-amber-50/70"
                                textColor="text-amber-600"
                            />
                        </div>
                    </div>



                    <div className='flex-1 p-4 rounded-xl bg-white w-full'>
                        <div className='flex items-center justify-between'>

                            <p className="text-md flex items-center gap-2 mb-4 bg-gray-200 text-gray-700 py-1 px-3 w-fit rounded-xl">
                                <ClipboardList className="w-4 h-4 text-gray-700" />
                                Your Tasks
                            </p>
                            <div className='flex gap-2 items-center justify-between'>

                                <button
                                    onClick={() => setShowAddTask(!showAddTask)}
                                    className=" flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-3xl shadow-sm transition-colors text-sm"
                                >
                                    <Plus size={16} className="text-white" />
                                    Add Task
                                </button>
                            </div>
                        </div>

                        <div className="bg-transparent rounded-xl mb-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4 flex-wrap">


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

                            </div>
                        </div>

                        {viewMode === 'calendar' ? (
                            renderCalendarView()
                        ) : (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                {/* {JSON.stringify(currentUserTasks)} */}
                                {filteredTasks?.length < 1 && <div className='text-center text-gray-600 py-10'>
                                    No tasks found! Create some...
                                </div>}
                                {filteredTasks.map(task => (
                                    <div
                                        key={task.taskId}

                                        className="bg-gray-50 hover:bg-zinc-200 border-gray-200 rounded-xl shadow-sm border  p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className='h-full flex flex-col justify-between items-center gap-4'>

                                                <input
                                                    type="checkbox"
                                                    checked={task.status === 'completed'}
                                                    onChange={() => handleToggleStatus(task.taskId)}
                                                    className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-black"
                                                />


                                            </div>
                                            <div className="flex-grow">
                                                <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                                    {task.title}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span onClick={() => {
                                                        setSelectedTask(task);
                                                        setIsPopupOpen(true);
                                                    }}
                                                        className='cursor-pointer bg-blue-100 py-1 px-2 rounded-full'
                                                    >
                                                        <Eye className='text-blue-900  w-4 h-4 ' />
                                                    </span>
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
                                                    {task.createdBy !== task?.assignedTo && (
                                                        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-200 text-orange-900">
                                                            Team Task
                                                        </span>
                                                    )}
                                                    {
                                                        task.assignedTo === task.createdBy ? (
                                                            <span className='px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-300 text-black flex'>
                                                                Self Assigned Task
                                                            </span>
                                                        ) : (
                                                            <span className='px-2.5 py-0.5 rounded-full text-sm font-medium bg-stone-300 text-stone-700'>
                                                                Assigned {user?.role === "Team Manager" ? `To: ${users.find((it) => it.id === task.assignedTo)?.username}` : `By: ${users.find((it) => it.id === task.createdBy)?.username}`}
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
                                                    <option value="" >{managedTeams.length < 1 ? "No Teams are Managed" : "Select a team"}</option>
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
                                                            {members
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

                <TaskDetailPopup
                    isPopupOpen={isPopupOpen}
                    onClose={() => {
                        setIsPopupOpen(false);
                        setSelectedTask(null);
                    }}
                    task={selectedTask}
                />

                {selected && (
                    <TeamDetailsPopup
                        team={selected}
                        users={users}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    )
}

export default UserDashboard;
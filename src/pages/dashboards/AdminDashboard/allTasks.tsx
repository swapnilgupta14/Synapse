import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/Card';
import { Task} from '../../../types';
import { useAppSelector } from '../../../redux/store';
import TaskDetailPopup from '../../../components/popups/TaskDetailPopup';
import { Trash2, Archive, AlertTriangle, X, LogOut, Trash, UsersIcon } from 'lucide-react';
import ProfilePopup from '../../../components/popups/ProfilePopup';
import { logout } from '../../../redux/reducers/authSlice';
import { taskServices } from '../../../api/services/taskServices';
import { ArchiveDialog as ArchiveDialogComponent, ReassignDialog } from '../../../components/dashboardsComponents/ArchieveReassignDialog';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useAppSelector(state => state.auth);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [archiveDate, setArchiveDate] = useState(new Date());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all-tasks');
  const [profile, openProfile] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [reassignData, setReassignData] = useState<{ fromUserId: number; toUserId: number }>({
    fromUserId: 0,
    toUserId: 0
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskServices.getAllTasks();
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  type PriorityType = 'high' | 'medium' | 'low';

  const handleBulkPriorityUpdate = async (priority: PriorityType) => {
    try {
      await taskServices.bulkUpdateTasks(selectedTasks, { priority });
      await fetchTasks();
      setSelectedTasks([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error updating priorities:', error);
    }
  };

  const handleArchiveTasks = async () => {
    try {
      if (selectedTasks.length > 0) {
        await taskServices.archiveTasks(selectedTasks);
      } else {
        await taskServices.autoArchiveTasks();
      }
      await fetchTasks();
      setShowArchiveDialog(false);
      setSelectedTasks([]);
    } catch (error) {
      console.error('Error archiving tasks:', error);
    }
  };

  const handleReassignTasks = async () => {
    try {
      if (selectedTasks.length === 0) {
        alert("Please select tasks to reassign");
        return;
      }
      await taskServices.reassignSelectedTasks(
        selectedTasks,
        reassignData.fromUserId,
        reassignData.toUserId
      );
      await fetchTasks();
      setShowReassignDialog(false);
      setSelectedTasks([]);
    } catch (error) {
      console.error('Error reassigning tasks:', error);
    }
  };

  useEffect(() => {
    const autoArchiveInterval = setInterval(async () => {
      try {
        await taskServices.autoArchiveTasks();
        await fetchTasks();
      } catch (error) {
        console.error('Error in auto-archive:', error);
      }
    }, 1 * 60 * 60 * 1000);
    return () => clearInterval(autoArchiveInterval);
  }, []);

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedTasks.map(taskId =>
        taskServices.deleteTask(taskId)
      );
      await Promise.all(deletePromises);
      await fetchTasks();
      setSelectedTasks([]);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskServices.deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const BulkActionsDialog = () => {
    if (!showBulkActions) return null;

    return (
      <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bulk Actions</h2>
            <button
              onClick={() => setShowBulkActions(false)}
              aria-label="Close"
              className="text-gray-600 hover:text-gray-900 transition-colors rounded-full p-2 hover:bg-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium">Update Priority</h4>
              <select
                onChange={(e) => handleBulkPriorityUpdate(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeleteDialog = () => {
    if (!showDeleteDialog) return null;

    return (
      <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[600px] max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Delete Tasks</h2>
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
              <div className="text-red-700 font-medium">
                <p>Are you sure you want to delete {selectedTasks.length} task(s)?</p>
                <p>This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // const handleReassignTasks = () => {
  //   dispatch(reassignTasks(reassignData));
  //   setShowReassignDialog(false);
  // };

  return (
    <div className='w-full h-screen flex flex-col gap-4 px-6'>
      <header className="flex w-full justify-between items-center py-4 pb-0 my-2">
        <div>
          <p className="text-xl font-medium text-gray-800">
            Welcome, <span className="text-black font-bold capitalize">{user?.username}</span>!
          </p>
          <p className="text-md text-gray-500">Here’s what’s on your plate today</p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => openProfile(true)}
            className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-white border border-black text-black px-4 py-2 rounded-3xl shadow-sm transition-colors text-md"
          >
            Role: <span className='font-semibold'>{user?.role}</span>
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-3xl shadow-sm transition-colors text-md"
            onClick={() => setShowBulkActions(true)}
          >
            <AlertTriangle size={14} />
            Update Priority
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-3xl shadow-sm transition-colors text-md"
            onClick={() => setShowArchiveDialog(true)}
          >
            <Archive size={14} />
            Archive Tasks
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-3xl shadow-sm transition-colors text-md"
            onClick={() => setShowReassignDialog(true)}
          >
            <UsersIcon size={16} />
            Reassign Tasks
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-3xl shadow-sm transition-colors text-md"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash size={14} className="text-white" />
            Bulk Delete
          </button>

          <button
            onClick={() => dispatch(logout())}
            className="flex items-center justify-center gap-2 bg-red-500 text-white text-md px-4 py-2 hover:bg-red-600 transition rounded-3xl"
          >
            Logout
            <LogOut className="w-4 h-4" />

          </button>
        </div>
      </header>


      <Card>
        <div className="w-full">
          <div className="flex border-b p-4 gap-3">
            <button
              onClick={() => setActiveTab('all-tasks')}
              className={`h-fit px-3 py-1 font-medium transition-colors rounded-lg  duration-200 ${activeTab === 'all-tasks'
                ? 'text-blue-800 bg-blue-100'
                : 'text-gray-700  hover:text-gray-600'
                }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setActiveTab('archived-tasks')}
              className={`h-fit px-3 py-1 font-medium transition-colors rounded-lg duration-200 ${activeTab === 'archived-tasks'
                ? 'text-blue-800 bg-blue-100'
                : 'text-gray-700  hover:text-gray-600'
                }`}
            >
              Archived Tasks
            </button>
          </div>
        </div>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-md">

              <thead>
                <tr className="border-b">
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks(tasks.map(task => task.taskId));
                        } else {
                          setSelectedTasks([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-3 text-left">S. NO.</th>
                  <th className="p-3 text-left">Task ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Created At</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Assigned To</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Due Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task.taskId} className="border-b">
                    <td className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.taskId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTasks([...selectedTasks, task.taskId]);
                          } else {
                            setSelectedTasks(selectedTasks.filter((id) => id !== task.taskId));
                          }
                        }}
                      />
                    </td>
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{task.taskId}</td>
                    <td className="p-3 truncate-cell" title={task.title}>
                      {task.title}
                    </td>
                    <td className="p-3 truncate-cell" title={new Date(task.createdBy).toLocaleDateString()}>
                      {new Date(task.createdBy).toLocaleDateString()}
                    </td>
                    <td className="p-3 truncate-cell" title={String(task.createdBy)}>{task.createdBy}</td>
                    <td className="p-3 truncate-cell" title={String(task.assignedTo)}>
                      {task.createdBy === task.assignedTo ? "Self" : task.assignedTo}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-md ${task.priority === "high"
                          ? "bg-red-200 text-red-800"
                          : task.priority === "medium"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                          }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 truncate-cell" title={task.category}>{task.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-md ${task.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                          }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3 truncate-cell" title={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-3 flex justify-between items-center">
                      <span
                        className="py-1 px-2 bg-blue-100 text-blue-700 rounded-xl text-md cursor-pointer hover:bg-black hover:text-white"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsPopupOpen(true);
                        }}
                      >
                        View
                      </span>

                      <span className="w-6 h-6 flex justify-center items-center bg-red-200 rounded-full text-md text-white cursor-pointer hover:text-white"
                        onClick={() => handleDeleteTask(task.taskId)}
                      >
                        <Trash2 size={14} className="text-red-600 hover:text-white" />
                      </span>

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

      <BulkActionsDialog />
      <ReassignDialog
        showReassignDialog={showReassignDialog}
        setShowReassignDialog={setShowReassignDialog}
        reassignData={reassignData}
        setReassignData={setReassignData}
        selectedTasks={selectedTasks}
        handleReassignTasks={handleReassignTasks}
      />
      <DeleteDialog />

      <TaskDetailPopup
        isPopupOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      <ArchiveDialogComponent
        showArchiveDialog={showArchiveDialog}
        setShowArchiveDialog={setShowArchiveDialog}
        archiveDate={archiveDate}
        setArchiveDate={setArchiveDate}
        selectedTasks={selectedTasks}
        handleArchiveTasks={handleArchiveTasks}
      />

      <ProfilePopup
        profile={profile}
        user={user}
        openProfile={openProfile}
      />

      <Outlet />
    </div>
  );
};

export default AdminDashboard;
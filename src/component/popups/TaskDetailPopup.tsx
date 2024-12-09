import {
  X,
  CalendarDays,
  User,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle2,
  Hash,
  FileText,
  UserCheck
} from 'lucide-react'; import { useSelector } from 'react-redux';
import { RootState, Task } from '../../types';

type PropTypes = {
  isPopupOpen?: Boolean,
  onClose: () => void;
  taskId: number
}

const TaskDetailPopup = ({ onClose, taskId }: PropTypes) => {
  if (taskId === 0) return;
  const tasks = useSelector((state: RootState) => state.tasks);
  const taskArr: Task[] = (tasks as any).tasks;
  const task = taskArr.find(t => t.taskId === taskId);

  if(!task) return;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-gray-50">
          <div className="flex items-center gap-2">
            <FileText className="text-gray-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Task Details</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Hash className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500">Task ID</label>
                  <p className="text-gray-900 font-medium">{task.taskId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500">Title</label>
                  <p className="text-gray-900 font-medium">{task.title}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(task.createdBy).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500">Created By</label>
                  <p className="text-gray-900 font-medium">{task.createdBy}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <UserCheck className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned To</label>
                  <p className="text-gray-900 font-medium">
                    {task.createdBy === task.assignedTo ? "Self" : task.assignedTo}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500 mr-3">Priority</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${task.priority === 'high'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500 ">Category</label>
                  <p className="text-gray-900 font-medium">{task.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500 mr-3">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${task.status === 'completed'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 text-gray-400" size={18} />
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <p className="text-gray-900 font-medium">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPopup;
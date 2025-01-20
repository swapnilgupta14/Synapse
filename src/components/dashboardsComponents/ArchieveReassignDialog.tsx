import { X, AlertCircle } from 'lucide-react';
import React from 'react';

interface User {
  id: number;
  username: string;
  role: string;
}

interface ArchiveDialogProps {
  showArchiveDialog: boolean;
  setShowArchiveDialog: (show: boolean) => void;
  archiveDate: Date;
  setArchiveDate: (date: Date) => void;
  selectedTasks: number[];
  handleArchiveTasks: () => Promise<void>;
}

interface ReassignDialogProps {
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

const ArchiveDialog: React.FC<ArchiveDialogProps> = ({ 
  showArchiveDialog, 
  setShowArchiveDialog, 
  archiveDate, 
  setArchiveDate, 
  selectedTasks,
  handleArchiveTasks 
}) => {
  if (!showArchiveDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Archive Tasks</h2>
          <button
            onClick={() => setShowArchiveDialog(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {selectedTasks.length > 0 ? (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                <p className="text-blue-700">
                  {selectedTasks.length} task(s) selected for archiving
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">Archive completed tasks before:</p>
              <input
                type="date"
                value={archiveDate.toISOString().split('T')[0]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArchiveDate(new Date(e.target.value))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          <button
            onClick={handleArchiveTasks}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            {selectedTasks.length > 0 ? 'Archive Selected Tasks' : 'Auto-Archive Tasks'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReassignDialog: React.FC<ReassignDialogProps> = ({ 
  showReassignDialog, 
  setShowReassignDialog, 
  reassignData, 
  setReassignData, 
  selectedTasks,
  handleReassignTasks 
}) => {
  if (!showReassignDialog) return null;

  const members: User[] = [];
  const users = localStorage.getItem("SignedUpUsers");
  if (users) {
    const parsedUsers = JSON.parse(users) as User[];
    members.push(...parsedUsers.filter((t) => t.role === "Team Member"));
  }

  const isValid = reassignData.fromUserId && 
                 reassignData.toUserId && 
                 reassignData.fromUserId !== reassignData.toUserId &&
                 selectedTasks.length > 0;

  const handleFromUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReassignData({ 
      ...reassignData, 
      fromUserId: parseInt(e.target.value) || 0 
    });
  };

  const handleToUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReassignData({ 
      ...reassignData, 
      toUserId: parseInt(e.target.value) || 0 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reassign Tasks</h2>
          <button
            onClick={() => setShowReassignDialog(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {selectedTasks.length > 0 ? (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                <p className="text-blue-700">
                  {selectedTasks.length} task(s) selected for reassignment
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <p className="text-yellow-700">
                  Please select tasks to reassign
                </p>
              </div>
            </div>
          )}

          <select
            onChange={handleFromUserChange}
            value={reassignData.fromUserId || ''}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">From User</option>
            {members.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} [{user.id}]
              </option>
            ))}
          </select>

          <select
            onChange={handleToUserChange}
            value={reassignData.toUserId || ''}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">To User</option>
            {members.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} [{user.id}]
              </option>
            ))}
          </select>

          {reassignData.fromUserId && reassignData.toUserId && 
           reassignData.fromUserId === reassignData.toUserId && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <p className="text-yellow-700">
                  Source and destination users cannot be the same
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleReassignTasks}
            disabled={!isValid}
            className={`w-full py-2 rounded-md transition-colors ${
              isValid 
                ? 'bg-black text-white hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Reassign Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export { ArchiveDialog, ReassignDialog };
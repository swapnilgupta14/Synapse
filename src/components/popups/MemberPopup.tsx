import React from "react";
import { X, User as UserIcon } from "lucide-react";

import { User } from "../../types";

interface MembersPopupProps {
    members: User[];
    onClose: () => void;
}

const MembersPopup: React.FC<MembersPopupProps> = ({ members, onClose }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-medium text-black">
                            Members in Organisation ({members.length})
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900 transition-colors rounded-full p-2 hover:bg-gray-200"
                >
                  <X size={24} />
                        </button>
                    </div>

                    <div className="divide-y py-4">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="p-4 px-6 hover:bg-gray-50 transition-colors flex items-center space-x-4"
                            >
                                <div className="bg-slate-200 rounded-full p-2">
                                    <UserIcon className="text-gray-600" size={24} />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {member.username}
                                            </p>
                                            <p className="text-sm text-gray-600">{member.email}</p>
                                        </div>
                                        <span
                                            className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${member.role === "Admin"
                                                    ? "bg-red-100 text-red-800"
                                                    : member.role === "Organisation"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : member.role === "Project Manager"
                                                            ? "bg-green-100 text-green-800"
                                                            : member.role === "Team Manager"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-purple-100 text-purple-700"
                                                }
                    `}
                                        >
                                            {member.role}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Added: {formatDate(member.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MembersPopup;

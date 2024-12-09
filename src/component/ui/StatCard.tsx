import React from 'react';

interface StatCardProps {
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, bgColor, textColor }) => (
    <div className="bg-gray-50 border-gray-300 rounded-xl shadow-lg p-6 border transition-all duration-300 flex-1">
        <div className="flex items-center justify-between">
            <div>
                <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
            <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
        </div>
    </div>
);

export default StatCard;
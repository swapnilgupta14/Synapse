import React, { useEffect, useState } from "react";
import { loadFromLocalStorage } from "../../../utils/localStorage";
import { Team } from "../../../types";

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
  const isActiveTeam = team.members.length > 0;
  const teamAge = team.createdAt
    ? Math.floor((Date.now() - new Date(team.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-white flex flex-col justify-between rounded-lg border border-gray-200 p-4 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 truncate">{team.name}</h2>
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${isActiveTeam
              ? 'bg-green-100 text-green-700'
              : 'bg-rose-100 text-rose-700'
              }`}
          >
            {isActiveTeam ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-gray-700">
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-sm text-gray-500 mb-1">Members</div>
            <div className="text-base font-semibold text-blue-600">{team.members.length}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-sm text-gray-500 mb-1">Age</div>
            <div className="text-base font-semibold text-purple-600">{teamAge} days</div>
          </div>
        </div>


      </div>

      <div>

        <div className="space-y-2">
          <div className="text-sm text-gray-500">Team Members</div>
          <div className="flex -space-x-2">
            {team.members.slice(0, 5).map((member, index) => (
              <div
                key={member.id}
                className="w-7 h-7 rounded-full bg-zinc-200 border border-black flex items-center justify-center text-gray-700 text-sm"
                style={{ zIndex: 5 - index }}
              >
                {member.username.charAt(0).toUpperCase()}
              </div>
            ))}
            {team.members.length < 1 && (
              <div>
                No Team Mmmbers
              </div>
            )}
            {team.members.length > 5 && (
              <div className="w-7 h-7 rounded-full bg-gray-300 border border-white flex items-center justify-center text-gray-700 text-sm">
                +{team.members.length - 5}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-3 space-x-2">
          <button
            className="flex-grow bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 text-sm"
          >
            View Details
          </button>
          <button
            className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-200 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const AllTeams: React.FC = () => {
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  useEffect(() => {
    const teams = loadFromLocalStorage("teams", []);
    if (teams) {
      setAllTeams(teams);
    }
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">All Teams ({allTeams.length})</h1>
        {allTeams.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No teams found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allTeams.map((team) => (
              <TeamCard key={team.teamId} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTeams;
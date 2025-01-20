import React, { useEffect, useState } from "react";
import { Team, User } from "../../../types";
import TeamCard from "../../../components/ui/TeamCard";
import TeamDetailsPopup from "../../../components/popups/TeamDetailPopup";
import teamServices from "../../../api/services/teamServices";
import userServices from "../../../api/services/userServices";

const AllTeams: React.FC = () => {
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {

    const getTeams = async () => {
      const res = await teamServices.getAllTeams();
      if (res) {
        setAllTeams(res);
      }
    }

    const fetchAllUsers = async () => {
      try {
        const users = await userServices.getAllUsers();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getTeams();
    fetchAllUsers();
  }, []);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
  };

  const closeModal = () => {
    setSelectedTeam(null);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">All Teams ({allTeams.length})</h1>
        {allTeams.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No teams found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allTeams.map((team) => (
              <TeamCard key={team.teamId} team={team} handleTeamClick={handleTeamClick} />
            ))}
          </div>
        )}
      </div>

      {selectedTeam && (
        <TeamDetailsPopup
          team={selectedTeam}
          users={users}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AllTeams;

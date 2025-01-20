import React from "react";
import { Team, User } from "../../../types";
import { useQuery } from "react-query";
import TeamCard from "../../../components/ui/TeamCard";
import TeamDetailsPopup from "../../../components/popups/TeamDetailPopup";
import teamServices from "../../../api/services/teamServices";
import userServices from "../../../api/services/userServices";

const AllTeams: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  const { data: allTeams = [] } = useQuery<Team[], Error>(
    'teams',
    teamServices.getAllTeams,
    {
      initialData: [],
      onError: (error) => {
        console.error('Error fetching teams:', error);
      }
    }
  );

  const { data: users = [] } = useQuery<User[], Error>(
    'users',
    userServices.getAllUsers,
    {
      initialData: [],
      onError: (error) => {
        console.error('Error fetching users:', error);
      }
    }
  );

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
  };

  const closeModal = () => {
    setSelectedTeam(null);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          All Teams ({allTeams.length})
        </h1>
        {allTeams.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No teams found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allTeams.map((team) => (
              <TeamCard
                key={team.teamId}
                team={team}
                handleTeamClick={handleTeamClick}
              />
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
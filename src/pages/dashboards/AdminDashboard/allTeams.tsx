import React, { useEffect, useState } from "react";
import { loadFromLocalStorage } from "../../../utils/localStorage";
import { Team, User } from "../../../types";
import TeamCard from "../../../component/ui/TeamCard";
import TeamDetailsPopup from "../../../component/popups/TeamDetailPopup";

const AllTeams: React.FC = () => {
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    const teams = loadFromLocalStorage("teams", []);
    if (teams) {
      setAllTeams(teams);
    }

    const signedUpUsers = loadFromLocalStorage("SignedUpUsers", []);
    if (signedUpUsers) {
      setUsers(signedUpUsers);
    }
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

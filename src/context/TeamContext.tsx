import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Team } from '../types';

interface TeamContextType {
  teams: Team[];
  loading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  createTeam: (team: Omit<Team, 'teamId'>) => Promise<void>;
  updateTeam: (team: Team) => Promise<void>;
  deleteTeam: (id: number) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/teams');
      setTeams(response.data);
    } catch (err) {
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (team: Omit<Team, 'teamId'>) => {
    try {
      const response = await axiosInstance.post('/teams', team);
      setTeams([...teams, response.data]);
    } catch (err) {
      setError('Failed to create team');
    }
  };

  const updateTeam = async (team: Team) => {
    try {
      await axiosInstance.put(`/teams/${team.teamId}`, team);
      setTeams(teams.map(t => t.teamId === team.teamId ? team : t));
    } catch (err) {
      setError('Failed to update team');
    }
  };

  const deleteTeam = async (id: number) => {
    try {
      await axiosInstance.delete(`/teams/${id}`);
      setTeams(teams.filter(t => t.teamId !== id));
    } catch (err) {
      setError('Failed to delete team');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <TeamContext.Provider value={{
      teams,
      loading,
      error,
      fetchTeams,
      createTeam,
      updateTeam,
      deleteTeam
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamProvider');
  }
  return context;
}; 
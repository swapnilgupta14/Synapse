import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import { Team, User, AddTeamPayload, TeamsState } from '../types';

const initialTeamsState: TeamsState = {
    teams: loadFromLocalStorage('teams', []),
};

const teamsSlice = createSlice({
    name: 'teams',
    initialState: initialTeamsState,
    reducers: {
        addTeam: (state, action: PayloadAction<AddTeamPayload>) => {
            const newTeam: Team = {
                ...action.payload,
                teamId: action.payload.teamId || Date.now(),
                createdAt: new Date().toISOString(),
                members: []
            };

            state.teams.push(newTeam);
            saveToLocalStorage('teams', state.teams);
        },
        updateTeam: (state, action: PayloadAction<Partial<Team> & { teamId: number }>) => {
            const index = state.teams.findIndex(t => t.teamId === action.payload.teamId);
            if (index !== -1) {
                state.teams[index] = {
                    ...state.teams[index],
                    ...action.payload
                };
                saveToLocalStorage('teams', state.teams);
            }
        },
        
        deleteTeam: (state, action: PayloadAction<number>) => {
            const teamIdToDelete = action.payload;

            state.teams = state.teams.filter(t => t.teamId !== teamIdToDelete);

            const signedUpUsers: User[] = JSON.parse(
                localStorage.getItem("SignedUpUsers") || "[]"
            );

            const updatedSignedUpUsers = signedUpUsers.map(user => {
                if (user.role === 'Admin' || !user.teamId) return user;

                return {
                    ...user,
                    teamId: user.teamId.filter(id => id !== teamIdToDelete)
                };
            });

            localStorage.setItem("SignedUpUsers", JSON.stringify(updatedSignedUpUsers));
            saveToLocalStorage('teams', state.teams);
        },

        addMemberToTeam: (state, action: PayloadAction<{ teamId: number; user: User }>) => {
            const teamIndex = state.teams.findIndex(t => t.teamId === action.payload.teamId);
            if (teamIndex !== -1) {
                const team = state.teams[teamIndex];
                if (!team.members.some(m => m.id === action.payload.user.id)) {
                    team.members.push(action.payload.user);
                    saveToLocalStorage('teams', state.teams);
                }
            }
        },
        removeMemberFromTeam: (state, action: PayloadAction<{ teamId: number; userId: number }>) => {
            const teamIndex = state.teams.findIndex(t => t.teamId === action.payload.teamId);
            if (teamIndex !== -1) {
                state.teams[teamIndex].members = state.teams[teamIndex].members
                    .filter(member => member.id !== action.payload.userId);
                saveToLocalStorage('teams', state.teams);
            }
        }
    }
});

export const {
    addTeam,
    updateTeam,
    deleteTeam,
    addMemberToTeam,
    removeMemberFromTeam
} = teamsSlice.actions;
export const teamsReducer = teamsSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addTeam, updateTeam } from './teamsSlice';
import { Project, Team, AddProjectPayload, ProjectsState } from '../types';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

const initialProjectsState: ProjectsState = {
  projects: loadFromLocalStorage('projects', []),
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState: initialProjectsState,
  reducers: {
    addProject: (state, action: PayloadAction<AddProjectPayload>) => {
      const newProject: Project = {
        ...action.payload,
        projectId: Date.now(),
        createdAt: new Date().toISOString(),
        teams: [],
        status: 'planning'
      };
      state.projects.push(newProject);
      saveToLocalStorage('projects', state.projects);
    },

    updateProject: (state, action: PayloadAction<Partial<Project> & { projectId: number }>) => {
      const index = state.projects.findIndex(p => p.projectId === action.payload.projectId);
      if (index !== -1) {
        state.projects[index] = {
          ...state.projects[index],
          ...action.payload
        };
        saveToLocalStorage('projects', state.projects);
      }
    },

    deleteProject: (state, action: PayloadAction<number>) => {
      state.projects = state.projects.filter(p => p.projectId !== action.payload);
      saveToLocalStorage('projects', state.projects);
    },

    assignTeamToProject: (state, action: PayloadAction<{ projectId: number; team: Team }>) => {
      const projectIndex = state.projects.findIndex(p => p.projectId === action.payload.projectId);
      if (projectIndex !== -1) {
        const project = state.projects[projectIndex];
        if (!project.teams.some(team => team.teamId === action.payload.team.teamId)) {
          project.teams.push(action.payload.team);
          saveToLocalStorage('projects', state.projects);
        }
      }
    },

    removeTeamFromProject: (state, action: PayloadAction<{ projectId: number; teamId: number }>) => {
      const projectIndex = state.projects.findIndex(p => p.projectId === action.payload.projectId);
      if (projectIndex !== -1) {
        state.projects[projectIndex].teams = state.projects[projectIndex].teams
          .filter(team => team.teamId !== action.payload.teamId);
        saveToLocalStorage('projects', state.projects);
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(addTeam, (state, action) => {
        if (action.payload.projectId) {
          const projectIndex = state.projects.findIndex(p => p.projectId === action.payload.projectId);
          if (projectIndex !== -1) {
            const newTeam: Team = {
              teamId: action.payload.teamId || Date.now(),
              name: action.payload.name,
              projectId: action.payload.projectId,
              createdAt: new Date().toISOString(),
              members: [],
              teamManagerId: action.payload.teamManagerId || 0,
              description: action.payload.description || ''
            };

            const project = state.projects[projectIndex];
            if (!project.teams.some(team => team.teamId === newTeam.teamId)) {
              project.teams.push(newTeam);
              saveToLocalStorage('projects', state.projects);
            }
          }
        }
      })
      .addCase(updateTeam, (state, action) => {
        state.projects.forEach(project => {
          project.teams = project.teams.filter(
            team => team.teamId !== action.payload.teamId
          );
        });

        if (action.payload.projectId) {
          const targetProjectIndex = state.projects.findIndex(
            p => p.projectId === action.payload.projectId
          );

          if (targetProjectIndex !== -1) {
            const updatedTeam: Team = {
              teamId: action.payload.teamId,
              name: action.payload.name || "",
              projectId: action.payload.projectId,
              createdAt: new Date().toISOString(),
              members: [],
              teamManagerId: action.payload.teamManagerId || 0,
              description: action.payload.description || ''
            };

            const existingTeamIndex = state.projects[targetProjectIndex].teams.findIndex(
              team => team.teamId === action.payload.teamId
            );

            if (existingTeamIndex === -1) {
              state.projects[targetProjectIndex].teams.push(updatedTeam);
            }
          }
        }

        saveToLocalStorage('projects', state.projects);
      }
      );
  }
});

export const {
  addProject,
  updateProject,
  deleteProject,
  assignTeamToProject,
  removeTeamFromProject
} = projectsSlice.actions;
export const projectsReducer = projectsSlice.reducer;
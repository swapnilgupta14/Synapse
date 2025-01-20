import axiosInstance from "../axiosInstance";
import { Team, User } from "../../types";
import toast from "react-hot-toast";

interface TeamCreationData extends Omit<Team, "teamId"> {
  teamId?: number;
  id?: number;
}

// // Utility functions for member validation
// const isValidMemberArray = (members: any[]): boolean =>
//   members.every((member) => typeof member === "number");

// const transformMembersToIds = (members: any[]): number[] =>
//   members.map((member) => (typeof member === "object" ? member.id : member));

const sanitizeMembers = (members: any[]): number[] => {
  return members
    .filter(
      (member) => typeof member === "number" || typeof member?.id === "number"
    )
    .map((member) => (typeof member === "object" ? member.id : member));
};

const teamServices = {
  getAllTeams: async (): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get("/teams");
      return response.data;
    } catch (error) {
      console.error("Error fetching all teams:", error);
      throw error;
    }
  },

  getTeamsByOrganisation: async (organisationId: number): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get(
        `/teams?organisationId=${organisationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching organisation teams:", error);
      throw error;
    }
  },

  createTeam: async (teamData: TeamCreationData): Promise<Team> => {
    try {
      const id = new Date().getTime();
      const sanitizedMembers = sanitizeMembers(teamData.members || []);

      const teamPayload = {
        ...teamData,
        id,
        teamId: id,
        members: sanitizedMembers,
        createdAt: teamData.createdAt || new Date().toISOString(),
      };

      const response = await axiosInstance.post("/teams", teamPayload);

      if (teamPayload.projectId) {
        const projectResponse = await axiosInstance.get(
          `/projects/${teamPayload.projectId}`
        );
        const project = projectResponse.data;

        await axiosInstance.patch(`/projects/${teamPayload.projectId}`, {
          teams: [...project.teams, response.data.teamId],
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  },

  getTeamById: async (teamId: number): Promise<Team> => {
    try {
      const response = await axiosInstance.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching team:", error);
      throw error;
    }
  },

  getTeamsByUserId: async (userId: number): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get(`/teams?members=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams by user id:", error);
      throw error;
    }
  },

  updateTeam: async (
    teamId: number,
    teamData: Partial<Team>
  ): Promise<Team> => {
    try {
      const updatedTeamData = { ...teamData };
      if (teamData.members) {
        updatedTeamData.members = sanitizeMembers(teamData.members);
      }

      if ("projectId" in teamData) {
        const currentTeam = await teamServices.getTeamById(teamId);

        if (currentTeam.projectId) {
          const oldProjectResponse = await axiosInstance.get(
            `/projects/${currentTeam.projectId}`
          );
          const oldProject = oldProjectResponse.data;
          await axiosInstance.patch(`/projects/${currentTeam.projectId}`, {
            teams: oldProject.teams.filter((id: number) => id !== teamId),
          });
        }

        if (teamData.projectId) {
          const newProjectResponse = await axiosInstance.get(
            `/projects/${teamData.projectId}`
          );
          const newProject = newProjectResponse.data;
          await axiosInstance.patch(`/projects/${teamData.projectId}`, {
            teams: [...newProject.teams, teamId],
          });
        }
      }

      const response = await axiosInstance.patch(
        `/teams/${teamId}`,
        updatedTeamData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating team:", error);
      throw error;
    }
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    try {
      const team = await teamServices.getTeamById(teamId);
      if (team.projectId) {
        const projectResponse = await axiosInstance.get(
          `/projects/${team.projectId}`
        );
        const project = projectResponse.data;
        await axiosInstance.patch(`/projects/${team.projectId}`, {
          teams: project.teams.filter((id: number) => id !== teamId),
        });
      }

      const sanitizedMembers = sanitizeMembers(team.members);
      for (const memberId of sanitizedMembers) {
        const userResponse = await axiosInstance.get(`/users/${memberId}`);
        const user = userResponse.data;
        await axiosInstance.patch(`/users/${memberId}`, {
          teamId: user.teamId.filter((id: number) => id !== teamId),
        });
      }
      await axiosInstance.delete(`/teams/${teamId}`);
    } catch (error) {
      console.error("Error deleting team:", error);
      throw error;
    }
  },

  addTeamMember: async (teamId: number, user: User): Promise<Team> => {
    try {
      const team = await teamServices.getTeamById(teamId);
      const userId = typeof user === "object" ? user.id : user;

      if (!team.members.includes(userId)) {
        const response = await axiosInstance.patch(`/teams/${teamId}`, {
          members: [...team.members, userId],
        });

        const userResponse = await axiosInstance.get(`/users/${userId}`);
        const userData = userResponse.data;

        if (userData.teamId && !userData.teamId.includes(teamId)) {
          await axiosInstance.patch(`/users/${userId}`, {
            teamId: [...userData.teamId, teamId],
          });
        } else {
          await axiosInstance.patch(`/users/${userId}`, {
            teamId: [teamId],
          });
        }
        toast.success("Team member added successfully");
        return response.data;
      }

      return team;
    } catch (error) {
      toast.error("Error adding team member");
      console.error("Error adding team member:", error);
      throw error;
    }
  },

  addTeamMembers: async (
    teamId: number,
    memberIds: number[]
  ): Promise<Team> => {
    try {
      const team = await teamServices.getTeamById(teamId);
      const sanitizedNewMembers = sanitizeMembers(memberIds);
      const uniqueMembers = [
        ...new Set([...team.members, ...sanitizedNewMembers]),
      ];

      const response = await axiosInstance.patch(`/teams/${teamId}`, {
        members: uniqueMembers,
      });

      for (const userId of sanitizedNewMembers) {
        const userResponse = await axiosInstance.get(`/users/${userId}`);
        const user = userResponse.data;

        if (user.teamId && !user.teamId.includes(teamId)) {
          await axiosInstance.patch(`/users/${userId}`, {
            teamId: [...user.teamId, teamId],
          });
        } else {
          await axiosInstance.patch(`/users/${userId}`, {
            teamId: [teamId],
          });
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error adding team members:", error);
      throw error;
    }
  },

  removeTeamMember: async (teamId: number, userId: number): Promise<Team> => {
    try {
      const team = await teamServices.getTeamById(teamId);
      const response = await axiosInstance.patch(`/teams/${teamId}`, {
        members: team.members.filter((memberId: number) => memberId !== userId),
      });

      const userResponse = await axiosInstance.get(`/users/${userId}`);
      const user = userResponse.data;
      await axiosInstance.patch(`/users/${userId}`, {
        teamId: user.teamId.filter((id: number) => id !== teamId),
      });
      return response.data;
    } catch (error) {
      console.error("Error removing team member:", error);
      throw error;
    }
  },

  removeTeamMembers: async (
    teamId: number,
    memberIds: number[]
  ): Promise<Team> => {
    try {
      const team = await teamServices.getTeamById(teamId);
      const sanitizedMemberIds = sanitizeMembers(memberIds);

      const response = await axiosInstance.patch(`/teams/${teamId}`, {
        members: team.members.filter(
          (memberId: number) => !sanitizedMemberIds.includes(memberId)
        ),
      });

      for (const userId of sanitizedMemberIds) {
        const userResponse = await axiosInstance.get(`/users/${userId}`);
        const user = userResponse.data;
        await axiosInstance.patch(`/users/${userId}`, {
          teamId: user.teamId.filter((id: number) => id !== teamId),
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error removing team members:", error);
      throw error;
    }
  },

  getProjectTeams: async (projectId: number): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get(`/teams?projectId=${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching project teams:", error);
      throw error;
    }
  },

  assignTeamToProject: async (
    teamId: number,
    projectId: number
  ): Promise<Team> => {
    try {
      const team = await teamServices.getTeamById(teamId);
      if (team.projectId) {
        const oldProjectResponse = await axiosInstance.get(
          `/projects/${team.projectId}`
        );
        const oldProject = oldProjectResponse.data;
        await axiosInstance.patch(`/projects/${team.projectId}`, {
          teams: oldProject.teams.filter((id: number) => id !== teamId),
        });
      }

      const projectResponse = await axiosInstance.get(`/projects/${projectId}`);
      const project = projectResponse.data;
      await axiosInstance.patch(`/projects/${projectId}`, {
        teams: [...project.teams, teamId],
      });

      const response = await axiosInstance.patch(`/teams/${teamId}`, {
        projectId,
      });

      return response.data;
    } catch (error) {
      console.error("Error assigning team to project:", error);
      throw error;
    }
  },

  removeTeamFromProject: async (teamId: number): Promise<Team> => {
    try {
      const team = await teamServices.getTeamById(teamId);

      if (team.projectId) {
        const projectResponse = await axiosInstance.get(
          `/projects/${team.projectId}`
        );
        const project = projectResponse.data;
        await axiosInstance.patch(`/projects/${team.projectId}`, {
          teams: project.teams.filter((id: number) => id !== teamId),
        });
      }

      const response = await axiosInstance.patch(`/teams/${teamId}`, {
        projectId: null,
      });

      return response.data;
    } catch (error) {
      console.error("Error removing team from project:", error);
      throw error;
    }
  },
};

export default teamServices;

import axiosInstance from "../axiosInstance";
import { Project } from "../../types";
import toast from "react-hot-toast";

interface ProjectCreationData extends Omit<Project, "projectId"> {
  projectId?: number;
  id?: number;
}

// const sanitizeTeams = (teams: number[]): number[] => {
//   return teams
//     .filter((team: number) => typeof team === "number")
//     .map((team) => (typeof team === "object" ? team.id : team));
// };

const projectServices = {
  getProjects: async () => {
    try {
      const response = await axiosInstance.get("/projects");
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  getProjectById: async (projectId: number) => {
    try {
      const response = await axiosInstance.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  },

  getAllProjects: async (): Promise<Project[]> => {
    try {
      const response = await axiosInstance.get("/projects");
      return response.data;
    } catch (error) {
      console.error("Error fetching all projects:", error);
      throw error;
    }
  },

  getProjectsByOrganisation: async (
    organisationId: number
  ): Promise<Project[]> => {
    try {
      const response = await axiosInstance.get(
        `/projects?organisationId=${organisationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching organisation projects:", error);
      throw error;
    }
  },

  createProject: async (projectData: ProjectCreationData): Promise<Project> => {
    try {
      const id = new Date().getTime();
      const sanitizedTeams = projectData.teams;
      // ? sanitizeTeams(projectData.teams)
      // : [];

      const projectPayload = {
        ...projectData,
        id,
        projectId: id,
        teams: sanitizedTeams,
        createdAt: projectData.createdAt || new Date().toISOString(),
      };

      const response = await axiosInstance.post("/projects", projectPayload);

      for (const teamId of sanitizedTeams) {
        // const teamResponse = await axiosInstance.get(`/teams/${teamId}`);
        // const team = teamResponse.data;
        // console.log(team);
        await axiosInstance.patch(`/teams/${teamId}`, {
          projectId: response.data.projectId,
        });
      }

      toast.success("Project created successfully");
      return response.data;
    } catch (error) {
      toast.error("Error creating project");
      console.error("Error creating project:", error);
      throw error;
    }
  },

  updateProject: async (
    projectId: number,
    projectData: Partial<Project>
  ): Promise<Project> => {
    try {
      const updatedProjectData = { ...projectData };

      if (projectData.teams) {
        const currentProject = await projectServices.getProjectById(projectId);
        const sanitizedTeams = projectData.teams;

        const removedTeams = currentProject.teams.filter(
          (teamId: number) => !sanitizedTeams.includes(teamId)
        );

        for (const teamId of removedTeams) {
          await axiosInstance.patch(`/teams/${teamId}`, {
            projectId: null,
          });
        }

        const newTeams = sanitizedTeams.filter(
          (teamId) => !currentProject.teams.includes(teamId)
        );

        for (const teamId of newTeams) {
          await axiosInstance.patch(`/teams/${teamId}`, {
            projectId: projectId,
          });
        }

        updatedProjectData.teams = sanitizedTeams;
      }

      const response = await axiosInstance.patch(
        `/projects/${projectId}`,
        updatedProjectData
      );

      toast.success("Project updated successfully");
      return response.data;
    } catch (error) {
      toast.error("Error updating project");
      console.error("Error updating project:", error);
      throw error;
    }
  },

  deleteProject: async (projectId: number): Promise<void> => {
    try {
      const project = await projectServices.getProjectById(projectId);

      for (const teamId of project.teams) {
        await axiosInstance.patch(`/teams/${teamId}`, {
          projectId: null,
        });
      }

      await axiosInstance.delete(`/projects/${projectId}`);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Error deleting project");
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  addTeamToProject: async (
    projectId: number,
    teamId: number
  ): Promise<Project> => {
    try {
      const project = await projectServices.getProjectById(projectId);

      if (!project.teams.includes(teamId)) {
        const response = await axiosInstance.patch(`/projects/${projectId}`, {
          teams: [...project.teams, teamId],
        });

        await axiosInstance.patch(`/teams/${teamId}`, {
          projectId: projectId,
        });

        toast.success("Team added to project successfully");
        return response.data;
      }

      return project;
    } catch (error) {
      toast.error("Error adding team to project");
      console.error("Error adding team to project:", error);
      throw error;
    }
  },

  removeTeamFromProject: async (
    projectId: number,
    teamId: number
  ): Promise<Project> => {
    try {
      const project = await projectServices.getProjectById(projectId);

      const response = await axiosInstance.patch(`/projects/${projectId}`, {
        teams: project.teams.filter((id: number) => id !== teamId),
      });

      await axiosInstance.patch(`/teams/${teamId}`, {
        projectId: null,
      });

      toast.success("Team removed from project successfully");
      return response.data;
    } catch (error) {
      toast.error("Error removing team from project");
      console.error("Error removing team from project:", error);
      throw error;
    }
  },

  getProjectsByTeamId: async (teamId: number): Promise<Project[]> => {
    try {
      const response = await axiosInstance.get(`/projects?teams=${teamId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching projects by team id:", error);
      throw error;
    }
  },

  getProjectsByUserId: async (userId: number): Promise<Project[]> => {
    try {
      const response = await axiosInstance.get(
        `/projects?projectManagerId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching projects by user id:", error);
      throw error;
    }
  },
};

export default projectServices;

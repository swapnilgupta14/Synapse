import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import {
  teamsReducer,
  addTeam,
  updateTeam,
  deleteTeam,
  addMemberToTeam,
  removeMemberFromTeam,
} from "../redux/reducers/teamsSlice";
import { User } from "../types";

const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(global, "localStorage", { value: mockLocalStorage });

const mockUser: User = {
  id: 1,
  username: "testuser",
  role: "Team Member",
  email: "test@example.com",
  token: "mocktoken",
  teamId: [],
};

const createTestStore = () =>
  configureStore({
    reducer: {
      teams: teamsReducer,
    },
  });

describe("Teams Slice Reducers", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    localStorage.clear();
    store = createTestStore();
  });

  it("should add a team", () => {
    const newTeam = {
      name: "Test Team",
      projectId: 1,
      teamManagerId: 1,
      description: "A test team",
    };

    store.dispatch(addTeam(newTeam));

    const state = store.getState().teams;

    expect(state.teams).toHaveLength(1);
    expect(state.teams[0].name).toBe(newTeam.name);
    expect(state.teams[0].description).toBe(newTeam.description);

    const storedTeams = JSON.parse(localStorage.getItem("teams") || "[]");
    expect(storedTeams).toHaveLength(1);
  });

  it("should update a team", () => {
    const initialTeam = {
      name: "Initial Team",
      projectId: 1,
      teamManagerId: 1,
      description: "Initial description",
    };
    store.dispatch(addTeam(initialTeam));

    const team = store.getState().teams.teams[0];

    store.dispatch(
      updateTeam({
        teamId: team.teamId,
        name: "Updated Team",
        description: "Updated description",
      })
    );

    const state = store.getState().teams;

    expect(state.teams).toHaveLength(1);
    expect(state.teams[0].name).toBe("Updated Team");
    expect(state.teams[0].description).toBe("Updated description");
  });

  it("should delete a team", () => {
    const teamToDelete = {
      name: "Team to Delete",
      projectId: 1,
      teamManagerId: 1,
      description: "Description to delete",
    };
    store.dispatch(addTeam(teamToDelete));

    const team = store.getState().teams.teams[0];

    store.dispatch(deleteTeam(team.teamId));

    const state = store.getState().teams;

    expect(state.teams).toHaveLength(0);
    expect(localStorage.getItem("teams")).toBe("[]");
  });

  it("should add a member to a team", () => {
    const team = {
      name: "Team with Members",
      projectId: 1,
      teamManagerId: 1,
    };
    store.dispatch(addTeam(team));

    const addedTeam = store.getState().teams.teams[0];

    store.dispatch(
      addMemberToTeam({
        teamId: addedTeam.teamId,
        user: mockUser,
      })
    );

    const state = store.getState().teams;

    expect(state.teams[0].members).toHaveLength(1);
    expect(state.teams[0].members[0].username).toBe(mockUser.username);
  });

  it("should remove a member from a team", () => {
    const team = {
      name: "Team with Members",
      projectId: 1,
      teamManagerId: 1,
    };
    store.dispatch(addTeam(team));

    const addedTeam = store.getState().teams.teams[0];

    store.dispatch(
      addMemberToTeam({
        teamId: addedTeam.teamId,
        user: mockUser,
      })
    );

    store.dispatch(
      removeMemberFromTeam({
        teamId: addedTeam.teamId,
        userId: mockUser.id,
      })
    );

    const state = store.getState().teams;

    expect(state.teams[0].members).toHaveLength(0);
  });
});

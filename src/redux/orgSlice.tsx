import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { RootState } from '../redux/store';

interface OrganisationState {
    members: User[];
    loading: boolean;
    error: string | null;
}

const initialState: OrganisationState = {
    members: [],
    loading: false,
    error: null
};

const organisationSlice = createSlice({
    name: 'organisation',
    initialState,
    reducers: {
        loadMembers: (state) => {
            const org = localStorage.getItem("userCurrent");
            if (org) {
                const orgParsed = JSON.parse(org);
                const orgID = orgParsed.id;

                const storedUsers = JSON.parse(localStorage.getItem('SignedUpUsers') || '[]')
                    .filter((user: User) => user.role !== 'Admin' && user.organisationId && user.organisationId === orgID);
                state.members = storedUsers;
            }
        },

        addMembersToOrg: (state, action: PayloadAction<User[]>) => {
            const org = localStorage.getItem("userCurrent");
            if (org) {
                const orgParsed = JSON.parse(org);
                const orgID = orgParsed?.role === "Organisation" && orgParsed.id;

                const allUsers = JSON.parse(localStorage.getItem('SignedUpUsers') || '[]');

                const addedUsers: User[] = [];
                const duplicateUsers: User[] = [];

                action.payload.forEach(userToAdd => {
                    const userExists = state.members.some(
                        member => member.email === userToAdd.email
                    );

                    if (!userExists) {
                        const updatedUser = {
                            ...userToAdd,
                            organisationId: orgID,
                        };

                        state.members.push(updatedUser);
                        addedUsers.push(updatedUser);
                    } else {
                        duplicateUsers.push(userToAdd);
                    }
                });

                const updatedUsers = allUsers.map((user: User) => {
                    const matchingAddedUser = addedUsers.find(
                        addedUser => addedUser.email === user.email
                    );
                    return matchingAddedUser
                        ? { ...user, organisationId: matchingAddedUser.organisationId }
                        : user;
                });

                localStorage.setItem('SignedUpUsers', JSON.stringify(updatedUsers));

                if (duplicateUsers.length > 0) {
                    state.error = `${duplicateUsers.length} user(s) already in the organisation.`;
                } else {
                    state.error = null;
                }
            }
        },

        removeMemberFromOrg: (state, action: PayloadAction<string>) => {
            const memberEmail = action.payload;

            state.members = state.members.filter(
                member => member.email !== memberEmail
            );

            const allUsers = JSON.parse(localStorage.getItem('SignedUpUsers') || '[]');
            const updatedUsers = allUsers.map((user: User) =>
                user.email === memberEmail
                    ? { ...user, organisationId: undefined }
                    : user
            );

            localStorage.setItem('SignedUpUsers', JSON.stringify(updatedUsers));
        },

        clearMembers: (state) => {
            state.members = [];
            state.error = null;
        }
    }
});

export const selectOrganisationMembers = (state: RootState) => state.organisation.members;

export const {
    loadMembers,
    addMembersToOrg,
    removeMemberFromOrg,
    clearMembers
} = organisationSlice.actions;

export default organisationSlice.reducer;
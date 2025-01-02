// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { vi, describe, it, expect, beforeEach } from 'vitest';
// import AddTaskModal from '../component/popups/'; // Adjust import path
// import { addTask } from './taskSlice'; // Adjust import path

// // Mock dependencies
// const mockDispatch = vi.fn();
// vi.mock('react-redux', async () => {
//   const actual = await vi.importActual('react-redux');
//   return {
//     ...actual,
//     useDispatch: () => mockDispatch,
//   };
// });

// describe('AddTaskModal', () => {
//   const mockCurrentUser = {
//     id: 1,
//     username: 'testuser',
//     role: 'Team Manager',
//     email: 'test@example.com',
//     token: 'fake-token'
//   };

//   const mockProps = {
//     user: mockCurrentUser,
//     setShowAddTask: vi.fn(),
//     currentUser: mockCurrentUser,
//     managedTeams: [
//       {
//         teamId: 1,
//         name: 'Test Team',
//         members: [
//           { id: 2, username: 'team-member', role: 'Team Member' }
//         ]
//       }
//     ]
//   };

//   beforeEach(() => {
//     mockDispatch.mockClear();
//   });

//   it('renders add task modal', () => {
//     render(<AddTaskModal {...mockProps} />);
    
//     expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
//     expect(screen.getByPlaceholderText('Task description')).toBeInTheDocument();
//   });

//   it('allows entering task details', () => {
//     render(<AddTaskModal {...mockProps} />);
    
//     const titleInput = screen.getByPlaceholderText('Task title');
//     const descriptionInput = screen.getByPlaceholderText('Task description');
    
//     fireEvent.change(titleInput, { target: { value: 'New Test Task' } });
//     fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    
//     expect(titleInput).toHaveValue('New Test Task');
//     expect(descriptionInput).toHaveValue('Test description');
//   });

//   it('creates a task for team manager', () => {
//     render(<AddTaskModal {...mockProps} />);
    
//     // Fill in task details
//     const titleInput = screen.getByPlaceholderText('Task title');
//     const descriptionInput = screen.getByPlaceholderText('Task description');
//     const addTaskButton = screen.getByText('Add Task');
    
//     fireEvent.change(titleInput, { target: { value: 'New Team Task' } });
//     fireEvent.change(descriptionInput, { target: { value: 'Team task description' } });
    
//     // Select team task type
//     const teamTaskButton = screen.getByText('Team Task');
//     fireEvent.click(teamTaskButton);
    
//     // Select team
//     const teamSelect = screen.getByText('Select a team');
//     fireEvent.change(teamSelect, { target: { value: '1' } });
    
//     // Select team member
//     const memberSearchInput = screen.getByPlaceholderText('Search team members...');
//     fireEvent.change(memberSearchInput, { target: { value: 'team-member' } });
    
//     const memberOption = screen.getByText('team-member');
//     fireEvent.click(memberOption);
    
//     // Submit task
//     fireEvent.click(addTaskButton);
    
//     // Verify dispatch was called with correct task
//     expect(mockDispatch).toHaveBeenCalledWith(
//       expect.objectContaining({
//         type: 'tasks/addTask',
//         payload: expect.objectContaining({
//           title: 'New Team Task',
//           description: 'Team task description',
//           assignedTo: 2, // team member's ID
//           createdBy: 1 // current user's ID
//         })
//       })
//     );
//   });

//   it('closes modal when close button is clicked', () => {
//     const setShowAddTaskMock = vi.fn();
//     render(<AddTaskModal {...mockProps} setShowAddTask={setShowAddTaskMock} />);
    
//     const closeButton = screen.getByText('×');
//     fireEvent.click(closeButton);
    
//     expect(setShowAddTaskMock).toHaveBeenCalledWith(false);
//   });
// });
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import AllTasks from '../pages/dashboards/AdminDashboard/allTasks';
const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'));
const AllProjects = lazy(() => import('../pages/dashboards/AdminDashboard/allProjects'));
const AllUsers = lazy(() => import('../pages/dashboards/AdminDashboard/allUsers'));
const Analytics = lazy(() => import('../pages/dashboards/AdminDashboard/analytics'));
const AllTeams = lazy(() => import('../pages/dashboards/AdminDashboard/allTeams'));

export const adminRoutes: RouteObject = {
    path: 'admin',
    element: <AdminDashboard />,
    children: [
        { path: 'tasks', element: <AllTasks /> },
        { path: 'projects', element: <AllProjects /> },
        { path: 'users', element: <AllUsers /> },
        { path: 'analytics', element: <Analytics /> },
        { path: 'teams', element: <AllTeams /> },
    ],
}; 
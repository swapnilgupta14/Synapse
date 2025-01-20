import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const OrganisationDashboard = lazy(() => import('../pages/dashboards/OrganisationDashboard'));
const OrganizationHierarchyPage = lazy(() => import('../pages/dashboards/OrganisationDashboard/Hierarchy'));
import CreateProject from '../pages/dashboards/OrganisationDashboard/CreateProject';

export const organisationRoutes: RouteObject = {
    path: 'organisation',
    element: <OrganisationDashboard />,
    children: [
        { path: 'createProject', element: <CreateProject /> },
        { path: 'hierarchy', element: <OrganizationHierarchyPage /> },
    ],
}; 
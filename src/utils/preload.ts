export const preloadComponent = (importFn: () => Promise<any>): void => {
  importFn();
};

export const preloadRoute = (routePath: string): void => {
  const routeComponentMap: Record<string, () => Promise<any>> = {
    '/dashboard/admin': () => import('../pages/dashboards/AdminDashboard'),
    '/dashboard/organisation': () => import('../pages/dashboards/OrganisationDashboard'),
  };

  const importFn = routeComponentMap[routePath];
  if (importFn) {
    preloadComponent(importFn);
  }
}; 
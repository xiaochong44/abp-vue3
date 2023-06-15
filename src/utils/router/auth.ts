/**
 * 根据用户权限过滤路由
 * @param routes - 权限路由
 * @param permission - 权限
 */
export function filterAuthRoutesByUserPermission(routes: AuthRoute.Route[], permission: string[]) {
  return routes.map(route => filterAuthRouteByUserPermission(route, permission)).flat(1);
}

/**
 * 根据用户权限过滤单个路由
 * @param route - 单个权限路由
 * @param permission - 权限
 */
function filterAuthRouteByUserPermission(route: AuthRoute.Route, permission: string[]): AuthRoute.Route[] {
  const filterRoute = { ...route };
  const hasPermission = !route.meta.permissions || permission.some(x => route.meta.permissions!.includes(x));

  if (filterRoute.children) {
    const filterChildren = filterRoute.children.map(item => filterAuthRouteByUserPermission(item, permission)).flat(1);
    Object.assign(filterRoute, { children: filterChildren });
  }
  return hasPermission ? [filterRoute] : [];
}

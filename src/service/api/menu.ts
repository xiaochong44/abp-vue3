import { request } from '../request';

export function fetchCreateMenu(input: Menu.MenuCreateOrUpdate) {
  return request.post('/api/app/menu', input);
}

export function fetchUpdateMenu(id: string, input: Menu.MenuCreateOrUpdate) {
  return request.put(`/api/app/menu/${id}`, input);
}

export function fetchDeleteMenu(id: string) {
  return request.delete(`/api/app/menu/${id}`);
}

export function fetchMenuList() {
  return request.get<Menu.MenuTreeItem[]>(`/api/app/menu/list}`);
}

export function fetchUserMenu() {
  return request.get<Menu.MenuTreeItem[]>(`/api/app/menu/user-menus`);
}
export function fetchPermissionTree() {
  return request.get<Menu.MenuTreeItem[]>(`/api/app/menu/permission-tree`);
}

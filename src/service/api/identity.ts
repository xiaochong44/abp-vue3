import { request } from '../request';

/**
 * 获取角色
 * @param page - 分页信息
 * @returns - 返回分页结果
 */
export function fetchIdentityRoles(page: Identity.GetIdentityRoleInput) {
  return request.get<Common.PagedResult<Identity.IdentityRole>>('/api/identity/roles', { params: page });
}

/**
 * 更新角色
 * @param id - 角色Id
 * @param role - 角色
 * @returns - 角色信息
 */
export function fetchUpdateRole(id: string, role: Identity.UpdateIdentityRole) {
  return request.put(`/api/identity/roles/${id}`, role);
}
/**
 * 创建角色
 * @param role - 角色
 * @returns - 角色信息
 */
export function fetchCreateRole(role: Identity.UpdateIdentityRole) {
  return request.post(`/api/identity/roles`, role);
}
/**
 * 删除角色
 * @param id - 角色id
 */
export function fetchDeleteRole(id: string) {
  return request.delete(`/api/identity/roles/${id}`);
}
/**
 * 获取组织树
 * @returns - 组织树
 */
export function fetchOrganizationTree() {
  return request.get<Identity.OrganizationTreeItem[]>(`/api/identity/organization/all`);
}
/**
 * 创建部门
 * @returns - 部门信息
 */
export function fetchCreateOrganization(org: Identity.CreateOrUpdateOrganization) {
  return request.post<Identity.Organization>(`/api/identity/organization`, org);
}
/**
 * 更新部门
 * @returns - 部门信息
 */
export function fetchUpdateOrganization(id: string, org: Identity.CreateOrUpdateOrganization) {
  return request.put<Identity.Organization>(`/api/identity/organization/${id}`, org);
}
/**
 * 删除部门
 */
export function fetchDeleteOrganization(id: string) {
  return request.delete(`/api/identity/organization/${id}`);
}
/**
 * 获取部门成员
 * @param page 分页请求
 * @returns - 组织树
 */
export function fetchGetOrganizationMember(page: Identity.GetOrganizationMembersInput) {
  return request.get<Common.PagedResult<Identity.IdentityUser>>(`/api/identity/organization/members`, { params: page });
}
/**
 * 创建用户
 * @param user 用户
 * @returns - 用户
 */
export function fetchCreateUser(user: Identity.IdeneityUserCreate) {
  return request.post<Identity.IdentityUser>(`/api/identity/users`, user);
}
/**
 * 修改用户
 * @param id 用户ID
 * @param user 用户信息
 * @returns - 用户
 */
export function fetchUpdateUser(id: string, user: Identity.IdentityUserUpdate) {
  return request.put<Identity.IdentityUser>(`/api/identity/users/${id}`, user);
}
/**
 * 删除用户
 * @param id 用户ID
 */
export function fetchDeleteUser(id: string) {
  return request.delete(`/api/identity/users/${id}`);
}
/**
 * 获取角色列表
 * @returns - 角色列表
 */
export function fetchGetAllRoles() {
  return request.get<Common.ListResult<Identity.IdentityRole>>(`/api/identity/users/assignable-roles`);
}
/**
 * 获取用户角色
 * @param id 用户ID
 * @returns 角色列表
 */
export function fetchGetUserRoles(id: string) {
  return request.get<Common.ListResult<Identity.IdentityRole>>(`/api/identity/users/${id}/roles`);
}
/**
 * 部门添加成员
 * @param id 部门ID
 * @param 成员列表
 */
export function fetchAddMembers(id: string, input: Identity.AddOrRemoveMembersInput) {
  return request.post(`/api/identity/organization/${id}/add`, input);
}
/**
 * 部门添加成员
 * @param id 部门ID
 * @param 成员列表
 */
export function fetchRemoveMembers(id: string, input: Identity.AddOrRemoveMembersInput) {
  return request.post(`/api/identity/organization/${id}/remove`, input);
}
/**
 * 获取权限
 * @param providerName 提供者,用户为U，角色为R
 * @param providerKey 授权ID
 * @return 权限列表
 */
export function fetchGetPermissionList(providerName: 'R' | 'U', providerKey: string) {
  return request.get<Identity.GetPermissionListResult>(`/api/permission-management/permissions`, {
    params: { providerKey, providerName }
  });
}
/**
 * 设置权限
 * @param providerName 提供者,用户为U，角色为R
 * @param providerKey 授权ID
 */
export function fetchUpdatePermissionList(
  providerName: 'R' | 'U',
  providerKey: string,
  permissions: Identity.UpdatePermissions
) {
  return request.put(`/api/permission-management/permissions`, permissions, {
    params: { providerKey, providerName }
  });
}

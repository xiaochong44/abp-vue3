import { request } from '../request';

/**
 * 获取请求日志
 * @param page - 分页信息
 * @returns - 返回分页结果
 */
export function fetchAuditLogs(page: AbpLogs.GetAuditLogsInput) {
  return request.get<Common.PagedResult<AbpLogs.AuditLog>>('/api/app/audit-log', { params: page });
}

/**
 * 获取登录日志
 * @param page - 分页信息
 * @returns - 返回分页结果
 */
export function fetchSecurityLogs(page: AbpLogs.GetSecurityLogInput) {
  return request.get<Common.PagedResult<AbpLogs.SecurityLog>>('/api/identity/security-log', { params: page });
}

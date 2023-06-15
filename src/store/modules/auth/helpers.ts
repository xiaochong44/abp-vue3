import { localStg } from '@/utils';

/** 获取token */
export function getToken() {
  return localStg.get('token') || '';
}
/** 获取token */
export function getGrantedPolicies() {
  return localStg.get('grantedPolicies') || {};
}
/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo: Application.CurrentUser = {
    id: '',
    name: '',
    surName: '',
    tenantId: null,
    isAuthenticated: false,
    emailVerified: false,
    phoneNumberVerified: false,
    userName: '',
    roles: []
  };
  const userInfo: Application.CurrentUser = localStg.get('userInfo') || emptyInfo;

  return userInfo;
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
}

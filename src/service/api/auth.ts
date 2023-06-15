import { AUTH_CONSTS } from '~/src/config';
import { mockRequest, request } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
export function fetchLogin(username: string, password: string) {
  return request.post<ApiAuth.Token>(
    '/connect/token',
    {
      username,
      password,
      scope: AUTH_CONSTS.SCOPE,
      client_id: AUTH_CONSTS.CLIENT_ID,
      grant_type: 'password'
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
}
/** 获取应用信息 */
export function fetchApplicationConfiguration() {
  return request.get<Application.ApplicationConfiguration>(
    'api/abp/application-configuration?IncludeLocalizationResources=false'
  );
}
/** 获取用户信息 */
export function fetchUserInfo() {
  return mockRequest.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return mockRequest.post<ApiAuth.Token>('/updateToken', { refreshToken });
}

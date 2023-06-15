/** 应用模块 */
declare namespace Application {
  interface CurrentUser {
    isAuthenticated: boolean;
    id: string | null;
    tenantId?: string | null;
    impersonatorUserId?: string | null;
    impersonatorTenantId?: string | null;
    impersonatorUserName?: string | null;
    impersonatorTenantName?: string | null;
    userName: string | null;
    name: string | null;
    surName: string | null;
    email?: string | null;
    emailVerified: boolean;
    phoneNumber?: string | null;
    phoneNumberVerified: boolean;
    roles: string[];
  }
  interface CurrentTenant {
    id: string | null;
    name: string | null;
    isAvailable: boolean;
  }
  interface ApplicationConfiguration {
    currentUser: CurrentUser;
    currentTenant: CurrentTenant;
    auth: {
      grantedPolicies: Record<string, boolean>;
    };
  }
}

/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   */
  type RoleType = 'super' | 'admin' | 'user';

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    userId: string;
    /** 用户名 */
    userName: string;
    /** 用户角色类型 */
    userRole: RoleType;
  }
  type PermissionType =
    | 'AbpIdentity.Roles'
    | 'AbpIdentity.Roles.Create'
    | 'AbpIdentity.Roles.Update'
    | 'AbpIdentity.Roles.Delete'
    | 'AbpIdentity.Roles.ManagePermissions'
    | 'AbpIdentity.Organizations'
    | 'AbpIdentity.Organizations.Create'
    | 'AbpIdentity.Organizations.Update'
    | 'AbpIdentity.Organizations.Delete'
    | 'AbpIdentity.Organizations.ManageMember'
    | 'AbpIdentity.Users'
    | 'AbpIdentity.Users.Create'
    | 'AbpIdentity.Users.Update'
    | 'AbpIdentity.Users.Delete'
    | 'System.DataDictionary'
    | 'System.DataDictionary.Create'
    | 'System.DataDictionary.Update'
    | 'System.DataDictionary.Delete'
    | 'AuditLogging.AuditLog'
    | 'AbpIdentity.SecurityLog';
}

declare namespace UserManagement {
  interface User extends ApiUserManagement.User {
    /** 序号 */
    index: number;
    /** 表格的key（id） */
    key: string;
  }

  /**
   * 用户性别
   * - 0: 女
   * - 1: 男
   */
  type GenderKey = NonNullable<User['gender']>;

  /**
   * 用户状态
   * - 1: 启用
   * - 2: 禁用
   * - 3: 冻结
   * - 4: 软删除
   */
  type UserStatusKey = NonNullable<User['userStatus']>;
}

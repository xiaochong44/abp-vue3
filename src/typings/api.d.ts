// 后端接口返回的数据类型

/** 后端返回的用户权益相关类型 */
declare namespace ApiAuth {
  /** 返回的token和刷新token */
  interface Token {
    access_token: string;
    token_type: string;
    expires_in: number;
  }
  /** 返回的用户信息 */
  type UserInfo = Auth.UserInfo;
}

/** 后端返回的路由相关类型 */
declare namespace ApiRoute {
  /** 后端返回的路由数据类型 */
  interface Route {
    /** 动态路由 */
    routes: AuthRoute.Route[];
    /** 路由首页对应的key */
    home: AuthRoute.AllRouteKey;
  }
}
declare namespace Common {
  interface IEntityWithKey<T> {
    id: T;
  }
  interface IEntity extends IEntityWithKey<string> {}
  interface IHasCreationTime {
    creationTime: string;
  }
  interface IMayHaveCreator {
    creatorId?: string;
  }
  interface ICreationAuditedObject extends IHasCreationTime, IMayHaveCreator {}
  interface IHasModificationTime {
    lastModificationTime?: string;
  }
  interface IModificationAuditedObject extends IHasModificationTime {
    lastModifierId?: string;
  }
  interface ISoftDelete {
    isDeleted: boolean;
  }
  interface IHasDeletionTime {
    deletionTime?: string;
  }
  interface IDeletionAuditedObject extends IHasDeletionTime, ISoftDelete {
    deleterId?: string;
  }
  interface IFullAuditedObject extends ICreationAuditedObject, IModificationAuditedObject, IDeletionAuditedObject {}
  interface IAuditedObject extends ICreationAuditedObject, IModificationAuditedObject {}
  interface IAuditedEntityWithKeyAndUser<TPrimary, TUser> extends IAuditedObject {
    id: TPrimary;
    creator?: TUser;
    lastModifier?: TUser;
  }
  interface IAuditedEntityWithUser<TUser> extends IAuditedEntityWithKeyAndUser<string, TUser> {}
  interface PagedResult<T> {
    items: T[];
    totalCount: number;
  }
  interface ListResult<T> {
    items: T[];
  }
}
declare namespace ApiUserManagement {
  interface User {
    /** 用户id */
    id: string;
    /** 用户名 */
    userName?: string;
    /** 用户年龄 */
    age?: number;
    /**
     * 用户性别
     * - 0: 女
     * - 1: 男
     */
    gender?: '0' | '1';
    /** 用户手机号码 */
    phone: string;
    /** 用户邮箱 */
    email?: string;
    /**
     * 用户状态
     * - 1: 启用
     * - 2: 禁用
     * - 3: 冻结
     * - 4: 软删除
     */
    userStatus?: '1' | '2' | '3' | '4';
  }
}

declare namespace AbpLogs {
  interface AuditLog {
    id: string;
    applicationName?: string;
    userId?: string;
    userName?: string;
    tenantId?: string;
    tenantName?: string;
    executionTime: string;
    executionDuration: number;
    clientIpAddress: string;
    clientName?: string;
    browserInfo: string;
    httpMethod: string;
    url: string;
    exceptions?: string;
    comments: string;
    httpStatusCode: number;
  }
  interface GetAuditLogsInput {
    startTime?: string;
    endTime?: string;
    httpMethod?: string;
    userName?: string;
    hasException?: boolean;
    sorting?: string;
    skipCount: number;
    maxResultCount: number;
  }
  interface SecurityLog {
    id: string;
    applicationName?: string;
    action: string;
    userName: string;
    tenantName?: string;
    clientIpAddress: string;
    clientId?: string;
    browserInfo: string;
    creationTime: string;
  }
  interface GetSecurityLogInput {
    startTime?: string;
    endTime?: string;
    userName?: string;
    sorting?: string;
    skipCount: number;
    maxResultCount: number;
  }
}

declare namespace System {
  interface DataDictionaryItem extends Common.IEntity {
    code: string;
    displayName: string;
    description?: string;
  }
  interface DataDictionaryUpdate {
    displayName: string;
    description?: string;
    items: DataDictionaryItem[];
  }
  interface DataDictionaryCreate extends DataDictionaryUpdate {
    code: string;
  }
  interface DataDictionary extends Common.IAuditedEntityWithUser<Identity.IdentityUser> {
    code: string;
    displayName: string;
    description?: string;
    items?: DataDictionaryItem[];
  }
  interface GetDataDictionariesInput {
    sorting?: string;
    skipCount: number;
    maxResultCount: number;
    code?: string;
    displayName?: string;
  }
}

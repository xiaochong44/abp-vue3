declare namespace Identity {
  interface GetIdentityRoleInput {
    filter?: string;
    sorting?: string;
    skipCount: number;
    maxResultCount: number;
  }
  interface IdentityRole {
    id: string;
    name: string;
    isDefault: boolean;
    isStatic: boolean;
    isPublic: boolean;
    concurrencyStamp: string;
  }
  interface CreateIdentityRole {
    name: string;
    isDefault: boolean;
    isPublic: boolean;
  }
  interface UpdateIdentityRole {
    name: string;
    isDefault: boolean;
    isPublic: boolean;
    concurrencyStamp: string;
  }
  interface OrganizationTreeItem {
    title: string;
    key: string;
    value: string;
    index: number;
    parentId?: string;
    children?: OrganizationTreeItem[];
  }
  interface CreateOrUpdateOrganization {
    displayName: string;
    index: number;
    parentId?: string;
  }
  interface Organization {
    id: string;
    code: string;
    displayName: string;
    index: number;
    parentId?: string;
  }
  interface GetOrganizationMembersInput {
    filter?: string;
    sorting?: string;
    skipCount: number;
    maxResultCount: number;
    organizationUnitId?: string;
  }
  interface IdentityUser extends Common.IFullAuditedObject {
    id: string;
    userName: string;
    name: string;
    surname: string;
    email: string;
    emailConfirmed: boolean;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    isActive: boolean;
    lockoutEnabled: boolean;
    lockoutEnd: string;
    concurrencyStamp: string;
    entityVersion: number;
  }
  interface IdentityCreateOrUpdateBase {
    userName: string;
    name: string;
    email: string;
    phoneNumber?: string;
    isActive: boolean;
    lockoutEnabled: boolean;
    organizationUnitId: string;
    roleNames?: string[];
  }
  interface IdentityUserUpdate extends IdentityCreateOrUpdateBase {}
  interface IdeneityUserCreate extends IdentityCreateOrUpdateBase {
    password: string;
  }
  interface AddOrRemoveMembersInput {
    memberIds: string[];
  }
  interface ProviderInfo {
    providerName: string;
    providerKey: string;
  }

  interface PermissionGrantInfo {
    name: string;
    displayName: string;
    parentName?: string;
    isGranted: boolean;
    allowedProviders: string[];
    grantedProviders: ProviderInfo[];
  }

  interface PermissionGroup {
    name: string;
    displayName: string;
    permissions: PermissionGrantInfo[];
  }

  interface GetPermissionListResult {
    entityDisplayName: string;
    groups: PermissionGroup[];
  }

  interface UpdatePermission {
    name: string;
    isGranted: boolean;
  }

  export interface UpdatePermissions {
    permissions: UpdatePermission[];
  }
}

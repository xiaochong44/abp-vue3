const management: AuthRoute.Route = {
  name: 'management',
  path: '/management',
  component: 'basic',
  children: [
    {
      name: 'management_role',
      path: '/management/role',
      component: 'self',
      meta: {
        title: '角色管理',
        requiresAuth: true,
        icon: 'carbon:user-role'
      }
    },
    {
      name: 'management_user',
      path: '/management/user',
      component: 'self',
      meta: {
        title: '用户管理',
        requiresAuth: true,
        icon: 'ic:round-manage-accounts'
      }
    },
    {
      name: 'management_auditlog',
      path: '/management/auditlog',
      component: 'self',
      meta: { title: '请求日志', requiresAuth: true }
    },
    {
      name: 'management_securitylog',
      path: '/management/securitylog',
      component: 'self',
      meta: { title: '登录日志', requiresAuth: true }
    },
    {
      name: 'management_organization',
      path: '/management/organization',
      component: 'self',
      meta: { title: '部门管理', requiresAuth: true }
    },
    {
      name: 'management_dictionary',
      path: '/management/dictionary',
      component: 'self',
      meta: { title: '数据字典', requiresAuth: true }
    }
  ],
  meta: {
    title: '系统管理',
    icon: 'carbon:cloud-service-management',
    order: 9
  }
};

export default management;

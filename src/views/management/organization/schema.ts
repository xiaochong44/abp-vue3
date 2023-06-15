import { h } from 'vue';
import type { ISchema } from '@formily/vue';
import type { TableColumnType } from 'ant-design-vue';
import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

export const schema: ISchema = {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        minColumns: [4],
        maxColumns: [4]
      },
      properties: {
        filter: {
          type: 'string',
          title: '关健字',
          'x-decorator': 'FormItem',
          'x-component': 'Input'
        }
      }
    }
  }
};

export const editOrganizationSchema: ISchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      'x-hidden': true,
      'x-reactions': {
        target: 'parentId',
        fulfill: {
          state: {
            display: '{{$self.value}}'
          }
        }
      }
    },
    displayName: {
      type: 'string',
      title: '名称',
      required: true,
      'x-component': 'Input',
      'x-decorator': 'FormItem'
    },
    index: {
      type: 'number',
      default: 0,
      title: '排序',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber'
    },
    parentId: {
      type: 'string',
      title: '上级部门',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect'
    }
  }
};
export const editUserSchema: ISchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      'x-hidden': true,
      'x-reactions': {
        target: 'password',
        fulfill: {
          state: {
            display: '{{$self.value}}'
          }
        }
      }
    },
    userName: {
      type: 'string',
      title: '用户名',
      required: true,
      'x-component': 'Input',
      'x-decorator': 'FormItem'
    },
    password: {
      type: 'string',
      title: '密码',
      required: true,
      'x-component': 'Password',
      'x-decorator': 'FormItem',
      minLength: 6
    },
    name: {
      type: 'string',
      title: '姓名',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input'
    },
    email: {
      type: 'string',
      title: '邮箱',
      required: true,
      'x-validator': 'email',
      'x-decorator': 'FormItem',
      'x-component': 'Input'
    },
    isActive: {
      type: 'boolean',
      title: '启用',
      default: true,
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    lockoutEnabled: {
      type: 'boolean',
      title: '允许锁定',
      default: true,
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    roleNames: {
      type: 'array',
      title: '角色',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple'
      },
      'x-reactions': ['{{useAsyncDataSource(loadData)}}']
    },
    organizationUnitId: {
      type: 'string',
      title: '部门',
      'x-decorator': 'FormItem',
      'x-component': 'TreeSelect'
    }
  }
};

export const columns: TableColumnType<Identity.IdentityUser>[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 150
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 150
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 150
  },
  {
    title: '电话',
    dataIndex: 'phoneNumber',
    width: 150
  },
  {
    title: '状态',
    width: 150,
    dataIndex: 'isActive',
    customRender: ({ record }) => {
      if (record.isActive) {
        return h(Tag, { color: 'green' }, '启用');
      }
      return h(Tag, { color: 'red' }, '禁用');
    }
  },
  {
    title: '允许锁定',
    width: 150,
    dataIndex: 'lockoutEnabled',
    customRender: ({ record }) => {
      if (record.lockoutEnabled) {
        return h(Tag, { color: 'green' }, '是');
      }
      return h(Tag, { color: 'red' }, '否');
    }
  },
  {
    title: '创建时间',
    width: 180,
    dataIndex: 'creationTime',
    customRender: ({ record }) => {
      return dayjs(record.creationTime).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];

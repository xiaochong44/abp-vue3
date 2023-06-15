import type { ISchema } from '@formily/vue';
import type { TableColumnType } from 'ant-design-vue';

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

export const editSchema: ISchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      'x-hidden': true
    },
    name: {
      type: 'string',
      title: '名称',
      required: true,
      'x-component': 'Input',
      'x-decorator': 'FormItem'
    },
    isDefault: {
      type: 'boolean',
      default: false,
      title: '默认',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    }
  }
};

export const columns: TableColumnType<Identity.IdentityRole>[] = [
  {
    key: 'name',
    title: '名称',
    dataIndex: 'name',
    width: 300
  },
  {
    key: 'isDefault',
    title: '默认',
    width: 300,
    dataIndex: 'isDefault',
    customRender: ({ record }) => {
      return record.isDefault ? '是' : '否';
    }
  }
];

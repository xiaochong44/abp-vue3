import type { ISchema } from '@formily/vue';
import type { TableColumnType } from 'ant-design-vue';
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
        code: {
          type: 'string',
          title: '编号',
          'x-decorator': 'FormItem',
          'x-component': 'Input'
        },
        displayName: {
          type: 'string',
          title: '名称',
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
      'x-hidden': true,
      'x-reactions': {
        target: 'code',
        fulfill: {
          state: {
            editable: '{{!$self.value}}'
          }
        }
      }
    },
    code: {
      type: 'string',
      title: '编号',
      required: true,
      'x-component': 'Input',
      'x-decorator': 'FormItem'
    },
    displayName: {
      type: 'string',
      title: '名称',
      required: true,
      'x-component': 'Input',
      'x-decorator': 'FormItem'
    },
    items: {
      type: 'array',
      title: '项目',
      'x-component': 'ArrayTable',
      'x-decorator': 'FormItem',
      'x-component-props': {
        pagination: { pageSize: 10 }
      },
      items: {
        type: 'object',
        properties: {
          column1: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              width: 80,
              title: '序号',
              align: 'center'
            },
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index'
              }
            }
          },
          code: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '编号' },
            properties: {
              code: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  size: 'small'
                },
                required: true
              }
            }
          },
          displayName: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 200, title: '名称' },
            properties: {
              displayName: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  size: 'small'
                },
                required: true
              }
            }
          },
          operator: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: '操作',
              prop: 'operations',
              width: 70,
              fixed: 'right'
            },
            properties: {
              item: {
                type: 'void',
                'x-component': 'FormItem',
                properties: {
                  remove: {
                    type: 'void',
                    'x-component': 'ArrayTable.Remove'
                  }
                }
              }
            }
          }
        }
      },
      properties: {
        add: {
          type: 'void',
          title: '添加条目',
          'x-component': 'ArrayItems.Addition'
        }
      }
    }
  }
};

export const columns: TableColumnType<System.DataDictionary>[] = [
  {
    title: '编号',
    dataIndex: 'code',
    width: 300
  },
  {
    title: '名称',
    dataIndex: 'displayName',
    width: 300
  },
  {
    title: '创建人',
    width: 180,
    dataIndex: 'creator',
    customRender: ({ record }) => {
      return record.creator?.name;
    }
  },
  {
    title: '创建时间',
    width: 180,
    dataIndex: 'creationTime',
    customRender: ({ record }) => {
      return dayjs(record.creationTime).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    title: '修改人',
    width: 180,
    dataIndex: 'lastModifier',
    customRender: ({ record }) => {
      return record.lastModifier?.name;
    }
  },
  {
    title: '修改时间',
    width: 180,
    dataIndex: 'creationTime',
    customRender: ({ record }) => {
      return record.creationTime && dayjs(record.creationTime).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];

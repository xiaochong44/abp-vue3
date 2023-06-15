import { h } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import type { ISchema } from '@formily/vue';
import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

export const schems: ISchema = {
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
        '[startTime,endTime]': {
          type: 'string',
          title: '日期',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker.RangePicker'
        },
        userName: {
          type: 'string',
          title: '用户名',
          'x-decorator': 'FormItem',
          'x-component': 'Input'
        }
      }
    }
  }
};

export const columns: TableColumnType<AbpLogs.SecurityLog>[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 100
  },
  {
    title: '租户名',
    dataIndex: 'tenantName',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'action',
    width: 100,
    customRender: ({ record }) => {
      if (record.action === 'LoginSucceeded') {
        return h(Tag, { color: 'green' }, '登录成功');
      }
      return h(Tag, { color: 'red' }, '登录失败');
    }
  },
  {
    title: '执行时间',
    dataIndex: 'creationTime',
    width: 180,
    customRender: ({ record }) => {
      return dayjs(record.creationTime).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    title: '客户端',
    dataIndex: 'clientId',
    width: 100
  },
  {
    title: 'IP地址',
    dataIndex: 'clientIpAddress',
    width: 100
  },
  {
    title: '浏览器',
    dataIndex: 'browserInfo',
    width: 150,
    ellipsis: true
  }
];

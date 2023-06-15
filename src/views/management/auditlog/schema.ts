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
        hasException: {
          type: 'string',
          title: '状态',
          enum: [
            { label: '全部', value: '' },
            { label: '成功', value: false },
            { label: '失败', value: true }
          ],
          default: '',
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          'x-component-props': {
            optionType: 'button'
          }
        },
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
        },
        httpMethod: {
          type: 'string',
          title: '类型',
          enum: [
            {
              label: 'GET',
              value: 'GET'
            },
            {
              label: 'POST',
              value: 'POST'
            },
            {
              label: 'PUT',
              value: 'PUT'
            },
            {
              label: 'DELETE',
              value: 'DELETE'
            }
          ],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '全部'
          }
        }
      }
    }
  }
};

export const columns: TableColumnType<AbpLogs.AuditLog>[] = [
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
    title: 'Url',
    dataIndex: 'url',
    width: 150,
    ellipsis: true
  },
  {
    title: '方法',
    dataIndex: 'httpMethod',
    width: 100
  },
  {
    title: '状态码',
    dataIndex: 'httpStatusCode',
    width: 100,
    customRender: ({ record }) => {
      if (record.httpStatusCode === 200 || record.httpStatusCode === 204) {
        return h(Tag, { color: 'green' }, record.httpStatusCode);
      }
      return h(Tag, { color: 'red' }, record.httpStatusCode);
    }
  },
  {
    title: '执行时间',
    dataIndex: 'executionTime',
    width: 180,
    customRender: ({ record }) => {
      return dayjs(record.executionTime).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    title: '执行时长',
    dataIndex: 'executionDuration',
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
  },
  {
    title: '错误信息',
    dataIndex: 'exceptions',
    width: 300,
    ellipsis: true
  }
];

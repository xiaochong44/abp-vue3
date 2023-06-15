import type { ISchema } from '@formily/vue';
import type { TableProps, TableColumnType } from 'ant-design-vue';

/**
 * 表格分页参数
 */
type PaginationParams = { skipCount: number; maxResultCount: number };

/**
 * 表格请求接口的参数
 */
export type ApiParams = PaginationParams;

/**
 * 表格接口的请求函数
 */
type ApiFn<Params = ApiParams, TableData = Record<string, unknown>> = (
  params: Params
) => Promise<Service.RequestResult<Common.PagedResult<TableData>>>;

export interface ToolbarSetting {
  reload?: boolean;
  size?: boolean;
}
type InnerTableProps<T> = Omit<TableProps<T>, 'title'>;
export interface ProTableProps<T> extends InnerTableProps<T> {
  cardBordered?: boolean;
  title?: string;
  id?: string;
  action?: TableColumnType | false;
  autoHeight?: boolean;
  showToolBar?: boolean;
  showSearchForm?: boolean;
  searchSchema?: ISchema;
  toolbar?: ToolbarSetting;
  apiFn?: ApiFn<ApiParams, T>;
  apiParams?: Record<string, any>;
}

export type ProTableInstance = {
  getData: () => Promise<void>;
  reload: () => Promise<void>;
};

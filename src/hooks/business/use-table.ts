import { ref, reactive } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { PaginationProps } from 'ant-design-vue';
import type { ColumnType } from 'ant-design-vue/es/table/interface';
import { useLoadingEmpty } from '../common';

/**
 * 表格分页参数
 */
type PaginationParams = { skipCount: number; maxResultCount: number };

/**
 * 表格请求接口的参数
 */
type ApiParams = PaginationParams;

/**
 * 表格接口的请求函数
 */
type ApiFn<Params = ApiParams, TableData = Record<string, unknown>> = (
  params: Params
) => Promise<Service.RequestResult<Common.PagedResult<TableData>>>;

/**
 * 表格接口请求后转换后的数据
 */
type TransformedTableData<TableData = Record<string, unknown>> = {
  data: TableData[];
  pageNum: number;
  pageSize: number;
  total: number;
};

/**
 * 表格的列
 */
type DataTableColumn<T> = ColumnType<T>;

/**
 * 表格数据转换器
 * @description 将不同接口的表格数据转换成统一的类型
 */
type Transformer<TableData = Record<string, unknown>> = (
  apiData: Common.PagedResult<TableData>
) => TransformedTableData<TableData>;

type TableParams<TableData = Record<string, unknown>, Params = ApiParams> = {
  apiFn?: ApiFn<Params, TableData>;
  apiParams: ComputedRef<Params>;
  transformer?: Transformer<TableData>;
  columns: DataTableColumn<TableData>[];
  pagination?: PaginationProps;
};

export function useTable<TableData, Params extends ApiParams>(
  params: TableParams<TableData, Params>,
  immediate = true
) {
  const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty();
  const data: Ref<TableData[]> = ref([]);

  function updateData(update: TableData[]) {
    data.value = update;
  }

  let dataSource: TableData[] = [];
  function setDataSource(source: TableData[]) {
    dataSource = source;
  }

  function resetData() {
    data.value = dataSource;
  }

  const columns = ref(params.columns) as Ref<DataTableColumn<TableData>[]>;

  const pagination = reactive({
    ...getPagination(params.pagination)
  }) as PaginationProps;

  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update);
  }
  function transformedApiData(apiData: Common.PagedResult<TableData>) {
    const transformedData: TransformedTableData<TableData> = {
      data: apiData.items,
      total: apiData.totalCount,
      pageNum: params.apiParams.value.skipCount / params.apiParams.value.maxResultCount + 1,
      pageSize: params.apiParams.value.maxResultCount
    };
    return transformedData;
  }
  async function getData() {
    const apiParams: Params = { ...params.apiParams.value };

    startLoading();
    const { data: apiData } = params.apiFn
      ? await params.apiFn(apiParams)
      : { data: { items: [], totalCount: 0 } as Common.PagedResult<TableData> };

    if (apiData) {
      const transformedData = params.transformer ? params.transformer(apiData) : transformedApiData(apiData);

      updateData(transformedData.data);

      setDataSource(transformedData.data);

      setEmpty(transformedData.data.length === 0);

      updatePagination({
        current: transformedData.pageNum,
        pageSize: transformedData.pageSize,
        total: transformedData.total
      });
    }

    endLoading();
  }

  if (immediate) {
    getData();
  }

  return {
    data,
    columns,
    loading,
    empty,
    pagination,
    getData,
    updateData,
    resetData
  };
}

function getPagination(pagination?: Partial<PaginationProps>) {
  const defaultPagination: Partial<PaginationProps> = {
    current: 1,
    pageSize: 10,
    showSizeChanger: false
  };
  Object.assign(defaultPagination, pagination);

  return defaultPagination;
}

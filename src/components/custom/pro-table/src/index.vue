<template>
  <div ref="wrapRef" :style="wrapStyle">
    <SearchForm
      v-if="showSearchForm"
      ref="searchFormRef"
      :schema="searchSchema"
      class="mb-4"
      @submit="handleSearch"
      @reset="handleReset"
    >
    </SearchForm>
    <Card :bordered="cardBordered" :style="cardStyle" :body-style="bodyStyle">
      <div class="h-full overflow-hidden pro-table">
        <div v-if="showToolBar" class="mb-4 toolbar">
          <div class="flex justify-between items-center">
            <div class="font-bold">{{ title }}</div>
            <div class="flex-1 flex justify-end gap-4">
              <slot name="toolbar" />
              <Toolbar
                :size="tableProps.size"
                :setting="toolbar"
                @size-change="handleSizeChange"
                @reload="handleReload"
              />
            </div>
          </div>
        </div>
        <Table v-bind="tableProps" ref="tableRef" @change="handleTableChange">
          <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </Table>
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup generic="T">
import type { CSSProperties, Ref } from 'vue';
import { computed, ref, unref } from 'vue';
import type { TablePaginationConfig } from 'ant-design-vue';
import { Table, Card } from 'ant-design-vue';
import type { SizeType } from 'ant-design-vue/es/config-provider';
import type { FilterValue, SorterResult } from 'ant-design-vue/es/table/interface';
import { isBoolean, isUndefined } from 'lodash-es';
import { useTable } from '@/hooks';
import SearchForm from '@/components/custom/search-form.vue';
import Toolbar from './components/toolbar/index.vue';
import { useTableScroll } from './useTableScroll';
import type { ProTableProps } from './types';

defineOptions({
  name: 'ProTable'
});

const emits = defineEmits<{
  (event: 'reload'): void;
  (event: 'paginationChange', page: TablePaginationConfig): void;
}>();
const props = withDefaults(defineProps<ProTableProps<T>>(), {
  cardBordered: true,
  showHeader: true,
  indentSize: 15,
  rowKey: 'key',
  showExpandColumn: true,
  showSorterTooltip: true,
  childrenColumnName: 'children',
  sortDirections: () => ['ascend', 'descend'],
  tableLayout: 'fixed',
  size: 'middle',
  title: '',
  action: () => {
    return { title: '操作', width: 120, fixed: 'right' };
  },
  showToolBar: true,
  toolbar: () => {
    return {
      reload: true,
      size: true
    };
  },
  showSearchForm: false,
  autoHeight: false
});
const cardStyle = computed<CSSProperties | undefined>(() => {
  return props.autoHeight ? { flex: 1 } : undefined;
});
const bodyStyle = computed<CSSProperties | undefined>(() => {
  return props.autoHeight ? { height: '100%' } : undefined;
});
const wrapStyle = computed<CSSProperties | undefined>(() => {
  return props.autoHeight ? { height: '100%', display: 'flex', flexDirection: 'column' } : undefined;
});
const innerPropsRef = ref<Partial<ProTableProps<T>>>();
const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as ProTableProps<T>;
});
const wrapRef: Ref<HTMLDivElement | null> = ref(null);
const tableRef: Ref<ComponentRef<HTMLDivElement>> = ref(null);
const searchFormRef: Ref<ComponentRef<HTMLDivElement>> = ref(null);
const innerSize = ref<SizeType>(undefined);
const innerSorter = ref<SorterResult<T> | SorterResult<T>[]>({});
const innerFilter = ref<Record<string, FilterValue>>({});
const innerPagination = ref<TablePaginationConfig>({ current: 1, pageSize: 10 });
const searchState = ref({});
const columns = computed(() => {
  const cols = props.columns || [];
  const action = { title: '操作', width: 120, fixed: 'right', ...props.action };
  if (props.action && cols.findIndex(x => x.key === '$action$') < 0) {
    cols?.push({
      title: action.title,
      fixed: action.fixed,
      width: action.width,
      key: '$action$',
      slots: {
        customRender: 'action'
      }
    });
  }
  return cols;
});
const getPagination = computed<TablePaginationConfig | false>(() => {
  if (isBoolean(props.pagination)) {
    return false;
  }
  return { ...innerPagination.value, ...props.pagination };
});
const getApiParams = computed(() => {
  return {
    maxResultCount: isBoolean(getPagination.value) ? 0 : getPagination.value.pageSize || 10,
    skipCount: isBoolean(getPagination.value)
      ? 0
      : ((getPagination.value.current || 1) - 1) * (getPagination.value.pageSize || 0),
    ...searchState.value,
    ...props.apiParams
  };
});
const { data, getData, loading, pagination } = useTable({
  apiFn: props.apiFn,
  columns: columns.value,
  apiParams: getApiParams,
  pagination: !getPagination.value ? undefined : getPagination.value
});
const { getScrollRef } = useTableScroll(getProps, tableRef, wrapRef);
const tableProps = computed(() => {
  return {
    ...props,
    title: undefined,
    columns: columns.value,
    size: innerSize.value || props.size,
    scroll: getScrollRef.value as any,
    loading: loading.value || props.loading,
    // loading: isUndefined(props.loading) ? loading.value : props.loading,
    dataSource: props.dataSource || data.value,
    pagination: { ...getPagination.value, ...pagination }
  };
});
function handleSizeChange(size: SizeType) {
  innerSize.value = size;
}
async function handleReload() {
  emits('reload');
  innerPagination.value.current = 1;
  await getData();
}
function handleTableChange(
  page: TablePaginationConfig,
  filter: Record<string, FilterValue>,
  sorter: SorterResult<any> | SorterResult<any>[]
) {
  innerSorter.value = sorter;
  innerFilter.value = filter;
  innerPagination.value = page;
  emits('paginationChange', page);
  getData();
}
function handleSearch(values: any) {
  searchState.value = values;
  getData();
}
function handleReset() {
  searchState.value = {};
  getData();
}
defineExpose({
  getData,
  reload: handleReload
});
</script>
<style>
.pro-table .ant-pagination {
  margin-bottom: 0 !important;
}
</style>

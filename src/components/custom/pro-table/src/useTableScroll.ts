import type { Ref, ComputedRef } from 'vue';
import { ref, computed, unref, nextTick, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import isBoolean from 'lodash-es/isBoolean';
import { onMountedOrActivated, useWindowSizeFn } from '~/src/hooks/common';
import type { ProTableProps } from './types';

export function useTableScroll<T>(
  propsRef: ComputedRef<ProTableProps<T>>,
  tableElRef: Ref<ComponentRef>,
  wrapRef: Ref<HTMLDivElement | null>
) {
  const tableHeightRef: Ref<Nullable<number | string>> = ref(167);
  const hasScrollBarY = ref(false);
  // Greater than animation time 280
  const debounceRedoHeight = useDebounceFn(redoHeight, 100);

  const getCanResize = computed(() => {
    const { autoHeight, scroll } = unref(propsRef);
    return autoHeight && !(scroll || {}).y;
  });

  watch(
    () => [unref(getCanResize), unref(propsRef.value)?.dataSource?.length],
    () => {
      debounceRedoHeight();
    },
    {
      flush: 'post'
    }
  );

  function redoHeight() {
    nextTick(() => {
      calcTableHeight();
    });
  }

  function setHeight(height: number) {
    tableHeightRef.value = height;
  }

  // No need to repeat queries
  let paginationEl: HTMLElement | null;
  let footerEl: HTMLElement | null;
  let bodyEl: HTMLElement | null;
  function getElementHeight(ele: HTMLElement | null) {
    return ele?.offsetHeight || 0;
  }
  function getToolbarHeight() {
    let toolbarHeight = 0;
    const tableEl: Element = wrapRef.value!;
    if (propsRef.value.showToolBar) {
      const toolbarEl = tableEl.querySelector('.toolbar') as HTMLElement;
      if (toolbarEl) toolbarHeight = toolbarEl.offsetHeight + 16;
    }
    return toolbarHeight;
  }
  function getPaginationHeight() {
    let paginationHeight = 16;
    const tableEl: Element = tableElRef.value!.$el;
    if (!isBoolean(propsRef.value.pagination)) {
      paginationEl = tableEl.querySelector('.ant-pagination') as HTMLElement;
      if (paginationEl) {
        const offsetHeight = paginationEl.offsetHeight;
        paginationHeight += offsetHeight || 0;
      }
    } else {
      paginationHeight = 0;
    }
    return paginationHeight;
  }
  function getFooterHeight() {
    let footerHeight = 0;
    const tableEl: Element = tableElRef.value!.$el;
    if (!isBoolean(propsRef.value.pagination)) {
      if (!footerEl) {
        footerEl = tableEl.querySelector('.ant-table-footer') as HTMLElement;
      } else {
        const offsetHeight = footerEl.offsetHeight;
        footerHeight += offsetHeight || 0;
      }
    }
    return footerHeight;
  }
  function getSearchFormHeight() {
    let height = 0;
    const searchForm = wrapRef.value?.querySelector('.search-form') as HTMLElement;
    if (searchForm) {
      height = searchForm.offsetHeight + 16;
    }
    return height;
  }
  async function calcTableHeight() {
    if (!tableElRef.value) return;
    const tableEl: Element = tableElRef.value.$el;
    if (!tableEl) return;
    if (!bodyEl) {
      bodyEl = tableEl.querySelector('.ant-table-body');
      if (!bodyEl) return;
    }
    hasScrollBarY.value = bodyEl.scrollHeight > bodyEl.clientHeight;
    const hasScrollBarX = bodyEl.scrollWidth > bodyEl.clientWidth;
    if (hasScrollBarY.value) {
      // eslint-disable-next-line no-unused-expressions
      tableEl.classList.contains('hide-scrollbar-y') && tableEl.classList.remove('hide-scrollbar-y');
    } else {
      // eslint-disable-next-line no-unused-expressions
      !tableEl.classList.contains('hide-scrollbar-y') && tableEl.classList.add('hide-scrollbar-y');
    }

    if (hasScrollBarX) {
      // eslint-disable-next-line no-unused-expressions
      tableEl.classList.contains('hide-scrollbar-x') && tableEl.classList.remove('hide-scrollbar-x');
    } else {
      // eslint-disable-next-line no-unused-expressions
      !tableEl.classList.contains('hide-scrollbar-x') && tableEl.classList.add('hide-scrollbar-x');
    }

    bodyEl!.style.height = 'unset';

    if (!unref(getCanResize) || propsRef.value.dataSource?.length === 0) return;

    await nextTick();

    const headEl = tableEl.querySelector('.ant-table-thead ');
    // Pager height
    const paginationHeight = getPaginationHeight();

    const footerHeight = getFooterHeight();

    const toolbarHeight = getToolbarHeight();

    const headerHeight = getElementHeight(headEl as HTMLElement);
    const searchHeight = getSearchFormHeight();

    let bottomIncludeBody = 0;
    if (unref(wrapRef)) {
      const wrapHeight = unref(wrapRef)?.offsetHeight ?? 0;
      bottomIncludeBody = wrapHeight - searchHeight - 48 - toolbarHeight;
    }
    const height = bottomIncludeBody - paginationHeight - footerHeight - headerHeight - 2;
    setHeight(height);
    // bodyEl!.style.height = `${height}px`;
  }
  useWindowSizeFn(calcTableHeight as any, 280);
  onMountedOrActivated(() => {
    calcTableHeight();
    nextTick(() => {
      debounceRedoHeight();
    });
  });

  const getScrollRef = computed(() => {
    const tableHeight = unref(tableHeightRef);
    const { autoHeight, scroll } = unref(propsRef);
    return {
      x: true,
      y: null,
      scrollToFirstRowOnChange: false,
      ...scroll
    };
  });

  return { getScrollRef, redoHeight };
}

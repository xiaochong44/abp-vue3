<template>
  <div class="pro-table-action" @click="onCellClick">
    <template v-for="(action, index) in actions" :key="`${index}-${action.label}`">
      <Tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
        <PopConfirmButton v-bind="action"> </PopConfirmButton>
      </Tooltip>
      <PopConfirmButton v-else-if="action.popConfirm" v-bind="action"> </PopConfirmButton>
      <Button v-else v-bind="action">{{ action.text }}</Button>
      <Divider v-if="divider && index < actions.length - 1" type="vertical" class="action-divider" />
    </template>
    <Dropdown
      v-if="dropdownList && dropdownList.length > 0"
      :trigger="['hover']"
      :drop-menu-list="dropdownList"
      popconfirm
    >
      <slot name="more"></slot>
      <Button v-if="!$slots.more" type="link" size="small">
        <MoreOutlined class="icon-more" />
      </Button>
    </Dropdown>
  </div>
</template>
<script setup lang="ts">
import { toRaw, computed } from 'vue';
import { isBoolean, isFunction, isString } from 'lodash-es';
import { MoreOutlined } from '@ant-design/icons-vue';
import { Tooltip, Divider, Button } from 'ant-design-vue';
import type { TooltipProps } from 'ant-design-vue';
import { useAuth } from '@/hooks';
import Dropdown from '@/components/custom/dropdown-menus.vue';
import PopConfirmButton from '@/components/custom/popconfirm-button.vue';
import type { ActionItem, TableActionProps } from '../types';

const { hasPermission } = useAuth();
const props = withDefaults(defineProps<TableActionProps>(), { divider: true, stopButtonPropagation: false });

function isIfShow(action: ActionItem): boolean {
  const ifShow = action.ifShow;

  let isShow = true;

  if (isBoolean(ifShow)) {
    isShow = ifShow;
  }
  if (isFunction(ifShow)) {
    isShow = ifShow(action);
  }
  return isShow;
}
const actions = computed(() => {
  return (toRaw(props.actions) || [])
    .filter(action => {
      return (!action.auth || hasPermission(action.auth)) && isIfShow(action);
    })
    .map(action => {
      const { popConfirm } = action;
      return {
        type: 'link',
        size: 'small',
        ...action,
        ...(popConfirm || {}),
        onConfirm: popConfirm?.confirm,
        onCancel: popConfirm?.cancel,
        showCancel: true,
        enable: Boolean(popConfirm)
      };
    });
});
const dropdownList = computed((): any[] => {
  const list = (toRaw(props.dropDownActions) || []).filter(action => {
    return isIfShow(action);
  });
  return list.map((action, index) => {
    const { popConfirm } = action;
    return {
      ...action,
      ...popConfirm,
      onConfirm: popConfirm?.confirm,
      onCancel: popConfirm?.cancel,
      divider: index < list.length - 1 ? props.divider : false
    };
  });
});
function getTooltip(data: string | TooltipProps): TooltipProps {
  return {
    placement: 'bottom',
    ...(isString(data) ? { title: data } : data)
  };
}
function onCellClick(e: MouseEvent) {
  if (!props.stopButtonPropagation) return;
  const path = e.composedPath() as HTMLElement[];
  const isInButton = path.find(ele => {
    return ele.tagName?.toUpperCase() === 'BUTTON';
  });
  if (isInButton) e.stopPropagation();
}
</script>
<style>
.pro-table-action .ant-divider-vertical {
  margin: 0 !important;
}
</style>

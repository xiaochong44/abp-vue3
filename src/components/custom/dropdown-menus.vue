<template>
  <Dropdown
    :arrow="arrow"
    :overlay-class-name="overlayClassName"
    :overlay-style="overlayStyle"
    :disabled="disabled"
    :placement="placement"
    :trigger="trigger"
    :destroy-popup-on-hide="destroyPopupOnHide"
  >
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <Menu :selected-keys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <MenuItem v-bind="getAttr(item.title)" :disabled="item.disabled" @click="handleClickMenu(item)">
            <Popconfirm v-if="popconfirm && item.popConfirm" v-bind="getPopConfirmAttrs(item.popConfirm)">
              <template v-if="item.popConfirm.icon" #icon>
                <svg-icon :icon="item.popConfirm.icon" />
              </template>
              <div>
                <svg-icon v-if="item.icon" :icon="item.icon" />
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </Popconfirm>
            <template v-else>
              <svg-icon v-if="item.icon" :icon="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </MenuItem>
          <MenuDivider v-if="item.divider" :key="`d-${item.title}`" />
        </template>
      </Menu>
    </template>
  </Dropdown>
</template>
<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed } from 'vue';
import { Dropdown, Menu, MenuItem, MenuDivider, Popconfirm } from 'ant-design-vue';
import type { Trigger } from 'ant-design-vue/es/dropdown/props';
import { isFunction, omit } from 'lodash-es';
import type { ActionItem } from './pro-table';

type DropdownMenuProps = {
  arrow?: boolean;
  destroyPopupOnHide?: boolean;
  disabled?: boolean;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  placement?:
    | 'top'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topRight'
    | 'topCenter'
    | 'bottomCenter'
    | undefined;
  trigger?: Trigger[] | Trigger | undefined;
  dropMenuList: ActionItem[];
  popconfirm: boolean;
  selectedKeys: string[];
};
withDefaults(defineProps<DropdownMenuProps>(), {
  arrow: true,
  destroyPopupOnHide: false,
  disabled: false,
  overlayClassName: undefined,
  overlayStyle: undefined,
  placement: 'bottom',
  trigger: () => ['click'],
  popconfirm: false,
  dropMenuList: () => [],
  selectedKeys: () => []
});
const emit = defineEmits(['menuEvent']);

function handleClickMenu(item: ActionItem) {
  emit('menuEvent', item);
  item.onClick?.();
}

const getPopConfirmAttrs = computed(() => {
  return (attrs: any) => {
    const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon']);
    if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm)) originAttrs.onConfirm = attrs.confirm;
    if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel)) originAttrs.onCancel = attrs.cancel;
    return originAttrs;
  };
});

const getAttr = (key: string | undefined) => ({ key });
</script>

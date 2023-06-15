<template>
  <div class="settings-item">
    <Tooltip placement="top" title="密度">
      <Dropdown placement="bottom" :trigger="['click']">
        <span><ColumnHeightOutlined /></span>
        <template #overlay>
          <Menu selectable :selected-keys="selectedKeys" @click="handleSizeChange">
            <MenuItem key="large">默认</MenuItem>
            <MenuItem key="middle">中等</MenuItem>
            <MenuItem key="small">紧凑</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ColumnHeightOutlined } from '@ant-design/icons-vue';
import { Tooltip, Dropdown, Menu, MenuItem } from 'ant-design-vue';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import type { SizeType } from 'ant-design-vue/es/config-provider';

const props = defineProps<{ size: SizeType }>();
const emits = defineEmits<{ (event: 'change', size: SizeType): void }>();
const selectedKeys = computed(() => {
  return [props.size] as string[];
});

function handleSizeChange(info: MenuInfo) {
  if (props.size !== info.key) {
    emits('change', info.key as SizeType);
  }
}
</script>

<template>
  <div class="pro-table-settings">
    <Reload v-if="setting.reload" @click="handleReload" />
    <Size v-if="setting.size" :size="size" @change="handleSizeChange" />
  </div>
</template>
<script setup lang="ts">
import type { SizeType } from 'ant-design-vue/es/config-provider';
import type { ToolbarProps } from '../../types';
import Reload from './reload-item.vue';
import Size from './size-item.vue';
defineProps<ToolbarProps>();
const emits = defineEmits<{ (event: 'sizeChange', size: SizeType): void; (event: 'reload'): void }>();

function handleSizeChange(size: SizeType) {
  emits('sizeChange', size);
}
function handleReload() {
  emits('reload');
}
</script>
<style lang="scss">
.pro-table-settings {
  display: inline-flex;
  gap: 16px;
  align-items: center;
  .settings-item {
    cursor: pointer;
    font-size: 16px;
    line-height: 32px;
    &:hover {
      color: rgba(var(--primary-color));
    }
  }
}
</style>

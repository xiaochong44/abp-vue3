<template>
  <div class="settings-item" @click="handleClick">
    <Tooltip placement="top" title="刷新">
      <ReloadOutlined />
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'reload-item'
});
import { ReloadOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';

const emits = defineEmits(['click']);

function handleClick() {
  emits('click');
}
</script>

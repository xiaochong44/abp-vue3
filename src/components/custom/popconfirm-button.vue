<template>
  <Popconfirm v-bind="popconfirmProps">
    <Button v-bind="props">
      <template v-if="props.icon && isIconify" #icon>
        <svg-icon :icon="props.icon" />
      </template>
      {{ text }}</Button
    >
  </Popconfirm>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { PopconfirmProps, ButtonProps } from 'ant-design-vue';
import { Popconfirm, Button } from 'ant-design-vue';
import { omit } from 'lodash-es';

const props = defineProps<PopconfirmProps & ButtonProps & { text?: string }>();

const popconfirmProps = computed(() => {
  return omit(props, 'visible', 'open');
});
const isIconify = computed(() => {
  return props.icon?.indexOf(':') >= 0;
});
</script>

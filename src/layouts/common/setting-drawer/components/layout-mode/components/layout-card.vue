<template>
  <div
    class="border-2px rounded-6px cursor-pointer hover:border-primary"
    :class="[checked ? 'border-primary' : 'border-transparent']"
  >
    <Tooltip :placement="activeConfig.placement" trigger="hover" :title="label" :overlay-style="{ zIndex: 9999 }">
      <div
        class="layout-card__shadow gap-6px w-96px h-64px p-6px rd-4px"
        :class="[mode.includes('vertical') ? 'flex' : 'flex-col']"
      >
        <slot></slot>
      </div>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Tooltip } from 'ant-design-vue';
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip';

defineOptions({ name: 'LayoutCard' });

interface Props {
  /** 布局模式 */
  mode: UnionKey.ThemeLayoutMode;
  /** 布局模式文本 */
  label: string;
  /** 选中状态 */
  checked: boolean;
}

const props = defineProps<Props>();

type LayoutConfig = Record<
  UnionKey.ThemeLayoutMode,
  {
    placement: TooltipPlacement;
    headerClass: string;
    menuClass: string;
    mainClass: string;
  }
>;

const layoutConfig: LayoutConfig = {
  vertical: {
    placement: 'bottomLeft',
    headerClass: '',
    menuClass: 'w-1/3 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  'vertical-mix': {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-1/4 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  horizontal: {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-full h-3/4'
  },
  'horizontal-mix': {
    placement: 'bottomRight',
    headerClass: '',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-2/3 h-3/4'
  }
};

const activeConfig = computed(() => layoutConfig[props.mode]);
</script>

<style scoped>
.layout-card__shadow {
  box-shadow: 0 1px 2.5px rgba(0, 0, 0, 0.18);
}
</style>

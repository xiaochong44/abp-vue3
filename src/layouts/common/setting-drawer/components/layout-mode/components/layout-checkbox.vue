<template>
  <div
    class="border-2px rounded-6px cursor-pointer hover:border-primary"
    :class="[checked ? 'border-primary' : 'border-transparent']"
  >
    <Tooltip :placement="activeConfig.placement" trigger="hover" :title="label">
      <div class="layout-checkbox__shadow relative w-56px h-48px bg-white rounded-4px overflow-hidden">
        <div class="absolute-lt bg-#273352" :class="activeConfig.menuClass"></div>
        <div class="absolute-rb bg-#f0f2f5" :class="activeConfig.mainClass"></div>
      </div>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Tooltip } from 'ant-design-vue';
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip';

defineOptions({ name: 'LayoutCheckbox' });

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
    menuClass: string;
    mainClass: string;
  }
>;

const layoutConfig: LayoutConfig = {
  vertical: {
    placement: 'bottomLeft',
    menuClass: 'w-1/3 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  'vertical-mix': {
    placement: 'bottom',
    menuClass: 'w-1/4 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  horizontal: {
    placement: 'bottom',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-full h-3/4'
  },
  'horizontal-mix': {
    placement: 'bottomRight',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-2/3 h-3/4'
  }
};

const activeConfig = computed(() => layoutConfig[props.mode]);
</script>

<style scoped>
.layout-checkbox__shadow {
  box-shadow: 0 1px 2.5px rgba(0, 0, 0, 0.18);
}
</style>

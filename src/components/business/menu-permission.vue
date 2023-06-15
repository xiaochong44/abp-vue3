<template>
  <div>
    <div class="menu-folder flex items-center border-gray-200" :style="style">
      <div class="mr-10">
        <Checkbox :checked="isChecked(menu.permission)" @change="handleChange">{{ menu?.displayName }}</Checkbox>
      </div>
      <div v-if="isMenu" class="flex-1">
        <Checkbox
          v-for="(btn, index) in menu?.children"
          :key="index"
          :checked="isChecked(btn.permission)"
          @change="handleBtnChange($event, btn)"
          >{{ btn.displayName }}</Checkbox
        >
      </div>
    </div>
    <div v-if="!isMenu" class="pl-8">
      <menu-permission
        v-for="(child, index) in childitems"
        :key="index"
        :menu="child"
        :checked="checked"
        @change="handleChildChange"
      ></menu-permission>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import { computed, watchEffect } from 'vue';
import { Checkbox } from 'ant-design-vue';
import type { CheckboxChangeEvent } from 'ant-design-vue/lib/checkbox/interface';
import { getTreeProp } from '~/src/utils';
defineOptions({
  name: 'menu-permission'
});
const emits = defineEmits<{ (event: 'change', data: string[]): void }>();
const props = defineProps<{ menu: Menu.MenuTreeItem; checked: string[] }>();
let allPermissions: string[] = [];
const isMenu = computed(() => {
  return props.menu?.type === 1;
});
const childitems = computed(() => {
  return props.menu?.children.filter(x => x.type !== 2);
});
const style = computed<CSSProperties>(() => {
  return {
    padding: '16px 0',
    borderBottomWidth: '1px',
    borderStyle: 'solid'
  };
});
function isChecked(name?: string) {
  return name ? props.checked.indexOf(name) >= 0 : false;
}
function handleBtnChange(e: CheckboxChangeEvent, btn: Menu.MenuTreeItem) {
  const orgChecked = [...props.checked];
  if (e.target.checked) {
    if (orgChecked.indexOf(btn.permission!) < 0) {
      orgChecked.push(btn.permission!);
    }
    if (orgChecked.indexOf(props.menu.permission!) < 0) {
      orgChecked.push(props.menu.permission!);
    }
  } else {
    const index = orgChecked.indexOf(btn.permission!);
    if (index >= 0) {
      orgChecked.splice(index, 1);
    }
  }
  console.log(orgChecked);
  emits('change', orgChecked);
}
function handleChange(e: CheckboxChangeEvent) {
  const orgChecked = [...props.checked];
  if (e.target.checked) {
    if (orgChecked.indexOf(props.menu.permission!) < 0) {
      orgChecked.push(props.menu.permission!);
    }
    allPermissions.forEach(x => {
      if (orgChecked.indexOf(x) < 0) {
        orgChecked.push(x);
      }
    });
  } else {
    let index = orgChecked.indexOf(props.menu.permission!);
    if (index >= 0) {
      orgChecked.splice(index, 1);
    }
    allPermissions.forEach(x => {
      index = orgChecked.indexOf(x);
      if (index >= 0) {
        orgChecked.splice(index, 1);
      }
    });
  }
  emits('change', orgChecked);
}
function handleChildChange(data: string[]) {
  if (allPermissions.some(x => data.indexOf(x) >= 0) && data.indexOf(props.menu.permission!) < 0) {
    data.push(props.menu.permission!);
  }
  emits('change', data);
}
watchEffect(() => {
  allPermissions = [];
  if (props.menu.children) {
    const permissions = getTreeProp(props.menu.children, 'permission');
    if (permissions) {
      allPermissions.push(...permissions);
    }
  }
  // allPermissions.push(props.menu.permission!);
});
</script>

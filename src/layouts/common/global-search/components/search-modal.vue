<template>
  <Modal
    v-model:open="show"
    :closable="false"
    footer-style="padding: 0; margin: 0"
    class="fixed left-0 right-0"
    :class="[isMobile ? 'wh-full top-0px rounded-0' : 'w-630px top-50px']"
  >
    <InputGroup>
      <Input ref="inputRef" v-model:value="keyword" clearable placeholder="请输入关键词搜索" @input="handleSearch">
        <template #prefix>
          <icon-uil-search class="text-15px text-#c2c2c2" />
        </template>
      </Input>
    </InputGroup>

    <div class="mt-20px">
      <Empty v-if="resultOptions.length === 0" description="暂无搜索结果" />
      <search-result v-else v-model:value="activePath" :options="resultOptions" @enter="handleEnter" />
    </div>
    <template #footer>
      <search-footer v-if="!isMobile" />
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, InputGroup, Input, Empty } from 'ant-design-vue';
import { onKeyStroke, useDebounceFn } from '@vueuse/core';
import { useRouteStore } from '@/store';
import { useBasicLayout } from '@/composables';
import SearchResult from './search-result.vue';
import SearchFooter from './search-footer.vue';

defineOptions({ name: 'SearchModal' });

interface Props {
  /** 弹窗显隐 */
  value: boolean;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:value', val: boolean): void;
}

const emit = defineEmits<Emits>();

const { isMobile } = useBasicLayout();
const router = useRouter();
const routeStore = useRouteStore();

const keyword = ref('');
const activePath = ref('');
const resultOptions = shallowRef<AuthRoute.Route[]>([]);
const inputRef = ref<HTMLInputElement>();

const handleSearch = useDebounceFn(search, 300);

const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit('update:value', val);
  }
});

watch(show, async val => {
  if (val) {
    /** 自动聚焦 */
    await nextTick();
    inputRef.value?.focus();
  } else {
    setTimeout(() => {
      resultOptions.value = [];
      keyword.value = '';
    }, 200);
  }
});

/** 查询 */
function search() {
  resultOptions.value = routeStore.searchMenus.filter(
    menu => keyword.value && menu.meta?.title.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase().trim())
  );
  if (resultOptions.value?.length > 0) {
    activePath.value = resultOptions.value[0].path;
  } else {
    activePath.value = '';
  }
}

function handleClose() {
  show.value = false;
  /** 延时处理防止用户看到某些操作 */
  setTimeout(() => {
    resultOptions.value = [];
    keyword.value = '';
  }, 200);
}

/** key up */
function handleUp() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(item => item.path === activePath.value);
  if (index === 0) {
    activePath.value = resultOptions.value[length - 1].path;
  } else {
    activePath.value = resultOptions.value[index - 1].path;
  }
}

/** key down */
function handleDown() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(item => item.path === activePath.value);
  if (index + 1 === length) {
    activePath.value = resultOptions.value[0].path;
  } else {
    activePath.value = resultOptions.value[index + 1].path;
  }
}

/** key enter */
function handleEnter() {
  const { length } = resultOptions.value;
  if (length === 0 || activePath.value === '') return;
  const routeItem = resultOptions.value.find(item => item.path === activePath.value);
  if (routeItem?.meta?.href) {
    window.open(activePath.value, '__blank');
  } else {
    router.push(activePath.value);
    handleClose();
  }
}

onKeyStroke('Escape', handleClose);
onKeyStroke('Enter', handleEnter);
onKeyStroke('ArrowUp', handleUp);
onKeyStroke('ArrowDown', handleDown);
</script>

<style lang="scss" scoped></style>

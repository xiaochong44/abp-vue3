<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 mt-4">
      <ProTable
        id="role-list-table"
        ref="listRef"
        title="数据字典列表"
        card-bordered
        bordered
        :api-fn="fetchDataDictionaries"
        :columns="columns"
        :show-header="true"
        auto-height
        :search-schema="schema"
        :show-search-form="true"
        :scroll="{ x: 1200 }"
        :pagination="{}"
      >
        <template #toolbar>
          <Button type="primary" :disabled="!hasCreate" @click="handleCreate">新建</Button>
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                text: '编辑',
                disabled: record.isStatic || !hasUpdate,
                onClick: handleEdit.bind(null, record)
              },
              {
                text: '删除',
                color: 'error',
                disabled: record.isStatic || !hasDelete,
                popConfirm: {
                  title: '是否继续',
                  confirm: handleDelete.bind(null, record)
                }
              }
            ]"
          ></TableAction>
        </template>
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useTable } from '@/hooks';
import { ref } from 'vue';
import { Button } from 'ant-design-vue';
import { useAuth } from '@/hooks';
import type { ProTableInstance } from '@/components/custom/pro-table';
import { ProTable } from '@/components/custom/pro-table';
import {
  fetchDataDictionaries,
  fetchUpdateDataDictionary,
  fetchDeleteDataDictionary,
  fetchCreateDataDictionary
} from '@/service/api';
import { useFormily } from '@/components/formily/hooks';
import { columns, schema } from './schema';
import EditForm from './edit-form.vue';

const { hasCreate, hasDelete, hasUpdate } = useAuth('System.DataDictionary');
const { FormDialog } = useFormily();
const listRef = ref<ProTableInstance | null>(null);

function handleEdit(item: any) {
  openDrawer(item);
}
function openDrawer(data: any) {
  FormDialog({ title: '编辑', width: 800, bodyStyle: { maxHeight: '65vh', overflow: 'auto' } }, EditForm as any)
    .open({ initialValues: data })
    .then(async x => {
      if (x.id) {
        await fetchUpdateDataDictionary(x.id, x);
      } else {
        await fetchCreateDataDictionary(x);
      }
      listRef.value?.getData();
    });
}

function handleCreate() {
  openDrawer({ id: '' });
}
async function handleDelete(item: Identity.IdentityRole) {
  await fetchDeleteDataDictionary(item.id);
  listRef.value?.getData();
}
</script>

<style scoped></style>

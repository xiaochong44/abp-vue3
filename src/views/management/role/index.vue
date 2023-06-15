<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 mt-4">
      <ProTable
        id="role-list-table"
        ref="listRef"
        title="角色列表"
        card-bordered
        bordered
        :api-fn="fetchIdentityRoles"
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
                text: '权限',
                disabled: !hasManagePermission,
                onClick: handleManagePermission.bind(null, record)
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
    <EditPermission ref="permissionRef" />
  </div>
</template>

<script setup lang="ts">
// import { useTable } from '@/hooks';
import { ref, computed } from 'vue';
import { Button } from 'ant-design-vue';
import { useAuth } from '@/hooks';
import type { ProTableInstance } from '@/components/custom/pro-table';
import { ProTable } from '@/components/custom/pro-table';
import { fetchIdentityRoles, fetchUpdateRole, fetchDeleteRole, fetchCreateRole } from '@/service/api';
import { useFormily } from '@/components/formily/hooks';
import { columns, schema } from './schema';
import EditForm from './edit-form.vue';
import EditPermission from './permission-modal.vue';

const { hasCreate, hasDelete, hasUpdate, hasPermission } = useAuth('AbpIdentity.Roles');
const { FormDrawer } = useFormily();
const listRef = ref<ProTableInstance | null>(null);
const permissionRef = ref<any>(null);
const hasManagePermission = computed(() => {
  return hasPermission('AbpIdentity.Roles.ManagePermissions');
});
function handleEdit(item: any) {
  openDrawer(item);
}
function openDrawer(data: any) {
  FormDrawer({ title: '编辑', width: 400 }, EditForm as any)
    .open({ initialValues: data })
    .then(async x => {
      if (x.id) {
        await fetchUpdateRole(x.id, x);
      } else {
        await fetchCreateRole(x);
      }
      listRef.value?.getData();
    });
}
function handleManagePermission(role: Identity.IdentityRole) {
  permissionRef.value?.openModal(role);
}
function handleCreate() {
  openDrawer({ id: '', isDefault: false });
}
async function handleDelete(item: Identity.IdentityRole) {
  await fetchDeleteRole(item.id);
  listRef.value?.getData();
}
</script>

<style scoped></style>

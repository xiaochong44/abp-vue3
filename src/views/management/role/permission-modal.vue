<template>
  <Modal title="权限管理" width="800px" :open="open" @cancel="handleCancel" @ok="handleOk">
    <div class="max-h-60vh overflow-auto">
      <MenuPermission
        v-for="(item, index) in permissions"
        :key="index"
        :menu="item"
        :checked="curPermissions"
        @change="handlePermissionChange"
      ></MenuPermission>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'ant-design-vue';
import { fetchPermissionTree, fetchGetPermissionList, fetchUpdatePermissionList } from '@/service';
import MenuPermission from '@/components/business/menu-permission.vue';

const permissions = ref<Menu.MenuTreeItem[]>([]);
const roleRef = ref<Identity.IdentityRole | null>(null);
const curPermissions = ref<string[]>([]);

const open = ref(false);
function handleCancel() {
  open.value = false;
}
async function handleOk() {
  if (roleRef.value) {
    const updatePermissions: Identity.UpdatePermissions = {
      permissions: curPermissions.value.map(p => {
        return {
          name: p,
          isGranted: true
        };
      })
    };
    await fetchUpdatePermissionList('R', roleRef.value!.name, updatePermissions);
  }
  open.value = false;
}
function openModal(role: Identity.IdentityRole) {
  roleRef.value = role;
  fetchGetPermissionList('R', role.name).then(x => {
    const grandedPermissions: string[] = [];
    x.data?.groups.forEach(g => {
      const names = g.permissions.filter(p => p.isGranted).map(p => p.name);
      grandedPermissions.push(...names);
    });
    curPermissions.value = grandedPermissions;
  });
  open.value = true;
}
function handlePermissionChange(data: string[]) {
  curPermissions.value = data;
}
defineExpose({ openModal });
onMounted(() => {
  fetchPermissionTree().then(x => {
    permissions.value = x.data || [];
  });
});
</script>

<template>
  <div class="h-full flex">
    <div class="h-full w-300px mr-4 bg-white p-4 overflow-auto rounded-2">
      <Input v-model:value="searchValue" size="small" class="mb-4" allow-clear placeholder="请输入关键字搜索" />
      <Tree
        :tree-data="treeData"
        block-node
        :expanded-keys="expandedKeys"
        :selected-keys="selectedKeys"
        :auto-expand-parent="autoExpandParent"
        @expand="handleExpand"
        @select="handleSelectedOrg"
      >
        <template #title="{ key: treeKey, title }">
          <Dropdown :trigger="['contextmenu']">
            <div>{{ title }}</div>
            <template #overlay>
              <Menu @click="({ key: menuKey }) => handleContextMenuClick(treeKey, menuKey)">
                <MenuItem key="add" :disabled="!hasCreate">新增</MenuItem>
                <MenuItem key="edit" :disabled="!hasUpdate">编辑</MenuItem>
                <MenuItem key="delete" :disabled="!hasDelete">删除</MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </template>
      </Tree>
    </div>
    <div class="flex-1 overflow-hidden">
      <ProTable
        v-if="hasGetUsers"
        id="role-list-table"
        ref="listRef"
        title="用户列表"
        card-bordered
        bordered
        :api-fn="fetchGetOrganizationMember"
        :api-params="selectedOrgId"
        :columns="columns"
        :show-header="true"
        auto-height
        :search-schema="schema"
        :show-search-form="true"
        :scroll="{ x: 1200 }"
        :pagination="{}"
        :action="{
          width: '120px'
        }"
      >
        <template #toolbar>
          <Button type="primary" :disabled="!hasCreateUser || selectedKeys.length === 0" @click="handleCreateUser"
            >新建</Button
          >
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                text: '编辑',
                disabled: !hasUpdateUser,
                onClick: handleEditUser.bind(null, record)
              },
              {
                text: '删除',
                color: 'error',
                disabled: record.userName === 'admin' || !hasDeleteUser,
                popConfirm: {
                  title: '是否继续',
                  confirm: handleDeleteUser.bind(null, record)
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
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { Tree, Input, Dropdown, Menu, MenuItem, Modal, Button } from 'ant-design-vue';
import { onFieldMount } from '@formily/core';
import { useAuth } from '@/hooks';
import type { ProTableInstance } from '@/components/custom/pro-table';
import { ProTable } from '@/components/custom/pro-table';
import {
  fetchOrganizationTree,
  fetchCreateOrganization,
  fetchUpdateOrganization,
  fetchDeleteOrganization,
  fetchGetOrganizationMember,
  fetchCreateUser,
  fetchUpdateUser,
  fetchDeleteUser,
  fetchGetUserRoles
} from '@/service/api';
import { useFormily } from '@/components/formily/hooks';
import { filterTree } from '~/src/utils';
import EditOrganization from './editOrganization.vue';
import EditUser from './editUser.vue';
import { columns, schema } from './schema';

const { hasCreate, hasDelete, hasUpdate } = useAuth('AbpIdentity.Organizations');
const {
  hasCreate: hasCreateUser,
  hasDelete: hasDeleteUser,
  hasGet: hasGetUsers,
  hasUpdate: hasUpdateUser
} = useAuth('AbpIdentity.Users');
const { FormDialog } = useFormily();
const treeData = ref<Identity.OrganizationTreeItem[]>([]);
const allTreeData = ref<Identity.OrganizationTreeItem[]>([]);
const selectedKeys = ref<(string | number)[]>([]);
const searchValue = ref('');
const autoExpandParent = ref<boolean>(true);
const expandedKeys = ref<(string | number)[]>([]);
const listRef = ref<ProTableInstance | null>(null);

// 拍平的数组
const platTreeData: Identity.OrganizationTreeItem[] = [];
const selectedOrgId = computed(() => {
  if (selectedKeys.value.length > 0) {
    return {
      organizationUnitId: selectedKeys.value[0]
    };
  }
  return {};
});
function platTree(data: Identity.OrganizationTreeItem[]) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    platTreeData.push({ key, title: node.title, value: key, parentId: node.parentId, index: node.index });
    if (node.children) {
      platTree(node.children);
    }
  }
}
async function getOrganizationTree() {
  const { data: apidata } = await fetchOrganizationTree();
  allTreeData.value = apidata || [];
  platTree(allTreeData.value);
  searchTreeNodes(searchValue.value || '');
  if (selectedKeys.value.length === 0 && treeData.value.length > 0) {
    selectedKeys.value = [treeData.value[0].key];
  }
}
function handleExpand(keys: (string | number)[]) {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
}
function handleSelectedOrg(keys: (string | number)[]) {
  selectedKeys.value = keys;
  nextTick(() => {
    listRef.value?.reload();
  });
}
function handleCreateUser() {
  openUserModal({});
}
async function openUserModal(user: any) {
  if (user.id) {
    const res = await fetchGetUserRoles(user.id);
    const roleNames = res.data?.items.map(x => x.name);
    // eslint-disable-next-line require-atomic-updates
    user.organizationUnitId = selectedKeys.value[0];
    // eslint-disable-next-line require-atomic-updates
    user.roleNames = roleNames;
  }
  FormDialog({ title: user.id ? '新建用户' : '编辑用户' }, EditUser as any)
    .open({
      initialValues: user,
      effects() {
        onFieldMount('organizationUnitId', field => {
          (field as any).setDataSource(allTreeData.value);
        });
      }
    })
    .then(async x => {
      if (x.id) {
        await fetchUpdateUser(x.id, x);
      } else {
        const res = await fetchCreateUser(x);
        if (res.data) {
          // await fetchAddMembers(selectedKeys.value[0] as string, { memberIds: [res.data?.id] });
        }
      }
      listRef.value?.reload();
    });
}
function handleEditUser(user: Identity.IdentityUser) {
  openUserModal(user);
}
async function handleDeleteUser(user: Identity.IdentityUser) {
  await fetchDeleteUser(user.id);
  listRef.value?.reload();
}
async function handleContextMenuClick(treeKey: string, menuKey: any) {
  const initialValues: Identity.CreateOrUpdateOrganization & { id?: string } = {
    displayName: '',
    index: 0,
    parentId: treeKey
  };
  if (menuKey === 'edit') {
    const org = platTreeData.find(x => x.key === treeKey);
    if (org) {
      initialValues.displayName = org.title;
      initialValues.index = org.index;
      initialValues.parentId = org.parentId;
      initialValues.id = org.key;
    } else {
      return;
    }
  } else if (menuKey === 'delete') {
    Modal.confirm({
      title: '温馨提示',
      content: '删除后无法恢复，是否继续?',
      okText: '继续',
      onOk: async () => {
        await fetchDeleteOrganization(treeKey);
        await getOrganizationTree();
      }
    });

    return;
  }
  onEditOrganization(initialValues);
}
function onEditOrganization(initialValues: Identity.CreateOrUpdateOrganization & { id?: string }) {
  FormDialog({ title: '编辑' }, EditOrganization as any)
    .open({
      initialValues,
      effects() {
        onFieldMount('parentId', field => {
          (field as any).setDataSource(allTreeData.value);
        });
      }
    })
    .then(async x => {
      if (x.id) {
        await fetchUpdateOrganization(x.id, x);
      } else {
        await fetchCreateOrganization(x);
      }
      await getOrganizationTree();
    });
}
function searchTreeNodes(searchText: string) {
  const searchData = filterTree(allTreeData.value, node => {
    return node.title.indexOf(searchText) >= 0;
  });
  treeData.value = searchData;
  // const expandkeys = treeToList(searchData).map((val: any) => {
  //   return val.key;
  // });
  // expandedKeys.value = expandkeys;
}
onMounted(() => {
  getOrganizationTree();
});
watch(searchValue, value => {
  const expanded = platTreeData
    .map(item => {
      if (item.title.indexOf(value) > -1) {
        return item.parentId;
      }
      return undefined;
    })
    .filter(item => Boolean(item));
  expandedKeys.value = expanded as string[];
  searchValue.value = value;
  autoExpandParent.value = true;
  searchTreeNodes(value);
});
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex-1">
      <ProTable
        id="role-list-table"
        title="请求列表"
        card-bordered
        bordered
        :api-fn="fetchAuditLogs"
        :columns="columns"
        :show-header="true"
        auto-height
        :search-schema="schems"
        :show-search-form="true"
        :scroll="{ x: 1200 }"
        :pagination="{}"
        :action="false"
      >
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProTable } from '@/components/custom/pro-table';
import { fetchAuditLogs } from '@/service/api';
import { schems, columns } from './schema';
</script>

<style scoped></style>

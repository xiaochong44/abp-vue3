<template>
  <FormLayout :label-col="6" :wrapper-col="16">
    <SchemaField :schema="editUserSchema" :scope="{ useAsyncDataSource, loadData }" />
  </FormLayout>
</template>
<script lang="ts" setup>
import { action } from '@formily/reactive';
import type { DataField } from '@formily/core';
import { fetchGetAllRoles } from '@/service';
import { useFormily } from '@/components/formily/hooks';
import { editUserSchema } from './schema';

const { FormLayout, SchemaField } = useFormily();

const useAsyncDataSource = (service: () => Promise<any>) => (field: DataField) => {
  field.loading = true;
  service().then(
    action.bound!(data => {
      field.dataSource = data;
      field.loading = false;
    })
  );
};

const loadData = async () => {
  return new Promise(resolve => {
    fetchGetAllRoles().then(x => {
      if (x.data) {
        const options = x.data.items.map(item => {
          return {
            label: item.name,
            value: item.name
          };
        });
        resolve(options);
      }
    });
  });
};
</script>

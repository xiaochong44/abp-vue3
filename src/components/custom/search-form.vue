<template>
  <Card :body-style="{ paddingBottom: 0 }" class="search-form">
    <FormProvider :form="form">
      <div class="flex justify-between">
        <div class="flex-1 mr-4">
          <SchemaField :schema="schema"> </SchemaField>
        </div>
        <FormButtonGroup name="btn">
          <Submit @submit="onSubmit">查询</Submit>
          <Reset @click="onReset">重置</Reset>
        </FormButtonGroup>
      </div>
    </FormProvider>
  </Card>
</template>
<script setup lang="ts">
import { Card } from 'ant-design-vue';
import type { ISchema } from '@formily/vue';
import { useFormily } from '@/components/formily/hooks';
const { form, FormProvider, SchemaField, Submit, Reset, FormButtonGroup } = useFormily();

interface Props {
  schema?: ISchema;
  onSubmit: (values: any) => void;
  onReset?: () => void;
}

defineProps<Props>();
</script>

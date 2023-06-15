<template>
  <FormLayout :label-col="6" :wrapper-col="16">
    <SchemaField :schema="editSchema" />
  </FormLayout>
</template>
<script lang="ts" setup>
import { useFormily } from '@/components/formily/hooks';
import { editSchema } from './schema';

const { FormLayout, SchemaField } = useFormily();
</script>

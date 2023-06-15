<template>
  <FormLayout :label-col="6" :wrapper-col="16">
    <SchemaField :schema="editOrganizationSchema" />
  </FormLayout>
</template>
<script lang="ts" setup>
import { useFormily } from '@/components/formily/hooks';
import { editOrganizationSchema } from './schema';

const { FormLayout, SchemaField } = useFormily();
</script>

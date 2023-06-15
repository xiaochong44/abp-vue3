import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/vue';
import {
  FormItem,
  Select,
  Input,
  DatePicker,
  Submit,
  FormGrid,
  Form,
  FormButtonGroup,
  FormLayout,
  ArrayItems,
  ArrayCards,
  ArrayCollapse,
  ArrayTable,
  ArrayTabs,
  Cascader,
  Checkbox,
  Editable,
  FormCollapse,
  FormDialog,
  FormDrawer,
  FormStep,
  FormTab,
  InputNumber,
  Password,
  PreviewText,
  Radio,
  Reset,
  Space,
  Switch,
  TimePicker,
  TreeSelect,
  Upload
} from './src';

export function useFormily() {
  const form = createForm();
  const fields = createSchemaField({
    components: {
      FormItem,
      Select,
      Input,
      DatePicker,
      FormGrid,
      FormButtonGroup,
      FormLayout,
      ArrayItems,
      ArrayCards,
      ArrayCollapse,
      ArrayTable,
      ArrayTabs,
      Cascader,
      Checkbox,
      Editable,
      FormCollapse,
      FormStep,
      FormTab,
      InputNumber,
      Password,
      PreviewText,
      Radio,
      Reset,
      Space,
      Switch,
      TimePicker,
      TreeSelect,
      Upload,
      Submit
    }
  });
  return {
    form,
    createForm,
    FormProvider,
    Submit,
    Reset,
    FormGrid,
    Form,
    FormDialog,
    FormDrawer,
    FormButtonGroup,
    FormLayout,
    ...fields
  };
}

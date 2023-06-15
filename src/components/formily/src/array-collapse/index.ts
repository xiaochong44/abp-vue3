import type { Ref } from 'vue';
import { defineComponent, ref, watchEffect, h } from 'vue';
import { Badge, Card, Collapse, Empty } from 'ant-design-vue';
import type { ArrayField } from '@formily/core';
import { RecursionField, useField, useFieldSchema, FragmentComponent } from '@formily/vue';
import { observer } from '@formily/reactive-vue';
import type { ISchema } from '@formily/json-schema';
import type { CollapseProps } from 'ant-design-vue/lib/collapse';
import type { CollapsePanelProps } from 'ant-design-vue/lib/collapse/CollapsePanel';
import { toArr } from '@formily/shared';
import cls from 'ant-design-vue/es/_util/classNames';
import { composeExport } from '../__builtins__/shared';
import { ArrayBase } from '../array-base';
import { usePrefixCls } from '../__builtins__';
import useStyle from './style';

export interface IArrayCollapseProps extends CollapseProps {
  defaultOpenPanelCount?: number;
}

const isAdditionComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Addition') > -1;
};

const isIndexComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Index') > -1;
};

const isRemoveComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Remove') > -1;
};

const isMoveUpComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('MoveUp') > -1;
};

const isMoveDownComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('MoveDown') > -1;
};

const isOperationComponent = (schema: ISchema) => {
  return (
    isAdditionComponent(schema) || isRemoveComponent(schema) || isMoveDownComponent(schema) || isMoveUpComponent(schema)
  );
};
const range = (count: number) => Array.from({ length: count }).map((_, i) => i);

const takeDefaultActiveKeys = (dataSourceLength: number, defaultOpenPanelCount: number) => {
  if (dataSourceLength < defaultOpenPanelCount) return range(dataSourceLength);
  return range(defaultOpenPanelCount);
};

const insertActiveKeys = (activeKeys: number[], index: number) => {
  if (activeKeys.length <= index) return activeKeys.concat(index);
  return activeKeys.reduce((buf, key) => {
    if (key < index) return buf.concat(key);
    if (key === index) return buf.concat([key, key + 1]);
    return buf.concat(key + 1);
  }, []as number[]);
};

const ArrayCollapseInner = observer(
  defineComponent({
    name: 'ArrayCollapse',
    props: {
      defaultOpenPanelCount: {
        type: Number,
        default: 5
      }
    },
    setup(props, { attrs }) {
      const fieldRef = useField<ArrayField>();
      const schemaRef = useFieldSchema();

      const prefixCls = usePrefixCls('formily-array-collapse');
      const [wrapSSR, hashId] = useStyle(prefixCls);
      const activeKeys: Ref<number[]> = ref([]);

      watchEffect(() => {
        const field = fieldRef.value;
        const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
        if (!field.modified && dataSource.length) {
          activeKeys.value = takeDefaultActiveKeys(dataSource.length, props.defaultOpenPanelCount);
        }
      });

      const { keyMap } = ArrayBase.useKey(schemaRef.value);

      return () => {
        const field = fieldRef.value;
        const schema = schemaRef.value;
        const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
        if (!schema) throw new Error('can not found schema object');

        const renderAddition = () => {
          return schema.reduceProperties((addition, schema, key) => {
            if (isAdditionComponent(schema)) {
              return h(RecursionField, {
                schema,
                name: key
              });
            }
            return addition;
          }, null);
        };

        const renderEmpty = () => {
          if (dataSource?.length) return;
          return h(
            Card,
            {
              class: [cls(`${prefixCls}-item`, hashId)]
            },
            {
              default: () => h(Empty)
            }
          );
        };

        const renderItems = () => {
          if (!dataSource.length) {
            return null;
          }

          const items = dataSource?.map((item, index) => {
            const items = Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items;
            // const key = getKey(item, index)
            const panelProps = field.query(`${field.address}.${index}`).get('componentProps');
            const props: CollapsePanelProps = items!['x-component-props'];
            const headerTitle = panelProps?.header || props.header || field.title;
            const path = field.address.concat(index);
            const errors = field.form.queryFeedbacks({
              type: 'error',
              address: `${path}.**`
            });

            const header = h(
              ArrayBase.Item,
              {
                index,
                record: item
              },
              {
                default: () => [
                  h(RecursionField, {
                    schema: items,
                    name: index,
                    filterProperties: (schema: ISchema) => {
                      if (!isIndexComponent(schema)) return false;
                      return true;
                    },
                    onlyRenderProperties: true
                  }),
                  errors.length
                    ? h(
                        Badge,
                        {
                          class: [`errors-badge`],
                          count: errors.length
                        },
                        { default: () => headerTitle }
                      )
                    : headerTitle
                ]
              }
            );

            const extra = h(
              ArrayBase.Item,
              {
                index,
                record: item
              },
              {
                default: () => [
                  h(
                    RecursionField,
                    {
                      schema: items,
                      name: index,
                      filterProperties: (schema: ISchema) => {
                        if (!isOperationComponent(schema)) return false;
                        return true;
                      },
                      onlyRenderProperties: true
                    },
                    {
                      default: () => [attrs.extra]
                    }
                  )
                ]
              }
            );
            const content = h(RecursionField, {
              schema: items,
              name: index,
              filterProperties: (schema: ISchema) => {
                if (isIndexComponent(schema)) return false;
                if (isOperationComponent(schema)) return false;
                return true;
              }
            });

            const newProps = { ...props };
            const newPanelProps = panelProps ? { ...panelProps } : {};
            // 不传header这个props，采用slot的header
            delete newProps.header;
            delete newPanelProps.header;

            return h(
              Collapse.Panel,
              {
                ...newProps,
                ...newPanelProps,
                key: index,
                forceRender: true
              },
              {
                default: () => [
                  h(
                    ArrayBase.Item,
                    {
                      index,
                      record: item
                    },
                    {
                      default: () => [content]
                    }
                  )
                ],
                header: () => header,
                extra: () => extra
              }
            );
          });

          return h(
            Collapse as any,
            {
              ...attrs,
              class: [cls(`${prefixCls}-item`, hashId)],
              activeKey: activeKeys.value,
              onChange: (keys: number[]) => {
                activeKeys.value = toArr(keys).map(Number);
              }
            },
            { default: () => [items] }
          );
        };

        return wrapSSR(
          h(
            ArrayBase,
            {
              keyMap,
              onAdd: (index: number) => {
                activeKeys.value = insertActiveKeys(activeKeys.value, index);
              }
            },
            {
              default: () => [renderEmpty(), renderItems(), renderAddition()]
            }
          )
        );
      };
    }
  })
);

const ArrayCollapsePanel = defineComponent<CollapsePanelProps>({
  name: 'ArrayCollapsePanel',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => h(FragmentComponent, {}, slots);
  }
});

export const ArrayCollapse = composeExport(ArrayCollapseInner, {
  CollapsePanel: ArrayCollapsePanel,
  Index: ArrayBase.Index,
  SortHandle: ArrayBase.SortHandle,
  Addition: ArrayBase.Addition,
  Remove: ArrayBase.Remove,
  MoveDown: ArrayBase.MoveDown,
  MoveUp: ArrayBase.MoveUp,
  useArray: ArrayBase.useArray,
  useIndex: ArrayBase.useIndex,
  useRecord: ArrayBase.useRecord
});

export default ArrayCollapse;

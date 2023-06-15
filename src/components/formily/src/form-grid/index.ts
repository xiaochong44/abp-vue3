import type { InjectionKey, Ref } from 'vue'
import {
  defineComponent,
  provide,
  ref,
  onMounted,
  computed,
  watchEffect,
  h,
} from 'vue'
import { observer } from '@formily/reactive-vue'
import { markRaw } from '@formily/reactive'
import type { IGridOptions } from '@formily/grid'
import { Grid } from '@formily/grid'
import { composeExport } from '../__builtins__/shared'
import { useFormLayout } from '../form-layout'
import { inject } from 'vue'
import type { PropType } from 'vue'
import { pickDataProps, usePrefixCls } from '../__builtins__'
import useStyle from './style'
import cls from 'ant-design-vue/es/_util/classNames'

export interface IFormGridProps extends IGridOptions {
  grid?: Grid<HTMLElement>
  prefixCls?: string
  className?: string
}

const FormGridSymbol: InjectionKey<Ref<Grid<HTMLElement>>> =
  Symbol('FormGridContext')

interface GridColumnProps {
  gridSpan: number
}

export const createFormGrid = (props: IFormGridProps): Grid<HTMLElement> => {
  return markRaw(new Grid(props))
}

export const useFormGrid = (): Ref<Grid<HTMLElement>> => inject(FormGridSymbol) as any

/**
 * @deprecated
 */
const useGridSpan = (gridSpan: number) => {
  return gridSpan
}

/**
 * @deprecated
 */
export const useGridColumn = (gridSpan = 1) => {
  return gridSpan
}

const FormGridInner = observer(
  // eslint-disable-next-line vue/one-component-per-file
  defineComponent({
    name: 'FormGrid',
    props: {
      columnGap: {
        type: Number,
      },
      rowGap: {
        type: Number,
      },
      minColumns: {
        type: [Number, Array],
      },
      minWidth: {
        type: [Number, Array],
      },
      maxColumns: {
        type: [Number, Array],
      },
      maxWidth: {
        type: [Number, Array],
      },
      breakpoints: {
        type: Array,
      },
      colWrap: {
        type: Boolean,
        default: true,
      },
      strictAutoFit: {
        type: Boolean,
        default: false,
      },
      shouldVisible: {
        type: Function as PropType<IGridOptions['shouldVisible']>,
        default() {
          return () => true
        },
      },
      grid: {
        type: Object as PropType<Grid<HTMLElement>>,
      },
    },
    setup(props: any, { slots, attrs }) {
      const layout = useFormLayout()

      const gridInstance = computed(() => {
        const newProps: any = {}
        Object.keys(props).forEach((key) => {
          if (typeof props[key] !== 'undefined') {
            newProps[key] = props[key]
          }
        })
        const options = {
          columnGap: layout.value?.gridColumnGap ?? 8,
          rowGap: layout.value?.gridRowGap ?? 4,
          ...newProps,
        }
        return markRaw(options?.grid ? options.grid : new Grid(options))
      })
      const prefixCls = usePrefixCls('formily-grid')

      const [wrapSSR, hashId] = useStyle(prefixCls)
      const root = ref<HTMLDivElement | null>(null)
      const dataProps = pickDataProps(props)
      provide(FormGridSymbol, gridInstance)

      onMounted(() => {
        watchEffect((onInvalidate) => {
          const dispose = gridInstance.value.connect(root.value)
          onInvalidate(() => {
            dispose()
          })
        })
				watchEffect(() => {
					if (root.value && !root.value.style.gridTemplateColumns) {
						root.value.style.gridTemplateColumns = gridInstance.value.templateColumns
					}
				})
      })

      return () => {
        return wrapSSR(
          h(
            'div',
            {
              ...dataProps,
              class: cls(`${prefixCls}-layout`, hashId, attrs.class),
              style: {
                gridTemplateColumns: gridInstance.value.templateColumns,
                gap: gridInstance.value.gap,
              },
              ref: root,
            },
            slots
          )
        )
      }
    },
  })
)

const FormGridColumn = observer(
  // eslint-disable-next-line vue/one-component-per-file
  defineComponent({
    name: 'FormGridColumn',
    props: {
      gridSpan: {
        type: Number,
        default: 1,
      },
    },
    setup(props: GridColumnProps, { slots }) {
      return () => {
        return h(
          'div',
          {
            'data-grid-span': props.gridSpan,
          },
          slots
        )
      }
    },
  })
)

export const FormGrid = composeExport(FormGridInner, {
  GridColumn: FormGridColumn,
  useGridSpan,
  useFormGrid,
  createFormGrid,
})

export default FormGrid

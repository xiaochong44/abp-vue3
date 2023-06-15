import type { SpaceProps as AntSpaceProps } from 'ant-design-vue/lib/space'
import { Space as AntSpace } from 'ant-design-vue'
import { useFormLayout } from '../form-layout'
import { defineComponent, h } from 'vue'


export const Space = defineComponent({
  name: 'Space',
  props: ['size', 'align', 'direction'],
  // inject: 'configProvider',
  setup(props: AntSpaceProps, { slots }) {
    const layout = useFormLayout()

    return () => {
      return h(
        AntSpace,
        {
					size: props.size ?? layout.value?.spaceGap,
          ...props,

        },
        slots
      )
    }
  },
})

export default Space

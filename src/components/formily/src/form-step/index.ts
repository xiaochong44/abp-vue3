import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { action, model, observable } from '@formily/reactive'
import type { VoidField, Form } from '@formily/core'
import { observer } from '@formily/reactive-vue'
import {
  useField,
  useFieldSchema,
  RecursionField,
  FragmentComponent,
} from '@formily/vue'
import type { Schema, SchemaKey } from '@formily/json-schema'
import { Steps } from 'ant-design-vue'

import type { StepsProps, StepProps } from 'ant-design-vue/lib/steps'
import { composeExport } from '../__builtins__/shared'
import { usePrefixCls } from '../__builtins__'
import cls from 'ant-design-vue/es/_util/classNames'

const { Step } = Steps

export interface IFormStep {
  connect: (steps: SchemaStep[], field: VoidField) => void
  current: number
  allowNext: boolean
  allowBack: boolean
  setCurrent(key: number): void
  submit: Form['submit']
  next(): void
  back(): void
}

export interface IFormStepProps extends StepsProps {
  formStep?: IFormStep
}

type SchemaStep = {
  name: SchemaKey
  props: any
  schema: Schema
}

type FormStepEnv = {
  form: Form | null
  field: VoidField | null
  steps: SchemaStep[]
}

const parseSteps = (schema: Schema) => {
  const steps: SchemaStep[] = []
  schema.mapProperties((schema, name) => {
    if (schema['x-component']?.indexOf('StepPane') > -1) {
      steps.push({
        name,
        props: schema['x-component-props'],
        schema,
      })
    }
  })
  return steps
}

const createFormStep = (defaultCurrent = 0): IFormStep => {
  const env: FormStepEnv = observable({
    form: null,
    field: null,
    steps: [],
  })

  const setDisplay = action.bound!((target: number) => {
    const currentStep = env.steps[target]
    env.steps.forEach(({ name }) => {
      env.form?.query(`${env.field?.address}.${name}`).take((field) => {
        if (name === currentStep.name) {
          field.setDisplay('visible')
        } else {
          field.setDisplay('hidden')
        }
      })
    })
  })

  const next = action.bound!(() => {
    if (formStep.allowNext) {
      setDisplay(formStep.current + 1)
      formStep.setCurrent(formStep.current + 1)
    }
  })

  const back = action.bound!(() => {
    if (formStep.allowBack) {
      setDisplay(formStep.current - 1)
      formStep.setCurrent(formStep.current - 1)
    }
  })

  const formStep: IFormStep = model({
    connect(steps: any, field: any) {
      env.steps = steps
      env.form = field?.form
      env.field = field
    },
    current: defaultCurrent,
    setCurrent(key: number) {
      formStep.current = key
    },
    get allowNext() {
      return formStep.current < env.steps.length - 1
    },
    get allowBack() {
      return formStep.current > 0
    },
    async next() {
      try {
        await env.form?.validate()
        next()
      } catch {}
    },
    async back() {
      back()
    },
    async submit(onSubmit: any) {
      return env.form?.submit?.(onSubmit)
    },
  })  as any
  return formStep
}

const FormStepInner = observer(
  defineComponent({
    name: 'FormStep',
    props: {
      formStep: {
        type: Object as PropType<IFormStep>,
        default() {
          return {
            current: 0,
          }
        },
      },
    },
    setup(props: IFormStepProps, { attrs }) {
      const field = useField<VoidField>().value
      const prefixCls = usePrefixCls('formily-step')
      const fieldSchemaRef = useFieldSchema()

      const steps = parseSteps(fieldSchemaRef.value)

      props.formStep!.connect?.(steps, field)

      return () => {
        const current = props.current || props.formStep?.current || 0

        const renderSteps = (steps: SchemaStep[], callback: any) => {
          return steps.map(callback)
        }

        return h(
          'div',
          {
            class: [cls(prefixCls, attrs.class)],
          },
          {
            default: () => [
              h(
                Steps,
                {
                  ...attrs,
                  current,
                },
                () =>
                  renderSteps(steps, ({ props }: any, key: any) => {
                    return h(Step, { ...props, key })
                  })
              ),

              renderSteps(steps, ({ name, schema }: any, key: any) => {
                if (key !== current) return
                return h(RecursionField, { name, schema, key })
              }),
            ],
          }
        )
      }
    },
  })
)

const StepPane = defineComponent<StepProps>({
  name: 'FormStepPane',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => h(FragmentComponent, {}, slots)
  },
})

export const FormStep = composeExport(FormStepInner, {
  StepPane,
  createFormStep,
})

export default FormStep

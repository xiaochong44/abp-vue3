import { useConfigContextInject } from 'ant-design-vue/es/config-provider/context';

export const usePrefixCls = (
  tag?: string,
  props?: {
    prefixCls?: string;
  }
) => {
  const context = useConfigContextInject();
  if (context) {
    const { getPrefixCls } = context;
    return getPrefixCls(tag, props?.prefixCls);
  }
  const prefix = props?.prefixCls ?? 'ant-';
  return `${prefix}${tag ?? ''}`;
};

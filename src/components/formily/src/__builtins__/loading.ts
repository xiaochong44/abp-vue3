import type { MessageArgsProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { VueNode } from 'ant-design-vue/es/_util/type';

export const loading = async (title: VueNode | MessageArgsProps = 'Loading...', processor: () => Promise<any>) => {
  let hide: any = null;
  const loading = setTimeout(() => {
    hide = message.loading(title);
  }, 100);
  try {
    return await processor();
  } finally {
    hide?.();
    clearTimeout(loading);
  }
};

import { message } from 'ant-design-vue';
import type { MessageType } from 'ant-design-vue/lib/message';

export const loading = async (loadingText: string, processor: () => Promise<any>) => {
  let loadingInstance: MessageType | null = null;
  loadingInstance = message.loading(loadingText || 'Loading...', 0);
  try {
    return await processor();
  } finally {
    if (loadingInstance) loadingInstance();
    // loadingInstance && loadingInstance.();
  }
};

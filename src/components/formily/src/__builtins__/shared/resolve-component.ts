import type { DefineComponent } from 'vue';
import { h, toRaw } from 'vue';
import { isVnode } from './utils';
import type { SlotTypes } from '.';

export const resolveComponent = (child?: SlotTypes, props?: Record<string, any>) => {
  if (child) {
    if (typeof child === 'string' || typeof child === 'number') {
      return child;
    } else if (typeof child === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-types
      return (child as Function)(props);
    } else if (isVnode(child)) {
      return child;
    }
    return h(toRaw(child as DefineComponent), { props });
  }

  return null;
};

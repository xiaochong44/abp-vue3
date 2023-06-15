import { ref } from 'vue';
import type { CSSInterpolation, CSSObject } from 'ant-design-vue';
import { useStyleRegister } from 'ant-design-vue';
import { useConfigContextInject } from 'ant-design-vue/es/config-provider/context';
import { merge } from '@formily/shared';
import type { ComponentTokenMap, GlobalToken } from 'ant-design-vue/es/theme/interface';
import type { VueNode } from 'ant-design-vue/es/_util/type';
import { useToken } from './hooks';

// eslint-disable-next-line @typescript-eslint/ban-types
export type OverrideComponent = keyof ComponentTokenMap | (string & {});

export interface StyleInfo {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
}

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string;
};

export type GenerateStyle<
  ComponentToken extends object = TokenWithCommonCls<GlobalToken>,
  ReturnType = CSSInterpolation
> = (token: ComponentToken, options?: any) => ReturnType;

export const genCommonStyle = (token: any, componentPrefixCls: string): CSSObject => {
  const { fontFamily, fontSize } = token;

  const rootPrefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;

  return {
    [rootPrefixSelector]: {
      fontFamily,
      fontSize,
      boxSizing: 'border-box',

      '&::before, &::after': {
        boxSizing: 'border-box'
      },

      [rootPrefixSelector]: {
        boxSizing: 'border-box',

        '&::before, &::after': {
          boxSizing: 'border-box'
        }
      }
    }
  };
};
export type UseComponentStyleResult = [(node: VueNode) => VueNode, string];

export const genStyleHook = <ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: TokenWithCommonCls<GlobalToken>, info: StyleInfo) => CSSInterpolation
) => {
  return (prefixCls: string): UseComponentStyleResult => {
    const { theme, token, hashId } = useToken();
    const { getPrefixCls, iconPrefixCls } = useConfigContextInject();
    const rootPrefixCls = getPrefixCls();
    return [
      useStyleRegister(
        ref({
          theme,
          token,
          hashId,
          path: ['formily-antd', component, prefixCls, iconPrefixCls] as any
        }),
        () => {
          const componentCls = `.${prefixCls}`;
          const mergedToken: TokenWithCommonCls<GlobalToken> = merge(token.value, {
            componentCls,
            prefixCls,
            iconCls: `.${iconPrefixCls}`,
            antCls: `.${rootPrefixCls}`
          });

          const styleInterpolation = styleFn(mergedToken, {
            hashId: hashId.value,
            prefixCls,
            rootPrefixCls,
            iconPrefixCls: iconPrefixCls.value
          });
          return [genCommonStyle(token, prefixCls), styleInterpolation];
        }
      ),
      hashId.value
    ];
  };
};

import type { TooltipProps, ButtonProps } from 'ant-design-vue';

export interface ActionItem extends ButtonProps {
  onClick?: Fn;
  text?: string;
  color?: 'success' | 'error' | 'warning';
  icon?: string;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  // 权限编码控制是否显示
  auth?: string | string[];
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
  tooltip?: string | TooltipProps;
}

export interface PopConfirm {
  title: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: string;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomRight';
}

export interface TableActionProps {
  actions?: ActionItem[];
  dropDownActions?: ActionItem[];
  divider?: boolean;
  stopButtonPropagation?: boolean;
}

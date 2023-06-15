declare namespace Menu {
  enum MenuType {
    Folder = 0,
    MenuItem = 1,
    Button = 2
  }
  interface MenuCreateOrUpdate {
    name: string;
    displayName: string;
    icon?: string;
    parentId?: string;
    index: number;
    path?: string;
    componentPath?: string;
    permission?: string;
    type: MenuType;
    visible: boolean;
    disabled: boolean;
    keepalive: boolean;
    isUrl: boolean;
  }
  interface MenuTreeItem {
    id: string;
    name: string;
    displayName: string;
    icon?: string;
    parentId?: string;
    index: number;
    path?: string;
    componentPath?: string;
    permission?: string;
    type: MenuType;
    level: number;
    visible: boolean;
    disabled: boolean;
    keepalive: boolean;
    isUrl: boolean;
    children: MenuTreeItem[];
  }
}

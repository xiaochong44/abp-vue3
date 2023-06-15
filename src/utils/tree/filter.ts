export function filterTree<T = any>(tree: T[], func: (n: T) => boolean, childrenProp = 'children'): T[] {
  const children = childrenProp;
  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter(node => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
}

export function treeToList<T = any>(tree: any, childrenProp = 'children'): T {
  const result: any = [...tree];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < result.length; i++) {
    // eslint-disable-next-line no-continue
    if (!result[i][childrenProp!]) continue;
    result.splice(i + 1, 0, ...result[i][childrenProp!]);
  }
  return result;
}
export function getTreeProp<T = any>(node: T[], prop: keyof T, childrenProp = 'children') {
  const propValues: any[] = [];
  node.forEach((n: any) => {
    propValues.push(n[prop]);
    if (n[childrenProp]) {
      const childProps = getTreeProp(n[childrenProp] as any, prop);
      if (childProps) {
        propValues.push(...childProps);
      }
    }
  });
  return propValues;
}

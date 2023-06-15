export const pickDataProps = (props: any = {}) => {
  const results: any = {};

  for (const key in props) {
    if (key.indexOf('data-') > -1) {
      results[key] = props[key];
    }
  }

  return results;
};

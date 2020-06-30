import _ from 'lodash';

const transform = <T>(data: T, func: Function): any => {
  if (!data) {
    return data;
  } else if (Array.isArray(data)) {
    return data.map(elem => transform(elem, func));
  } else if (typeof data === 'object') {
    return _.mapKeys(data as any, (value, key) => transform(key, func));
  }

  return func(data);
};

export const camelCase = <T>(data: T): any => {
  return transform(data, _.camelCase);
};

export const snakeCase = <T>(data: T): any => {
  return transform(data, _.snakeCase);
};

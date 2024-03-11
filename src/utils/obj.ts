import { curry, isEmpty, isNil } from 'ramda';
import om from '@/libs/object-mapper';
import { camelcase, snakecase } from './str';

const convert = (data: any, fn: Function): any => {
  if (Array.isArray(data)) {
    return data.map((v) => convert(v, fn));
  } else if (
    data !== undefined &&
    data !== null &&
    data.constructor === Object
  ) {
    return Object.keys(data).reduce(
      (result, key) => ({
        ...result,
        [fn(key)]: convert(data[key], fn),
      }),
      {}
    );
  }
  return data;
};

/**
 * 오브젝트 내 key 를 camel case로 변환
 * @example
 * obj.camelize({ab_cd: 1}); => {abCd: 1}
 */
export const camelize = (data: any) => convert(data, camelcase);

/**
 * 오브젝트 내 key 를 snake case로 변환
 * @example
 * obj.snakize({abCd: 1}); => {ab_cd: 1}
 */
export const snakize = (data: any): any => convert(data, snakecase);

export const has = curry(
  (source, key: string): boolean =>
    !(isNil(source[key]) || isEmpty(source[key]))
);

/**
 * 오브젝트 전체 key 를 반환
 * @example
 * obj.keys({ a: { b: 1 }, c: [{ d: 1 }] }); => ['a.b', 'c[].d']
 */

export const keys = (source: { [key: string]: any }): any => {
  return Object.keys(source)
    .filter((key) => typeof source[key] === 'object')
    .map((key) => {
      const item = source[key];
      if (item instanceof Object) {
        if (Array.isArray(item)) {
          const children = item[0];
          if (children instanceof Object) {
            return keys(children).map((k: string) => `${key}[].${k}`);
          }
          return `${key}[]`;
        } else {
          return keys(item).map((k: string) => `${key}.${k}`);
        }
      } else {
        return '';
      }
    })

    .reduce(
      (x, y) => x.concat(y),
      Object.entries(source)
        .filter(([, value]) => !(value instanceof Object))
        .map(([key]) => key)
    );
};

const falsy = (source: any, encode: boolean = true): any => {
  if (Array.isArray(source)) {
    return source.map((src) => falsy(src, encode));
  } else {
    if (!source) return {};
    const res = Object.entries(source)
      .map(([key, value]) => {
        if (value instanceof Object) {
          return [key, falsy(value, encode)];
        } else {
          return [
            key,
            encode
              ? value === null || value === undefined
                ? '!!FALSY!!'
                : value
              : value === '!!FALSY!!'
              ? null
              : value,
          ];
        }
      })
      .reduce((a, [key, value]) => ({ ...a, [key]: value }), {});
    return res;
  }
};

export const mapper = curry(
  <T1 = any, T2 = any, T3 = any>(map: T1, source: T2): T3 => {
    const value = falsy(source);
    const all = keys(value).reduce(
      (a: any, b: string) => ({ ...a, [b]: b }),
      {}
    );
    const res = om(value, { ...all, ...map });
    return falsy(res, false);
  }
);

export const convertFormToObj = (form: any) => {
  const obj: any = {};
  Object.keys(form).map((k) => {
    if (!parseInt(k)) return;
    const { name, value } = form[k];
    obj[name] = value;
  });
  return obj;
};

const obj = { camelize, snakize, mapper, keys };
export default obj;

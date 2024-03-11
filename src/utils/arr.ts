import { curry } from 'ramda';
/**
 * 특정 위치로부터 값 덮어쓰기
 * @example
 * override(1, '', [1,2,3]) => [1, '', '']
 */
export const override = curry(
  (at: number, value: any, source: any[]): any[] => {
    if (source.length <= at) return source;
    const a = source.concat().splice(0, at);
    const b = Array(source.length - at).fill(value);
    return [...a, ...b];
  }
);

/**
 * 값 채우기
 * @example
 * fill(2, '') => ['', '']
 */
export const fill = curry((len: number, value: any): any[] =>
  Array(len).fill(value)
);

export const reduce = (fn: any, arr: any[]) => arr.reduce(fn, []);

const arr = {
  override,
  fill,
  reduce,
};

export default arr;

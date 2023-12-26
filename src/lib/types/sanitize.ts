import type { IFilterXSSOptions } from 'xss';

export type SanitizeOptions = IFilterXSSOptions & {
    whiteList?: IFilterXSSOptions['whiteList'];
};

export type Sanitized<T> = T extends (...args: unknown[]) => unknown
    ? T // if T is a function, return it as is
    : T extends object
    ? {
          readonly [K in keyof T]: Sanitized<T[K]>;
      }
    : T;

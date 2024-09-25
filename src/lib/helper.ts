import { _ } from './lodash';
import { v4 as uuid } from 'uuid';
import JSONFormat from 'json-format';
import jwt from 'jsonwebtoken';
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import { BigNumberState } from '@dappworks/kit';

const valMap = {
  undefined: '',
  null: '',
  false: false,
};

export const helper = {
  promise: {
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async runAsync<T, U = Error>(promise: Promise<T>): Promise<[U | null, T | null]> {
      return promise.then<[null, T]>((data: T) => [null, data]).catch<[U, null]>((err) => [err, null]);
    },
  },
  object: {
    crawlObject(object, options) {
      const newObj = JSON.parse(JSON.stringify(object));
      return helper.object.crawl(newObj, options);
    },
    crawl(object, options) {
      Object.keys(object).forEach((i) => {
        if (typeof object[i] === 'object') {
          helper.object.crawl(object[i], options);
        } else {
          const handler = options[typeof object[i]];
          if (handler) {
            object[i] = handler(object[i]);
          }
        }
      });
      return object;
    },
  },
  json: {
    isJsonString(str: string) {
      if (!str || typeof str !== 'string') return false;
      if (!str?.includes('{')) return false;
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    safeParse(val: any) {
      try {
        return JSON.parse(val);
      } catch (error) {
        return val;
      }
    },
    clearUUID(val: any) {
      try {
        return JSON.parse(JSON.stringify(val).replace(/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/g, uuid()));
      } catch (e) {
        return val;
      }
    },
  },
  deepAssign(target, ...sources) {
    sources.forEach((source) => {
      Object.keys(source).forEach((key) => {
        let descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (descriptor && descriptor?.get) {
          return Object.defineProperty(target, key, descriptor);
        }
        const targetValue = target[key];
        let sourceValue = source[key];
        if (helper.isObject(targetValue) && helper.isObject(sourceValue)) {
          try {
            target[key] = helper.deepAssign(targetValue, sourceValue);
          } catch (e) {
            target[key] = Object.assign(targetValue, sourceValue);
          }
        } else {
          target[key] = sourceValue;
        }
      });
    });
    return target;
  },
  isObject(value) {
    return value != null && typeof value === 'object';
  },
  deepMerge(obj, newObj) {
    const newVal = _.mergeWith(obj, newObj, (...args) => {
      const [objValue, srcValue] = args;
      if (typeof srcValue === 'object') {
        return helper.deepMerge(objValue, srcValue);
      }
      return srcValue || valMap[srcValue];
    });
    return newVal;
  },
  download: {
    downloadByBlob(name: string, blob: Blob) {
      const a = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      a.href = href;
      a.download = name;
      a.click();
    },
    downloadJSON(name: string, jsonObj: object) {
      try {
        const jsonStr: string = JSONFormat(jsonObj);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        this.downloadByBlob(name + '.json', blob);
      } catch (error) {
        console.error(error);
      }
    },
    downloadByLink(href: string) {
      const a = document.createElement('a');
      a.href = href;
      a.click();
    },
  },
  number: {
    clamp(val, min, max) {
      return val > max ? max : val < min ? min : val;
    },
    convertRange(value, r1, r2) {
      return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
    },
    warpBigNumber(value: string, decimals = 18, options?: { format?: string; fallback?: string; min?: number }) {
      const { format = '0.0', fallback = '0.000', min } = options || {};
      if (!value) {
        return {
          value: '...',
          format: '...',
          decimals: '0',
          isZero: true,
        };
      }
      const BigNumberResponse = new BigNumberState({ value: new BigNumber(value), decimals });
      return {
        value: BigNumberResponse.value.toFixed(0),
        originFormat: BigNumberResponse.value.div(10 ** decimals).toFixed(),
        format: helper.number.numberFormat(BigNumberResponse.value.div(10 ** decimals).toFixed(), format, { fallback, min }),
        decimals: String(BigNumberResponse.decimals),
        isZero: BigNumberResponse.value.isZero(),
      };
    },
    //http://numeraljs.com/ format params does not need to deal with decimal places
    //format: '$0,0' '0a' '0,0' '0,0$'
    numberFormat(str: string | number, format: string = '0,0', options: { min?: number; fallback?: string } = {}): string {
      const { fallback = '0.00' } = options || {};

      if (!str || isNaN(Number(str))) return fallback;
      const numStr = new BigNumber(str).toFixed();
      const countNonZeroNumbers = (_str: string) => {
        const decimalPointIndex = _str.indexOf('.');
        if (decimalPointIndex === -1) {
          return 0;
        }
        const decimalPart = _str.substring(decimalPointIndex + 1);
        let trailingZerosCount = 0;
        for (let i = 0; i < decimalPart.length; i++) {
          if (decimalPart[i] === '0') {
            trailingZerosCount++;
          } else {
            break;
          }
        }
        return trailingZerosCount;
      };

      const fractionDigits = countNonZeroNumbers(format);
      const numberFractionDigits = countNonZeroNumbers(numStr);
      if (options?.min) {
        if (new BigNumber(numStr).isLessThan(new BigNumber(options?.min || 0))) {
          return `< ${numeral(options?.min).format(format)}`;
        }
      }
      const fullStr = new BigNumber(numStr).toFixed();
      let preStr = numeral(fullStr.split('.')[0]).format(format.split('.')[0]);
      const fractionStr = fullStr.split('.')?.[1]?.slice(0, fractionDigits + numberFractionDigits);

      if (numberFractionDigits >= fractionDigits) {
        return (preStr + '.' + fractionStr).replace(/\.?0+$/, '');
      }

      if (fractionStr?.[fractionDigits - 1] == '9') {
        return (preStr + '.' + fractionStr.slice(0, fractionDigits - 1) + '9').replace(/\.?0+$/, '');
      }

      const resultStr = numeral(new BigNumber(numStr).toString()).format(format);
      return resultStr.replace(/\.?0+$/, '');
    },
  },
  encode: async (jwtClaims: { sub: string; name: string; iat: number; exp: number }) => {
    return jwt.sign(jwtClaims, process.env.JWT_SECRET, { algorithm: 'HS256' });
  },
  decode: async (token: string): Promise<{ sub: string; name: string; iat: number; exp: number }> => {
    //@ts-ignore
    return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  },
  env: {
    //@ts-ignore
    isBrowser: typeof window === 'undefined' ? false : true,
    isIopayMobile: typeof window !== 'undefined' && window.navigator?.userAgent?.toLowerCase().includes('iopay'),
    isPc() {
      const userAgentInfo = typeof window !== 'undefined' && window.navigator?.userAgent;
      const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo && userAgentInfo.indexOf(Agents[v]!) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
  },
};

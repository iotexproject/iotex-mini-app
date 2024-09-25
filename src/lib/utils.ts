import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import normalizeUrl from 'normalize-url';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const moneyFormat = (
  num: number | string,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    precision?: number;
    fallback?: null | string;
  },
) => {
  if (typeof num === 'string') {
    num = Number(num);
  }
  if (!num || isNaN(num) || num === 0) {
    if (options?.fallback !== undefined) {
      return options.fallback;
    }
    return '-';
  }

  if (options?.precision) {
    const absNum = Math.abs(num);
    if (absNum < 1 && absNum > 0) {
      return '$' + num.toPrecision(options.precision);
    }
  }

  return '$' + num.toLocaleString(undefined, { minimumFractionDigits: options?.minimumFractionDigits, maximumFractionDigits: options?.maximumFractionDigits });
};

export const numberFormat = (
  num: number | string,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    precision?: number;
    fallback?: null | string;
  },
) => {
  if (typeof num === 'string') {
    num = Number(num);
  }

  if (!num || isNaN(num) || num === 0) {
    if (options?.fallback !== undefined) {
      return options.fallback;
    }
    return '-';
  }

  if (options?.precision) {
    const absNum = Math.abs(num);
    if (absNum < 1 && absNum > 0) {
      return num.toPrecision(options.precision);
    }
  }

  return num.toLocaleString(undefined, { minimumFractionDigits: options?.minimumFractionDigits, maximumFractionDigits: options?.maximumFractionDigits });
};

export const shortStr = (text: string, length = 10) => {
  if (text.length <= length) {
    return text;
  }
  return text.slice(0, length) + '...' + text.slice(-length - 1);
};

export const getCanonicalUrl = (
  url: string,
  normalizeOptions = {
    stripHash: true,
    removeQueryParameters: true,
    removeTrailingSlash: true,
  },
) => {
  return normalizeUrl(url, normalizeOptions);
};

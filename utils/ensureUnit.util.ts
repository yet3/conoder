export const ensureUnit = (value?: number | string | null, unit = 'px'): string => {
  if (value == null) return `0${unit}`;

  if (typeof value === 'number') return value + unit;
  if (typeof value === 'string') {
    if (/^([0-9]|\.)*$/gm.test(value)) return value + unit;
    return value;
  }

  return `0${unit}`;
};

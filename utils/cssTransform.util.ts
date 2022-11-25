import { ensureUnit } from './ensureUnit.util';

type Translate = number | string | Array<number | string>;
interface Opts {
  x?: Translate;
  y?: Translate;

  scale?: number;
}

const parseTranslate = (t: Translate): string => {
  if (Array.isArray(t)) {
    let result: string = 'calc(';

    t.forEach((v, i) => {
      result += ensureUnit(v);
      if (i !== t.length - 1) result += ' + ';
    });

    result += ')';
    return result;
  }

  return ensureUnit(t);
};

export const cssTransform = (o: Opts): string => {
  const result: string[] = [];

  let _x = '0px';
  let _y = '0px';

  if (o.x != null) _x = parseTranslate(o.x);
  if (o.y != null) _y = parseTranslate(o.y);

  result.push(`translate(${_x}, ${_y})`);

  if (o.scale != null) result.push(`scale(${o.scale})`)

  return result.join(' ');
};

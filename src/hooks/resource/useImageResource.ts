import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import { isNotNull } from '@akron/runner';

/**
 * SVG 이미지의 path를 나타냅니다.
 * (SuperOffice의 pathProps와 동일합니다.)
 */
export interface ISVGPath {
  className: string;
  d: string;
}

/**
 * SVG 이미지를 나타냅니다.
 * (SuperOffice의 ISvgData와 동일합니다.)
 */
export interface ISVGData {
  viewBox: string;
  children: Array<ISVGPath>;
}

/**
 * svg 내부에 쓰이는 id가 있을 경우 그 값을 unique하게 만들어주기 위한 counter 입니다.
 */
let counter = 0;

/**
 * svg 내부에 쓰이는 모든 id를 검색 후, counter를 postfix로 붙입니다.
 */
const makeUnique = (svgString: string): string => {
  const ids = svgString.match(/(id="(.*?)("))/g);
  if (isNotNull(ids) && ids.length > 0) {
    counter += 1;
    const idStrs: Array<string> = [];
    ids.forEach(id => {
      const idStr = id.slice(4, -1);
      idStrs.push(idStr);
    });

    idStrs.forEach(id => {
      const re = new RegExp(id, 'ig');
      const replaceStr = `${id}_${counter}`;

      svgString = svgString.replace(re, replaceStr);
      counter += 1;
    });
  }
  return svgString;
};

/**
 * 이미지 리소스를 사용하기 위한 hook입니다.
 * id를 넣어주면 i18next + react-i18next가 런타임에 이를 리소스팩의 문자열로 변환해줍니다.
 * (SuperOffice의 useImgRes()와 동일합니다.)
 */
const useImageResource = (id: string) => {
  const { t } = useTranslation();
  // console.log(t(id));
  const memoizedResult = useMemo(() => {
    let result: ISVGData | string = t(id, { returnObjects: true });
    // console.log(result);
    if (typeof result === 'string') {
      result = makeUnique(result);
    }
    return result;
  }, [id, t]);
  return memoizedResult;
};

export default useImageResource;

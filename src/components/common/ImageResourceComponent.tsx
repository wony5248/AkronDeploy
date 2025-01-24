import { dWarn, isDefined } from '@akron/runner';
import useImageResource, { ISVGData, ISVGPath } from 'hooks/resource/useImageResource';
import { ComponentProps, CSSProperties } from 'react';

/**
 * <svg>에 삽입할 속성들.
 */
type SVGProps = ComponentProps<'svg'>;

/**
 * SVGStringComponent props.
 */
interface ISVGStringComponentProps {
  id: string;
  className?: string;
  svgData: string;
  w?: string;
  h?: string;
  svgProps?: SVGProps;
}

/**
 * 기본 tooltip이 나타나는 것을 방지하기 위해
 * title tag를 제거함
 */
const removeTitle = (value: string): string => {
  const titleStart = value.indexOf('<title>');
  const titleEnd = value.indexOf('</title>');
  if (titleStart === -1 || titleEnd === -1) {
    return value;
  }
  const newValue = value.slice(0, titleStart - 1) + value.slice(titleEnd + 1);
  return removeTitle(newValue);
};

/**
 * svgData에서 fill 속성 없이 stroke 속성만 있는 요소를 찾아
 * fill 속성을 transparent로 설정함
 */
function modifySvgData(svgData: string) {
  return svgData.replace(/<(\w+)(.*?)>/g, (match, element, attributes) => {
    if (!attributes.includes('fill=') && attributes.includes('stroke=')) {
      return `<${element} fill="transparent"${attributes}>`;
    }
    return match;
  });
}

/**
 * SVG 데이터가 string으로 주어졌을 때 이를 렌더해주는 component입니다.
 * (SuperOffice의 SVGComponent와 동일합니다.)
 */
const SVGStringComponent: React.FC<ISVGStringComponentProps> = ({
  id,
  className,
  svgData,
  w,
  h,
}: ISVGStringComponentProps) => {
  // ID에 해당하는 리소스가 없는 경우 id가 그대로 리턴되므로 그것을 활용하여 예외 처리
  if (id === svgData) {
    dWarn(`잘못된 리소스 id: ${id}`);
    return null;
  }

  const modifiedSvgData = modifySvgData(svgData);

  const svg = new DOMParser().parseFromString(modifiedSvgData, 'text/xml').firstChild as SVGSVGElement;
  let viewBoxWidth = 0;
  let viewBoxHeight = 0;

  const viewBoxX = svg.viewBox.baseVal.x;
  const viewBoxY = svg.viewBox.baseVal.y;
  const viewBoxW = svg.viewBox.baseVal.width !== 0 ? svg.viewBox.baseVal.width : 32;
  const viewBoxH = svg.viewBox.baseVal.height !== 0 ? svg.viewBox.baseVal.height : 32;

  try {
    viewBoxWidth = svg.width.baseVal.value;
    viewBoxHeight = svg.height.baseVal.value;
    // (2) 0이면? 아마로 width, height 설정이 없음 -> viewBox 속성을 사용해 본다.
    if (viewBoxWidth <= 0 && viewBoxHeight <= 0) {
      viewBoxWidth = svg.viewBox.baseVal.width;
      viewBoxHeight = svg.viewBox.baseVal.height;
    }
  } catch (error) {
    dWarn(`w,h가 설정되지 않은 image: ${id}`);
  }

  const firstTagEnd = modifiedSvgData.indexOf('>'); // end of svg tag
  const result = modifiedSvgData.slice(firstTagEnd + 1);

  return (
    <svg
      className={className}
      width={w || viewBoxWidth}
      height={h || viewBoxHeight}
      // viewBox={`0 0 32 32`}
      viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`}
      // 리소스팩은 사용자로부터 얻어온 데이터가 아니므로 XSS에 대한 보안 이슈가 없을 것이라 가정

      dangerouslySetInnerHTML={{ __html: result }}
    />
  );
};

/**
 * SVGObjectComponent props.
 */
interface ISVGObjectComponentProps {
  className?: string;
  svgData: ISVGData;
  style: CSSProperties;
  w: string;
  h: string;
  svgProps?: SVGProps;
}

/**
 * SVG 데이터가 object로 주어졌을 때 이를 렌더해주는 component입니다.
 * (SuperOffice의 ImgResComponent에서 일부 로직을 component로 분리했습니다.)
 */
const SVGObjectComponent: React.FC<ISVGObjectComponentProps> = ({
  className,
  svgData,
  style,
  w,
  h,
  svgProps,
}: ISVGObjectComponentProps) => (
  <svg className={className} style={style} viewBox={svgData.viewBox} width={w} height={h} {...svgProps}>
    {svgData.children.map((child: ISVGPath, index: number) => {
      return <path className={child.className} d={child.d} key={`${child.d.toString()}_${index.toString()}`} />;
    })}
  </svg>
);

/**
 * ImageResourceComponent props.
 */
interface IProps {
  id: string;
  className?: string;
  style?: CSSProperties;
  w?: string; // width
  h?: string; // height
  svgProps?: SVGProps;
}

/**
 * 이미지(SVG) 리소스를 렌더해주는 component입니다.
 * (SuperOffice의 ImgResComponent와 동일합니다.)
 */
const ImageResourceComponent: React.FC<IProps> = ({
  id,
  className,
  style = {},
  w = '100%',
  h = '100%',
  svgProps,
}: IProps) => {
  const svgData = useImageResource(id);
  if (id === undefined || id === 'undefined') {
    return null;
  }
  if (typeof svgData === 'object' && isDefined(svgData.children)) {
    return <SVGObjectComponent className={className} svgData={svgData} style={style} w={w} h={h} svgProps={svgProps} />;
  }

  if (typeof svgData === 'string') {
    return <SVGStringComponent id={id} className={className} svgData={svgData} w={w} h={h} svgProps={svgProps} />;
  }

  dWarn(`잘못된 리소스 id123: ${id}`);
  return null;
};

export default ImageResourceComponent;

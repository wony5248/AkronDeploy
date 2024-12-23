import { toolPaneDockButton } from 'styles/toolpane/ToolpaneDockButton';

/**
 * ToolpaneDockButtonComponent props.
 */
interface IProps {
  // 버튼 아이콘의 이름.
  name: string;
  // 활성화된 툴페인인가의 여부.
  isActive: boolean;

  onClick: () => void;
}

const textMap = new Map<string, string>([
  ['Design', '디자인'],
  ['Content', '속성'],
  ['Logic', '로직'],
]);

/**
 * 해당되는 툴페인을 열고 닫는 토글 버튼입니다.
 */
const ToolpaneDockButtonComponent: React.FC<IProps> = ({ name, isActive, onClick }: IProps) => (
  <button css={toolPaneDockButton(isActive)} type={'button'} onClick={onClick}>
    {textMap.get(name)}
  </button>
);

export default ToolpaneDockButtonComponent;

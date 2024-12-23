import { ReactNode } from 'react';
import * as ReactDOM from 'react-dom';

/**
 * PortalComponent props
 */
interface IProps {
  children?: ReactNode;
  parentElement?: Element | null;
}

/**
 * PortalComponent의 DOM 계층 외부에 있는 DOM node로 하위 항목을 렌더링합니다.
 *
 * @param children 추가할 node
 * @param parentElement children이 생성될 부모 node
 */
const PortalComponent: React.FC<IProps> = ({ children, parentElement }: IProps) => {
  const container = parentElement ?? document.getElementById('root') ?? document.body;

  return ReactDOM.createPortal(children, container);
};

export default PortalComponent;

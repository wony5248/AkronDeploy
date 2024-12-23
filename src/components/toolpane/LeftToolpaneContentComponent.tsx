import { ReactNode } from 'react';
import { toolPaneContent } from 'styles/toolpane/LeftToolpane';

/**
 * LeftToolPaneContentComponent props.
 */
interface IProps {
  children: ReactNode;
}

/**
 * 좌측 툴페인의 container component.
 */
const LeftToolPaneContentComponent: React.FC<IProps> = ({ children }: IProps) => (
  <div css={toolPaneContent}>{children}</div>
);

export default LeftToolPaneContentComponent;

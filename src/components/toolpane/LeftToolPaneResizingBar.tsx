import { leftToolPaneResizingBar, leftToolPaneResizingLine } from 'styles/toolpane/LeftToolpane';

/**
 * LeftToolPaneResizingBar props.
 */
interface IProps {
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
  setInitialY: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * LeftToolPaneResizingBar.
 */
const LeftToolPaneResizingBar: React.FC<IProps> = ({ setIsResizing, setInitialY }: IProps) => {
  const onMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setInitialY(e.clientY);
  };

  const onMouseUp = () => {
    setIsResizing(false);
  };

  // 사용성을 위해 실제 line보다 넓은 영역이 resize 이벤트를 받음
  return (
    <div css={leftToolPaneResizingBar} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <div css={leftToolPaneResizingLine} />
    </div>
  );
};

export default LeftToolPaneResizingBar;

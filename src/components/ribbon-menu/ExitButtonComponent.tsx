import { publishButton } from 'styles/ribbon-menu/RibbonMenu';

/**
 * ExitButtonComponent props
 */
interface IProps {
  // 확인을 클릭할 경우의 handler.
  onClick: () => void;
}

const ExitButtonComponent: React.FC<IProps> = (props: IProps) => {
  const { onClick } = props;

  return (
    <div>
      <button css={[publishButton, 'exit']} type={'button'} onClick={onClick}>
        종료
      </button>
    </div>
  );
};

export default ExitButtonComponent;

import { StandardSize } from 'components/type/SizeTypes';
import { headerContent, title as dialogTitle, subText as dialogSubText } from 'styles/controls/dialog/Dialog';

/**
 * Dialog Header Labels Props
 */
interface IProps {
  // Dialog 상위에 표현될 text
  title: string;
  // title 하위에 표현될 text
  subText?: string;
  // Component properties에 정의된 size
  size: StandardSize;
}

// DialogHeader > Labels
const DialogHeaderLabelsComponent = ({ title, subText, size }: IProps): JSX.Element => {
  const titleLabel = title; // useTextResource(title);
  const subLabel = subText || ''; //useTextResource(subText || '');

  return (
    <div css={headerContent(size)}>
      <span css={dialogTitle(size)}>{titleLabel}</span>
      {subText && <span css={dialogSubText(size)}>{subLabel}</span>}
    </div>
  );
};

export default DialogHeaderLabelsComponent;

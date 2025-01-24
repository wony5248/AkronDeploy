import { separatorItem, separatorLine } from 'styles/ribbon-menu/menu-item/SeparatorItem';

/**
 * 리본 메뉴클릭시 context menu에 사용되는 separator
 */
const SeparatorItemComponent: React.FC = () => {
  return (
    <div css={separatorItem}>
      <div css={separatorLine} />
    </div>
  );
};

export default SeparatorItemComponent;

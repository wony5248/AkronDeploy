// import styles from 'common/style/ribbon-menu/RibbonMenu.scss';
import LeftMenuComponent from 'components/ribbon-menu/LeftMenuComponent';
import { ribbonMenu } from 'styles/ribbon-menu/RibbonMenu';
import RightMenuComponent from 'components/ribbon-menu/RightMenuComponent';

/**
 * Top Menu Component를 관리
 */
const RibbonMenuComponent: React.FC = () => {
  return (
    <div id="ribbonMenu" css={ribbonMenu}>
      <LeftMenuComponent />
      <RightMenuComponent />
    </div>
  );
};

export default RibbonMenuComponent;

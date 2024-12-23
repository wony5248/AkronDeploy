// import styles from 'common/style/ribbon-menu/RibbonMenu.scss';
import RibbonButtonComponent from 'components/ribbon-menu/RibbonButtonComponent';
import RibbonDialogButtonComponent from 'components/ribbon-menu/RibbonDialogButtonComponent';
import RibbonMenuDropdownButtonComponent from 'components/ribbon-menu/RibbonMenuDropdownButtonComponent';
import useEditorStore from 'hooks/useEditorStore';
import { WorkAreaTabIndex } from 'store/app/EditorUIStore';
import { IRibbonButton } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import RibbonButtonDataList from 'store/ribbon-menu/RibbonMenuData';
import { leftMenu } from 'styles/ribbon-menu/RibbonMenu';

/**
 * 좌측 Ribbon Menu 구성 Component
 */
const LeftMenuComponent: React.FC = () => {
  const editorStore = useEditorStore();
  const ribbonButtonData = RibbonButtonDataList;

  const onClick = (commandPropName: string) => {
    // handleCommandEvent로 변경 예정
    // ribbonStore.onClickedRibbonButton(commandPropName, commandType, ...args);
    if (commandPropName === 'ConvertDataTab') {
      editorStore.getEditorUIStore().setWorkAreaTabIndex(WorkAreaTabIndex.DATA);
    }
  };

  const parseButton = () => {
    return ribbonButtonData.map((button: IRibbonButton) => {
      if (button.type) {
        if (button.type === 'dialog') {
          return (
            <RibbonDialogButtonComponent
              key={button.label}
              label={button.label}
              image={button.image}
              commandPropName={button.commandPropName ?? ''}
              commandType={button.commandType ?? ''}
              onClick={onClick}
            />
          );
        }
        if (button.type === 'dropdown') {
          return (
            <RibbonMenuDropdownButtonComponent
              key={button.label}
              label={button.label}
              image={button.image}
              childList={button.childList}
              onClick={onClick}
            />
          );
        }
      }
      return (
        <RibbonButtonComponent
          key={button.label}
          label={button.label}
          image={button.image}
          commandPropName={button.commandPropName}
          commandType={button.commandType}
          onClick={onClick}
        />
      );
    });
  };

  return <div css={leftMenu}>{parseButton()}</div>;
};

export default LeftMenuComponent;

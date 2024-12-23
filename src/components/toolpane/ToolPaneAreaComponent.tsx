import ToolPaneDockButtonComponent from 'components/toolpane/ToolPaneDockButtonComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { RightToolPaneType, rightToolPaneTypeNames } from 'store/toolpane/ToolPaneComponentInfo';
import { toolPane, toolPaneArea, toolPaneDock } from 'styles/toolpane/RightToolpane';

/**
 * 변수데이터 적용창을 열기위해 전달해야하는 정보입니다.
 */
export interface VarToolpaneInfo {
  Name: string;
  // Type: WidgetMetaDataPropDetailType[];
  // Control?: WidgetMetaDataControlType;
  // propertyKey: keyof IWidgetCommonProperties;
  varDialogOpen: boolean;
}

/**
 * Workarea에서 오른쪽(또는 왼쪽)에 있는 영역으로, 툴페인 관련 view들을 표시합니다.
 */
const ToolPaneAreaComponent: React.FC = () => {
  const editorStroe = useEditorStore();
  const activeToolPaneType = editorStroe.getEditorUIStore().getActiveRightToolPaneType();

  const editorUIStore = editorStroe.getEditorUIStore();

  const onClickDockButton = (type: RightToolPaneType) => {
    editorUIStore.setActiveRightToolPaneType(type);
  };

  // const selectedWidget = editorStroe.getSelectedWidgets()[0];

  const [varDialogOpen, setVarDialogOpen] = useState<VarToolpaneInfo | undefined>(undefined);
  const handleVarDialogOpen = (object: VarToolpaneInfo) => {
    setVarDialogOpen(object);
  };
  const handleVarDialogClose = () => {
    const object = { ...varDialogOpen, varDialogOpen: false };
    setVarDialogOpen(object as VarToolpaneInfo);
  };

  return (
    <div css={toolPaneArea}>
      <div css={toolPaneDock}>
        {rightToolPaneTypeNames.map(type => {
          if (type === 'Logic') {
            return null;
          }
          return (
            <ToolPaneDockButtonComponent
              name={type}
              key={`toolpane-dock-${type}`}
              isActive={type === activeToolPaneType}
              onClick={() => {
                onClickDockButton(type);
              }}
            />
          );
        })}
      </div>
      <div css={toolPane}>
        {/* <ContentToolPaneComponent handleVarDialogOpen={handleVarDialogOpen} />
                <StyleToolPaneComponent handleVarDialogOpen={handleVarDialogOpen} />
                {isUXProject && <LogicToolPaneComponent />} */}
      </div>

      {/* {selectedWidget && (varDialogOpen?.propertyKey === 'content' || varDialogOpen?.propertyKey === 'style') && (
                <ApplyVariableDataDialogContentComponent
                    open={varDialogOpen?.varDialogOpen}
                    propertyName={varDialogOpen?.Name}
                    propertyType={varDialogOpen?.Type} // Type interface 고려한 구현 변경 필요
                    propertyKey={varDialogOpen?.propertyKey}
                    handleClose={handleVarDialogClose}
                    control={varDialogOpen?.Control}
                />
            )} */}
    </div>
  );
};

export default observer(ToolPaneAreaComponent);

import EditorStore from 'models/store/EditorStore';
import { ToolPaneProp } from 'store/toolpane/ToolPaneComponentInfo';

/**
 * 툴페인의 dock 버튼 활성화 비활성화 여부를 핸들링하는 함수입니다.
 */
export default function sectionSelectedPropsHandler(editorStore: EditorStore): ToolPaneProp {
  // const selectedSection = appStore.getSelectedSection();
  let disabled = false;
  // if (selectedSection === undefined) {
  //     disabled = true;
  // }

  // if (
  //     !selectedSection
  //         ?.getAppWidgetModel()
  //         .getProperties()
  //         .content.sectionList?.value?.map((sectionInfo: any) => sectionInfo.isSelected)
  //         .includes(true)
  // ) {
  //     disabled = true;
  // }
  return {
    disabled,
  };
}

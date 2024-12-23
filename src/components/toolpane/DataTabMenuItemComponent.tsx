import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DataTabIndex } from 'store/app/EditorUIStore';
import {
  pageThumbnail,
  pageThumbnailIndex,
  pageThumbnailName,
  pageThumbnailTitle,
} from 'styles/toolpane/PageWidgetList';

/**
 * DataTabMenuItemComponent Props
 */
interface IProps {
  tabIndex: DataTabIndex;
  imgID: string;
  labelString: string;
}

/**
 * Page list를 화면에 표시하기 위한 component.
 */
const DataTabMenuItemComponent: React.FC<IProps> = (props: IProps) => {
  const editorStore = useEditorStore();
  const UIStore = editorStore.getEditorUIStore();
  const { tabIndex, imgID, labelString } = props;
  const handleDataTabClick = (idx: DataTabIndex) => {
    UIStore.setDataTabIndex(idx);
  };
  const [isHover, setIsHover] = useState<boolean>(false);
  const isSelected = UIStore.getDataTabIndex() === tabIndex;

  return (
    <div
      css={pageThumbnail}
      onClick={() => handleDataTabClick(tabIndex)}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <div css={pageThumbnailTitle}>
        {/* <ImageResourceComponent css={pageThumbnailIndex} id={imgID} w={'16px'} h={'16px'} /> */}
        <button style={{ width: '16px', height: '16px' }} />
        <label css={pageThumbnailName}>{labelString}</label>
      </div>
    </div>
  );
};

export default observer(DataTabMenuItemComponent);

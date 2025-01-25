import ImageResourceComponent from 'components/common/ImageResourceComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { DataTabIndex } from 'store/app/EditorUIStore';
import { pageThumbnail, pageThumbnailIndex, pageThumbnailName, pageThumbnailTitle } from 'styles/toolpane/PageList';

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
  const { tabIndex, labelString, imgID } = props;
  const handleDataTabClick = (idx: DataTabIndex) => {
    UIStore.setDataTabIndex(idx);
  };
  const isSelected = UIStore.getDataTabIndex() === tabIndex;

  return (
    <div css={pageThumbnail(isSelected)} onClick={() => handleDataTabClick(tabIndex)}>
      <div css={pageThumbnailTitle}>
        <ImageResourceComponent id={imgID} w={'16px'} h={'16px'} />
        <label css={pageThumbnailName(false)}>{labelString}</label>
      </div>
    </div>
  );
};

export default observer(DataTabMenuItemComponent);

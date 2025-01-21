import { isNotNull } from '@akron/runner';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { RenamePageCommandProps } from 'models/store/command/handler/PageCommandHandler';
import * as React from 'react';
import { pageThumbnailIndex, pageThumbnailName, pageThumbnailTitle } from 'styles/toolpane/PageList';

/**
 * PageThumbnailTitleComponent props.
 */
interface IProps {
  pageModel: WidgetModel;
  idx: number;
}

/**
 * page thumbnail title를 위한 컴포넌트 입니다.
 */
const PageThumbnailTitleComponent = React.forwardRef<HTMLLabelElement, IProps>(
  (props: IProps, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const { idx, pageModel } = props;
    const editorStore = useEditorStore();
    const titleRef = ref as React.RefObject<HTMLLabelElement>;
    const ESC = React.useRef<boolean>(false);
    // const pageProps = pageModel.getComponentSpecificProperties();

    const handleBlur = () => {
      if (isNotNull(titleRef.current as HTMLLabelElement) && !ESC.current) {
        (titleRef.current as HTMLLabelElement).contentEditable = 'false';
        (titleRef.current as HTMLLabelElement).style.border = 'none';
        (titleRef.current as HTMLLabelElement).style.textOverflow = 'ellipsis';
        (titleRef.current as HTMLLabelElement).style.whiteSpace = 'nowrap';
        (titleRef.current as HTMLLabelElement).style.overflow = 'hidden';

        const newTitle = (titleRef.current as HTMLLabelElement).textContent;
        if (isNotNull(newTitle) && newTitle !== '') {
          const commandProps: RenamePageCommandProps = {
            commandID: CommandEnum.RENAME_PAGE,
            targetModel: pageModel,
            pageName: newTitle,
          };
          editorStore.handleCommandEvent(commandProps);
        } else {
          (titleRef.current as HTMLLabelElement).textContent = pageModel.getName();
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleBlur();
      } else if (e.key === 'Escape') {
        if (isNotNull(titleRef.current as HTMLLabelElement)) {
          ESC.current = true;
          (titleRef.current as HTMLLabelElement).contentEditable = 'false'; // 이 시점에 onBlur 호출됨
          (titleRef.current as HTMLLabelElement).style.border = 'none';
          (titleRef.current as HTMLLabelElement).style.textOverflow = 'ellipsis';
          (titleRef.current as HTMLLabelElement).style.whiteSpace = 'nowrap';
          (titleRef.current as HTMLLabelElement).style.overflow = 'hidden';
          (titleRef.current as HTMLLabelElement).textContent = pageModel.getName();
          ESC.current = false;
        }
      }
    };

    return (
      <div css={pageThumbnailTitle}>
        <label css={pageThumbnailIndex(false)}>{idx + 1}</label>
        <label css={pageThumbnailName(false)} onKeyDown={handleKeyDown} onBlur={handleBlur} ref={ref}>
          {pageModel.getName()}
        </label>
      </div>
    );
  }
);

export default observer(PageThumbnailTitleComponent);

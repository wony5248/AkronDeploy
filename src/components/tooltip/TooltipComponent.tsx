// import styles from 'common/style/tooltip/Tooltip.scss';

import useEditorStore from 'hooks/useEditorStore';
import { titleBorder, tooltip, title as tooltipTitle, link as tooltipLink } from 'styles/tooltip/Tooltip';

const TooltipComponent = () => {
  const editorStore = useEditorStore();
  const tooltipStore = editorStore.getTooltipStore();
  const { title, content, icon, link, linkText } = tooltipStore.getTooltip();
  const position = tooltipStore.getPosition();

  return (
    <div css={tooltip(position)}>
      {title && (
        <div css={title && (content || icon || link || linkText) ? titleBorder : tooltipTitle}>
          {icon && (
            <i>
              {
                // <ImageResourceComponent id={icon} w={'12px'} h={'12px'} />
                <button style={{ width: '12px', height: '12px' }} />
              }
            </i>
          )}
          <span>{title}</span>
        </div>
      )}
      {content && <p>{content}</p>}
      {link && (
        <a href={link} css={tooltipLink} target="_blank" rel="noreferrer">
          {linkText}
        </a>
      )}
    </div>
  );
};

export default TooltipComponent;

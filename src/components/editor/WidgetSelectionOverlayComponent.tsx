import WidgetSelectionViewComponent from 'components/editor/WidgetSelectionViewComponent';
import WidgetModel from 'models/node/WidgetModel';

/**
 * WidgetSelectionOverlay를 render하기 위한 인자들
 */
interface Props {
  model: WidgetModel;
}

const WidgetSelectionOverlayComponent: React.FC<Props> = ({ model }: Props) => (
  <div id={'widgetSelectionOverlay'}>
    <WidgetSelectionViewComponent model={model} />
  </div>
);

export default WidgetSelectionOverlayComponent;

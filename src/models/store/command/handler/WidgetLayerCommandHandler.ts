import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import { applyLockCommand } from 'models/store/command/handler/WidgetEditCommandHandler';
import MoveWidgetCommand from 'models/store/command/widget/MoveWidgetCommand';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AkronContext from 'models/store/context/AkronContext';

/**
 * Layer 이동 관련 command props.
 */
export type WidgetLayerCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.LAYER_MOVE;
  targetModel: WidgetModel;
  depParentModel: WidgetModel;
  destParentModel: WidgetModel;
  destNextSiblingModel?: WidgetModel;
};

/**
 * Widget의 Layer 이동 command들을 수행하는 command handler.
 */
class WidgetLayerCommandHandler extends CommandHandler {
  /**
   * Widget의 Layer 관련 command를 처리.
   */
  public processCommand(props: WidgetLayerCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.LAYER_MOVE:
        this.moveLayer(props, ctx);
        break;
      default:
        return false;
    }

    return true;
  }

  /**
   * 받은 props를 통해 레이어 이동 실행
   */
  private moveLayer(props: WidgetLayerCommandProps, ctx: AkronContext) {
    const moveWidgetCommand = new MoveWidgetCommand(
      props.targetModel,
      props.depParentModel,
      props.destParentModel,
      props.destNextSiblingModel
    );
    ctx.getCommand()?.append(moveWidgetCommand);

    if (props.destParentModel.getProperties().content.locked) {
      const lockComponent = (component: WidgetModel) => {
        applyLockCommand(ctx, component, true);
        component.forEachChild(lockComponent);
      };

      lockComponent(props.targetModel);
    }
  }
}

export default WidgetLayerCommandHandler;

import { boundMethod } from 'autobind-decorator';
import CommandMapper from './CommandMapper';
import CommandExecutor from './CommandExecutor';
import CommandEnum from './CommandEnum';
import Command from './Command';
import AkronContext from 'models/store/context/AkronContext';
import AkronCommandMapper from 'models/store/command/akron/AkronCommandMapper';
import CommandHandlerFactory from 'models/store/command/factory/CommandHandlerFactory';

/**
 * Command 수행을 담당하는 class 입니다.
 * Document model 의 제어는 Command manager 안에서만 가능합니다.
 */
class CommandManager {
  /**
   * Command ID 에 대한 command handler list 를 가지고 있는 mapper 입니다. 상황에 따라 map 구성이 달라질 수 있습니다.
   */
  private commandMap: CommandMapper;

  /**
   * Command 를 실제 실행하는 객체입니다.
   */
  private readonly commandExecutor: CommandExecutor;

  /**
   * 생성자
   */
  public constructor(map: CommandMapper) {
    this.commandMap = map;
    this.commandExecutor = new CommandExecutor();
  }

  /**
   * Command ID 에 입각한 command handling 을 수행합니다.
   *
   * @param commandID 최초 command ID 로 context 의 command ID 변화를 확인하기 위해 인자가 구분되어 있습니다.
   * @param ctx context 정보로 로직에 필요한 데이터를 가지고 있습니다.
   */
  @boundMethod
  public execute(ctx: AkronContext): void {
    const commandProps = ctx.getCommandProps();
    if (commandProps === undefined) {
      return;
    }
    // undo
    if (commandProps.commandID === this.UndoCommandEnum()) {
      this.commandExecutor.unExecuteCommand(ctx);
      return;
    }
    // redo
    if (ctx.getCommandProps()?.commandID === this.RedoCommandEnum()) {
      this.commandExecutor.reExecuteCommand(ctx);
      return;
    }

    ctx.setCommand(new Command(ctx));
    // compose simple commands

    this.commandMap
      .get(commandProps.commandID)
      ?.some(handler => (ctx.getCommandProps() ? handler.processCommand(commandProps, ctx) : true));
    // execute
    if (ctx.getCommand()?.isEmpty() === false) {
      if (commandProps.undoable !== undefined) {
        ctx.getCommand()?.setUndoable(commandProps.undoable);
      }
      this.commandExecutor.executeCommand(ctx);
    }
  }

  public UndoCommandEnum(): CommandEnum | void {}

  public RedoCommandEnum(): CommandEnum | void {}
}

export default CommandManager;

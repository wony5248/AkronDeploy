import { boundMethod } from 'autobind-decorator';
import CommandHandler from './CommandHandler';
import CommandEnum from './CommandEnum';
/**
 * CommandMapper 는 command ID 에 따라 어떤 command handler 들이 동작하는지를 정의한 class 입니다.
 * Command manager 가 command ID 를 받으면 command mapper 에서 command handler list 를 받을 수 있습니다.
 */
class CommandMapper {
  /**
   * Command Enum 별 매핑되는 CommandHandler를 관리하는 map
   */
  protected readonly commandMap: Map<CommandEnum, CommandHandler[]>;

  /**
   * 생성자
   */
  public constructor() {
    this.commandMap = new Map();
  }

  /**
   * Command ID 에 따른 command handler list 를 반환합니다.
   *
   * @param commandID Command handler list 를 찾기 위한 key
   * @returns Command ID 에 해당하는 command handler list
   */
  @boundMethod
  public get(commandID: CommandEnum): CommandHandler[] | undefined {
    return this.commandMap.get(commandID);
  }
}

export default CommandMapper;

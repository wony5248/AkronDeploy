import CommandProps from './CommandProps';
import Context from '../context/Context';

/**
 * Document 의 command 를 처리하기 위한 class 입니다.
 * Command manager 하위에 존재합니다.
 */
abstract class CommandHandler<ID, CommandEnum, SelectionProps> {
  /**
   * Command ID 를 받아 command 를 처리합니다.
   *
   * @param ctx context 정보로 로직에 필요한 데이터를 가지고 있습니다. CommandID 를 포함합니다.
   * @returns true 시 command handler list 의 loop 이 중단됩니다.
   */
  public abstract processCommand(
    props: CommandProps<CommandEnum, SelectionProps>,
    ctx: Context<ID, CommandEnum, SelectionProps>
  ): boolean;
}

export default CommandHandler;

import AkronContext from 'models/store/context/AkronContext';
import WidgetCommandProps from 'models/store/command/widget/WidgetCommandProps';

/**
 * Document 의 command 를 처리하기 위한 class 입니다.
 * Command manager 하위에 존재합니다.
 */
abstract class CommandHandler {
  /**
   * Command ID 를 받아 command 를 처리합니다.
   *
   * @param ctx context 정보로 로직에 필요한 데이터를 가지고 있습니다. CommandID 를 포함합니다.
   * @returns true 시 command handler list 의 loop 이 중단됩니다.
   */
  public abstract processCommand(props: WidgetCommandProps, ctx: AkronContext): boolean;
}

export default CommandHandler;

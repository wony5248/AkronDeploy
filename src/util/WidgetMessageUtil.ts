import { Behavior } from 'models/message/OperationMessage';
import { IOperationMessage } from 'models/message/OperationMessageType';
import WidgetModel from 'models/node/WidgetModel';

/**
 * component의 Recursive한 child component relation Message 생성
 */
export function makeRelationMessageRecursive(model: WidgetModel, behavior: Behavior): IOperationMessage[] {
  const messages = new Array<IOperationMessage>();
  const message = model.makeRelationMessage(behavior) as IOperationMessage;
  messages.push(message);
  model.forEachChild(child => {
    messages.push(...makeRelationMessageRecursive(child, behavior));
  });
  return messages;
}

/**
 * component의 Recursive한 child component relation Message 생성
 */
export function makeInstanceMessageRecursive(model: WidgetModel, behavior: Behavior): IOperationMessage[] {
  const messages = new Array<IOperationMessage>();
  const message = model.makeInstanceMessage(behavior) as IOperationMessage;
  messages.push(message);
  model.forEachChild(child => {
    messages.push(...makeInstanceMessageRecursive(child, behavior));
  });
  return messages;
}

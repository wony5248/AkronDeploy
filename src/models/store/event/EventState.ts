/**
 * App state 를 나타내는 enum 입니다.
 * Event handler 는 state machine 으로, event state 에 따라 반응하는 event handler 의 종류와 순서가 다릅니다.
 * Event state 에 따라 어떤 event handler 가 반응하는지는 EventMapper 에 명세되어 있습니다.
 */
enum EventState {
  // Default state
  IDLE,
  DEFAULT,
  EDIT,

  // Edit widget state
  WIDGET_MOVE,
  WIDGET_RESIZE,
  WIDGET_INSERT,

  // INVALID
  INVALID,
}

export default EventState;

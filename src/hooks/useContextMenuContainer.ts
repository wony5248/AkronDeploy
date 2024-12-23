import { useContext } from 'react';
import { ContextMenuContext } from 'store/context-menu/ContextMenuContainer';

const useContextMenuContainer = () => useContext(ContextMenuContext);

export default useContextMenuContainer;

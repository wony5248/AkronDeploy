import { useContext } from 'react';
import { EditorStoreContext } from 'models/store/EditorStore';

/**
 * Editor Page 안에서 Editor store에 접근하기 위한 hook.
 */
const useEditorStore = () => useContext(EditorStoreContext);

export default useEditorStore;

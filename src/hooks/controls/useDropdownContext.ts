import { DropdownSize, DropdownType } from 'components/controls/dropdown/DropdownComponent';
import { createContext, useContext } from 'react';

/**
 * Dropdown 하위에서 공유하는 데이터
 */
interface IDropdownData {
  value: any;
  label: string;
  type: DropdownType;
  size: DropdownSize;
  placeholder: any;
}

/**
 * Dropdown 하위 children에게 데이터를 공유하기 위함.
 */
export const DropdownContext = createContext<IDropdownData>({} as IDropdownData);

const useDropdownContext = (): IDropdownData => useContext(DropdownContext);

export default useDropdownContext;

/**
 * 각종 dialog들 (dialogContent폴더 참조) 정의 시 자주 사용되는 props입니다.
 * 추가 속성이 필요한 경우 아래 예시처럼 확장하여 사용하면 됩니다.
 *
 * @example
 * interface IProps extends IDialogContentProps {
 *     name: string;
 * }
 */
export interface IDialogContentProps {
    open: boolean;
    handleClose: () => void;
}

/**
 * Dialog들 중 리본에 붙일 dialog들 (`ribbonDialogContentMap`) 정의 시 자주 사용되는 props입니다.
 * `extends`로 확장해서 써도 되고 `Pick`, `Omit` 등 이용하여 몇개만 골라 써도 됩니다.
 *
 * @example
 * // props 중 몇개만 사용.
 * type IProps = Pick<IRibbonDialogContentProps, 'open' | 'handleClose' | 'onClick'>;
 */
export interface IRibbonDialogContentProps extends IDialogContentProps {
    commandPropName: string;
    commandType: string;

    // 확인을 클릭할 경우의 handler.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (buttonName: string, commandType: string, ...args: any[]) => void;
}

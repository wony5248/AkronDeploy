/**
 * Common Component 내에서 사용할 공통 Size Type을 정의합니다.
 *
 * [사용법]
 * 정의된 타입 중 일부만 사용하고 싶은 경우 : ts의 Extract<T, U> 사용
 * - T: 추출하려는 타입
 * - U: 선택하려는 타입
 * e.g. type ButtonSize = Extract<BasicSize, 'large'>;
 *
 * 여러 타입을 함께 사용하고 싶은 경우 : ts의 Union 사용
 * e.g. type IconButtonSize = BasicSize | ExtendedSize;
 */

/**
 * Common Control에 대한 기본 size type 입니다.
 */
export type BasicSize = 'small' | 'medium' | 'large';

/**
 * BasicSize 외의 추가 size type 입니다.
 */
export type ExtendedSize = 'xxxsmall' | 'xxsmall' | 'xsmall' | 'xlarge' | 'xxlarge' | 'xxxlarge';

/**
 * BasicSize와 xsmall 을 합친 size type 입니다.
 */
export type StandardSize = BasicSize | Extract<ExtendedSize, 'xsmall'>;

/**
 * DeviceSizeMap.
 */
export const DeviceSizeMap = new Map<string, Map<string, number[]>>([
  [
    'Mobile',
    new Map<string, number[]>([
      ['Iphone 14 Pro Max', [430, 932]],
      ['Iphone 14 Pro', [393, 852]],
      ['Iphone 14 Plus', [428, 926]],
      ['Iphone 14', [390, 844]],
      ['Galaxy S20', [360, 800]],
      ['Galaxy S10', [360, 760]],
      ['Galaxy Note 5', [360, 640]],
    ]),
  ],
  [
    'Desktop',
    new Map<string, number[]>([
      ['Desktop', [1280, 1024]],
      ['Desktop HD', [1440, 1021]],
      ['HD 720p', [1280, 720]],
      ['HD 1080p', [1920, 1080]],
    ]),
  ],
]);
/**
 * DeviceInfo.
 */
export interface DeviceInfo {
  appID?: number;
  deviceType: string;
  deviceName: string;
  orientation: 'vertical' | 'horizontal';
  deviceFrame: boolean;
  userWidth: number; // deviceType가 Custom인 경우에만 존재
  userHeight: number;
  statusBarType: string;
}

export const defaultDeviceInfo: DeviceInfo = {
  deviceFrame: false,
  deviceName: 'Iphone 14 Pro Max',
  deviceType: 'Mobile',
  orientation: 'vertical',
  userHeight: 0,
  userWidth: 0,
  statusBarType: 'None',
};

/**
 * Device 사이즈를 반환하는 함수
 */
export function getDeviceSize(deviceInfo: DeviceInfo): { width: number; height: number } {
  const size = DeviceSizeMap.get(deviceInfo.deviceType)?.get(deviceInfo.deviceName) as number[];

  const isDesktop = deviceInfo.deviceType === 'Desktop';
  const isVertical = deviceInfo.orientation === 'vertical';
  const isSwapWidthHeight = (isDesktop && isVertical) || (!isDesktop && !isVertical);

  const sizeStyle = isSwapWidthHeight ? { width: size[1], height: size[0] } : { width: size[0], height: size[1] };

  return sizeStyle;
}

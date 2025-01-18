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

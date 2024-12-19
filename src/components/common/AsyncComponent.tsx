import { ReactNode, useEffect, useState } from 'react';

/**
 * AsyncComponent의 Props입니다.
 */
interface AsyncComponentProps<T> {
  fallback: ReactNode;
  render: (data: T) => ReactNode;
  func: () => Promise<T>;
}

/**
 * Data를 받아오는 Async Funcion을 실행하고 그 전까지 fallback을 노출하다가,
 * Function이 data를 정상적으로 받아오면 render를 호출해 페이지를 노출하는 컴포넌트입니다.
 */
const AsyncComponent = <T,>({ fallback, render, func }: AsyncComponentProps<T>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (isLoading) {
        const result = await func();
        setData(result);
        setIsLoading(true);
      }
    })();
  }, [func, isLoading]);

  if (isLoading && !data) {
    return <>{fallback}</>;
  }
  return <>{render(data)}</>;
};

export default AsyncComponent;

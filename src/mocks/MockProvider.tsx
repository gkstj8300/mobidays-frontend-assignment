/**
 * MSW 워커 부팅 프로바이더
 *
 * NODE_ENV가 'production'일 때만 MSW를 활성화한다. 로컬 개발에서는 json-server가
 * 실제 API로 동작하므로 MSW가 불필요하다.
 *
 * 워커 시작 전에는 자식 컴포넌트 렌더링을 지연시켜 fetch가 MSW 이전에 빠져나가는 경쟁 조건을 방지한다.
 */

'use client';

import { useEffect, useState } from 'react';

const SHOULD_ENABLE_MSW = process.env.NODE_ENV === 'production';

interface MockProviderProps {
  children: React.ReactNode;
}

export default function MockProvider({ children }: MockProviderProps) {
  const [ready, setReady] = useState(!SHOULD_ENABLE_MSW);

  useEffect(() => {
    if (!SHOULD_ENABLE_MSW) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }

    let cancelled = false;
    (async () => {
      const { worker } = await import('./browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
      if (!cancelled) {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

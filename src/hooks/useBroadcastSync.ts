import { useEffect } from 'react';
import { setupBroadcastListener } from '../store/useAppStore';

/**
 * 브로드캐스트 채널 동기화 훅
 * 앱 최상위에서 한 번만 호출하면 됨
 */
export function useBroadcastSync() {
  useEffect(() => {
    setupBroadcastListener();

    return () => {
      // cleanup은 필요 없음 (채널은 앱 전체에서 공유)
    };
  }, []);
}

/**
 * body 클래스 설정 훅
 */
export function useBodyClass(className: string) {
  useEffect(() => {
    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
}

import { Navigate } from 'react-router-dom';
import { useBodyClass } from '../hooks/useBroadcastSync';
import { useStreamId } from '../hooks/useStreamId';
import { getAppStore } from '../store/useAppStore';
import { SongInput } from '../components/control/SongInput';
import { HistoryManager } from '../components/control/HistoryManager';
import { VisibilityToggles } from '../components/control/VisibilityToggles';
import { ThemeSettings } from '../components/control/ThemeSettings';
import { Preview } from '../components/control/Preview';

export function ControlPage() {
  const streamId = useStreamId();

  // body에 control-mode 클래스 추가 (다크 테마용)
  useBodyClass('control-mode');

  // streamId가 없으면 입력 페이지로 리다이렉트
  if (!streamId) {
    return <Navigate to="/control/login" replace />;
  }

  // streamId 기반 스토어 사용
  const useStore = getAppStore(streamId);

  return (
    <ControlPageContent streamId={streamId} useStore={useStore} />
  );
}

interface ControlPageContentProps {
  streamId: string;
  useStore: ReturnType<typeof getAppStore>;
}

function ControlPageContent({ streamId, useStore }: ControlPageContentProps) {
  return (
    <div className="min-h-screen p-6">
      {/* 헤더 */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Live Overlay</h1>
            <p className="text-gray-500 text-sm">Stream ID: {streamId.slice(0, 8)}...</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`/overlay?id=${streamId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              오버레이 새 탭에서 열기 →
            </a>
            <a
              href="/control/login"
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              다른 스트림
            </a>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 컬럼: 곡 관리 */}
          <div className="space-y-6">
            <SongInput useStore={useStore} />
            <HistoryManager useStore={useStore} />
          </div>

          {/* 중간 컬럼: 미리보기 */}
          <div className="lg:col-span-1">
            <Preview useStore={useStore} />
          </div>

          {/* 오른쪽 컬럼: 설정 */}
          <div className="space-y-6">
            <VisibilityToggles useStore={useStore} />
            <ThemeSettings useStore={useStore} />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            OBS Browser Source URL:{' '}
            <code className="text-amber-400">
              {typeof window !== 'undefined' ? `${window.location.origin}/overlay?id=${streamId}` : `/overlay?id=${streamId}`}
            </code>
          </div>
          <div>변경사항은 자동으로 동기화됩니다</div>
        </div>
      </footer>
    </div>
  );
}

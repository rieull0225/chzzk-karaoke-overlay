import { useBodyClass } from '../hooks/useBroadcastSync';
import { useStreamId } from '../hooks/useStreamId';
import { getAppStore } from '../store/useAppStore';
import { OverlayContainer } from '../components/overlay/OverlayContainer';
import { CurrentSongDisplay } from '../components/overlay/CurrentSongDisplay';
import { HistoryList } from '../components/overlay/HistoryList';

export function OverlayPage() {
  const streamId = useStreamId();

  // body에 overlay-mode 클래스 추가
  useBodyClass('overlay-mode');

  // streamId가 없으면 에러 표시
  if (!streamId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Stream ID가 필요합니다. URL에 ?id=xxx 를 추가하세요.</p>
      </div>
    );
  }

  return <OverlayContent streamId={streamId} />;
}

function OverlayContent({ streamId }: { streamId: string }) {
  const useStore = getAppStore(streamId);
  const { currentSong, songHistory, visibility, theme, layout } = useStore();

  // 표시할 내용이 없으면 빈 화면
  const hasContent =
    (visibility.currentSong && currentSong) ||
    (visibility.history && songHistory.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <OverlayContainer theme={theme} layout={layout}>
      {visibility.currentSong && currentSong && (
        <CurrentSongDisplay song={currentSong} theme={theme} />
      )}
      {visibility.history && songHistory.length > 0 && (
        <HistoryList songs={songHistory} theme={theme} layout={layout} />
      )}
    </OverlayContainer>
  );
}

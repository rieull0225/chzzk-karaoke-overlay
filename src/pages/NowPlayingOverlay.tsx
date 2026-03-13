import { useBodyClass } from '../hooks/useBroadcastSync';
import { useStreamId } from '../hooks/useStreamId';
import { getAppStore } from '../store/useAppStore';
import { CurrentSongDisplay } from '../components/overlay/CurrentSongDisplay';

export function NowPlayingOverlay() {
  const streamId = useStreamId();
  useBodyClass('overlay-mode');

  if (!streamId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Stream ID가 필요합니다. URL에 ?id=xxx 를 추가하세요.</p>
      </div>
    );
  }

  return <NowPlayingContent streamId={streamId} />;
}

function NowPlayingContent({ streamId }: { streamId: string }) {
  const useStore = getAppStore(streamId);
  const { currentSong, theme, layout } = useStore();

  if (!currentSong) {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    custom: 'top-0 left-0',
  };

  return (
    <div
      className={`fixed ${positionClasses[layout.position]}`}
      style={{ padding: layout.padding }}
    >
      <CurrentSongDisplay song={currentSong} theme={theme} />
    </div>
  );
}

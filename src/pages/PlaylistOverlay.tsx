import { useBodyClass } from '../hooks/useBroadcastSync';
import { useStreamId } from '../hooks/useStreamId';
import { getAppStore } from '../store/useAppStore';
import { HistoryList } from '../components/overlay/HistoryList';
import type { OverlayTheme, OverlayLayout } from '../types';

export function PlaylistOverlay() {
  const streamId = useStreamId();
  useBodyClass('overlay-mode');

  if (!streamId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Stream ID가 필요합니다. URL에 ?id=xxx 를 추가하세요.</p>
      </div>
    );
  }

  return <PlaylistContent streamId={streamId} />;
}

function PlaylistContent({ streamId }: { streamId: string }) {
  const useStore = getAppStore(streamId);
  const { songHistory, theme, layout } = useStore();

  if (songHistory.length === 0) {
    return null;
  }

  return (
    <div style={getContainerStyle(layout)}>
      <div style={getPanelStyle(theme)}>
        <HistoryList songs={songHistory} theme={theme} layout={layout} />
      </div>
    </div>
  );
}

function getContainerStyle(layout: OverlayLayout): React.CSSProperties {
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: layout.padding, left: layout.padding },
    'top-right': { top: layout.padding, right: layout.padding },
    'bottom-left': { bottom: layout.padding, left: layout.padding },
    'bottom-right': { bottom: layout.padding, right: layout.padding },
    custom: { bottom: layout.padding, left: layout.padding },
  };

  return {
    position: 'fixed',
    ...positionStyles[layout.position],
    maxWidth: '90vw',
    zIndex: 9999,
  };
}

function getPanelStyle(theme: OverlayTheme): React.CSSProperties {
  if (!theme.showPanel) return {};

  return {
    backgroundColor: `${theme.backgroundColor}${Math.round(theme.backgroundOpacity * 255)
      .toString(16)
      .padStart(2, '0')}`,
    borderRadius: `${theme.borderRadius}px`,
    padding: '16px 24px',
  };
}

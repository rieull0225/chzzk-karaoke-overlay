import { getAppStore } from '../../store/useAppStore';
import { CurrentSongDisplay } from '../overlay/CurrentSongDisplay';
import { HistoryList } from '../overlay/HistoryList';

interface PreviewProps {
  useStore: ReturnType<typeof getAppStore>;
}

export function Preview({ useStore }: PreviewProps) {
  const { currentSong, songHistory, visibility, theme, layout } = useStore();

  // 미리보기용 배경 스타일 (실제 오버레이는 투명)
  const previewBgStyle = {
    backgroundImage:
      'linear-gradient(45deg, #1a1a1a 25%, #252525 25%, #252525 50%, #1a1a1a 50%, #1a1a1a 75%, #252525 75%)',
    backgroundSize: '20px 20px',
  };

  // 패널 배경 스타일
  const panelStyle = theme.showPanel
    ? {
        backgroundColor: `${theme.backgroundColor}${Math.round(theme.backgroundOpacity * 255)
          .toString(16)
          .padStart(2, '0')}`,
        borderRadius: `${theme.borderRadius}px`,
        padding: '16px 24px',
      }
    : {};

  // 데이터가 없을 때 보여줄 더미 데이터
  const previewSong = currentSong || {
    id: 'preview',
    title: '미리보기 곡 제목',
    artist: '아티스트명',
    playedAt: Date.now(),
  };

  const previewHistory =
    songHistory.length > 0
      ? songHistory
      : [
          { id: '1', title: '이전 곡 1', artist: '아티스트', playedAt: Date.now() - 180000 },
          { id: '2', title: '이전 곡 2', artist: '아티스트', playedAt: Date.now() - 360000 },
        ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">미리보기</h2>

      {/* 미리보기 영역 */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          ...previewBgStyle,
          minHeight: '300px',
        }}
      >
        {/* 오버레이 미리보기 */}
        <div
          className="absolute"
          style={{
            [layout.position.includes('top') ? 'top' : 'bottom']: layout.padding,
            [layout.position.includes('left') ? 'left' : 'right']: layout.padding,
            maxWidth: 'calc(100% - 48px)',
          }}
        >
          <div style={panelStyle}>
            {visibility.currentSong && (
              <CurrentSongDisplay song={previewSong} theme={theme} />
            )}
            {visibility.history && (
              <HistoryList songs={previewHistory} theme={theme} layout={layout} />
            )}
          </div>
        </div>

        {/* 데이터 없음 안내 */}
        {!visibility.currentSong && !visibility.history && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 text-sm">표시할 요소가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

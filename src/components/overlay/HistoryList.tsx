import type { Song, OverlayTheme, OverlayLayout } from '../../types';

interface HistoryListProps {
  songs: Song[];
  theme: OverlayTheme;
  layout: OverlayLayout;
}

export function HistoryList({ songs, theme, layout }: HistoryListProps) {
  if (songs.length === 0) {
    return null;
  }

  // 최대 표시 개수만큼만 보여줌
  const displaySongs = songs.slice(0, layout.maxHistoryItems);

  return (
    <div
      className="mt-4"
      style={{
        textAlign: theme.textAlign,
      }}
    >
      {/* History 라벨 */}
      <div
        className="text-shadow-sm uppercase tracking-widest mb-2 opacity-60"
        style={{
          color: theme.textColor,
          fontSize: `${theme.fontSize.history * 0.7}px`,
        }}
      >
        History
      </div>

      {/* 곡 목록 */}
      <ul className="space-y-1">
        {displaySongs.map((song, index) => (
          <li
            key={song.id}
            className="text-shadow-sm animate-slideIn"
            style={{
              color: theme.textColor,
              fontSize: `${theme.fontSize.history}px`,
              fontFamily: theme.fontFamily,
              opacity: 1 - index * 0.15, // 아래로 갈수록 희미해짐
              animationDelay: `${index * 50}ms`,
            }}
          >
            <span>{song.title}</span>
            {song.artist && (
              <span className="opacity-50"> - {song.artist}</span>
            )}
          </li>
        ))}
      </ul>

      {/* 더 많은 곡이 있음을 표시 */}
      {songs.length > layout.maxHistoryItems && (
        <div
          className="text-shadow-sm mt-1 opacity-40"
          style={{
            color: theme.textColor,
            fontSize: `${theme.fontSize.history * 0.8}px`,
          }}
        >
          +{songs.length - layout.maxHistoryItems} more
        </div>
      )}
    </div>
  );
}

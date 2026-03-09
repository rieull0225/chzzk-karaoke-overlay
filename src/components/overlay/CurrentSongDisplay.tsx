import type { Song, OverlayTheme } from '../../types';

interface CurrentSongDisplayProps {
  song: Song | null;
  theme: OverlayTheme;
}

export function CurrentSongDisplay({ song, theme }: CurrentSongDisplayProps) {
  if (!song) {
    return null;
  }

  return (
    <div
      className="animate-fadeIn"
      style={{
        textAlign: theme.textAlign,
      }}
    >
      {/* Now Playing 라벨 */}
      <div
        className="text-shadow-sm uppercase tracking-widest mb-1 opacity-80"
        style={{
          color: theme.accentColor,
          fontSize: `${theme.fontSize.current * 0.4}px`,
        }}
      >
        Now Playing
      </div>

      {/* 곡 제목 */}
      <div
        className="text-shadow font-bold leading-tight"
        style={{
          color: theme.textColor,
          fontSize: `${theme.fontSize.current}px`,
          fontFamily: theme.fontFamily,
        }}
      >
        {song.title}
      </div>

      {/* 아티스트 (있을 경우) */}
      {song.artist && (
        <div
          className="text-shadow-sm mt-1 opacity-70"
          style={{
            color: theme.textColor,
            fontSize: `${theme.fontSize.current * 0.5}px`,
            fontFamily: theme.fontFamily,
          }}
        >
          {song.artist}
        </div>
      )}
    </div>
  );
}

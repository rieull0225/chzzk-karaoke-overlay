import { useState, type FormEvent } from 'react';
import { getAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SongInputProps {
  useStore: ReturnType<typeof getAppStore>;
}

export function SongInput({ useStore }: SongInputProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  const { currentSong, setCurrentSong, confirmCurrentSong, clearCurrentSong } = useStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCurrentSong(title, artist || undefined);
    setTitle('');
    setArtist('');
  };

  const handleConfirm = () => {
    confirmCurrentSong();
  };

  const handleClear = () => {
    clearCurrentSong();
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">현재 곡 설정</h2>

      {/* 현재 재생 중인 곡 표시 */}
      {currentSong && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg border-l-4 border-amber-500">
          <div className="text-xs text-amber-500 uppercase tracking-wide mb-1">
            Now Playing
          </div>
          <div className="text-white font-medium text-lg">{currentSong.title}</div>
          {currentSong.artist && (
            <div className="text-gray-400 text-sm">{currentSong.artist}</div>
          )}
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleConfirm}>
              확정 (히스토리에 추가)
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClear}>
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 새 곡 입력 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="곡 제목"
          placeholder="곡 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="아티스트 (선택)"
          placeholder="아티스트명"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={!title.trim()}>
          {currentSong ? '곡 변경' : '곡 설정'}
        </Button>
      </form>
    </div>
  );
}

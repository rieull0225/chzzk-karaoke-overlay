import { useState } from 'react';
import { getAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HistoryManagerProps {
  useStore: ReturnType<typeof getAppStore>;
}

export function HistoryManager({ useStore }: HistoryManagerProps) {
  const { songHistory, updateHistoryItem, deleteHistoryItem, clearHistory } = useStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');

  const startEdit = (id: string, title: string, artist?: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditArtist(artist || '');
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateHistoryItem(editingId, {
        title: editTitle.trim(),
        artist: editArtist.trim() || undefined,
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditArtist('');
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          히스토리 ({songHistory.length}곡)
        </h2>
        {songHistory.length > 0 && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              if (confirm('히스토리를 모두 삭제하시겠습니까?')) {
                clearHistory();
              }
            }}
          >
            전체 삭제
          </Button>
        )}
      </div>

      {songHistory.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          아직 재생된 곡이 없습니다.
          <br />
          곡을 설정하고 확정하면 여기에 추가됩니다.
        </div>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {songHistory.map((song) => (
            <li
              key={song.id}
              className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg group hover:bg-gray-750"
            >
              {editingId === song.id ? (
                // 편집 모드
                <div className="flex-1 space-y-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="곡 제목"
                  />
                  <Input
                    value={editArtist}
                    onChange={(e) => setEditArtist(e.target.value)}
                    placeholder="아티스트"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      저장
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                // 보기 모드
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-white truncate">{song.title}</div>
                    {song.artist && (
                      <div className="text-gray-500 text-sm">{song.artist}</div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(song.id, song.title, song.artist)}
                    >
                      편집
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteHistoryItem(song.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

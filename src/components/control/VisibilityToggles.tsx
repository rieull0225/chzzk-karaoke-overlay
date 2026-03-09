import { getAppStore } from '../../store/useAppStore';
import { Toggle } from '../ui/Toggle';

interface VisibilityTogglesProps {
  useStore: ReturnType<typeof getAppStore>;
}

export function VisibilityToggles({ useStore }: VisibilityTogglesProps) {
  const { visibility, setVisibility } = useStore();

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">표시 설정</h2>

      <div className="space-y-4">
        <Toggle
          label="현재 곡 표시"
          checked={visibility.currentSong}
          onChange={(checked) => setVisibility({ currentSong: checked })}
        />
        <Toggle
          label="플레이리스트 표시"
          checked={visibility.history}
          onChange={(checked) => setVisibility({ history: checked })}
        />
        <div className="border-t border-gray-800 pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-3">다음 기능은 준비 중입니다</p>
          <Toggle
            label="신청곡 표시"
            checked={visibility.requests}
            onChange={(checked) => setVisibility({ requests: checked })}
            disabled
          />
          <div className="mt-3">
            <Toggle
              label="가사 표시"
              checked={visibility.lyrics}
              onChange={(checked) => setVisibility({ lyrics: checked })}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}

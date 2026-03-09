import { getAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';

interface ThemeSettingsProps {
  useStore: ReturnType<typeof getAppStore>;
}

export function ThemeSettings({ useStore }: ThemeSettingsProps) {
  const { theme, layout, setTheme, setLayout, resetSettings } = useStore();

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">스타일 설정</h2>
        <Button size="sm" variant="ghost" onClick={resetSettings}>
          초기화
        </Button>
      </div>

      <div className="space-y-5">
        {/* 색상 설정 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">색상</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">텍스트</label>
              <input
                type="color"
                value={theme.textColor}
                onChange={(e) => setTheme({ textColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">강조</label>
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => setTheme({ accentColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* 폰트 크기 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">폰트 크기</h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              현재 곡: {theme.fontSize.current}px
            </label>
            <input
              type="range"
              min="16"
              max="64"
              value={theme.fontSize.current}
              onChange={(e) =>
                setTheme({
                  fontSize: { ...theme.fontSize, current: Number(e.target.value) },
                })
              }
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              히스토리: {theme.fontSize.history}px
            </label>
            <input
              type="range"
              min="12"
              max="32"
              value={theme.fontSize.history}
              onChange={(e) =>
                setTheme({
                  fontSize: { ...theme.fontSize, history: Number(e.target.value) },
                })
              }
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* 배경 패널 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">배경 패널</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={theme.showPanel}
              onChange={(e) => setTheme({ showPanel: e.target.checked })}
              className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-300">배경 패널 표시</span>
          </label>
          {theme.showPanel && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  배경 투명도: {Math.round(theme.backgroundOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={theme.backgroundOpacity * 100}
                  onChange={(e) =>
                    setTheme({ backgroundOpacity: Number(e.target.value) / 100 })
                  }
                  className="w-full accent-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  모서리 둥글기: {theme.borderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={theme.borderRadius}
                  onChange={(e) => setTheme({ borderRadius: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </>
          )}
        </div>

        {/* 정렬 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">정렬</h3>
          <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                onClick={() => setTheme({ textAlign: align })}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    theme.textAlign === align
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                {align === 'left' ? '왼쪽' : align === 'center' ? '중앙' : '오른쪽'}
              </button>
            ))}
          </div>
        </div>

        {/* 위치 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">위치</h3>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['top-left', '좌상단'],
                ['top-right', '우상단'],
                ['bottom-left', '좌하단'],
                ['bottom-right', '우하단'],
              ] as const
            ).map(([pos, label]) => (
              <button
                key={pos}
                onClick={() => setLayout({ position: pos })}
                className={`
                  py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    layout.position === pos
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 히스토리 표시 개수 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">
            히스토리 표시 개수: {layout.maxHistoryItems}개
          </h3>
          <input
            type="range"
            min="1"
            max="50"
            value={layout.maxHistoryItems}
            onChange={(e) => setLayout({ maxHistoryItems: Number(e.target.value) })}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
}

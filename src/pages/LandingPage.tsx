import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* 로고/타이틀 */}
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Live Overlay
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          OBS용 라이브 방송 오버레이
        </p>

        {/* 설명 */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-8 text-left border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-amber-400">주요 기능</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>현재 플레이 중인 곡 제목 실시간 표시</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>플레이 히스토리 자동 기록 및 표시</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>폰트, 색상, 위치 등 자유로운 커스터마이징</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>OBS Browser Source 호환 투명 배경</span>
            </li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/control">
            <Button size="lg" className="w-full sm:w-auto">
              관리자 페이지 열기
            </Button>
          </Link>
          <Link to="/overlay">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              오버레이 미리보기
            </Button>
          </Link>
        </div>

        {/* 사용법 */}
        <div className="mt-12 text-left">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            사용법
          </h3>
          <ol className="space-y-4 text-gray-400 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-amber-500 text-xs font-bold">
                1
              </span>
              <span>관리자 페이지에서 현재 곡을 입력하고 스타일을 설정합니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-amber-500 text-xs font-bold">
                2
              </span>
              <span>
                OBS에서 Browser Source를 추가하고 URL을{' '}
                <code className="text-amber-400">/overlay</code>로 설정합니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-amber-500 text-xs font-bold">
                3
              </span>
              <span>관리자 페이지에서 곡을 변경하면 OBS에 실시간으로 반영됩니다.</span>
            </li>
          </ol>
        </div>

        {/* 푸터 */}
        <footer className="mt-16 text-gray-600 text-sm">
          Made for streamers with love
        </footer>
      </div>
    </div>
  );
}

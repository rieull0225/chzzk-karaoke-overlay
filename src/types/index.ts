// 곡 정보
export interface Song {
  id: string;
  title: string;
  artist?: string;
  playedAt: number; // timestamp
  notes?: string;
}

// 오버레이 표시 설정
export interface OverlayVisibility {
  currentSong: boolean;
  history: boolean;
  requests: boolean;
  lyrics: boolean;
}

// 테마 설정
export interface OverlayTheme {
  textColor: string;
  accentColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  fontFamily: string;
  fontSize: {
    current: number;
    history: number;
  };
  showPanel: boolean;
  borderRadius: number;
  textAlign: 'left' | 'center' | 'right';
}

// 레이아웃 설정 (Phase 2에서 확장)
export interface OverlayLayout {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom';
  padding: number;
  maxHistoryItems: number;
}

// 전체 앱 상태
export interface AppState {
  // 곡 데이터
  currentSong: Song | null;
  songHistory: Song[];
  requestSongs: Song[];
  lyrics: string;

  // 설정
  visibility: OverlayVisibility;
  theme: OverlayTheme;
  layout: OverlayLayout;
}

// 액션 타입
export interface AppActions {
  // 곡 관리
  setCurrentSong: (title: string, artist?: string) => void;
  confirmCurrentSong: () => void;
  clearCurrentSong: () => void;

  // 히스토리 관리
  updateHistoryItem: (id: string, updates: Partial<Song>) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;

  // 신청곡 관리 (Phase 2)
  addRequestSong: (title: string, artist?: string) => void;
  removeRequestSong: (id: string) => void;
  clearRequests: () => void;

  // 가사 관리 (Phase 2)
  setLyrics: (lyrics: string) => void;
  clearLyrics: () => void;

  // 설정 관리
  setVisibility: (visibility: Partial<OverlayVisibility>) => void;
  setTheme: (theme: Partial<OverlayTheme>) => void;
  setLayout: (layout: Partial<OverlayLayout>) => void;
  resetSettings: () => void;

  // 전체 상태 동기화
  syncState: (state: Partial<AppState>) => void;
}

// 스토어 타입
export interface AppStore extends AppState, AppActions {}

// 기본값
export const DEFAULT_VISIBILITY: OverlayVisibility = {
  currentSong: true,
  history: true,
  requests: false,
  lyrics: false,
};

export const DEFAULT_THEME: OverlayTheme = {
  textColor: '#ffffff',
  accentColor: '#fbbf24', // amber-400
  backgroundColor: '#000000',
  backgroundOpacity: 0.6,
  fontFamily: "'Noto Sans KR', sans-serif",
  fontSize: {
    current: 32,
    history: 18,
  },
  showPanel: true,
  borderRadius: 12,
  textAlign: 'left',
};

export const DEFAULT_LAYOUT: OverlayLayout = {
  position: 'bottom-left',
  padding: 24,
  maxHistoryItems: 50,
};

// 유틸리티 함수
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

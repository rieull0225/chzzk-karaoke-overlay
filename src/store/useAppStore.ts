import { create } from 'zustand';
import type { AppStore, Song } from '../types';
import {
  DEFAULT_VISIBILITY,
  DEFAULT_THEME,
  DEFAULT_LAYOUT,
  generateId,
} from '../types';
import {
  getStreamData,
  saveStreamData,
  deleteStreamData,
  subscribeToStream,
  type StreamData,
} from '../lib/supabase';

// 스토어 인스턴스 캐시 (streamId별)
const storeCache = new Map<string, ReturnType<typeof createStore>>();

// 구독 해제 함수 캐시
const unsubscribeCache = new Map<string, () => void>();

function mapStreamDataToState(data: StreamData): Partial<AppStore> {
  return {
    currentSong: data.current_song as Song | null,
    songHistory: (data.song_history || []) as Song[],
    requestSongs: (data.request_songs || []) as Song[],
    lyrics: data.lyrics || '',
    visibility: data.visibility as AppStore['visibility'] || DEFAULT_VISIBILITY,
    theme: data.theme as AppStore['theme'] || DEFAULT_THEME,
    layout: data.layout as AppStore['layout'] || DEFAULT_LAYOUT,
  };
}

function mapStateToStreamData(state: Partial<AppStore>): Partial<StreamData> {
  return {
    current_song: state.currentSong,
    song_history: state.songHistory,
    request_songs: state.requestSongs,
    lyrics: state.lyrics,
    visibility: state.visibility,
    theme: state.theme,
    layout: state.layout,
  };
}

function createStore(streamId: string) {
  const store = create<AppStore>()((set, get) => ({
    // 초기 상태
    currentSong: null,
    songHistory: [],
    requestSongs: [],
    lyrics: '',
    visibility: DEFAULT_VISIBILITY,
    theme: DEFAULT_THEME,
    layout: DEFAULT_LAYOUT,

    // 현재 곡 설정
    setCurrentSong: (title: string, artist?: string) => {
      const newSong: Song = {
        id: generateId(),
        title: title.trim(),
        artist: artist?.trim(),
        playedAt: Date.now(),
      };
      set({ currentSong: newSong });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 현재 곡 확정 (히스토리에 추가)
    confirmCurrentSong: () => {
      const { currentSong, songHistory } = get();
      if (!currentSong) return;

      const updatedHistory = [currentSong, ...songHistory];
      set({
        songHistory: updatedHistory,
        currentSong: null,
      });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 현재 곡 삭제
    clearCurrentSong: () => {
      set({ currentSong: null });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 히스토리 항목 수정
    updateHistoryItem: (id: string, updates: Partial<Song>) => {
      const { songHistory } = get();
      const updatedHistory = songHistory.map((song) =>
        song.id === id ? { ...song, ...updates } : song
      );
      set({ songHistory: updatedHistory });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 히스토리 항목 삭제
    deleteHistoryItem: (id: string) => {
      const { songHistory } = get();
      set({ songHistory: songHistory.filter((song) => song.id !== id) });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 히스토리 전체 삭제
    clearHistory: () => {
      set({ songHistory: [] });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 신청곡 추가
    addRequestSong: (title: string, artist?: string) => {
      const { requestSongs } = get();
      const newRequest: Song = {
        id: generateId(),
        title: title.trim(),
        artist: artist?.trim(),
        playedAt: Date.now(),
      };
      set({ requestSongs: [...requestSongs, newRequest] });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 신청곡 삭제
    removeRequestSong: (id: string) => {
      const { requestSongs } = get();
      set({ requestSongs: requestSongs.filter((song) => song.id !== id) });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 신청곡 전체 삭제
    clearRequests: () => {
      set({ requestSongs: [] });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 가사 설정
    setLyrics: (lyrics: string) => {
      set({ lyrics });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 가사 삭제
    clearLyrics: () => {
      set({ lyrics: '' });
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 표시 설정
    setVisibility: (visibility) => {
      set((state) => ({
        visibility: { ...state.visibility, ...visibility },
      }));
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 테마 설정
    setTheme: (theme) => {
      set((state) => ({
        theme: { ...state.theme, ...theme },
      }));
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 레이아웃 설정
    setLayout: (layout) => {
      set((state) => ({
        layout: { ...state.layout, ...layout },
      }));
      saveStreamData(streamId, mapStateToStreamData(get()));
    },

    // 설정 초기화 (DB도 삭제)
    resetSettings: async () => {
      set({
        currentSong: null,
        songHistory: [],
        requestSongs: [],
        lyrics: '',
        visibility: DEFAULT_VISIBILITY,
        theme: DEFAULT_THEME,
        layout: DEFAULT_LAYOUT,
      });
      // DB에서 삭제
      await deleteStreamData(streamId);
    },

    // 전체 상태 동기화 (실시간 구독용)
    syncState: (state) => {
      set(state);
    },
  }));

  // 초기 데이터 로드 및 실시간 구독
  (async () => {
    const data = await getStreamData(streamId);
    if (data) {
      store.setState(mapStreamDataToState(data));
    }
  })();

  // 실시간 구독 설정
  const unsubscribe = subscribeToStream(streamId, (data) => {
    store.setState(mapStreamDataToState(data));
  });
  unsubscribeCache.set(streamId, unsubscribe);

  return store;
}

// streamId별 스토어 가져오기
export function getAppStore(streamId: string) {
  if (!storeCache.has(streamId)) {
    storeCache.set(streamId, createStore(streamId));
  }
  return storeCache.get(streamId)!;
}

// 기본 export (하위 호환용)
export const useAppStore = create<AppStore>()((_set, _get) => ({
  currentSong: null,
  songHistory: [],
  requestSongs: [],
  lyrics: '',
  visibility: DEFAULT_VISIBILITY,
  theme: DEFAULT_THEME,
  layout: DEFAULT_LAYOUT,
  setCurrentSong: () => {},
  confirmCurrentSong: () => {},
  clearCurrentSong: () => {},
  updateHistoryItem: () => {},
  deleteHistoryItem: () => {},
  clearHistory: () => {},
  addRequestSong: () => {},
  removeRequestSong: () => {},
  clearRequests: () => {},
  setLyrics: () => {},
  clearLyrics: () => {},
  setVisibility: () => {},
  setTheme: () => {},
  setLayout: () => {},
  resetSettings: () => {},
  syncState: () => {},
}));

export function setupBroadcastListener() {
  // Supabase 실시간 구독으로 대체
}

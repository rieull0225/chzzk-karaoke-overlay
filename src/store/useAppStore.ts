import { create } from 'zustand';
import type { AppStore, Song } from '../types';
import {
  DEFAULT_VISIBILITY,
  DEFAULT_THEME,
  DEFAULT_LAYOUT,
  generateId,
} from '../types';

// 스토어 인스턴스 캐시 (streamId별)
const storeCache = new Map<string, ReturnType<typeof createStore>>();

// BroadcastChannel 캐시
const channelCache = new Map<string, BroadcastChannel>();

function getStorageKey(streamId: string) {
  return `obs-overlay-${streamId}`;
}

function getChannelName(streamId: string) {
  return `obs-overlay-sync-${streamId}`;
}

function loadFromStorage(streamId: string): Partial<AppStore> {
  try {
    const data = localStorage.getItem(getStorageKey(streamId));
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load from storage:', e);
  }
  return {};
}

function saveToStorage(streamId: string, state: Partial<AppStore>) {
  try {
    const dataToSave = {
      currentSong: state.currentSong,
      songHistory: state.songHistory,
      requestSongs: state.requestSongs,
      lyrics: state.lyrics,
      visibility: state.visibility,
      theme: state.theme,
      layout: state.layout,
    };
    localStorage.setItem(getStorageKey(streamId), JSON.stringify(dataToSave));
  } catch (e) {
    console.warn('Failed to save to storage:', e);
  }
}

function getBroadcastChannel(streamId: string): BroadcastChannel | null {
  if (typeof window === 'undefined') return null;

  if (!channelCache.has(streamId)) {
    try {
      const channel = new BroadcastChannel(getChannelName(streamId));
      channelCache.set(streamId, channel);
    } catch {
      console.warn('BroadcastChannel not supported');
      return null;
    }
  }
  return channelCache.get(streamId) || null;
}

function broadcastState(streamId: string, state: Partial<AppStore>) {
  const channel = getBroadcastChannel(streamId);
  if (channel) {
    const stateToSync = {
      currentSong: state.currentSong,
      songHistory: state.songHistory,
      requestSongs: state.requestSongs,
      lyrics: state.lyrics,
      visibility: state.visibility,
      theme: state.theme,
      layout: state.layout,
    };
    channel.postMessage({ type: 'STATE_UPDATE', payload: stateToSync });
  }
}

function createStore(streamId: string) {
  const savedState = loadFromStorage(streamId);

  const store = create<AppStore>()((set, get) => ({
    // 초기 상태 (저장된 데이터로 덮어씀)
    currentSong: savedState.currentSong ?? null,
    songHistory: savedState.songHistory ?? [],
    requestSongs: savedState.requestSongs ?? [],
    lyrics: savedState.lyrics ?? '',
    visibility: savedState.visibility ?? DEFAULT_VISIBILITY,
    theme: savedState.theme ?? DEFAULT_THEME,
    layout: savedState.layout ?? DEFAULT_LAYOUT,

    // 현재 곡 설정
    setCurrentSong: (title: string, artist?: string) => {
      const newSong: Song = {
        id: generateId(),
        title: title.trim(),
        artist: artist?.trim(),
        playedAt: Date.now(),
      };
      set({ currentSong: newSong });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
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
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 현재 곡 삭제
    clearCurrentSong: () => {
      set({ currentSong: null });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 히스토리 항목 수정
    updateHistoryItem: (id: string, updates: Partial<Song>) => {
      const { songHistory } = get();
      const updatedHistory = songHistory.map((song) =>
        song.id === id ? { ...song, ...updates } : song
      );
      set({ songHistory: updatedHistory });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 히스토리 항목 삭제
    deleteHistoryItem: (id: string) => {
      const { songHistory } = get();
      set({ songHistory: songHistory.filter((song) => song.id !== id) });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 히스토리 전체 삭제
    clearHistory: () => {
      set({ songHistory: [] });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
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
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 신청곡 삭제
    removeRequestSong: (id: string) => {
      const { requestSongs } = get();
      set({ requestSongs: requestSongs.filter((song) => song.id !== id) });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 신청곡 전체 삭제
    clearRequests: () => {
      set({ requestSongs: [] });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 가사 설정
    setLyrics: (lyrics: string) => {
      set({ lyrics });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 가사 삭제
    clearLyrics: () => {
      set({ lyrics: '' });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 표시 설정
    setVisibility: (visibility) => {
      set((state) => ({
        visibility: { ...state.visibility, ...visibility },
      }));
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 테마 설정
    setTheme: (theme) => {
      set((state) => ({
        theme: { ...state.theme, ...theme },
      }));
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 레이아웃 설정
    setLayout: (layout) => {
      set((state) => ({
        layout: { ...state.layout, ...layout },
      }));
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 설정 초기화
    resetSettings: () => {
      set({
        visibility: DEFAULT_VISIBILITY,
        theme: DEFAULT_THEME,
        layout: DEFAULT_LAYOUT,
      });
      saveToStorage(streamId, get());
      broadcastState(streamId, get());
    },

    // 전체 상태 동기화 (브로드캐스트 수신용)
    syncState: (state) => {
      set(state);
    },
  }));

  // BroadcastChannel 리스너 설정
  const channel = getBroadcastChannel(streamId);
  if (channel) {
    channel.onmessage = (event) => {
      if (event.data?.type === 'STATE_UPDATE') {
        store.getState().syncState(event.data.payload);
      }
    };
  }

  return store;
}

// streamId별 스토어 가져오기
export function getAppStore(streamId: string) {
  if (!storeCache.has(streamId)) {
    storeCache.set(streamId, createStore(streamId));
  }
  return storeCache.get(streamId)!;
}

// 기본 export (하위 호환용, streamId 없이 사용 시)
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
  // 이제 각 스토어에서 자체적으로 처리
}

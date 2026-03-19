import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Running in offline mode.');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();

// 스트림 데이터 타입
export interface StreamData {
  id: string; // session_id (16자 랜덤)
  current_song: unknown;
  song_history: unknown[];
  request_songs: unknown[];
  lyrics: string;
  visibility: unknown;
  theme: unknown;
  layout: unknown;
  created_at: string;
  updated_at: string;
}

// 스트림 데이터 가져오기
export async function getStreamData(streamId: string): Promise<StreamData | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('streams')
    .select('*')
    .eq('id', streamId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 데이터 없음 - 새로 생성
      return null;
    }
    console.error('Error fetching stream data:', error);
    return null;
  }

  return data;
}

// 스트림 데이터 저장/업데이트
export async function saveStreamData(streamId: string, data: Partial<StreamData>, isNew = false): Promise<boolean> {
  if (!supabase) return false;

  const now = new Date().toISOString();
  const upsertData: Record<string, unknown> = {
    id: streamId,
    ...data,
    updated_at: now,
  };

  // 새 레코드인 경우 created_at 설정
  if (isNew) {
    upsertData.created_at = now;
  }

  const { error } = await supabase
    .from('streams')
    .upsert(upsertData);

  if (error) {
    console.error('Error saving stream data:', error);
    return false;
  }

  return true;
}

// 오래된 데이터 삭제 (2일 이상 된 데이터)
export async function cleanupOldStreams(): Promise<void> {
  if (!supabase) return;

  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('streams')
    .delete()
    .lt('created_at', twoDaysAgo);

  if (error) {
    console.error('Error cleaning up old streams:', error);
  }
}

// 스트림 데이터 삭제
export async function deleteStreamData(streamId: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('streams')
    .delete()
    .eq('id', streamId);

  if (error) {
    console.error('Error deleting stream data:', error);
    return false;
  }

  return true;
}

// 초기 데이터 로드만 (폴링 없음)
export function subscribeToStream(streamId: string, callback: (data: StreamData) => void) {
  if (!supabase) {
    return () => {};
  }

  // 초기 로드만 수행
  getStreamData(streamId).then((data) => {
    if (data) {
      callback(data);
    }
  });

  return () => {};
}

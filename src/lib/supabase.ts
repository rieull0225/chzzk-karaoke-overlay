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
  id: string; // stream_id
  current_song: unknown;
  song_history: unknown[];
  request_songs: unknown[];
  lyrics: string;
  visibility: unknown;
  theme: unknown;
  layout: unknown;
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
export async function saveStreamData(streamId: string, data: Partial<StreamData>): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('streams')
    .upsert({
      id: streamId,
      ...data,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error saving stream data:', error);
    return false;
  }

  return true;
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

// 실시간 구독
export function subscribeToStream(streamId: string, callback: (data: StreamData) => void) {
  if (!supabase) {
    return () => {}; // no-op unsubscribe
  }

  const channel = supabase
    .channel(`stream-${streamId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'streams',
        filter: `id=eq.${streamId}`,
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as StreamData);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

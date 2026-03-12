import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { generateSessionId } from '../types';

interface ChannelInfo {
  channelId: string;
  channelName: string;
  channelImageUrl: string;
  followerCount: number;
  openLive: boolean;
}

// localStorage 키
const SESSION_KEY = 'overlay_session';

interface StoredSession {
  sessionId: string;
  channelName: string;
  createdAt: number;
}

export function StreamIdInput() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [existingSession, setExistingSession] = useState<StoredSession | null>(null);
  const navigate = useNavigate();

  // 기존 세션 확인
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const session: StoredSession = JSON.parse(stored);
        // 2일(48시간) 이내인 경우만 유효
        const twoDays = 48 * 60 * 60 * 1000;
        if (Date.now() - session.createdAt < twoDays) {
          setExistingSession(session);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const extractStreamId = (input: string): string => {
    const trimmed = input.trim();

    // chzzk URL 패턴 체크
    const urlMatch = trimmed.match(/chzzk\.naver\.com\/([a-f0-9]+)/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    // 그냥 ID만 입력한 경우 (hex 문자열)
    if (/^[a-f0-9]+$/i.test(trimmed) && trimmed.length >= 10) {
      return trimmed;
    }

    return '';
  };

  const fetchChannelInfo = async (channelId: string): Promise<ChannelInfo | null> => {
    try {
      const response = await fetch(
        `/api/chzzk/service/v1/channels/${channelId}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.code === 200 && data.content) {
        return {
          channelId: data.content.channelId,
          channelName: data.content.channelName,
          channelImageUrl: data.content.channelImageUrl,
          followerCount: data.content.followerCount,
          openLive: data.content.openLive,
        };
      }

      return null;
    } catch (e) {
      console.error('Failed to fetch channel info:', e);
      return null;
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    const id = extractStreamId(input);
    if (!id) {
      setError('올바른 Stream ID 또는 치지직 URL을 입력하세요');
      setChannelInfo(null);
      return;
    }

    setLoading(true);
    setError('');

    const info = await fetchChannelInfo(id);

    setLoading(false);

    if (info) {
      setChannelInfo(info);
      setError('');
    } else {
      setChannelInfo(null);
      setError('채널을 찾을 수 없습니다. ID를 확인해주세요.');
    }
  };

  const handleStart = () => {
    if (channelInfo) {
      // 새 세션 ID 생성
      const sessionId = generateSessionId();
      const session: StoredSession = {
        sessionId,
        channelName: channelInfo.channelName,
        createdAt: Date.now(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      navigate(`/control?id=${sessionId}`);
    }
  };

  const handleContinueSession = () => {
    if (existingSession) {
      navigate(`/control?id=${existingSession.sessionId}`);
    }
  };

  const handleNewSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setExistingSession(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">Live Overlay</h1>
        <p className="text-gray-400 text-center mb-8">치지직 채널을 검색하세요</p>

        {/* 기존 세션이 있으면 표시 */}
        {existingSession && (
          <div className="mb-6 p-4 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-sm text-gray-400 mb-2">이전 세션이 있습니다</p>
            <p className="text-lg font-semibold text-amber-400 mb-3">{existingSession.channelName}</p>
            <div className="flex gap-2">
              <Button onClick={handleContinueSession} className="flex-1">
                이어서 사용하기
              </Button>
              <Button onClick={handleNewSession} variant="secondary" className="flex-1">
                새로 시작
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            placeholder="치지직 URL 또는 채널 ID"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
              setChannelInfo(null);
            }}
            error={error}
          />
          <p className="text-xs text-gray-500">
            예: https://chzzk.naver.com/abcd1234efgh5678...
          </p>
          <Button type="submit" variant="secondary" className="w-full" disabled={loading || !input.trim()}>
            {loading ? '검색 중...' : '채널 검색'}
          </Button>
        </form>

        {/* 채널 정보 표시 */}
        {channelInfo && (
          <div className="mt-6 p-6 bg-gray-900 rounded-xl border border-gray-800 animate-fadeIn">
            <div className="flex items-center gap-4">
              {channelInfo.channelImageUrl && (
                <img
                  src={channelInfo.channelImageUrl}
                  alt={channelInfo.channelName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-amber-400 text-sm mb-1">채널을 찾았습니다!</p>
                <p className="text-xl font-bold text-white">
                  {channelInfo.channelName}
                </p>
                <p className="text-gray-500 text-sm">
                  팔로워 {channelInfo.followerCount.toLocaleString()}명
                  {channelInfo.openLive && (
                    <span className="ml-2 text-red-500">● LIVE</span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-800 rounded-lg text-center">
              <p className="text-lg">
                <span className="text-amber-400 font-semibold">{channelInfo.channelName}</span>
                <span className="text-gray-300">님 환영합니다!</span>
              </p>
            </div>

            <Button onClick={handleStart} className="w-full mt-4">
              오버레이 설정 시작하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

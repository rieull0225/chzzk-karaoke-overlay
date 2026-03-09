import { useSearchParams } from 'react-router-dom';

export function useStreamId(): string | null {
  const [searchParams] = useSearchParams();
  return searchParams.get('id');
}

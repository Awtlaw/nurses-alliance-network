import { useQuery } from '@tanstack/react-query';

export default function useUser() {
  const { data, isLoading } = useQuery({
    queryKey: ['user-session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  return { data: data?.user || null, loading: isLoading };
}

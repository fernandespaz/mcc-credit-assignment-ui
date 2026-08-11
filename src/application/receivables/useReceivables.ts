import { useQuery } from '@tanstack/react-query';
import { receivableRepository } from '@/infrastructure/repositories/ReceivableHttpRepository';

export const RECEIVABLES_QUERY_KEY = ['receivables'] as const;

export function useReceivables() {
  const { data: receivables = [], isLoading, error, refetch } = useQuery({
    queryKey: RECEIVABLES_QUERY_KEY,
    queryFn: () => receivableRepository.findAll(),
  });

  return { receivables, isLoading, error, refetch };
}

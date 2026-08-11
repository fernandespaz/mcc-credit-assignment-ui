import { useQuery } from '@tanstack/react-query';
import { assignorRepository } from '@/infrastructure/repositories/AssignorHttpRepository';

export const ASSIGNORS_QUERY_KEY = ['assignors'] as const;

export function useAssignors() {
  const { data: assignors = [], isLoading, error, refetch } = useQuery({
    queryKey: ASSIGNORS_QUERY_KEY,
    queryFn: () => assignorRepository.findAll(),
  });

  return { assignors, isLoading, error, refetch };
}

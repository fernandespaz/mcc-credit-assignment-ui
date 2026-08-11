import { useQuery } from '@tanstack/react-query';
import { receivableRepository } from '@/infrastructure/repositories/ReceivableHttpRepository';

export function useSimulateReceivable(receivableId: string | null, baseRate: number | null) {
  const enabled = !!receivableId && baseRate !== null && baseRate >= 0;

  const { data: simulation, isLoading, error, isFetching } = useQuery({
    queryKey: ['simulate', receivableId, baseRate],
    queryFn: () => receivableRepository.simulate(receivableId!, baseRate!),
    enabled,
    staleTime: 30_000,
  });

  return { simulation, isLoading, isFetching, error };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ExecuteSettlementPayload } from '@/domain/entities/Settlement';
import { settlementRepository } from '@/infrastructure/repositories/SettlementHttpRepository';
import { RECEIVABLES_QUERY_KEY } from '@/application/receivables/useReceivables';

export function useExecuteSettlement() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: executeSettlement,
    isPending,
    error,
    reset,
    data: settlement,
  } = useMutation({
    mutationFn: (payload: ExecuteSettlementPayload) => settlementRepository.execute(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: RECEIVABLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['settlements', 'by-receivable', data.receivableId] });
      queryClient.invalidateQueries({ queryKey: ['settlement-statement'] });
    },
  });

  return { executeSettlement, isPending, error, reset, settlement };
}

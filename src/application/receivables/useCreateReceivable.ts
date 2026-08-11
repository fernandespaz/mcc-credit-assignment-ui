import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateReceivablePayload } from '@/domain/entities/Receivable';
import { receivableRepository } from '@/infrastructure/repositories/ReceivableHttpRepository';
import { RECEIVABLES_QUERY_KEY } from './useReceivables';

export function useCreateReceivable() {
  const queryClient = useQueryClient();

  const { mutateAsync: createReceivable, isPending, error, reset, data: createdReceivable } = useMutation({
    mutationFn: (payload: CreateReceivablePayload) => receivableRepository.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECEIVABLES_QUERY_KEY });
    },
  });

  return { createReceivable, isPending, error, reset, createdReceivable };
}

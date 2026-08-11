import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateAssignorPayload } from '@/domain/entities/Assignor';
import { assignorRepository } from '@/infrastructure/repositories/AssignorHttpRepository';
import { ASSIGNORS_QUERY_KEY } from './useAssignors';

export function useCreateAssignor() {
  const queryClient = useQueryClient();

  const { mutateAsync: createAssignor, isPending, error, reset } = useMutation({
    mutationFn: (payload: CreateAssignorPayload) => assignorRepository.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNORS_QUERY_KEY });
    },
  });

  return { createAssignor, isPending, error, reset };
}

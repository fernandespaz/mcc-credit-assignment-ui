import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignorRepository } from '@/infrastructure/repositories/AssignorHttpRepository';
import { ASSIGNORS_QUERY_KEY } from './useAssignors';

export function useDeactivateAssignor() {
  const queryClient = useQueryClient();

  const { mutateAsync: deactivateAssignor, isPending, error } = useMutation({
    mutationFn: (id: string) => assignorRepository.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNORS_QUERY_KEY });
    },
  });

  return { deactivateAssignor, isPending, error };
}

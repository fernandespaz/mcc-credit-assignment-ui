import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateAssignorPayload } from '@/domain/entities/Assignor';
import { assignorRepository } from '@/infrastructure/repositories/AssignorHttpRepository';
import { ASSIGNORS_QUERY_KEY } from './useAssignors';

export function useUpdateAssignor() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateAssignor, isPending, error } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAssignorPayload }) =>
      assignorRepository.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNORS_QUERY_KEY });
    },
  });

  return { updateAssignor, isPending, error };
}

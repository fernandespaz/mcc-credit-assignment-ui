import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/presentation/components/ui/Modal';
import { Input } from '@/presentation/components/ui/Input';
import { Button } from '@/presentation/components/ui/Button';
import { useCreateAssignor } from '@/application/assignors/useCreateAssignor';
import { useUpdateAssignor } from '@/application/assignors/useUpdateAssignor';
import type { Assignor } from '@/domain/entities/Assignor';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

// ─── Schemas ─────────────────────────────────────────────────────────────────
const createSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  document: z
    .string()
    .transform(onlyDigits)
    .refine((v) => v.length === 11 || v.length === 14, 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos)'),
  email: z.string().email('E-mail inválido'),
});

const editSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

// ─── Create ───────────────────────────────────────────────────────────────────
interface CreateProps {
  onClose: () => void;
}

export function CreateAssignorModal({ onClose }: CreateProps) {
  const { createAssignor, isPending } = useCreateAssignor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateValues>({ resolver: zodResolver(createSchema) });

  async function onSubmit(values: CreateValues) {
    await createAssignor(values);
    onClose();
  }

  return (
    <Modal open title="Novo Cedente" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input label="Nome" placeholder="Razão Social ou Nome Completo" error={errors.name?.message} {...register('name')} />
        <Input label="CPF / CNPJ" placeholder="00.000.000/0001-00" error={errors.document?.message} {...register('document')} />
        <Input label="E-mail" type="email" placeholder="contato@empresa.com" error={errors.email?.message} {...register('email')} />
        <div className="flex gap-3 pt-1">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" loading={isPending} className="flex-1">
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Edit ─────────────────────────────────────────────────────────────────────
interface EditProps {
  assignor: Assignor;
  onClose: () => void;
}

export function EditAssignorModal({ assignor, onClose }: EditProps) {
  const { updateAssignor, isPending } = useUpdateAssignor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: assignor.name, email: assignor.email },
  });

  async function onSubmit(values: EditValues) {
    await updateAssignor({ id: assignor.id, payload: values });
    onClose();
  }

  return (
    <Modal open title="Editar Cedente" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input label="Nome" error={errors.name?.message} {...register('name')} />
        <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
        <div className="flex gap-3 pt-1">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" loading={isPending} className="flex-1">
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}

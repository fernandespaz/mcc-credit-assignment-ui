import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/Badge';
import { Button } from '@/presentation/components/ui/Button';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { EditAssignorModal } from './AssignorFormModal';
import { useDeactivateAssignor } from '@/application/assignors/useDeactivateAssignor';
import { formatDate } from '@/lib/formatters';
import type { Assignor } from '@/domain/entities/Assignor';

interface Props {
  assignors: Assignor[];
  isLoading: boolean;
}

export function AssignorsTable({ assignors, isLoading }: Props) {
  const [editing, setEditing] = useState<Assignor | null>(null);
  const { deactivateAssignor, isPending: deactivating } = useDeactivateAssignor();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (assignors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
        <p>Nenhum cedente cadastrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Documento</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">E-mail</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Cadastro</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {assignors.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                <td className="px-4 py-3 text-gray-600 tabular-nums">{a.document}</td>
                <td className="px-4 py-3 text-gray-600">{a.email}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(a.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge variant={a.active ? 'success' : 'neutral'}>
                    {a.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(a)}
                      aria-label={`Editar ${a.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {a.active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deactivateAssignor(a.id)}
                        loading={deactivating}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label={`Desativar ${a.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditAssignorModal assignor={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

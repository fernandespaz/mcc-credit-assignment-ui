import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { AssignorsTable } from './components/AssignorsTable';
import { CreateAssignorModal } from './components/AssignorFormModal';
import { useAssignors } from '@/application/assignors/useAssignors';

export function AssignorsPage() {
  const { assignors, isLoading } = useAssignors();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Cedentes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {assignors.length} cedente{assignors.length !== 1 ? 's' : ''} cadastrado{assignors.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo Cedente
        </Button>
      </div>

      <AssignorsTable assignors={assignors} isLoading={isLoading} />

      {showCreate && <CreateAssignorModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

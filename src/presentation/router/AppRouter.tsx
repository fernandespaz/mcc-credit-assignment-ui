import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/presentation/components/layout/AppLayout';
import { ReceivablesPage } from '@/presentation/pages/receivables/ReceivablesPage';
import { AssignorsPage } from '@/presentation/pages/assignors/AssignorsPage';
import { SettlementStatementPage } from '@/presentation/pages/settlements/SettlementStatementPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/receivables" replace />} />
        <Route path="receivables" element={<ReceivablesPage />} />
        <Route path="assignors" element={<AssignorsPage />} />
        <Route path="settlements" element={<SettlementStatementPage />} />
        <Route path="*" element={<Navigate to="/receivables" replace />} />
      </Route>
    </Routes>
  );
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/presentation/components/layout/AppLayout';
import { ReceivablesPage } from '@/presentation/pages/receivables/ReceivablesPage';
import { AssignorsPage } from '@/presentation/pages/assignors/AssignorsPage';
import { SettlementStatementPage } from '@/presentation/pages/settlements/SettlementStatementPage';
import { LoginPage } from '@/presentation/pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/receivables" replace />} />
        <Route path="receivables" element={<ReceivablesPage />} />
        <Route path="assignors" element={<AssignorsPage />} />
        <Route path="reports" element={<SettlementStatementPage />} />
        <Route path="*" element={<Navigate to="/receivables" replace />} />
      </Route>
    </Routes>
  );
}

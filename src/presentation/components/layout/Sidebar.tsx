import { NavLink } from 'react-router-dom';
import { LayoutGrid, Users, FileBarChart, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const navItems = [
  { to: '/receivables', label: 'Recebíveis', icon: LayoutGrid },
  { to: '/assignors', label: 'Cedentes', icon: Users },
  { to: '/settlements', label: 'Extrato', icon: FileBarChart },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-brand-900 text-white transition-transform duration-300',
          'lg:relative lg:z-auto lg:w-56 lg:translate-x-0 lg:transition-none',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <h1 className="text-base font-bold tracking-tight">SRM Credit</h1>
            <p className="text-xs text-brand-100 mt-0.5 opacity-70">Cessão de Crédito</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1" aria-label="Navegação principal">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-brand-100 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Logo from '@/assets/logonaporta.svg';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-[#F6984A] h-screen fixed left-0 top-0 flex flex-col shadow-lg">
      <div className="p-6 bg-[#E5893A]">
        <div className="flex items-center space-x-3">
          <img
            src={Logo}
            alt="Na Porta Logo"
            className="h-12 w-12"
          />
          <div>
            <h1 className="text-xl font-bold text-white">Na Porta</h1>
            <p className="text-xs text-white/80">Sistema de Pedidos</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                ? 'bg-white/20 text-white border-r-4 border-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                ? 'bg-white/20 text-white border-r-4 border-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Package size={20} />
            <span className="font-medium">Pedidos</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-white/20">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:text-white hover:bg-white/20"
          onClick={logout}
        >
          <LogOut size={18} className="mr-3" />
          Sair
        </Button>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-white/60">
          © 2024 Na Porta
        </p>
      </div>
    </div>
  );
};
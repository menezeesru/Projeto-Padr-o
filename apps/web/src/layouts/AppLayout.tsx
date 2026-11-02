import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  ListTodo,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  Search,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/abrir-chamado", label: "Abrir Chamado", icon: PlusCircle },
  { to: "/meus-chamados", label: "Meus Chamados", icon: Ticket },
  { to: "/fila", label: "Fila de Atendimento", icon: ListTodo },
  { to: "/todos-chamados", label: "Todos os Chamados", icon: FileText },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/notificacoes", label: "Notificações", icon: Bell },
  { to: "/configuracoes", label: "Configurações", icon: Settings }
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <aside className={`fixed left-0 top-0 h-full bg-[#12346B] border-r border-[#0F2A56] shadow-lg transition-all duration-300 ${collapsed ? "w-16" : "w-72"}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SD</span>
              </div>
              <div>
                <span className="font-bold text-white text-lg block leading-none">ServiceDesk</span>
                <span className="text-xs text-blue-200 font-semibold">PRO</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white font-bold text-lg">SD</span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${collapsed ? "hidden" : ""}`}
          >
            <Menu size={18} className="text-gray-200" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? "sidebar-link-active" 
                      : "sidebar-link"
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className={collapsed ? "mx-auto" : ""} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-72"}`}>
        <header className="h-16 bg-white border-b border-[#DCE4EF] shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Pesquisar chamados..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#DCE4EF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 hover:bg-[#EFF6FF] rounded-lg transition-colors border border-transparent hover:border-[#BFDBFE]">
              <Bell size={20} className="text-[#0F3DCC]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-[#BFDBFE]"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0F3DCC] to-[#08237A] rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
                <span className="text-white font-bold text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[#08237A]">{user?.name}</p>
                <p className="text-xs text-[#0F3DCC] font-medium">{user?.roleCodes?.[0]}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline font-medium">Sair</span>
              </button>
            </div>
          </div>
        </header>
        <main className="p-6 bg-white min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

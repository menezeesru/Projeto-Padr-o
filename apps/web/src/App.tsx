import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import MyTickets from "./pages/MyTickets";
import OpenTicket from "./pages/OpenTicket";
import Queue from "./pages/Queue";
import AllTickets from "./pages/AllTickets";
import Sla from "./pages/Sla";
import Catalog from "./pages/Catalog";
import Knowledge from "./pages/Knowledge";
import Inventory from "./pages/Inventory";
import Teams from "./pages/Teams";
import Approvals from "./pages/Approvals";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Audit from "./pages/Audit";
import Settings from "./pages/Settings";
import TicketDetail from "./pages/TicketDetail";

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><AppLayout /></Protected>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="meus-chamados" element={<MyTickets />} />
          <Route path="abrir-chamado" element={<OpenTicket />} />
          <Route path="fila" element={<Queue />} />
          <Route path="todos-chamados" element={<AllTickets />} />
          <Route path="sla" element={<Sla />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="base-conhecimento" element={<Knowledge />} />
          <Route path="inventario" element={<Inventory />} />
          <Route path="equipes" element={<Teams />} />
          <Route path="aprovacoes" element={<Approvals />} />
          <Route path="relatorios" element={<Reports />} />
          <Route path="notificacoes" element={<Notifications />} />
          <Route path="auditoria" element={<Audit />} />
          <Route path="configuracoes" element={<Settings />} />
          <Route path="chamado/:id" element={<TicketDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

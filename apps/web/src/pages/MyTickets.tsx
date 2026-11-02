import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { Link } from "react-router-dom";

const priorityMap: Record<string, string> = {
  P1_CRITICA: "P1 - CRÍTICA",
  P2_ALTA: "P2 - ALTA",
  P3_MEDIA: "P3 - MÉDIA",
  P4_BAIXA: "P4 - BAIXA"
};

const priorityColor: Record<string, string> = {
  P1_CRITICA: "bg-red-50 text-red-700 border-red-200",
  P2_ALTA: "bg-orange-50 text-orange-700 border-orange-200",
  P3_MEDIA: "bg-yellow-50 text-yellow-700 border-yellow-200",
  P4_BAIXA: "bg-blue-50 text-blue-700 border-blue-200"
};

const statusMap: Record<string, string> = {
  NOVO: "ABERTO",
  NA_FILA: "ABERTO",
  AGUARDANDO_TRIAGEM: "ABERTO",
  REABERTO: "ABERTO",
  ATRIBUIDO: "EM ATENDIMENTO",
  EM_ATENDIMENTO: "EM ATENDIMENTO",
  AGUARDANDO_TERCEIRO: "EM ATENDIMENTO",
  PENDENTE_SOLICITANTE: "EM ATENDIMENTO",
  AGUARDANDO_APROVACAO: "EM ATENDIMENTO",
  AGUARDANDO_SOLICITANTE: "EM ATENDIMENTO",
  RESOLVIDO: "RESOLVIDO",
  ENCERRADO: "RESOLVIDO",
  CANCELADO: "CANCELADO"
};

const statusColor: Record<string, string> = {
  NOVO: "bg-blue-50 text-blue-700 border-blue-200",
  NA_FILA: "bg-blue-50 text-blue-700 border-blue-200",
  AGUARDANDO_TRIAGEM: "bg-blue-50 text-blue-700 border-blue-200",
  REABERTO: "bg-blue-50 text-blue-700 border-blue-200",
  ATRIBUIDO: "bg-yellow-50 text-yellow-700 border-yellow-200",
  EM_ATENDIMENTO: "bg-yellow-50 text-yellow-700 border-yellow-200",
  AGUARDANDO_TERCEIRO: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PENDENTE_SOLICITANTE: "bg-yellow-50 text-yellow-700 border-yellow-200",
  AGUARDANDO_APROVACAO: "bg-yellow-50 text-yellow-700 border-yellow-200",
  AGUARDANDO_SOLICITANTE: "bg-yellow-50 text-yellow-700 border-yellow-200",
  RESOLVIDO: "bg-green-50 text-green-700 border-green-200",
  ENCERRADO: "bg-green-50 text-green-700 border-green-200",
  CANCELADO: "bg-red-50 text-red-700 border-red-200"
};

export default function MyTickets() {
  const { data, isLoading } = useQuery({
    queryKey: ["tickets", "mine"],
    queryFn: async () => (await api.get("/api/tickets?mine=true")).data
  });

  if (isLoading) return <div className="p-4 text-sm text-gray-600">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">Meus Chamados</h1>
        <p className="text-sm text-gray-600 mt-1">Acompanhe seus chamados abertos</p>
      </div>
      <div className="bg-white border border-[#DCE4EF] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F5F9]">
                <th className="text-left text-sm font-semibold text-[#334155] px-6 py-3">Protocolo</th>
                <th className="text-left text-sm font-semibold text-[#334155] px-6 py-3">Título</th>
                <th className="text-left text-sm font-semibold text-[#334155] px-6 py-3">Status</th>
                <th className="text-left text-sm font-semibold text-[#334155] px-6 py-3">Prioridade</th>
                <th className="text-left text-sm font-semibold text-[#334155] px-6 py-3">Abertura</th>
              </tr>
            </thead>
            <tbody>
              {(data || []).map((t: any) => (
                <tr key={t.id} className="border-t border-[#DCE4EF] hover:bg-[#F8FAFC] transition-colors duration-150">
                  <td className="px-6 py-3 text-sm font-medium text-[#2563EB]"><Link to={`/chamado/${t.id}`} className="hover:underline">{t.number}</Link></td>
                  <td className="px-6 py-3 text-sm text-[#1E293B] max-w-md truncate" title={t.title}>{t.title}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[t.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {statusMap[t.status] || t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityColor[t.priority] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {priorityMap[t.priority] || t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{new Date(t.openedAt).toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(data || []).length === 0 && (
          <div className="p-6 text-center text-sm text-gray-600">Nenhum chamado encontrado</div>
        )}
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const priorityMap: Record<string, string> = {
  P1_CRITICA: "P1 - Crítica",
  P2_ALTA: "P2 - Alta",
  P3_MEDIA: "P3 - Média",
  P4_BAIXA: "P4 - Baixa"
};

const priorityColor: Record<string, string> = {
  P1_CRITICA: "bg-red-50 text-red-700 border-red-200",
  P2_ALTA: "bg-orange-50 text-orange-700 border-orange-200",
  P3_MEDIA: "bg-yellow-50 text-yellow-700 border-yellow-200",
  P4_BAIXA: "bg-green-50 text-green-700 border-green-200"
};

const statusMap: Record<string, string> = {
  NOVO: "Aguardando Atendimento",
  NA_FILA: "Aguardando Atendimento",
  AGUARDANDO_TRIAGEM: "Aguardando Atendimento",
  REABERTO: "Aguardando Atendimento",
  ATRIBUIDO: "Em Atendimento",
  EM_ATENDIMENTO: "Em Atendimento",
  AGUARDANDO_TERCEIRO: "Em Atendimento",
  AGUARDANDO_SOLICITANTE: "Pendente do Solicitante",
  PENDENTE_SOLICITANTE: "Pendente do Solicitante",
  AGUARDANDO_APROVACAO: "Pendente do Solicitante",
  RESOLVIDO: "Concluído",
  ENCERRADO: "Concluído",
  CANCELADO: "Concluído"
};

const statusColor: Record<string, string> = {
  NOVO: "bg-yellow-50 text-yellow-700 border-yellow-200",
  NA_FILA: "bg-yellow-50 text-yellow-700 border-yellow-200",
  AGUARDANDO_TRIAGEM: "bg-yellow-50 text-yellow-700 border-yellow-200",
  REABERTO: "bg-yellow-50 text-yellow-700 border-yellow-200",
  ATRIBUIDO: "bg-blue-50 text-blue-700 border-blue-200",
  EM_ATENDIMENTO: "bg-blue-50 text-blue-700 border-blue-200",
  AGUARDANDO_TERCEIRO: "bg-blue-50 text-blue-700 border-blue-200",
  PENDENTE_SOLICITANTE: "bg-amber-50 text-amber-700 border-amber-200",
  AGUARDANDO_APROVACAO: "bg-amber-50 text-amber-700 border-amber-200",
  AGUARDANDO_SOLICITANTE: "bg-amber-50 text-amber-700 border-amber-200",
  RESOLVIDO: "bg-green-50 text-green-700 border-green-200",
  ENCERRADO: "bg-green-50 text-green-700 border-green-200",
  CANCELADO: "bg-green-50 text-green-700 border-green-200"
};

export default function Queue() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [priorityFilter, setPriorityFilter] = useState("TODOS");
  const { data: queues } = useQuery({ queryKey: ["queues"], queryFn: async () => (await api.get("/api/queues")).data });
  const { data: tickets } = useQuery({ queryKey: ["queue-tickets"], queryFn: async () => {
    if (!queues?.[0]?.id) return [];
    return (await api.get(`/api/queues/${queues[0].id}/tickets`)).data;
  }, enabled: !!queues?.[0]?.id });

  const accept = useMutation({
    mutationFn: async (ticketId: string) => api.post(`/api/queues/tickets/${ticketId}/accept`),
    onSuccess: () => {
      toast.success("Chamado aceito com sucesso");
      qc.invalidateQueries({ queryKey: ["queue-tickets"] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Erro ao aceitar chamado")
  });

  const finalizar = useMutation({
    mutationFn: async (ticketId: string) => api.post(`/api/queues/tickets/${ticketId}/finalize`),
    onSuccess: () => {
      toast.success("Chamado finalizado com sucesso");
      qc.invalidateQueries({ queryKey: ["queue-tickets"] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Erro ao finalizar chamado")
  });

  const filteredTickets = useMemo(() => {
    let list = tickets || [];
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((t: any) => 
        (t.number || "").toLowerCase().includes(s) || 
        (t.title || "").toLowerCase().includes(s)
      );
    }
    if (statusFilter !== "TODOS") {
      list = list.filter((t: any) => statusMap[t.status] === statusFilter);
    }
    if (priorityFilter !== "TODOS") {
      list = list.filter((t: any) => priorityMap[t.priority] === priorityFilter);
    }
    return list;
  }, [tickets, search, statusFilter, priorityFilter]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#0D2B52]">Fila de Atendimento</h1>
        <p className="text-sm text-gray-600 mt-1">Chamados aguardando atendimento da equipe de TI</p>
      </div>
      
      <div className="bg-white border border-[#DCE3EB] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por protocolo ou título..."
              className="w-full pl-10 pr-4 py-2 border border-[#DCE3EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[#DCE3EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="Aguardando Atendimento">Aguardando Atendimento</option>
            <option value="Em Atendimento">Em Atendimento</option>
            <option value="Pendente do Solicitante">Pendente do Solicitante</option>
            <option value="Concluído">Concluído</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-[#DCE3EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
          >
            <option value="TODOS">Todas as Prioridades</option>
            <option value="P1 - Crítica">P1 - Crítica</option>
            <option value="P2 - Alta">P2 - Alta</option>
            <option value="P3 - Média">P3 - Média</option>
            <option value="P4 - Baixa">P4 - Baixa</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#DCE3EB] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA]">
              <tr>
                <th className="text-left text-sm text-gray-600 px-4 py-3 font-medium">Protocolo</th>
                <th className="text-left text-sm text-gray-600 px-4 py-3 font-medium">Título</th>
                <th className="text-left text-sm text-gray-600 px-4 py-3 font-medium">Prioridade</th>
                <th className="text-left text-sm text-gray-600 px-4 py-3 font-medium">Status</th>
                <th className="text-left text-sm text-gray-600 px-4 py-3 font-medium">Abertura</th>
                <th className="text-left text-sm text-gray-600 px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t: any) => (
                <tr key={t.id} className="border-t border-[#DCE3EB] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#1565C0]">{t.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={t.title}>{t.title}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColor[t.priority] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {priorityMap[t.priority] || t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor[t.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {statusMap[t.status] || t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(t.openedAt).toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-sm">
                    {((t.status === "NOVO" || t.status === "NA_FILA" || t.status === "AGUARDANDO_TRIAGEM" || t.status === "REABERTO") && !t.assigneeId) ? (
                      <button 
                        onClick={() => accept.mutate(t.id)} 
                        disabled={accept.isPending || finalizar.isPending}
                        className="px-3 py-1.5 bg-[#1565C0] text-white rounded-md hover:bg-[#0D2B52] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {accept.isPending ? "Aceitando..." : "Aceitar"}
                      </button>
                    ) : (t.status === "EM_ATENDIMENTO" || t.status === "ATRIBUIDO" || t.status === "AGUARDANDO_TERCEIRO") ? (
                      <button 
                        onClick={() => finalizar.mutate(t.id)} 
                        disabled={accept.isPending || finalizar.isPending}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {finalizar.isPending ? "Finalizando..." : "Finalizar"}
                      </button>
                    ) : (t.status === "RESOLVIDO" || t.status === "ENCERRADO" || t.status === "CANCELADO") ? (
                      <span className="text-xs text-gray-500">Concluído</span>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTickets.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-600">
            {(tickets || []).length === 0 ? "Nenhum chamado na fila" : "Nenhum chamado encontrado com os filtros aplicados"}
          </div>
        )}
      </div>
    </div>
  );
}

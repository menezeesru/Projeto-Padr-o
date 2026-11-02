import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { FileText, Clock, CheckCircle, User, Mail, Users, AlertCircle, Timer, PlusCircle, UserCheck, PlayCircle, CheckCheck, XCircle } from "lucide-react";

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
  ATRIBUIDO: "bg-orange-50 text-orange-700 border-orange-200",
  EM_ATENDIMENTO: "bg-orange-50 text-orange-700 border-orange-200",
  AGUARDANDO_TERCEIRO: "bg-orange-50 text-orange-700 border-orange-200",
  PENDENTE_SOLICITANTE: "bg-orange-50 text-orange-700 border-orange-200",
  AGUARDANDO_APROVACAO: "bg-orange-50 text-orange-700 border-orange-200",
  AGUARDANDO_SOLICITANTE: "bg-orange-50 text-orange-700 border-orange-200",
  RESOLVIDO: "bg-green-50 text-green-700 border-green-200",
  ENCERRADO: "bg-green-50 text-green-700 border-green-200",
  CANCELADO: "bg-red-50 text-red-700 border-red-200"
};

const actionMap: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  TICKET_CREATED: { label: "Chamado criado", icon: PlusCircle, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  TICKET_ACCEPTED: { label: "Chamado aceito", icon: UserCheck, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  TICKET_ASSIGNED: { label: "Chamado atribuído", icon: Users, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  STATUS_CHANGED: { label: "Status alterado", icon: PlayCircle, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  COMMENT_ADDED: { label: "Comentário adicionado", icon: FileText, color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
  RESOLVED: { label: "Chamado resolvido", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  CLOSED: { label: "Chamado encerrado", icon: CheckCheck, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  CANCELLED: { label: "Chamado cancelado", icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" }
};

const slaStateColor: Record<string, string> = {
  OK: "text-green-700 bg-green-50 border-green-200",
  AT_RISK: "text-yellow-700 bg-yellow-50 border-yellow-200",
  BREACHED: "text-red-700 bg-red-50 border-red-200",
  PAUSED: "text-gray-700 bg-gray-50 border-gray-200"
};

const slaStateLabel: Record<string, string> = {
  OK: "Dentro do prazo",
  AT_RISK: "Próximo do vencimento",
  BREACHED: "SLA vencido",
  PAUSED: "Pausado"
};

export default function TicketDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => (await api.get(`/api/tickets/${id}`)).data
  });

  if (isLoading) return <div className="p-4 text-sm text-gray-600">Carregando...</div>;
  if (!data) return <div className="p-4 text-sm text-gray-600">Chamado não encontrado</div>;

  const getActionInfo = (action: string) => {
    return actionMap[action] || { label: action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()), icon: Clock, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#DCE4EF] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#2563EB]">{data.number}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#1E293B] leading-tight">{data.title}</h1>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[data.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                {statusMap[data.status] || data.status}
              </span>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityColor[data.priority] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                {priorityMap[data.priority] || data.priority}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#DCE4EF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#DCE4EF]">
              <FileText size={20} className="text-[#2563EB]" />
              <h2 className="text-lg font-semibold text-[#1E293B]">Descrição</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#334155] whitespace-pre-wrap leading-relaxed">{data.description}</p>
            </div>
          </div>
          <div className="bg-white border border-[#DCE4EF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#DCE4EF]">
              <Clock size={20} className="text-[#2563EB]" />
              <h2 className="text-lg font-semibold text-[#1E293B]">Linha do Tempo</h2>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-[#DCE4EF]"></div>
                <div className="space-y-6">
                  {(data.history || []).map((h: any, idx: number) => {
                    const info = getActionInfo(h.action);
                    const Icon = info.icon;
                    return (
                      <div key={h.id} className="relative flex gap-4">
                        <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border ${info.bg} flex-shrink-0`}>
                          <Icon size={18} className={info.color} />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <p className="text-sm font-semibold text-[#1E293B]">{info.label}</p>
                            <p className="text-xs text-gray-500">{new Date(h.createdAt).toLocaleString("pt-BR")}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">{h.actor?.name}</p>
                          {h.reason && <p className="text-sm text-[#334155] mt-2 bg-[#F8FAFC] p-3 rounded-lg border border-[#DCE4EF]">{h.reason}</p>}
                          {h.toValue && h.action === "STATUS_CHANGED" && (
                            <p className="text-xs text-gray-500 mt-1">
                              De: {statusMap[h.fromValue] || h.fromValue} → Para: {statusMap[h.toValue] || h.toValue}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-[#DCE4EF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#DCE4EF]">
              <User size={20} className="text-[#2563EB]" />
              <h2 className="text-lg font-semibold text-[#1E293B]">Solicitante</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#2563EB]">{data.requester?.name?.charAt(0).toUpperCase() || "U"}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">{data.requester?.name || "-"}</p>
                </div>
              </div>
              {data.requester?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  <span>{data.requester.email}</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white border border-[#DCE4EF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#DCE4EF]">
              <Users size={20} className="text-[#2563EB]" />
              <h2 className="text-lg font-semibold text-[#1E293B]">Responsável</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#2563EB]">{data.assignee?.name?.charAt(0).toUpperCase() || "?"}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">{data.assignee?.name || "Não atribuído"}</p>
                </div>
              </div>
              {data.team && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} className="text-gray-400" />
                  <span>Equipe: {data.team.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white border border-[#DCE4EF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[#DCE4EF]">
              <Timer size={20} className="text-[#2563EB]" />
              <h2 className="text-lg font-semibold text-[#1E293B]">SLA</h2>
            </div>
            <div className="p-6 space-y-4">
              {(data.slaInstances || []).map((s: any) => (
                <div key={s.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {s.type === "FIRST_RESPONSE" ? <AlertCircle size={18} className="text-orange-500" /> : <CheckCircle size={18} className="text-green-500" />}
                    <p className="text-sm font-semibold text-[#1E293B]">{s.type === "FIRST_RESPONSE" ? "Primeira Resposta" : "Resolução"}</p>
                  </div>
                  <div className="pl-6 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Vencimento</span>
                      <span className="text-gray-700 font-medium">{s.dueAt ? new Date(s.dueAt).toLocaleString("pt-BR") : "-"}</span>
                    </div>
                    <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${slaStateColor[s.state] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {slaStateLabel[s.state] || s.state}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${s.state === "BREACHED" ? "bg-red-500" : s.state === "AT_RISK" ? "bg-yellow-500" : s.state === "OK" ? "bg-green-500" : "bg-gray-400"}`} style={{ width: s.state === "BREACHED" ? "100%" : s.state === "AT_RISK" ? "75%" : s.state === "OK" ? "40%" : "30%" }}></div>
                    </div>
                  </div>
                </div>
              ))}
              {(data.slaInstances || []).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">Sem informações de SLA</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

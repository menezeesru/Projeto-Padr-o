import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS: Record<string, string> = {
  NOVO: "#2563EB",
  NA_FILA: "#2563EB",
  AGUARDANDO_TRIAGEM: "#2563EB",
  REABERTO: "#2563EB",
  ABERTO: "#2563EB",
  ATRIBUIDO: "#F97316",
  EM_ATENDIMENTO: "#F97316",
  AGUARDANDO_TERCEIRO: "#F97316",
  PENDENTE_SOLICITANTE: "#F97316",
  AGUARDANDO_APROVACAO: "#F97316",
  AGUARDANDO_SOLICITANTE: "#F97316",
  RESOLVIDO: "#16A34A",
  ENCERRADO: "#16A34A",
  CANCELADO: "#EF4444"
};

const PRIORITY_COLORS: Record<string, string> = {
  P1_CRITICA: "#EF4444",
  P2_ALTA: "#F97316",
  P3_MEDIA: "#EAB308",
  P4_BAIXA: "#2563EB"
};

const statusLabelMap: Record<string, string> = {
  NOVO: "Aberto",
  NA_FILA: "Aberto",
  AGUARDANDO_TRIAGEM: "Aberto",
  REABERTO: "Aberto",
  ABERTO: "Aberto",
  ATRIBUIDO: "Em Atendimento",
  EM_ATENDIMENTO: "Em Atendimento",
  AGUARDANDO_TERCEIRO: "Em Atendimento",
  PENDENTE_SOLICITANTE: "Em Atendimento",
  AGUARDANDO_APROVACAO: "Em Atendimento",
  AGUARDANDO_SOLICITANTE: "Em Atendimento",
  RESOLVIDO: "Resolvido",
  ENCERRADO: "Resolvido",
  CANCELADO: "Cancelado"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const irParaFila = () => {
    navigate("/fila");
  };
  const irParaTodos = () => {
    navigate("/todos");
  };
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get("/api/dashboard")).data
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-[#DCE4EF] rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-10 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = data?.cards || {};
  const byStatusRaw = (data?.charts?.byStatus || []).map((x: any) => ({ 
    name: statusLabelMap[x.status] || x.status, 
    value: x._count._all,
    original: x.status
  }));
  
  const byStatus = byStatusRaw.reduce((acc: any[], curr: any) => {
    const existing = acc.find(item => item.name === curr.name);
    if (existing) {
      existing.value += curr.value;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);
  
  const byPriorityRaw = (data?.charts?.byPriority || []).map((x: any) => ({ 
    name: x.priority, 
    value: x._count._all 
  }));

  const cardData = [
    { title: "Total de Chamados", value: cards.total, icon: Ticket, gradient: "from-[#12346B] to-[#2563EB]", trend: "up" },
    { title: "Abertos", value: cards.abertos, icon: Clock, gradient: "from-[#2563EB] to-[#3B82F6]", trend: "up" },
    { title: "Em Atendimento", value: cards.emAtendimento, icon: Activity, gradient: "from-[#F97316] to-[#FB923C]", trend: "down" },
    { title: "Resolvidos", value: cards.resolvidos, icon: CheckCircle, gradient: "from-[#16A34A] to-[#22C55E]", trend: "up" },
    { title: "Aguardando Atendimento", value: cards.aguardandoAtendimento, icon: AlertTriangle, gradient: "from-[#EAB308] to-[#F59E0B]", trend: "down" },
    { title: "Pendentes do Solicitante", value: cards.pendentesSolicitante, icon: Users, gradient: "from-[#F59E0B] to-[#FBBF24]", trend: "up" },
    { title: "Encerrados", value: cards.encerrados, icon: Zap, gradient: "from-[#22C55E] to-[#4ADE80]", trend: "up" },
    { title: "SLA Cumprido", value: cards.slaCumpridoPct + "%", icon: TrendingUp, gradient: "from-[#2563EB] to-[#60A5FA]", trend: "up" },
  ];

  const totalStatus = byStatus.reduce((sum: number, item: any) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Dashboard Gerencial</h1>
          <p className="text-sm text-gray-600 mt-1">Visão estratégica do Service Desk</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg border border-[#DCE4EF] shadow-sm">
          <span className="text-sm text-gray-600">
            Atualizado em: {new Date().toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={index} onClick={irParaFila} className="bg-white border border-[#DCE4EF] rounded-xl p-6 group cursor-pointer relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#EFF6FF]/50 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    card.trend === "up" 
                      ? "text-green-700 bg-green-50 border-green-200" 
                      : "text-red-700 bg-red-50 border-red-200"
                  }`}>
                    <TrendIcon size={12} />
                    {(card as any).change || (card.trend === "up" ? "+5%" : "-2%")}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-[#1E293B]">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#DCE4EF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE4EF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                <PieChartIcon size={20} className="text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1E293B]">Distribuição por Status</h2>
                <p className="text-sm text-gray-600">Chamados atuais por situação</p>
              </div>
            </div>
            <button onClick={irParaTodos} className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium hover:underline transition-colors">
              Ver todos
            </button>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie 
                  data={byStatus} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={110} 
                  innerRadius={70}
                  paddingAngle={2}
                >
                  {byStatus.map((item: any, index: number) => {
                    const color = item.original ? STATUS_COLORS[item.original] : Object.values(STATUS_COLORS)[index % Object.values(STATUS_COLORS).length];
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                  <Label 
                    value={totalStatus} 
                    position="center" 
                    className="text-2xl font-bold fill-[#1E293B]"
                  />
                  <Label 
                    value="TOTAL DE CHAMADOS" 
                    position="center" 
                    dy={18}
                    className="text-[10px] font-semibold fill-[#64748B]"
                  />
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #DCE4EF', 
                    borderRadius: '10px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                  formatter={(value: any, name: any) => [`${value} chamados`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {byStatus.map((item: any, index: number) => {
                const color = item.original ? STATUS_COLORS[item.original] : Object.values(STATUS_COLORS)[index % Object.values(STATUS_COLORS).length];
                const percent = totalStatus > 0 ? ((item.value / totalStatus) * 100).toFixed(0) : 0;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-xs text-gray-700">{item.name} {percent}% ({item.value})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DCE4EF] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE4EF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1E293B]">Distribuição por Prioridade</h2>
                <p className="text-sm text-gray-600">Classificação dos chamados</p>
              </div>
            </div>
            <button onClick={irParaTodos} className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium hover:underline transition-colors">
              Ver todos
            </button>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={byPriorityRaw} margin={{ top: 25, right: 10, left: 10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#DCE4EF' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#DCE4EF' }} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #DCE4EF', 
                    borderRadius: '10px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                  formatter={(value: any) => [`${value} chamados`, 'Quantidade']}
                  labelFormatter={(label) => priorityLabel(label)}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40} label={{ position: 'top', fontSize: 11, fill: '#475569' }}>
                  {byPriorityRaw.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || "#2563EB"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function priorityLabel(p: string) {
  const map: Record<string, string> = {
    P1_CRITICA: "P1 - CRÍTICA",
    P2_ALTA: "P2 - ALTA",
    P3_MEDIA: "P3 - MÉDIA",
    P4_BAIXA: "P4 - BAIXA"
  };
  return map[p] || p;
}

import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function Sla() {
  const { data, isLoading } = useQuery({
    queryKey: ["sla"],
    queryFn: async () => (await api.get("/api/sla/instances")).data
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#0D2B52]">SLA e Escalonamentos</h1>
      <div className="bg-white border border-[#DCE3EB] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Chamado</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Tipo</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Estado</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Vencimento</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Política</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((s: any) => (
              <tr key={s.id} className="border-t border-[#DCE3EB]">
                <td className="px-4 py-3 text-sm">{s.ticket?.number}</td>
                <td className="px-4 py-3 text-sm">{s.type === "FIRST_RESPONSE" ? "Primeira Resposta" : "Resolução"}</td>
                <td className="px-4 py-3 text-sm">{s.state}</td>
                <td className="px-4 py-3 text-sm">{new Date(s.dueAt).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3 text-sm">{s.policy?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

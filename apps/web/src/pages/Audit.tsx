import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function Audit() {
  const { data, isLoading } = useQuery({
    queryKey: ["audit"],
    queryFn: async () => (await api.get("/api/audit")).data
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#0D2B52]">Auditoria</h1>
      <div className="bg-white border border-[#DCE3EB] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Data/Hora</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Usuário</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Ação</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Entidade</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((log: any) => (
              <tr key={log.id} className="border-t border-[#DCE3EB]">
                <td className="px-4 py-3 text-sm">{new Date(log.createdAt).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3 text-sm">{log.user?.name || "-"}</td>
                <td className="px-4 py-3 text-sm">{log.action}</td>
                <td className="px-4 py-3 text-sm">{log.entity}</td>
                <td className="px-4 py-3 text-sm">{log.ip || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

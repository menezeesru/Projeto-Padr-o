import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function Teams() {
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: async () => (await api.get("/api/users")).data });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#0D2B52]">Equipes e Técnicos</h1>
      <div className="bg-white border border-[#DCE3EB] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Nome</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">E-mail</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Perfis</th>
              <th className="text-left text-sm text-gray-600 px-4 py-3">Departamento</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u: any) => (
              <tr key={u.id} className="border-t border-[#DCE3EB]">
                <td className="px-4 py-3 text-sm">{u.name}</td>
                <td className="px-4 py-3 text-sm">{u.email}</td>
                <td className="px-4 py-3 text-sm">{u.userRoles?.map((r: any) => r.role.code).join(", ")}</td>
                <td className="px-4 py-3 text-sm">{u.department?.name || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

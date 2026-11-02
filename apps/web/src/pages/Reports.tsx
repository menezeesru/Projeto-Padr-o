import { FileSpreadsheet, Download } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

export default function Reports() {
  const handleExportExcel = async () => {
    try {
      const response = await api.get("/api/reports/export/excel", {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio-chamados-${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Relatório em Excel exportado com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao exportar relatório");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">Relatórios Gerenciais</h1>
        <p className="text-sm text-gray-600 mt-1">Exportação e análise de chamados</p>
      </div>
      <div className="bg-white border border-[#DCE4EF] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <FileSpreadsheet size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1E293B]">Relatório de Chamados</h2>
              <p className="text-sm text-gray-600">Exportar todos os chamados em formato Excel (.XLSX)</p>
            </div>
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#16A34A] text-white rounded-lg hover:bg-[#15803D] transition-colors font-medium shadow-sm"
          >
            <Download size={18} />
            Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );
}

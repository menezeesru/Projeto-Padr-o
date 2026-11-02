import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner";
import { 
  FileText, 
  AlertCircle, 
  Send, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  BarChart3,
  FileCheck,
  Clock
} from "lucide-react";

export default function OpenTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState("MEDIO");
  const [urgency, setUrgency] = useState("MEDIA");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const impactOptions = [
    { value: "ALTO", label: "Alto", desc: "Afeta muitos usuários ou sistemas críticos", color: "text-red-600 bg-red-50 border-red-200" },
    { value: "MEDIO", label: "Médio", desc: "Afeta um grupo ou funcionalidade importante", color: "text-orange-600 bg-orange-50 border-orange-200" },
    { value: "BAIXO", label: "Baixo", desc: "Afeta um usuário ou funcionalidade menor", color: "text-green-600 bg-green-50 border-green-200" }
  ];

  const urgencyOptions = [
    { value: "ALTA", label: "Alta", desc: "Precisa de atenção imediata", color: "text-red-600 bg-red-50 border-red-200" },
    { value: "MEDIA", label: "Média", desc: "Pode aguardar no prazo normal", color: "text-orange-600 bg-orange-50 border-orange-200" },
    { value: "BAIXA", label: "Baixa", desc: "Não urgente, pode ser agendado", color: "text-blue-600 bg-blue-50 border-blue-200" }
  ];

  const categories = [
    { value: "cat-rede", label: "Falhas de Rede/Internet" },
    { value: "cat-incidentes", label: "Incidentes de TI" },
    { value: "cat-acesso", label: "Solicitação de Acesso" },
    { value: "cat-software", label: "Instalação de Software" },
    { value: "cat-hardware", label: "Problemas de Hardware" },
    { value: "cat-email", label: "E-mail Corporativo" },
    { value: "cat-outros", label: "Outros" }
  ];

  const categoryIdMap: Record<string, string> = {
    "cat-rede": "c9ac0cee-aa55-4853-944c-4b65c7fa1c30",
    "cat-incidentes": "c9ac0cee-aa55-4853-944c-4b65c7fa1c30",
    "cat-acesso": "c9ac0cee-aa55-4853-944c-4b65c7fa1c30",
    "cat-software": "c9ac0cee-aa55-4853-944c-4b65c7fa1c30",
    "cat-hardware": "c9ac0cee-aa55-4853-944c-4b65c7fa1c30",
    "cat-email": "c9ac0cee-aa55-4853-944c-4b65c7fa1c30",
    "cat-outros": "c9ac0cee-aa55-4853-944c-4b65c7fa1c30"
  };

  const getPriorityPreview = () => {
    if (impact === "ALTO" && urgency === "ALTA") return { label: "P1 - Crítica", color: "text-red-700 bg-red-100 border-red-300" };
    if ((impact === "ALTO" && urgency === "MEDIA") || (impact === "MEDIO" && urgency === "ALTA")) return { label: "P2 - Alta", color: "text-orange-700 bg-orange-100 border-orange-300" };
    if ((impact === "BAIXO" && urgency === "ALTA") || (impact === "MEDIO" && urgency === "BAIXA")) return { label: "P3 - Média", color: "text-blue-700 bg-blue-100 border-blue-300" };
    return { label: "P4 - Baixa", color: "text-green-700 bg-green-100 border-green-300" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setLoading(true);
    try {
      const payload: any = { 
        title, 
        description, 
        impact, 
        urgency
      };
      if (categoryId && categoryId.trim() !== "") {
        payload.categoryId = categoryIdMap[categoryId] || categoryId;
      }
      const res = await api.post("/api/tickets", payload);
      toast.success(`Chamado ${res.data.number} criado com sucesso!`);
      navigate(`/chamado/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erro ao abrir chamado");
    } finally {
      setLoading(false);
    }
  };

  const priority = getPriorityPreview();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white rounded-lg border border-[#E2E8F0] transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#0D2B52]">Abrir Novo Chamado</h1>
          <p className="text-gray-600 mt-1">Descreva seu problema ou solicitação para o suporte de TI</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s, index) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                step >= s 
                  ? "bg-[#1565C0] border-[#1565C0] text-white" 
                  : "bg-white border-[#E2E8F0] text-gray-400"
              }`}>
                {step > s ? <CheckCircle2 size={20} /> : s}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${step >= s ? "text-gray-900" : "text-gray-400"}`}>
                  {s === 1 && "Informações Básicas"}
                  {s === 2 && "Impacto e Urgência"}
                  {s === 3 && "Revisão e Envio"}
                </p>
                <p className="text-xs text-gray-500">
                  {s === 1 && "Título e descrição"}
                  {s === 2 && "Classifique a solicitação"}
                  {s === 3 && "Confirme os dados"}
                </p>
              </div>
              {index < 2 && (
                <div className={`h-0.5 flex-1 mx-4 ${step > s ? "bg-[#1565C0]" : "bg-[#E2E8F0]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F1F5F9]">
              <div className="w-10 h-10 bg-[#EAF3FF] rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-[#1565C0]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Informações Básicas</h2>
                <p className="text-sm text-gray-600">Descreva claramente seu problema</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Título do Chamado <span className="text-red-500">*</span>
              </label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="input" 
                placeholder="Ex: Problema para acessar sistema X"
                required 
              />
              <p className="text-xs text-gray-500">Seja breve e objetivo</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)} 
                className="input"
              >
                <option value="">Selecione uma categoria (opcional)</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Descrição Detalhada <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={8} 
                className="input resize-none" 
                placeholder="Descreva o problema com o máximo de detalhes: quando ocorreu, passos para reproduzir, mensagens de erro, etc."
                required 
              />
              <p className="text-xs text-gray-500">{description.length} caracteres</p>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={!title || !description}
                className="btn-primary flex items-center gap-2"
              >
                Próximo
                <ArrowLeft size={16} className="rotate-180" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F1F5F9]">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Impacto e Urgência</h2>
                <p className="text-sm text-gray-600">Ajude-nos a priorizar seu chamado corretamente</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Impacto <span className="text-red-500">*</span>
                </label>
                <div className="grid gap-3">
                  {impactOptions.map(opt => (
                    <label 
                      key={opt.value}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        impact === opt.value 
                          ? opt.color 
                          : "border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="impact"
                        value={opt.value}
                        checked={impact === opt.value}
                        onChange={(e) => setImpact(e.target.value)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Urgência <span className="text-red-500">*</span>
                </label>
                <div className="grid gap-3">
                  {urgencyOptions.map(opt => (
                    <label 
                      key={opt.value}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        urgency === opt.value 
                          ? opt.color 
                          : "border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={opt.value}
                        checked={urgency === opt.value}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${priority.color}`}>
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Prioridade Calculada: {priority.label}</span>
                </div>
                <p className="text-sm mt-1 opacity-90">
                  Baseada na combinação de impacto e urgência
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
              <button 
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                Próximo
                <ArrowLeft size={16} className="rotate-180" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F1F5F9]">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revisão e Envio</h2>
                <p className="text-sm text-gray-600">Confirme os dados antes de abrir o chamado</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Título</p>
                  <p className="text-gray-900 mt-1">{title}</p>
                </div>
                {categoryId && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categoria</p>
                    <p className="text-gray-900 mt-1">{categories.find(c => c.value === categoryId)?.label}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Descrição</p>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Impacto</p>
                    <p className="text-gray-900 mt-1">{impactOptions.find(i => i.value === impact)?.label}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Urgência</p>
                    <p className="text-gray-900 mt-1">{urgencyOptions.find(u => u.value === urgency)?.label}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prioridade</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border mt-1 ${priority.color}`}>
                    {priority.label}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Após o envio</p>
                  <p className="mt-1">Seu chamado será recebido pela equipe de TI e receberá um número de protocolo único. Você poderá acompanhar o andamento na seção "Meus Chamados".</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-6"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Abrir Chamado
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

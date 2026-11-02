import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("admin@servicedesk.local");
  const [password, setPassword] = useState("Admin@123456");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data.accessToken, res.data.user);
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE] opacity-60"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0F3DCC] to-[#08237A] rounded-2xl mb-6 shadow-[0_20px_25px_-5px_rgba(15,61,204,0.4),0_8px_10px_-6px_rgba(15,61,204,0.4)]">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#08237A] mb-3">ServiceDesk Pro</h1>
          <p className="text-lg text-[#0F3DCC] font-medium">Sistema de Gestão de Chamados de TI</p>
        </div>
        
        <div className="bg-white rounded-2xl border-2 border-[#BFDBFE] shadow-[0_25px_50px_-12px_rgba(15,61,204,0.25)] overflow-hidden">
          <div className="p-6 border-b-2 border-[#BFDBFE] bg-gradient-to-r from-[#EFF6FF] to-white">
            <h2 className="text-xl font-bold text-[#08237A]">Acesse sua conta</h2>
            <p className="text-sm text-[#0F3DCC] mt-1 font-medium">Entre com suas credenciais para continuar</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#08237A]">E-mail Corporativo</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0F3DCC]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-highlight pl-11"
                  placeholder="seu.email@empresa.com.br"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#08237A]">Senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0F3DCC]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-highlight pl-11 pr-11"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0F3DCC] hover:text-[#08237A] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Autenticando...
                </div>
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>
          <div className="px-6 pb-6">
            <div className="p-4 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE]">
              <p className="text-xs font-semibold text-[#08237A] mb-2">Credenciais de Demonstração</p>
              <div className="text-xs text-[#0F3DCC] space-y-1 font-mono">
                <p><span className="font-semibold">Email:</span> admin@servicedesk.local</p>
                <p><span className="font-semibold">Senha:</span> Admin@123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

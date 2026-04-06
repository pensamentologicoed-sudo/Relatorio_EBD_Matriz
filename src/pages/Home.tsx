import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { ButtonCard } from "../components/ButtonCard";
import { BookOpen, ChevronDown, Users, UserCheck, UserPlus, ArrowRight, Book, Coins, UserCircle, Send, BarChart3, Loader2, AlertTriangle } from "lucide-react";
import { ROOMS } from "../constants";
import { supabaseService, getSupabase } from "../services/supabaseService";

export default function Home() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [enrolledTeachers, setEnrolledTeachers] = useState<string>("");
  const [presentTeachers, setPresentTeachers] = useState<string>("");
  const [enrolledStudents, setEnrolledStudents] = useState<string>("");
  const [presentStudents, setPresentStudents] = useState<string>("");
  const [visitors, setVisitors] = useState<string>("");
  const [bibles, setBibles] = useState<string>("");
  const [offer, setOffer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = !!getSupabase();

  // Calculated Fields
  const totalEnrolled = useMemo(() => {
    return (Number(enrolledTeachers) || 0) + (Number(enrolledStudents) || 0);
  }, [enrolledTeachers, enrolledStudents]);

  const totalPresent = useMemo(() => {
    return (Number(presentTeachers) || 0) + (Number(presentStudents) || 0) + (Number(visitors) || 0);
  }, [presentTeachers, presentStudents, visitors]);

  const handleSendToSupabase = async () => {
    if (!selectedYear || !selectedQuarter || !selectedLesson || !selectedRoom) return;
    
    setIsSubmitting(true);
    try {
      const year = Number(selectedYear);
      const quarterNum = Number(selectedQuarter);
      const lessonVal = selectedLesson; // Mantém como string para bater com o banco
      const lessonNum = Number(selectedLesson);

      // Get licao_id from Supabase (optional normalization)
      const licaoId = await supabaseService.getLicaoId(year, quarterNum, lessonNum);

      console.log("Enviando relatório para o Supabase:", {
        year,
        quarter: quarterNum,
        lesson: lessonVal,
        room: selectedRoom,
        licaoId
      });

      await supabaseService.saveReport({
        year,
        quarter: quarterNum,
        lesson: lessonNum,
        room_id: selectedRoom,
        teachers_enrolled: Number(enrolledTeachers) || 0,
        teachers_present: Number(presentTeachers) || 0,
        students_enrolled: Number(enrolledStudents) || 0,
        students_present: Number(presentStudents) || 0,
        visitors: Number(visitors) || 0,
        bibles: Number(bibles) || 0,
        offer: Number(offer) || 0,
      });
      alert("Dados enviados com sucesso!");
      // Reset fields after success
      setEnrolledTeachers("");
      setPresentTeachers("");
      setEnrolledStudents("");
      setPresentStudents("");
      setVisitors("");
      setBibles("");
      setOffer("");
      setSelectedRoom("");
      setSelectedLesson("");
      console.log("Campos resetados após sucesso.");
    } catch (error) {
      console.error("Erro detalhado ao enviar para o Supabase:", error);
      const message = error instanceof Error ? error.message : "Erro ao enviar dados. Verifique a configuração do Supabase.";
      alert(`Erro: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSecretaria = selectedRoom === "secretaria";

  return (
    <PageContainer title="Escola Dominical">
      <div className="space-y-8">
        <div className="relative h-48 rounded-3xl overflow-hidden bg-zinc-900">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.-Pq1Hs15M1p4t5fwvmQZ6AHaEE?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Hero"
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h2 className="text-2xl font-bold">Bem-vindo</h2>
            <p className="text-zinc-200">Acesse seus relatórios e lições trimestrais.</p>
          </div>
        </div>

        <div className="space-y-6">
          {!isConfigured && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-bold">Modo de Demonstração (Local)</p>
                <p>O Supabase não está configurado. Os dados serão salvos apenas localmente.</p>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/anos")}
              className="w-full py-3 bg-zinc-100 text-zinc-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
            >
              <BookOpen size={18} />
              Painel Administrativo
            </button>
          </div>

          <div className="space-y-4">
            {/* 0. Ano */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700 ml-1">
                0. Selecione o Ano
              </label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedQuarter("");
                    setSelectedLesson("");
                    setSelectedRoom("");
                    setEnrolledTeachers("");
                    setPresentTeachers("");
                    setEnrolledStudents("");
                    setPresentStudents("");
                    setVisitors("");
                    setBibles("");
                    setOffer("");
                  }}
                  className={`w-full p-4 pr-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all appearance-none cursor-pointer font-medium ${
                    !selectedYear ? "text-zinc-400" : "text-zinc-800"
                  }`}
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            {/* 1. Trimestre */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700 ml-1">
                1. Selecione o Trimestre
              </label>
              <div className="relative">
                <select
                  value={selectedQuarter}
                  onChange={(e) => {
                    setSelectedQuarter(e.target.value);
                    setSelectedLesson("");
                    setSelectedRoom("");
                    setEnrolledTeachers("");
                    setPresentTeachers("");
                    setEnrolledStudents("");
                    setPresentStudents("");
                    setVisitors("");
                    setBibles("");
                    setOffer("");
                  }}
                  className={`w-full p-4 pr-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all appearance-none cursor-pointer font-medium ${
                    !selectedQuarter ? "text-zinc-400" : "text-zinc-800"
                  }`}
                >
                  <option value="">Selecione o Trimestre</option>
                  <option value="1" className="text-zinc-800">1º Trimestre</option>
                  <option value="2" className="text-zinc-800">2º Trimestre</option>
                  <option value="3" className="text-zinc-800">3º Trimestre</option>
                  <option value="4" className="text-zinc-800">4º Trimestre</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            {/* 2. Lição */}
            {selectedQuarter && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-zinc-700 ml-1">
                  2. Selecione a Lição
                </label>
                <div className="relative">
                  <select
                    value={selectedLesson}
                    onChange={(e) => {
                      setSelectedLesson(e.target.value);
                      setSelectedRoom("");
                      setEnrolledTeachers("");
                      setPresentTeachers("");
                      setEnrolledStudents("");
                      setPresentStudents("");
                      setVisitors("");
                      setBibles("");
                      setOffer("");
                    }}
                    className={`w-full p-4 pr-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all appearance-none cursor-pointer font-medium ${
                      !selectedLesson ? "text-zinc-400" : "text-zinc-800"
                    }`}
                  >
                    <option value="">Selecione a Lição</option>
                    {Array.from({ length: 13 }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="text-zinc-800">
                        Lição {i + 1}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Sala */}
            {selectedLesson && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-zinc-700 ml-1">
                  3. Selecione a Sala
                </label>
                <div className="relative">
                  <select
                    value={selectedRoom}
                    onChange={(e) => {
                      setSelectedRoom(e.target.value);
                      setEnrolledTeachers("");
                      setPresentTeachers("");
                      setEnrolledStudents("");
                      setPresentStudents("");
                      setVisitors("");
                      setBibles("");
                      setOffer("");
                    }}
                    className={`w-full p-4 pr-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all appearance-none cursor-pointer font-medium ${
                      !selectedRoom ? "text-zinc-400" : "text-zinc-800"
                    }`}
                  >
                    <option value="">Selecione a Sala</option>
                    {ROOMS.map((room) => (
                      <option key={room.id} value={room.id} className="text-zinc-800">
                        {room.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <Users size={20} />
                  </div>
                </div>
              </div>
            )}

            {/* Campos Condicionais */}
            {selectedRoom && (
              <>
                {/* 3. Dirigentes / Professores Matriculados */}
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-zinc-700 ml-1">
                    4. Quantidade de {isSecretaria ? "Dirigentes" : "Professores"} Matriculados
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={enrolledTeachers}
                      onChange={(e) => setEnrolledTeachers(e.target.value)}
                      placeholder="Ex: 5"
                      className="w-full p-4 pl-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 font-medium"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                      <UserPlus size={20} />
                    </div>
                  </div>
                </div>

                {/* 4. Dirigentes / Professores Presentes */}
                {enrolledTeachers && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-zinc-700 ml-1">
                      5. Quantidade de {isSecretaria ? "Dirigentes" : "Professores"} Presentes
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={presentTeachers}
                        onChange={(e) => setPresentTeachers(e.target.value)}
                        placeholder="Ex: 4"
                        className="w-full p-4 pl-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 font-medium"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <UserCheck size={20} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Secretários / Alunos Matriculados */}
                {presentTeachers && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-zinc-700 ml-1">
                      6. Quantidade de {isSecretaria ? "Secretários" : "Alunos"} Matriculados
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={enrolledStudents}
                        onChange={(e) => setEnrolledStudents(e.target.value)}
                        placeholder="Ex: 20"
                        className="w-full p-4 pl-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 font-medium"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <Users size={20} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Secretários / Alunos Presentes */}
                {enrolledStudents && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-zinc-700 ml-1">
                      7. Quantidade de {isSecretaria ? "Secretários" : "Alunos"} Presentes
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={presentStudents}
                        onChange={(e) => setPresentStudents(e.target.value)}
                        placeholder="Ex: 15"
                        className="w-full p-4 pl-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 font-medium"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <UserCheck size={20} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Visitantes (Oculto para Secretaria) */}
                {presentStudents && !isSecretaria && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-zinc-700 ml-1">
                      8. Quantidade de Visitantes
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={visitors}
                        onChange={(e) => setVisitors(e.target.value)}
                        placeholder="Ex: 2"
                        className="w-full p-4 pl-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 font-medium"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <UserCircle size={20} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. Bíblias (Aparece após Alunos Presentes para Secretaria, ou após Visitantes para outros) */}
                {((isSecretaria && presentStudents) || (!isSecretaria && visitors)) && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-zinc-700 ml-1">
                      {isSecretaria ? "8" : "9"}. Quantidade de Bíblias
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={bibles}
                        onChange={(e) => setBibles(e.target.value)}
                        placeholder="Ex: 12"
                        className="w-full p-4 pl-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 font-medium"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <Book size={20} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. Ofertas (Oculto para Secretaria) */}
                {bibles && !isSecretaria && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-zinc-700 ml-1">
                      10. Quantidade de Ofertas (R$)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        placeholder="Ex: 50.00"
                        className="w-full p-4 pl-12 bg-white rounded-2xl border border-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 font-medium"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <Coins size={20} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Resumo de Cálculos */}
                {((isSecretaria && bibles) || (!isSecretaria && offer)) && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Total Matriculados</p>
                      <p className="text-2xl font-bold text-zinc-900">{totalEnrolled}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">({isSecretaria ? "Dirig. + Secr." : "Prof. + Alunos"})</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Total Presentes</p>
                      <p className="text-2xl font-bold text-zinc-900">{totalPresent}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">({isSecretaria ? "Dirig. + Secr." : "Prof. + Alunos + Visit."})</p>
                    </div>
                  </div>
                )}

                {/* Botões de Ação */}
                {((isSecretaria && bibles) || (!isSecretaria && offer)) && (
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleSendToSupabase}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Send size={20} />
                      )}
                      Enviar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

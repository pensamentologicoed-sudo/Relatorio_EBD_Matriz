"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { FileText, Save, CheckCircle2, Users, UserCheck, UserPlus, Book, Coins, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getRoomName } from "../constants";
import { supabaseService, ReportData } from "../services/supabaseService";

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [year, quarter, lesson, sala] = id?.split("-") || [];

  const [content, setContent] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 🔥 Buscar licao_id correto
        const licao_id = await supabaseService.getLicaoId(
          Number(year),
          Number(quarter),
          Number(lesson)
        );

        // 🔥 Buscar relatório correto
        const reports = await supabaseService.getReportsByLesson(
          Number(year),
          Number(quarter),
          Number(lesson)
        );

        const current = reports.find(r => r.room_id === sala);

        if (current) {
          setReportData(current);
        }

      } catch (error) {
        console.error("Erro ao buscar relatório:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (year && quarter && lesson && sala) {
      fetchData();
    }
  }, [year, quarter, lesson, sala]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await supabaseService.saveReport({
        year: Number(year),
        quarter: Number(quarter),
        lesson: Number(lesson),
        room_id: sala,

        teachers_enrolled: reportData?.teachers_enrolled || 0,
        teachers_present: reportData?.teachers_present || 0,
        students_enrolled: reportData?.students_enrolled || 0,
        students_present: reportData?.students_present || 0,
        visitors: reportData?.visitors || 0,
        bibles: reportData?.bibles || 0,
        offer: reportData?.offer || 0
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar no Supabase");
    } finally {
      setIsSaving(false);
    }
  };

  const StatItem = ({ icon: Icon, label, value, colorClass }: any) => (
    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('400', '100')} ${colorClass}`}>
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-zinc-600">{label}</span>
      </div>
      <span className="text-lg font-bold text-zinc-900">{value}</span>
    </div>
  );

  return (
    <PageContainer 
      title={`Relatório - ${getRoomName(sala)}`} 
      showBack 
      onBack={() => navigate(`/trimestres/${year}-${quarter}-${lesson}`)}
    >
      <div className="space-y-6 pb-10">

        {/* DADOS NUMÉRICOS */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-zinc-500 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Dados Numéricos</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-zinc-400" />
            </div>
          ) : reportData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <StatItem icon={UserCheck} label="Professores Presentes" value={reportData.teachers_present} colorClass="text-blue-400" />
              <StatItem icon={UserPlus} label="Alunos Presentes" value={reportData.students_present} colorClass="text-purple-400" />
              <StatItem icon={Users} label="Visitantes" value={reportData.visitors} colorClass="text-zinc-400" />
              <StatItem icon={Book} label="Bíblias" value={reportData.bibles} colorClass="text-amber-400" />
              <StatItem icon={Coins} label="Oferta" value={`R$ ${reportData.offer?.toFixed(2) || "0.00"}`} colorClass="text-emerald-400" />

              <div className="md:col-span-2 mt-2 p-4 bg-zinc-900 rounded-2xl flex justify-between items-center text-white">
                <span className="font-bold">TOTAL GERAL</span>
                <span className="text-2xl font-black">
                  {(reportData.teachers_present || 0) + (reportData.students_present || 0) + (reportData.visitors || 0)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-zinc-400 border-2 border-dashed border-zinc-100 rounded-2xl">
              Nenhum dado enviado ainda.
            </div>
          )}
        </div>

        {/* OBSERVAÇÕES */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-500">
              <FileText size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">Observações</span>
            </div>

            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-emerald-600 text-sm font-medium"
                >
                  <CheckCircle2 size={16} />
                  Salvo!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 bg-zinc-50 rounded-2xl border border-zinc-100"
            placeholder="Digite observações..."
          />

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 bg-zinc-900 text-white"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20}/>Salvar</>}
          </button>

        </div>
      </div>
    </PageContainer>
  );
}
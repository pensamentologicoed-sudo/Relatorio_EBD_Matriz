import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { useEffect, useState, useMemo } from "react";
import { ROOMS } from "../constants";
import { supabaseService, ReportData, getSupabase } from "../services/supabaseService";
import { Loader2, AlertTriangle, FileText, RefreshCcw } from "lucide-react";

export default function Rooms() {
  const { id } = useParams(); // year-quarter-lesson
  const navigate = useNavigate();
  const [year, quarter, lesson] = id?.split("-") || [];
  
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = !!getSupabase();

  const fetchLessonReports = async () => {
    setIsLoading(true);
    try {
      console.log(`Buscando relatórios para o trimestre ${quarter} de ${year}, lição ${lesson}...`);
      const lessonReports = await supabaseService.getReportsByLesson(Number(year), Number(quarter), Number(lesson));
      console.log(`Relatórios da lição ${lesson}:`, lessonReports);
      setReports(lessonReports);
    } catch (error) {
      console.error("Erro ao buscar relatórios da lição:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonReports();
  }, [year, quarter, lesson]);

  const totals = useMemo(() => {
    return reports.reduce(
      (acc, report) => {
        const tEnrolled = report.teachers_enrolled + report.students_enrolled;
        const tPresent = report.teachers_present + report.students_present + report.visitors;
        
        return {
          teachers_enrolled: acc.teachers_enrolled + report.teachers_enrolled,
          teachers_present: acc.teachers_present + report.teachers_present,
          students_enrolled: acc.students_enrolled + report.students_enrolled,
          students_present: acc.students_present + report.students_present,
          visitors: acc.visitors + report.visitors,
          bibles: acc.bibles + report.bibles,
          offer: acc.offer + report.offer,
          total_enrolled: acc.total_enrolled + tEnrolled,
          total_present: acc.total_present + tPresent,
        };
      },
      {
        teachers_enrolled: 0,
        teachers_present: 0,
        students_enrolled: 0,
        students_present: 0,
        visitors: 0,
        bibles: 0,
        offer: 0,
        total_enrolled: 0,
        total_present: 0,
      }
    );
  }, [reports]);

  const highlights = useMemo(() => {
    if (reports.length === 0) return null;

    const findMaxRooms = (field: keyof ReportData | "total_present") => {
      const maxVal = reports.reduce((max, r) => {
        let val = 0;
        if (field === "total_present") {
          val = (r.teachers_present || 0) + (r.students_present || 0) + (r.visitors || 0);
        } else {
          val = Number(r[field]) || 0;
        }
        return val > max ? val : max;
      }, 0);

      if (maxVal === 0) return [];

      return reports
        .filter(r => {
          if (field === "total_present") {
            return ((r.teachers_present || 0) + (r.students_present || 0) + (r.visitors || 0)) === maxVal;
          }
          return (Number(r[field]) || 0) === maxVal;
        })
        .map(r => ROOMS.find(room => room.id === r.room_id)?.name || r.room_id);
    };

    return {
      maxPresent: findMaxRooms("total_present"),
      maxVisitors: findMaxRooms("visitors"),
      maxBibles: findMaxRooms("bibles"),
      maxOffer: findMaxRooms("offer"),
    };
  }, [reports]);

  return (
    <PageContainer 
      title={`Relatório - Lição ${lesson}`} 
      showBack 
      onBack={() => navigate(`/trimestre/${year}-${quarter}`)}
    >
      <div className="space-y-6 pb-10">
        {!isConfigured && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-800">
            <AlertTriangle className="shrink-0" size={20} />
            <p className="text-sm">Modo de Demonstração: Dados locais apenas.</p>
          </div>
        )}

        <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-zinc-800">Consolidado da Lição</h3>
              <button 
                onClick={fetchLessonReports}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                title="Atualizar dados"
              >
                <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
            <span className="text-[10px] bg-zinc-900 text-white px-2 py-1 rounded-full font-bold uppercase">
              {quarter}º Trim. {year}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                  <th className="p-3 border-b border-zinc-100">Sala</th>
                  <th className="p-3 border-b border-zinc-100 text-center">Matr.</th>
                  <th className="p-3 border-b border-zinc-100 text-center">Pres.</th>
                  <th className="p-3 border-b border-zinc-100 text-center">Visit.</th>
                  <th className="p-3 border-b border-zinc-100 text-center">Bíb.</th>
                  <th className="p-3 border-b border-zinc-100 text-right">Oferta</th>
                  <th className="p-3 border-b border-zinc-100 text-center">Responsável</th>
                  <th className="p-3 border-b border-zinc-100 text-center font-black text-zinc-900">Total</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <Loader2 className="animate-spin mx-auto text-zinc-400" />
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-zinc-400 italic">
                      Nenhum relatório enviado para esta lição ainda.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => {
                    const roomName = ROOMS.find(r => r.id === report.room_id)?.name || report.room_id;
                    const presPA = (report.teachers_present || 0) + (report.students_present || 0);
                    const tEnrolled = (report.teachers_enrolled || 0) + (report.students_enrolled || 0);
                    const tPresent = presPA + (report.visitors || 0);
                    
                    return (
                      <tr 
                        key={report.room_id} 
                        className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/licao/${id}-${report.room_id}`)}
                      >
                        <td className="p-3 font-medium text-zinc-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-zinc-900 transition-colors" />
                          {roomName}
                          <FileText size={12} className="opacity-0 group-hover:opacity-40 transition-opacity ml-auto" />
                        </td>
                        <td className="p-3 text-center text-zinc-600">{tEnrolled}</td>
                        <td className="p-3 text-center text-zinc-600">{presPA}</td>
                        <td className="p-3 text-center text-zinc-600">{report.visitors}</td>
                        <td className="p-3 text-center text-zinc-600">{report.bibles}</td>
                        <td className="p-3 text-right text-emerald-600 font-medium">R$ {report.offer?.toFixed(2) || "0.00"}</td>
                        <td className="p-3 text-center text-zinc-500 italic truncate max-w-[80px]">{report.filled_by || "-"}</td>
                        <td className="p-3 text-center text-zinc-900 font-bold bg-zinc-50/30">{tPresent}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {!isLoading && reports.length > 0 && (
                <tfoot>
                  <tr className="bg-zinc-900 text-white font-bold">
                    <td className="p-3 text-[10px] uppercase leading-tight">
                      <div className="flex flex-col">
                        <span className="opacity-50 font-medium">Totais</span>
                        <span>TOTAL</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50 font-medium uppercase">Matriculados</span>
                        <span className="text-sm">{totals.total_enrolled}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50 font-medium uppercase">Presentes</span>
                        <span className="text-sm">{totals.teachers_present + totals.students_present}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50 font-medium uppercase">Visitantes</span>
                        <span className="text-sm">{totals.visitors}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50 font-medium uppercase">Bíblia</span>
                        <span className="text-sm">{totals.bibles}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50 font-medium uppercase">Ofertas</span>
                        <span className="text-sm">R$ {totals.offer.toFixed(0)}</span>
                      </div>
                    </td>
                    <td className="p-3"></td>
                    <td className="p-3 text-center text-emerald-400">
                      <div className="flex flex-col">
                        <span className="text-[8px] opacity-50 font-medium uppercase">Total Geral</span>
                        <span className="text-sm">{totals.total_present}</span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 text-center italic">
          * Clique em uma sala para ver as notas e observações detalhadas.
        </p>

        {!isLoading && reports.length > 0 && highlights && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[
              { label: "Presentes", rooms: highlights.maxPresent, color: "text-blue-400" },
              { label: "Visitantes", rooms: highlights.maxVisitors, color: "text-purple-400" },
              { label: "Bíblias", rooms: highlights.maxBibles, color: "text-amber-400" },
              { label: "Ofertas", rooms: highlights.maxOffer, color: "text-emerald-400" },
            ].map((item, idx) => (
              <div key={idx} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-xl flex flex-col gap-1 h-full">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Classe com mais</span>
                <span className={`text-[10px] font-black uppercase ${item.color}`}>{item.label}</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.rooms.length > 0 ? (
                    item.rooms.map((name, i) => (
                      <div key={i} className="py-1 px-2 bg-white/10 rounded-lg text-white font-bold text-[10px]">
                        {name}
                      </div>
                    ))
                  ) : (
                    <span className="text-[10px] text-zinc-600 italic">Nenhuma</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

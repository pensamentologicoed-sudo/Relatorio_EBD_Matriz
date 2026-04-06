// ⚠️ STORAGE LOCAL (FALLBACK / OFFLINE)
// Mantém o mesmo padrão do Supabase

export interface LocalReportData {
  year: number;
  quarter: number;
  lesson: number;
  room_id: string;

  teachers_enrolled: number;
  teachers_present: number;
  students_enrolled: number;
  students_present: number;

  visitors: number;
  bibles: number;
  offer: number;

  updated_at: string;
}

const STORAGE_KEY = "escola_sabatina_reports_v2";

const generateKey = (data: {
  year: number;
  quarter: number;
  lesson: number;
  room_id: string;
}) => {
  return `${data.year}-${data.quarter}-${data.lesson}-${data.room_id}`;
};

export const storageService = {

  // =========================
  // PEGAR TODOS
  // =========================
  getReports: (): Record<string, LocalReportData> => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  // =========================
  // PEGAR UM
  // =========================
  getReport: (
    year: number,
    quarter: number,
    lesson: number,
    room_id: string
  ): LocalReportData | null => {
    const reports = storageService.getReports();
    const key = generateKey({ year, quarter, lesson, room_id });
    return reports[key] || null;
  },

  // =========================
  // SALVAR
  // =========================
  saveReport: (data: Omit<LocalReportData, "updated_at">): void => {
    const reports = storageService.getReports();
    const key = generateKey(data);

    reports[key] = {
      ...data,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  // =========================
  // DELETAR
  // =========================
  deleteReport: (
    year: number,
    quarter: number,
    lesson: number,
    room_id: string
  ): void => {
    const reports = storageService.getReports();
    const key = generateKey({ year, quarter, lesson, room_id });

    delete reports[key];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  // =========================
  // LIMPAR TUDO
  // =========================
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
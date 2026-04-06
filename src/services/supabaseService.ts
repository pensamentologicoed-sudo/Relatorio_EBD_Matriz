import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

// =========================
// CONEXÃO
// =========================
export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("❌ Variáveis do Supabase não configuradas.");
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// =========================
// TIPAGEM
// =========================
export interface ReportData {
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
  filled_by: string;
}

// =========================
// SERVICE
// =========================
export const supabaseService = {

  // =========================
  // BUSCAR OU CRIAR LICAO_ID
  // =========================
  async getLicaoId(year: number, quarter: number, lesson: number): Promise<number> {
    const supabase = getSupabase();

    // 1. Tentar buscar trimestre
    let { data: trimestre, error: tError } = await supabase
      .from("trimestres")
      .select("id")
      .eq("ano", year)
      .eq("numero", quarter)
      .maybeSingle();

    // 2. Se não existe trimestre, cria
    if (!trimestre) {
      console.log(`✨ Criando novo trimestre: ${quarter}º de ${year}`);
      const { data: newTrimestre, error: createTError } = await supabase
        .from("trimestres")
        .insert([{ ano: year, numero: quarter }])
        .select()
        .single();

      if (createTError || !newTrimestre) {
        throw new Error("❌ Erro ao criar trimestre no banco.");
      }
      trimestre = newTrimestre;
    }

    // 3. Tentar buscar lição
    let { data: licao, error: lError } = await supabase
      .from("licoes")
      .select("id")
      .eq("trimestre_id", trimestre.id)
      .eq("numero", lesson)
      .maybeSingle();

    // 4. Se não existe lição, cria
    if (!licao) {
      console.log(`✨ Criando nova lição: ${lesson} do trimestre ${trimestre.id}`);
      const { data: newLicao, error: createLError } = await supabase
        .from("licoes")
        .insert([{ trimestre_id: trimestre.id, numero: lesson }])
        .select()
        .single();

      if (createLError || !newLicao) {
        throw new Error("❌ Erro ao criar lição no banco.");
      }
      licao = newLicao;
    }

    return licao.id;
  },

  // =========================
  // SALVAR RELATÓRIO
  // =========================
  async saveReport(data: ReportData) {
    const supabase = getSupabase();

    try {
      // 🔥 1. Converter para licao_id
      const licao_id = await this.getLicaoId(
        data.year,
        data.quarter,
        data.lesson
      );

      // 🔥 2. Montar payload correto
      const payload = {
        licao_id,
        room_id: data.room_id,

        teachers_enrolled: data.teachers_enrolled,
        teachers_present: data.teachers_present,
        students_enrolled: data.students_enrolled,
        students_present: data.students_present,

        visitors: data.visitors,
        bibles: data.bibles,
        offer: data.offer,
        filled_by: data.filled_by
      };

      console.log("📤 Enviando para Supabase:", payload);

      // 🔥 3. UPSERT (resolve insert + update)
      const { error } = await supabase
        .from("reports")
        .upsert(payload, {
          onConflict: "licao_id,room_id"
        });

      if (error) throw error;

      console.log("✅ Relatório salvo com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao salvar relatório:", error);
      throw error;
    }
  },

  // =========================
  // BUSCAR RELATÓRIOS POR TRIMESTRE
  // =========================
  async getReportsByQuarter(year: number, quarter: number) {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("reports")
      .select(`
        *,
        licoes (
          numero,
          trimestres (
            numero,
            ano
          )
        )
      `)
      .eq("licoes.trimestres.ano", year)
      .eq("licoes.trimestres.numero", quarter)
      .order("room_id", { ascending: true });

    if (error) {
      console.error("❌ Erro ao buscar relatórios:", error);
      throw error;
    }

    return data;
  },

  // =========================
  // BUSCAR RELATÓRIOS POR LIÇÃO
  // =========================
  async getReportsByLesson(year: number, quarter: number, lesson: number) {
    const supabase = getSupabase();

    const licao_id = await this.getLicaoId(year, quarter, lesson);

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("licao_id", licao_id)
      .order("room_id", { ascending: true });

    if (error) {
      console.error("❌ Erro ao buscar relatórios da lição:", error);
      throw error;
    }

    return data;
  },

  // =========================
  // DELETAR RELATÓRIO
  // =========================
  async deleteReport(year: number, quarter: number, lesson: number, room_id: string) {
    const supabase = getSupabase();

    const licao_id = await this.getLicaoId(year, quarter, lesson);

    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("licao_id", licao_id)
      .eq("room_id", room_id);

    if (error) {
      console.error("❌ Erro ao deletar:", error);
      throw error;
    }

    console.log("🗑️ Relatório deletado");
  }
};
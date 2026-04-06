-- =========================
-- TABELA: TRIMESTRES
-- =========================
CREATE TABLE IF NOT EXISTS trimestres (
  id SERIAL PRIMARY KEY,
  numero INTEGER NOT NULL CHECK (numero BETWEEN 1 AND 4),
  ano INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (numero, ano)
);

-- =========================
-- TABELA: LICOES
-- =========================
CREATE TABLE IF NOT EXISTS licoes (
  id SERIAL PRIMARY KEY,
  numero INTEGER NOT NULL CHECK (numero BETWEEN 1 AND 13),
  trimestre_id INTEGER NOT NULL REFERENCES trimestres(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (numero, trimestre_id)
);

-- =========================
-- TABELA: REPORTS (RELATORIOS)
-- =========================
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  licao_id INTEGER NOT NULL REFERENCES licoes(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  
  teachers_enrolled INTEGER DEFAULT 0,
  teachers_present INTEGER DEFAULT 0,
  students_enrolled INTEGER DEFAULT 0,
  students_present INTEGER DEFAULT 0,
  visitors INTEGER DEFAULT 0,
  bibles INTEGER DEFAULT 0,
  offer DECIMAL(10,2) DEFAULT 0,
  total_enrolled INTEGER DEFAULT 0,
  total_present INTEGER DEFAULT 0,
  
  -- Garante que não haja duplicatas para a mesma sala na mesma lição
  UNIQUE(licao_id, room_id)
);

-- Habilitar RLS (Segurança)
ALTER TABLE trimestres ENABLE ROW LEVEL SECURITY;
ALTER TABLE licoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (Público para simplificar como solicitado anteriormente)
CREATE POLICY "Allow public insert trimestres" ON trimestres FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select trimestres" ON trimestres FOR SELECT USING (true);

CREATE POLICY "Allow public insert licoes" ON licoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select licoes" ON licoes FOR SELECT USING (true);

CREATE POLICY "Allow public insert reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Allow public update reports" ON reports FOR UPDATE USING (true);

-- Inserir trimestres para 2026 como exemplo
INSERT INTO trimestres (numero, ano) VALUES
(1, 2026),
(2, 2026),
(3, 2026),
(4, 2026)
ON CONFLICT DO NOTHING;

-- Inserir lições para os trimestres de 2026
DO $$
DECLARE
    t_id INTEGER;
BEGIN
    FOR t_id IN SELECT id FROM trimestres WHERE ano = 2026 LOOP
        FOR l IN 1..13 LOOP
            INSERT INTO licoes (numero, trimestre_id) 
            VALUES (l, t_id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

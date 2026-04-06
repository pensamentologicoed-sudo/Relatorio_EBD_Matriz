export const ROOMS = [
  { id: "secretaria", name: "Sala Secretaria" },
  { id: "01", name: "Sala 01 - Pré-Adolescente" },
  { id: "02", name: "Sala 02" },
  { id: "03", name: "Sala 03" },
  { id: "04", name: "Sala 04" },
  { id: "05", name: "Sala 05" },
  { id: "06", name: "Sala 06" },
  { id: "07", name: "Sala 07" },
  { id: "08", name: "Sala 08" },
  { id: "09", name: "Sala 09 - Proati Feminino" },
  { id: "10", name: "Sala 10" },
  { id: "11", name: "Sala 11" },
  { id: "12", name: "Sala 12" },
  { id: "13", name: "Sala 13" },
  { id: "14", name: "Sala 14" },
  { id: "15", name: "Sala 15 - Adolescente" },
  { id: "16", name: "Sala 16 - Maternal" },
  { id: "17", name: "Sala 17 - Jardim da Infância" },
  { id: "18", name: "Sala 18 - Primários" },
  { id: "19", name: "Sala 19 - Juniores" },
  { id: "20", name: "Sala 20 - Proati Masculino" },
];

export const getRoomName = (id: string) => {
  return ROOMS.find(r => r.id === id)?.name || `Sala ${id}`;
};

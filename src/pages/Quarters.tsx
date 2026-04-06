import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { ButtonCard } from "../components/ButtonCard";
import { LayoutGrid } from "lucide-react";

export default function Quarters() {
  const { year } = useParams();
  const navigate = useNavigate();
  const quarters = [1, 2, 3, 4];

  return (
    <PageContainer title={`Trimestres - ${year}`} showBack onBack={() => navigate("/anos")}>
      <div className="grid gap-4">
        {quarters.map((q) => (
          <ButtonCard
            key={q}
            title={`${q}º Trimestre`}
            icon={LayoutGrid}
            onClick={() => navigate(`/trimestre/${year}-${q}`)}
          />
        ))}
      </div>
    </PageContainer>
  );
}

import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { ButtonCard } from "../components/ButtonCard";
import { Calendar } from "lucide-react";

export default function Years() {
  const navigate = useNavigate();
  const years = [2026, 2027, 2028, 2029, 2030];

  return (
    <PageContainer title="Anos" showBack onBack={() => navigate("/")}>
      <div className="grid gap-4">
        {years.map((year) => (
          <ButtonCard
            key={year}
            title={year.toString()}
            icon={Calendar}
            onClick={() => navigate(`/anos/${year}`)}
          />
        ))}
      </div>
    </PageContainer>
  );
}

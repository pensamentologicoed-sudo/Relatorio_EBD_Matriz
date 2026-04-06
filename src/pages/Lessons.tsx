import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { ButtonCard } from "../components/ButtonCard";
import { Book, CheckCircle2 } from "lucide-react";
import { storageService } from "../services/storageService";
import { useEffect, useState } from "react";
import { getRoomName } from "../constants";

export default function Lessons() {
  const { id } = useParams(); // year-quarter
  const navigate = useNavigate();
  const [year, quarter] = id?.split("-") || [];
  const [savedReports, setSavedReports] = useState<Record<string, any>>({});
  
  useEffect(() => {
    setSavedReports(storageService.getReports());
  }, []);

  const lessons = Array.from({ length: 13 }, (_, i) => {
    const lessonId = i + 1;
    const fullId = `${id}-${lessonId}`;
    
    return {
      id: lessonId,
      fullId,
      title: `Lição ${lessonId}`,
      description: "Estudo da semana",
    };
  });

  return (
    <PageContainer 
      title={`${quarter}º Trim. ${year}`} 
      showBack 
      onBack={() => navigate(`/anos/${year}`)}
    >
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <ButtonCard
            key={lesson.id}
            title={lesson.title}
            subtitle={lesson.description}
            icon={Book}
            onClick={() => navigate(`/trimestres/${lesson.fullId}`)}
          />
        ))}
      </div>
    </PageContainer>
  );
}

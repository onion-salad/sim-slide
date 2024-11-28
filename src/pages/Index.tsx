import { useState, useEffect } from "react";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import { Presentation, createEmptyPresentation } from "@/lib/presentation";
import { loadPresentation } from "@/components/presentation/utils/presentationStorage";

const Index = () => {
  const [presentation, setPresentation] = useState<Presentation>(
    createEmptyPresentation()
  );

  useEffect(() => {
    const savedPresentation = loadPresentation();
    if (savedPresentation) {
      setPresentation(savedPresentation);
    }
  }, []);

  return (
    <div className="h-screen">
      <PresentationEditor
        presentation={presentation}
        onUpdate={setPresentation}
      />
    </div>
  );
};

export default Index;
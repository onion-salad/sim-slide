import { useState } from "react";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import { Presentation, createEmptyPresentation } from "@/lib/presentation";

const Index = () => {
  const [presentation, setPresentation] = useState<Presentation>(
    createEmptyPresentation()
  );

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
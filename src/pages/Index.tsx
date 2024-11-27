import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import { Presentation, createEmptyPresentation } from "@/lib/presentation";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const Index = () => {
  const queryClient = useQueryClient();

  const { data: presentation } = useQuery({
    queryKey: ["presentation"],
    queryFn: () => {
      return createEmptyPresentation();
    },
    initialData: createEmptyPresentation,
  });

  const { mutate: updatePresentation } = useMutation({
    mutationFn: async (newPresentation: Presentation) => {
      return newPresentation;
    },
    onSuccess: (newPresentation) => {
      queryClient.setQueryData(["presentation"], newPresentation);
    },
  });

  const handleRefresh = () => {
    queryClient.setQueryData(["presentation"], createEmptyPresentation());
    queryClient.removeQueries();
  };

  return (
    <div className="h-screen">
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleRefresh}
          title="スライドをリセット"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <PresentationEditor
        presentation={presentation}
        onUpdate={updatePresentation}
      />
    </div>
  );
};

export default Index;
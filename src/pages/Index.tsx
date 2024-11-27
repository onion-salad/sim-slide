import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import { Presentation, createEmptyPresentation } from "@/lib/presentation";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play } from "lucide-react";

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
      <PresentationEditor
        presentation={presentation}
        onUpdate={updatePresentation}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default Index;
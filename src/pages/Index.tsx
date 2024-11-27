import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PresentationEditor from "@/components/presentation/PresentationEditor";
import { Presentation, createEmptyPresentation } from "@/lib/presentation";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
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
      toast({
        title: "保存しました",
        description: "プレゼンテーションの変更が保存されました",
      });
    },
  });

  return (
    <div className="h-screen">
      <PresentationEditor
        presentation={presentation}
        onUpdate={updatePresentation}
      />
    </div>
  );
};

export default Index;
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TextEditor from "./TextEditor";

interface Step {
  subtitle: string;
  text: string;
}

interface StepEditorProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}

const StepEditor = ({ steps, onChange }: StepEditorProps) => {
  const { toast } = useToast();

  const handleStepChange = (index: number, field: string, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };
    onChange(updatedSteps);
  };

  const handleAddStep = () => {
    if (steps.length >= 3) {
      toast({
        title: "ステップ数制限",
        description: "ステップは最大3つまでです",
        variant: "destructive",
      });
      return;
    }
    onChange([...steps, { subtitle: "", text: "" }]);
  };

  const handleRemoveStep = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    onChange(updatedSteps);
  };

  return (
    <div className="space-y-4">
      <Accordion type="multiple" collapsible className="w-full">
        {steps.map((step, index) => (
          <AccordionItem key={index} value={`step-${index}`}>
            <div className="flex items-center">
              <AccordionTrigger className="flex-1">
                {step.subtitle || `ステップ ${index + 1}`}
              </AccordionTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleRemoveStep(index, e)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <AccordionContent>
              <div onClick={(e) => e.stopPropagation()}>
                <TextEditor
                  subtitle={step.subtitle}
                  text={step.text}
                  onChange={(field, value) => handleStepChange(index, field, value)}
                  showSubtitle={true}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button 
        onClick={handleAddStep} 
        variant="outline" 
        className="w-full"
        disabled={steps.length >= 3}
      >
        <Plus className="w-4 h-4 mr-2" />
        ステップを追加
      </Button>
    </div>
  );
};

export default StepEditor;
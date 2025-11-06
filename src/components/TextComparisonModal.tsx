import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface TextComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  typedText: string;
  wpm: number;
  accuracy: number;
}

export const TextComparisonModal = ({
  open,
  onOpenChange,
  originalText,
  typedText,
  wpm,
  accuracy,
}: TextComparisonModalProps) => {
  const getCharClass = (index: number) => {
    if (index >= typedText.length) return 'text-muted-foreground bg-muted/30';
    return typedText[index] === originalText[index] 
      ? 'text-primary bg-primary/10' 
      : 'text-destructive bg-destructive/10';
  };

  const errorCount = originalText.split('').filter((char, i) => typedText[i] !== char).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            Test Details
            <div className="flex gap-2">
              <Badge variant="outline">{wpm} WPM</Badge>
              <Badge variant="outline">{accuracy}% Accuracy</Badge>
              <Badge variant="destructive">{errorCount} Errors</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                Original Text
              </h3>
              <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm leading-relaxed">
                {originalText}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                Your Typing (with error highlighting)
              </h3>
              <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm leading-relaxed">
                {originalText.split('').map((char, index) => (
                  <span 
                    key={index} 
                    className={`${getCharClass(index)} px-0.5 rounded`}
                  >
                    {typedText[index] || char}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>✓ Green = Correct</p>
              <p>✗ Red = Incorrect</p>
              <p>Gray = Not typed</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

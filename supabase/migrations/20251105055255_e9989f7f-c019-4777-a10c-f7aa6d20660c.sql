-- Create typing_results table to store test results
CREATE TABLE public.typing_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wpm DECIMAL(5,2) NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  time_taken INTEGER NOT NULL,
  text_length INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.typing_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own results" 
ON public.typing_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own results" 
ON public.typing_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own results" 
ON public.typing_results 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance on user queries
CREATE INDEX idx_typing_results_user_id_created ON public.typing_results(user_id, created_at DESC);
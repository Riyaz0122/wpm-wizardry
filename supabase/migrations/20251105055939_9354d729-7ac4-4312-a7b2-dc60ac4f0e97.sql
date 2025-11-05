-- Add difficulty column to typing_results table
ALTER TABLE public.typing_results 
ADD COLUMN difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard'));
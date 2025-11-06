-- Add columns to store original and typed text
ALTER TABLE typing_results
ADD COLUMN original_text TEXT NOT NULL DEFAULT '',
ADD COLUMN typed_text TEXT NOT NULL DEFAULT '';
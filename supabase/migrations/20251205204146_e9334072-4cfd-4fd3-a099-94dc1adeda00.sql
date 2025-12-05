-- Add policies for admin operations (using service role or public for simplicity)
-- In production, you'd want proper admin authentication

CREATE POLICY "Allow all operations for payment accounts management" 
ON public.payment_accounts 
FOR ALL 
USING (true)
WITH CHECK (true);
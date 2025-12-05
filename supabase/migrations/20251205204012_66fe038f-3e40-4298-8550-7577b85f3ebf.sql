-- Create payment_accounts table
CREATE TABLE public.payment_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Building2',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_accounts ENABLE ROW LEVEL SECURITY;

-- Allow public read access (payment accounts are public info)
CREATE POLICY "Anyone can view active payment accounts" 
ON public.payment_accounts 
FOR SELECT 
USING (is_active = true);

-- Insert default payment accounts
INSERT INTO public.payment_accounts (bank_name, account_number, account_name, icon_name, display_order) VALUES
('SMARTCASH PSB', '0014272262', 'MAMUDA ABDULLAHI', 'Building2', 1),
('PALMPAY', '9014699586', 'EMMANUEL PHILIP', 'Wallet', 2),
('OPAY', '9014699586', 'EMMANUEL PHILIP', 'Smartphone', 3),
('MONIEPOINT', '9014699586', 'EMMANUEL PHILIP', 'Banknote', 4),
('KUDA', '9014699586', 'EMMANUEL PHILIP', 'CreditCard', 5);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_payment_accounts_updated_at
BEFORE UPDATE ON public.payment_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
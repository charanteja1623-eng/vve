-- Create the enquiries table
CREATE TABLE public.enquiries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    location text NOT NULL,
    event_type text NOT NULL,
    event_date date,
    budget text,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'new',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Note on Security: 
-- We are not adding an insert policy for public/anon roles here.
-- The API route uses a Service Role Key (kept exclusively on the server) 
-- to bypass RLS for inserts. This ensures no public endpoint can query 
-- or insert into this table directly via the Supabase client without going
-- through our Next.js API route where we enforce server-side validation, 
-- rate limiting, and honeypot checks.

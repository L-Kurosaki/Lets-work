/*
  # PieceJob Database Schema

  1. New Tables
    - `profiles` - User profile information extending auth.users
    - `jobs` - Job postings with location and requirements
    - `bids` - Provider bids on jobs
    - `messages` - Communication between users
    - `providers` - Provider-specific information
    - `reviews` - Job completion reviews
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Performance
    - Add indexes for common queries
    - Implement updated_at triggers
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  coordinates POINT,
  is_provider BOOLEAN DEFAULT false,
  avatar_url TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates POINT,
  budget TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[],
  urgency TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'posted',
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  provider_id UUID REFERENCES auth.users(id),
  estimated_duration INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  completed_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id) NOT NULL,
  provider_name TEXT NOT NULL,
  provider_avatar TEXT,
  amount TEXT NOT NULL,
  message TEXT NOT NULL,
  estimated_duration INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) NOT NULL,
  job_id UUID REFERENCES public.jobs(id),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Providers table
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  specialty TEXT,
  location TEXT,
  coordinates POINT,
  hourly_rate TEXT,
  completed_jobs INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  badges TEXT[],
  description TEXT,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id),
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_avatar TEXT,
  reviewee_id UUID REFERENCES auth.users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for jobs
CREATE POLICY "Anyone can view jobs" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Users can create jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Job owners can update jobs" ON public.jobs
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = provider_id);

-- RLS Policies for bids
CREATE POLICY "Anyone can view bids" ON public.bids
  FOR SELECT USING (true);

CREATE POLICY "Providers can create bids" ON public.bids
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Bid owners can update bids" ON public.bids
  FOR UPDATE USING (auth.uid() = provider_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- RLS Policies for providers
CREATE POLICY "Anyone can view providers" ON public.providers
  FOR SELECT USING (true);

CREATE POLICY "Providers can update own profile" ON public.providers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Providers can insert own profile" ON public.providers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON public.jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_provider_id ON public.jobs(provider_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_bids_job_id ON public.bids(job_id);
CREATE INDEX IF NOT EXISTS idx_bids_provider_id ON public.bids(provider_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON public.bids(status);

CREATE INDEX IF NOT EXISTS idx_messages_job_id ON public.messages(job_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_jobs_updated_at') THEN
        CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bids_updated_at') THEN
        CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON public.bids
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_providers_updated_at') THEN
        CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
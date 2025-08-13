-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create polls table
CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poll options table
CREATE TABLE public.poll_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  poll_option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  voter_ip TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, voter_ip, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Polls policies
CREATE POLICY "Anyone can view active polls" 
ON public.polls 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can view their own polls" 
ON public.polls 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own polls" 
ON public.polls 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own polls" 
ON public.polls 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polls" 
ON public.polls 
FOR DELETE 
USING (auth.uid() = user_id);

-- Poll options policies
CREATE POLICY "Anyone can view poll options for active polls" 
ON public.poll_options 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.polls 
  WHERE polls.id = poll_options.poll_id 
  AND polls.is_active = true
));

CREATE POLICY "Users can view options for their own polls" 
ON public.poll_options 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.polls 
  WHERE polls.id = poll_options.poll_id 
  AND polls.user_id = auth.uid()
));

CREATE POLICY "Users can create options for their own polls" 
ON public.poll_options 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.polls 
  WHERE polls.id = poll_options.poll_id 
  AND polls.user_id = auth.uid()
));

CREATE POLICY "Users can update options for their own polls" 
ON public.poll_options 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.polls 
  WHERE polls.id = poll_options.poll_id 
  AND polls.user_id = auth.uid()
));

CREATE POLICY "Users can delete options for their own polls" 
ON public.poll_options 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.polls 
  WHERE polls.id = poll_options.poll_id 
  AND polls.user_id = auth.uid()
));

-- Votes policies
CREATE POLICY "Anyone can view votes for active polls" 
ON public.votes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.polls 
  WHERE polls.id = votes.poll_id 
  AND polls.is_active = true
));

CREATE POLICY "Anyone can vote on active polls" 
ON public.votes 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.polls 
  WHERE polls.id = votes.poll_id 
  AND polls.is_active = true
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON public.polls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for votes to see live results
ALTER TABLE public.votes REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.votes;
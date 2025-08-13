-- Security Fix: Restrict vote data access and create secure aggregation

-- First, drop the existing insecure vote policies
DROP POLICY IF EXISTS "Anyone can view votes for active polls" ON public.votes;

-- Create secure vote policies - only poll owners can see detailed vote data
CREATE POLICY "Poll owners can view their poll votes" 
ON public.votes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.polls 
  WHERE polls.id = votes.poll_id 
  AND polls.user_id = auth.uid()
));

-- Keep the insert policy for voting (but make it more secure)
DROP POLICY IF EXISTS "Anyone can vote on active polls" ON public.votes;

CREATE POLICY "Authenticated users can vote on active polls" 
ON public.votes 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.polls 
    WHERE polls.id = votes.poll_id 
    AND polls.is_active = true
  )
);

-- Create a secure function to get vote counts without exposing individual votes
CREATE OR REPLACE FUNCTION public.get_poll_vote_counts(poll_id_param UUID)
RETURNS TABLE(option_id UUID, option_text TEXT, vote_count BIGINT, option_order INTEGER)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    po.id as option_id,
    po.option_text,
    COALESCE(v.vote_count, 0) as vote_count,
    po.option_order
  FROM public.poll_options po
  LEFT JOIN (
    SELECT 
      poll_option_id, 
      COUNT(*) as vote_count
    FROM public.votes 
    WHERE poll_id = poll_id_param
    GROUP BY poll_option_id
  ) v ON po.id = v.poll_option_id
  WHERE po.poll_id = poll_id_param
  ORDER BY po.option_order;
$$;

-- Create a function to get total vote count for a poll
CREATE OR REPLACE FUNCTION public.get_poll_total_votes(poll_id_param UUID)
RETURNS BIGINT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COUNT(*)::BIGINT
  FROM public.votes 
  WHERE poll_id = poll_id_param;
$$;

-- Create a function to check if current user has voted on a poll
CREATE OR REPLACE FUNCTION public.has_user_voted(poll_id_param UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM public.votes 
    WHERE poll_id = poll_id_param 
    AND user_id = auth.uid()
  );
$$;

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION public.get_poll_vote_counts(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_poll_total_votes(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_user_voted(UUID) TO anon, authenticated;
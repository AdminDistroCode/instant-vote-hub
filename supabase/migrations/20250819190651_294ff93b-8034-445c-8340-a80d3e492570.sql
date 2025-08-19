-- Remove voter_ip column to protect voter privacy
-- This column contains sensitive data that could be harvested by poll owners
-- The application doesn't use this field, so removing it is safe

ALTER TABLE public.votes DROP COLUMN voter_ip;
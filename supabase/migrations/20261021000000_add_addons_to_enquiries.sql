-- ==============================================================================
-- Migration: Add multi-select add-ons support to public.enquiries
-- Timestamp: 20261021000000
-- ==============================================================================
-- Non-destructive schema migration preserving all existing records.
-- Adds an array column to store multiple selected add-on service identifiers
-- (e.g. 'catering', 'decoration', 'tent-house').

ALTER TABLE public.enquiries
ADD COLUMN IF NOT EXISTS addons text[] DEFAULT '{}'::text[];

COMMENT ON COLUMN public.enquiries.addons IS 'Array of selected add-on service identifiers requested in the consultation enquiry.';

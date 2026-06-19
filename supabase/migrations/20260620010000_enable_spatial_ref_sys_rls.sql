ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'spatial_ref_sys'
      AND policyname = 'spatial_ref_sys_read'
  ) THEN
    CREATE POLICY spatial_ref_sys_read
      ON public.spatial_ref_sys
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END
$$;

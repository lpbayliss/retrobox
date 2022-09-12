-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE OR REPLACE FUNCTION public.create_user_profile()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
AS $BODY$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$BODY$;

ALTER FUNCTION public.create_user_profile()
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.create_user_profile() TO authenticated;

GRANT EXECUTE ON FUNCTION public.create_user_profile() TO postgres;

GRANT EXECUTE ON FUNCTION public.create_user_profile() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_user_profile() TO anon;

GRANT EXECUTE ON FUNCTION public.create_user_profile() TO service_role;

ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS website;

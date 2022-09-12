CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACHH ROW EXECUTE PROCEDURE public.create_user_profile();
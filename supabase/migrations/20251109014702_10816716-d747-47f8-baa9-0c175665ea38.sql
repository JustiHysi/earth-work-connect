-- Update the handle_new_user function to also insert a default role into user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Create impact stats
  INSERT INTO public.impact_stats (user_id)
  VALUES (NEW.id);
  
  -- Insert default role (volunteer) into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'volunteer'::app_role);
  
  RETURN NEW;
END;
$function$;
-- ============================================
-- MIGRACIÓN COMPLETA - SISTEMA LEGAL
-- ============================================

-- 1. TIPOS ENUM
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'lawyer', 'client');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'case_status') THEN
    CREATE TYPE public.case_status AS ENUM ('new', 'in_progress', 'pending_review', 'closed', 'archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_status') THEN
    CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read', 'failed');
  END IF;
END
$$;

-- 2. FUNCIONES
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

-- 3. TABLAS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status case_status DEFAULT 'new',
  client_id UUID REFERENCES auth.users(id),
  lawyer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  attendees JSONB DEFAULT '[]'::jsonb,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.n8n_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT NOT NULL UNIQUE,
  chat_id TEXT NOT NULL,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  message_content TEXT,
  message_type TEXT DEFAULT 'text',
  status message_status DEFAULT 'sent',
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS RLS
-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- User Roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Cases
DROP POLICY IF EXISTS "Users can view their own cases" ON public.cases;
CREATE POLICY "Users can view their own cases"
ON public.cases FOR SELECT
USING (
  auth.uid() = client_id OR 
  auth.uid() = lawyer_id OR 
  has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Lawyers and admins can create cases" ON public.cases;
CREATE POLICY "Lawyers and admins can create cases"
ON public.cases FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Lawyers and admins can update cases" ON public.cases;
CREATE POLICY "Lawyers and admins can update cases"
ON public.cases FOR UPDATE
USING (
  auth.uid() = lawyer_id OR 
  has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Admins can delete cases" ON public.cases;
CREATE POLICY "Admins can delete cases"
ON public.cases FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Contacts
DROP POLICY IF EXISTS "Users can view all contacts" ON public.contacts;
CREATE POLICY "Users can view all contacts"
ON public.contacts FOR SELECT
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Lawyers and admins can manage contacts" ON public.contacts;
CREATE POLICY "Lawyers and admins can manage contacts"
ON public.contacts FOR ALL
USING (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);

-- Documents
DROP POLICY IF EXISTS "Users can view documents from their cases" ON public.documents;
CREATE POLICY "Users can view documents from their cases"
ON public.documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = documents.case_id
    AND (
      cases.client_id = auth.uid() OR
      cases.lawyer_id = auth.uid() OR
      has_role(auth.uid(), 'admin')
    )
  )
);

DROP POLICY IF EXISTS "Lawyers and admins can upload documents" ON public.documents;
CREATE POLICY "Lawyers and admins can upload documents"
ON public.documents FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);

-- Calendar Events
DROP POLICY IF EXISTS "Users can view events they're involved in" ON public.calendar_events;
CREATE POLICY "Users can view events they're involved in"
ON public.calendar_events FOR SELECT
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = calendar_events.case_id
    AND (
      cases.client_id = auth.uid() OR
      cases.lawyer_id = auth.uid()
    )
  ) OR
  has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Lawyers and admins can manage events" ON public.calendar_events;
CREATE POLICY "Lawyers and admins can manage events"
ON public.calendar_events FOR ALL
USING (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);

-- N8N Webhooks
DROP POLICY IF EXISTS "Admins can manage webhooks" ON public.n8n_webhooks;
CREATE POLICY "Admins can manage webhooks"
ON public.n8n_webhooks FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- WhatsApp Messages
DROP POLICY IF EXISTS "Lawyers and admins can view all messages" ON public.whatsapp_messages;
CREATE POLICY "Lawyers and admins can view all messages"
ON public.whatsapp_messages FOR SELECT
USING (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Clients can view their messages" ON public.whatsapp_messages;
CREATE POLICY "Clients can view their messages"
ON public.whatsapp_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = whatsapp_messages.case_id
    AND cases.client_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "System can insert messages" ON public.whatsapp_messages;
CREATE POLICY "System can insert messages"
ON public.whatsapp_messages FOR INSERT
WITH CHECK (TRUE);

-- 6. TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cases_updated_at ON public.cases;
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON public.calendar_events;
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_n8n_webhooks_updated_at ON public.n8n_webhooks;
CREATE TRIGGER update_n8n_webhooks_updated_at
  BEFORE UPDATE ON public.n8n_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_whatsapp_messages_updated_at ON public.whatsapp_messages;
CREATE TRIGGER update_whatsapp_messages_updated_at
  BEFORE UPDATE ON public.whatsapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


# Migración de Base de Datos - Sistema Legal

Este documento contiene todos los scripts SQL necesarios para crear la base de datos completa del sistema.

## Orden de Ejecución

Ejecuta los scripts en el siguiente orden:

1. Tipos Enum
2. Funciones
3. Tablas
4. Políticas RLS
5. Triggers
6. Datos Iniciales

---

## 1. TIPOS ENUM

```sql
-- Tipo de rol de usuario
CREATE TYPE public.app_role AS ENUM ('admin', 'lawyer', 'client');

-- Estado del caso
CREATE TYPE public.case_status AS ENUM ('new', 'in_progress', 'on_hold', 'resolved', 'closed');

-- Estado del mensaje
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read', 'failed');
```

---

## 2. FUNCIONES

### Función para actualizar updated_at

```sql
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
```

### Función para verificar roles

```sql
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
```

### Función para manejar nuevos usuarios

```sql
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
  
  -- Asignar rol por defecto como cliente
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;
```

---

## 3. TABLAS

### Tabla: profiles

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Tabla: user_roles

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### Tabla: cases

```sql
CREATE TABLE public.cases (
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

-- Habilitar RLS
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
```

### Tabla: contacts

```sql
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
```

### Tabla: documents

```sql
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
```

### Tabla: calendar_events

```sql
CREATE TABLE public.calendar_events (
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

-- Habilitar RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
```

### Tabla: n8n_webhooks

```sql
CREATE TABLE public.n8n_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.n8n_webhooks ENABLE ROW LEVEL SECURITY;
```

### Tabla: whatsapp_messages

```sql
CREATE TABLE public.whatsapp_messages (
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

-- Habilitar RLS
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
```

---

## 4. POLÍTICAS RLS

### Políticas para profiles

```sql
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);
```

### Políticas para user_roles

```sql
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'));
```

### Políticas para cases

```sql
CREATE POLICY "Users can view their own cases"
ON public.cases FOR SELECT
USING (
  auth.uid() = client_id OR 
  auth.uid() = lawyer_id OR 
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Lawyers and admins can create cases"
ON public.cases FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Lawyers and admins can update cases"
ON public.cases FOR UPDATE
USING (
  auth.uid() = lawyer_id OR 
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete cases"
ON public.cases FOR DELETE
USING (has_role(auth.uid(), 'admin'));
```

### Políticas para contacts

```sql
CREATE POLICY "Users can view all contacts"
ON public.contacts FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Lawyers and admins can manage contacts"
ON public.contacts FOR ALL
USING (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);
```

### Políticas para documents

```sql
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

CREATE POLICY "Lawyers and admins can upload documents"
ON public.documents FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);
```

### Políticas para calendar_events

```sql
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

CREATE POLICY "Lawyers and admins can manage events"
ON public.calendar_events FOR ALL
USING (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);
```

### Políticas para n8n_webhooks

```sql
CREATE POLICY "Admins can manage webhooks"
ON public.n8n_webhooks FOR ALL
USING (has_role(auth.uid(), 'admin'));
```

### Políticas para whatsapp_messages

```sql
CREATE POLICY "Lawyers and admins can view all messages"
ON public.whatsapp_messages FOR SELECT
USING (
  has_role(auth.uid(), 'lawyer') OR 
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Clients can view their messages"
ON public.whatsapp_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = whatsapp_messages.case_id
    AND cases.client_id = auth.uid()
  )
);

CREATE POLICY "System can insert messages"
ON public.whatsapp_messages FOR INSERT
WITH CHECK (TRUE);
```

---

## 5. TRIGGERS

### Trigger para auth.users

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Triggers para updated_at

```sql
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_n8n_webhooks_updated_at
  BEFORE UPDATE ON public.n8n_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_messages_updated_at
  BEFORE UPDATE ON public.whatsapp_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 6. DATOS INICIALES (OPCIONAL)

### Crear usuario administrador

```sql
-- Primero crea el usuario en Supabase Auth UI o mediante API
-- Luego ejecuta esto con el UUID del usuario creado:

INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DEL_USUARIO_ADMIN', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Webhooks de ejemplo

```sql
INSERT INTO public.n8n_webhooks (name, description, webhook_url, is_active)
VALUES 
  ('n8n_rag_query_webhook', 'Webhook para consultas RAG', 'https://tu-n8n-instance.com/webhook/rag-query', true),
  ('upload_to_drive', 'Webhook para subir archivos a Google Drive', 'https://tu-n8n-instance.com/webhook/upload-drive', true),
  ('whatsapp_messages', 'Webhook para recibir mensajes de WhatsApp', 'https://tu-n8n-instance.com/webhook/whatsapp', true)
ON CONFLICT DO NOTHING;
```

---

## Verificación

Después de ejecutar todos los scripts, verifica:

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

-- AI Assistants and Conversations Schema v2
-- Extracted for Production Repo (Vite/Supabase JS)

-- Enum for Agent Types
DO $$ BEGIN
    CREATE TYPE public.ai_agent_role AS ENUM (
      'vana',
      'builder',
      'mechanic',
      'travel',
      'marketplace',
      'emergency',
      'support'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AI Conversational Logic
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  initial_agent_role public.ai_agent_role NOT NULL,
  current_agent_role public.ai_agent_role NOT NULL,
  title TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Messages
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'assistant', 'system')),
  agent_role public.ai_agent_role,
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Tasks (Created by agents when they can't answer or for support)
CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE SET NULL,
  agent_role public.ai_agent_role NOT NULL,
  task_type TEXT NOT NULL, 
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Issue Reports (Broken links, site errors)
CREATE TABLE IF NOT EXISTS public.ai_issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'ignored')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_issue_reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage messages in their conversations" ON public.ai_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- Admin read-only access for operational tables
CREATE POLICY "Admins can read all AI tasks" ON public.ai_tasks
  FOR SELECT USING (auth.jwt() ->> 'email' = 'darrin@vanciety.com'); 

CREATE POLICY "Admins can update AI tasks" ON public.ai_tasks
  FOR UPDATE USING (auth.jwt() ->> 'email' = 'darrin@vanciety.com');

CREATE POLICY "Admins can read all AI reports" ON public.ai_issue_reports
  FOR SELECT USING (auth.jwt() ->> 'email' = 'darrin@vanciety.com');

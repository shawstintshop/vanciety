-- Private messaging system
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id),
  title VARCHAR(255),
  is_group BOOLEAN DEFAULT false,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE conversation_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(conversation_id, user_id)
);

-- Private messages
CREATE TABLE private_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- text, image, location, event_invite
  attachment_url TEXT,
  reply_to_message_id INTEGER REFERENCES private_messages(id),
  is_read BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message read receipts
CREATE TABLE message_read_receipts (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES private_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Indexes
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_private_messages_conversation ON private_messages(conversation_id, created_at);
CREATE INDEX idx_private_messages_sender ON private_messages(sender_id);
CREATE INDEX idx_message_receipts_message ON message_read_receipts(message_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Users can view conversations they participate in" ON conversations
  FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_participants.conversation_id = conversations.id AND conversation_participants.user_id = auth.uid()));
  
CREATE POLICY "Authenticated users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for participants
CREATE POLICY "Users can view participants of their conversations" ON conversation_participants
  FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid()));
  
CREATE POLICY "Users can add participants to conversations they created" ON conversation_participants
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_participants.conversation_id AND conversations.created_by = auth.uid()));

-- Policies for messages
CREATE POLICY "Users can view messages from their conversations" ON private_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_participants.conversation_id = private_messages.conversation_id AND conversation_participants.user_id = auth.uid()));
  
CREATE POLICY "Users can send messages to conversations they participate in" ON private_messages
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_participants.conversation_id = private_messages.conversation_id AND conversation_participants.user_id = auth.uid()));
  
CREATE POLICY "Users can update their own messages" ON private_messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Policies for read receipts
CREATE POLICY "Users can view read receipts for their conversations" ON message_read_receipts
  FOR SELECT USING (EXISTS (SELECT 1 FROM private_messages pm JOIN conversation_participants cp ON pm.conversation_id = cp.conversation_id WHERE pm.id = message_read_receipts.message_id AND cp.user_id = auth.uid()));
  
CREATE POLICY "Users can mark messages as read" ON message_read_receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Create table for chatbot conversations and learning
CREATE TABLE chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  message text NOT NULL,
  response text NOT NULL,
  feedback integer CHECK (feedback BETWEEN 1 AND 5),
  helpful boolean,
  created_at timestamp with time zone DEFAULT now(),
  context jsonb -- Store conversation context
);

-- Create table for chatbot learning patterns
CREATE TABLE chatbot_learning (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_pattern text NOT NULL,
  successful_response text NOT NULL,
  success_count integer DEFAULT 1,
  average_rating numeric DEFAULT 0,
  last_used timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for faster pattern matching
CREATE INDEX idx_chatbot_learning_pattern ON chatbot_learning(query_pattern);
CREATE INDEX idx_conversations_session ON chatbot_conversations(session_id);
CREATE INDEX idx_conversations_user ON chatbot_conversations(user_id);

-- Enable RLS
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_learning ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view their own conversations"
ON chatbot_conversations FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own conversations"
ON chatbot_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own conversations"
ON chatbot_conversations FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS policies for learning patterns (read-only for users)
CREATE POLICY "Everyone can view learning patterns"
ON chatbot_learning FOR SELECT
USING (true);

CREATE POLICY "System can manage learning patterns"
ON chatbot_learning FOR ALL
USING (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));
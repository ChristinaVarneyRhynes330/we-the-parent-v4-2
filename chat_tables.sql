-- Create the chat_threads table
CREATE TABLE chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Create the chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES chat_threads(id),
    content TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

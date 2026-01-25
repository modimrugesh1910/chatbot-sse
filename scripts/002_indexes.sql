CREATE INDEX idx_messages_conversation
ON messages(conversation_id);

CREATE INDEX idx_embeddings_vector
ON message_embeddings
USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_users_email
ON users(email);
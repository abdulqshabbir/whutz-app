-- Custom SQL migration file, put you code below! --
ALTER TABLE userFriends ADD COLUMN acceptedFriendRequest BOOLEAN NOT NULL CHECK (acceptedFriendRequest IN (0, 1)) DEFAULT 0; 
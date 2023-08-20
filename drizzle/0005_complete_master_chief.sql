-- Custom SQL migration file, put you code below! --
CREATE TABLE IF NOT EXISTS userFriends(
  userId TEXT NOT NULL,
  friendId TEXT NOT NULL,
  channelId TEXT NOT NULL,
  PRIMARY KEY (userId, friendId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (friendId) REFERENCES users(id),
  FOREIGN KEY (channelId) REFERENCES channels(id)
);

DROP TABLE messages;
CREATE TABLE `messages` (
  `id` integer PRIMARY KEY NOT NULL,
  `sender` text NOT NULL,
  `reciever` text NOT NULL,
  `channel` text NOT NULL,
  `type` text NOT NULL,
  `content` text NOT NULL,
  `timestamp` integer NOT NULL default (unixepoch()),
  FOREIGN KEY (sender) REFERENCES users(id),
  FOREIGN KEY (reciever) REFERENCES users(id),
  FOREIGN KEY (channel) REFERENCES channels(id)
);

DROP TABLE channels;

CREATE TABLE `channels` (
  `id` TEXT PRIMARY KEY NOT NULL
);
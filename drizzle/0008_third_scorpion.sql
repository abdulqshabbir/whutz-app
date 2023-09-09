-- Custom SQL migration file, put you code below! --

DROP TABLE messages_temp;

CREATE TABLE `messages_temp` (
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

INSERT INTO messages_temp SELECT * FROM messages;

DROP TABLE `messages`;

CREATE TABLE `messages` (
  `id` integer PRIMARY KEY NOT NULL,
  `sender` text NOT NULL,
  `reciever` text NOT NULL,
  `channel` text NOT NULL,
  `type` text NOT NULL,
  `content` text NOT NULL,
  `timestamp` integer NOT NULL default (unixepoch()),
  `replyToId` integer,
  FOREIGN KEY (sender) REFERENCES users(id),
  FOREIGN KEY (reciever) REFERENCES users(id),
  FOREIGN KEY (channel) REFERENCES channels(id),
  FOREIGN KEY (replyToId) REFERENCES messages(id)
);

INSERT INTO messages(`id`, `sender`, `reciever`, `channel`, `type`, `content`, `timestamp`) SELECT `id`, `sender`, `reciever`, `channel`, `type`, `content`, `timestamp` from messages_temp;

DROP TABLE messages_temp;
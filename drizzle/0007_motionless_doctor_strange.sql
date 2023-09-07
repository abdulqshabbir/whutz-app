-- Custom SQL migration file, put you code below! --
CREATE TABLE IF NOT EXISTS `messageEmojies` (
  messageId integer not null,
  emoji TEXT NOT NULL CHECK (`emoji` in ('thumbs_up','tears_of_joy','cool','fear','eyes_heart')),
  PRIMARY KEY (messageId, emoji),
  FOREIGN KEY (messageId) REFERENCES messages(id) on update no action on delete cascade
);
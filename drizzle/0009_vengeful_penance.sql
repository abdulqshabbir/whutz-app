-- Custom SQL migration file, put you code below! --
CREATE TABLE friendRequests(
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  senderEmail TEXT NOT NULL,
  receiverEmail TEXT NOT NULL,
  status TEXT CHECK(status in ('pending', 'accepted', 'rejected'))
);

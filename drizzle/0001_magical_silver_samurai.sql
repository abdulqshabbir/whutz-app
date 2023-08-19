DROP TABLE `messages`;

CREATE TABLE `messages` (
`id` integer PRIMARY KEY NOT NULL,
`sender` text NOT NULL,
`reciever` text NOT NULL,
`channel` integer NOT NULL,
`type` text NOT NULL,
`content` text NOT NULL,
`timestamp` numeric DEFAULT (CURRENT_TIMESTAMP)
);
-- Custom SQL migration file, put you code below! --
CREATE TABLE IF NOT EXISTS `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`firstUserEmail` text NOT NULL,
	`secondUserEmail` text NOT NULL
);
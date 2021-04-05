BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "answer" (
	"attempt_index"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	"question_index"	INTEGER NOT NULL,
	"quiz_id"	INTEGER NOT NULL,
	"content"	TEXT NOT NULL,
	"correct"	INTEGER NOT NULL,
	PRIMARY KEY("user_id","question_index","quiz_id","attempt_index"),
	FOREIGN KEY("question_index") REFERENCES "question"("index") ON DELETE CASCADE,
	FOREIGN KEY("quiz_id") REFERENCES "question"("quiz_id") ON DELETE CASCADE,
	FOREIGN KEY("user_id") REFERENCES "attempt"("user_id") ON DELETE CASCADE,
	FOREIGN KEY("attempt_index") REFERENCES "attempt"("index") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "attempt" (
	"index"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	"quiz_id"	INTEGER NOT NULL,
	"started"	INTEGER NOT NULL UNIQUE,
	"ended"	INTEGER NOT NULL UNIQUE,
	PRIMARY KEY("index","user_id","quiz_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
	FOREIGN KEY("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "topic" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"title"	TEXT NOT NULL UNIQUE,
	"description"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "quiz" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"title"	TEXT NOT NULL UNIQUE,
	"topic_id"	INTEGER NOT NULL,
	FOREIGN KEY("topic_id") REFERENCES "topic"("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "user" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"login"	BLOB
);
CREATE TABLE IF NOT EXISTS "question" (
	"index"	INTEGER NOT NULL,
	"title"	TEXT NOT NULL UNIQUE,
	"statement"	TEXT NOT NULL UNIQUE,
	"answer"	TEXT NOT NULL,
	"type"	TEXT NOT NULL,
	"quiz_id"	INTEGER NOT NULL,
	FOREIGN KEY("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE,
	PRIMARY KEY("index","quiz_id")
);
COMMIT;

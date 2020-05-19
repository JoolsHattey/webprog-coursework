BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "response" (
	"uid"	TEXT,
	"quiz_id"	INTEGER,
	PRIMARY KEY("uid"),
	FOREIGN KEY("quiz_id") REFERENCES "quiz"("uid")
);
CREATE TABLE IF NOT EXISTS "quiz" (
	"uid"	TEXT,
	PRIMARY KEY("uid")
);
COMMIT;

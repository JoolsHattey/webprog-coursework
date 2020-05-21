-- Up

CREATE TABLE IF NOT EXISTS "response" (
	"uid"	    TEXT,
	"quiz_id"	INTEGER,
	"questions" TEXT,
	PRIMARY KEY("uid"),
	FOREIGN KEY("quiz_id") REFERENCES "quiz"("uid")
);
CREATE TABLE IF NOT EXISTS "quiz" (
	"uid"	    TEXT,
	"name"	    TEXT,
	"options"	TEXT,
	"questions"	TEXT,
	"savetime"	TEXT,
	PRIMARY KEY("uid")
);

-- INSERT INTO "quiz" (uid) VALUES ('yeetyettyetyetyet');

-- Down

DROP TABLE "responses"
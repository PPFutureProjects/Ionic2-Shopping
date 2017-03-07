export let versions = [
              {
           	   version: 2,
           	   changes: [
           	             {sql: "ALTER TABLE ifsp ADD COLUMN rate30 DOUBLE;", params: []},
           	             {sql: "ALTER TABLE ifsp ADD COLUMN rate60 DOUBLE;", params: []}
           	   ]
              },
              {
           	   version: 4,
           	   changes: [
           	             {sql: "ALTER TABLE ifsp ADD COLUMN gapCount integer;", params: []}
           	   ]
              },
              {
           	   version: 5,
           	   changes: [
           	             {sql: "ALTER TABLE user_table ADD COLUMN gapCount integer;", params: []}
           	   ]
              },
              {
           	   version: 6,
           	   changes: [
           	             {sql: "ALTER TABLE ifsp ADD COLUMN makeupCount integer", params: []}
           	   ]
              },
              {
           	   version: 8,
           	   changes: [
           	             {sql: "ALTER TABLE sn_history ADD COLUMN absentCardId integer", params: []},
           	             {sql: "ALTER TABLE sn_history ADD COLUMN cardId integer", params: []},
           	             {sql: "ALTER TABLE sn_history ADD COLUMN appSessionId integer", params: []}
           	   ]
              },
              {
           	   version: 10,
           	   changes: [
           	             {sql: "ALTER TABLE session_note ADD COLUMN signedRelationshipOther string", params: []}
           	   ]
              },
              {
           	   version: 12,
           	   changes: [
           	             {sql: "ALTER TABLE session_note ADD COLUMN sessionCode integer", params: []}
           	   ]
              },
              {
           	   version: 14,
           	   changes: [
           	             {sql: "ALTER TABLE makeup_dates ADD COLUMN ifspId integer", params: []}
           	   ]
              },
              {
           	   version: 16,
           	   changes: [
           	             {sql: "drop TABLE user_table", params: []},
						 {sql: "CREATE TABLE IF NOT EXISTS user_table (userId integer  PRIMARY KEY,username text,pass text,employeeId integer,insertedAt Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,lastLoggedIn integer,lastTimeDataLoaded integer,week integer default 99)", params: []}
           	   ]
              },
              {
           	   version: 18,
           	   changes: [
           	             {sql: "ALTER TABLE employees ADD COLUMN rate30 double", params: []},
           	             {sql: "ALTER TABLE employees ADD COLUMN rate60 double", params: []},
           	             {sql: "ALTER TABLE employees ADD COLUMN rate_ABA double", params: []},
           	             {sql: "ALTER TABLE sn_history ADD COLUMN rate double", params: []}
           	   ]
              }

    ]

	// {name:'absentCardId',     type:'integer'},
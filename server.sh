#!/bin/bash

db_path=./db/finance.db

if test -f "$db_path"; then
    export IS_DB_EXISTS="true"
else
    export IS_DB_EXISTS="false"
fi

export DB_NAME=../db/finance.db
export SERVER_PORT=3000

cd server
npm run start

# Test Database Data Seeding Tool

**This in an internal dev databse seeding tool.**

> Important!: PostgreSQL must be seeded before Redis as Redis seeding uses data from postgreSQL.

### Important pointers for postgreSQL database
- Make sure that postgis/postgis is used to run docker container.
- Container must expose port 5432.
- Create a directory named "data" and mount it as volume to "/var/lib/postgresql/data" inside container to persist data on subsequent startups (Optional). 
- SEED env var should always be set to 2903.
- The tool will automatically truncate database, prepare data and seed the database.

> There must be a database schema named "sih_devdb" created in the container.

### Important pointers for redis database
- Make sure that redis/redis-stack is used to run docker container.
- Container must expose port 6379 & 8001 (oprional).
- Create a directory named "data" and mount it as volume to "/data_redis" inside container to persist data on subsequent startups (Optional).
- The tool will automatically truncate database, prepare data if needed and seed the database.

### Install dependencies

To install dependencies run:

```bash
node install
```

### Usage

For help while using the tool:

```bash
node dist/index.js help
```

**Example Usage:**

Here is a  exhaustive list of accepted commands:

```bash
node dist/index.js pg
node dist/index.js redis
node dist/index.js truncate pg
node dist/index.js truncate redis
node dist/index.js prepare
node dist/index.js set
```

- The "set" command sets or updates the DATABASE_URL environment variable.
- The "truncate" command truncates the database.
- The "prepare" command prepares the data. Replaces data if it already existed else creates "src/data/" directory and stores the prepared data.
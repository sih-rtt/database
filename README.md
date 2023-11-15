# Test Database Data Seeding Tool

**This in an internal dev databse seeding tool.**

> Important!: PostgreSQL must be seeded before Redis as Redis seeding uses data from postgreSQL.
> Install Bun JS Runtime to work with this tool.

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
bun install
```
### Migrate schema to postgreSQL database

To migrate schema postgreSQL database run: 

```bash
bunx prisma migrate dev
```

> It is important to migrate schema and generate prisma client to seed the database.

### Usage

For help while using the tool:

```bash
bun src/index.ts help
```

**Example Usage:**

Here is a  exhaustive list of accepted commands:

```bash
bun src/index.ts pg
bun src/index.ts pg -n 1000
bun src/index.ts redis
bun src/index.ts truncate pg
bun src/index.ts truncate redis
bun src/index.ts prepare
```

- The -n (or the --num) flag is used to specify the number of records to be inserted in the "Conductor" table.
- The "truncate" command truncates the database.
- The "prepare" command prepares the data. Replaces data if it already existed else creates "src/data/" directory and stores the prepared data.
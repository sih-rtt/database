# Test Database Data Seeding Tool

**This in an internal dev databse seeding tool.**

Install Bun JS Runtime to work with this tool.

### Important pointers
- Make sure that postgis/postgis is used to run docker container.
- Container must expose port 5432.
- Create a directory named "data" and mount it as volume to "/var/lib/postgresql/data" inside container to persist data on subsequent startups (Optional). 
- SEED env var should always be set to 2903.
- The tool will automatically truncate database, prepare data and seed the database.

> There must be a database schema named "sih_devdb" created in the container.

### Install dependencies

To install dependencies run:

```bash
bun install
```
### Init Database

To initialize database run: 

```bash
bunx prisma migrate dev
```

### Usage

For help while using the tool:

```bash
bun src/index.ts help
```

**Example Usage:**

```bash
bun src/index.ts pg
bun src/index.ts pg -n 1000
bun src/index.ts truncate pg
```

- The -n (or the --num) flag is used to specify the number of records to be inserted in the "Conductor" table.
- The truncate command truncates the database.
  
> The redis database seeding tool is under development and doesn't work.

# Test Database Data Seeding Tool

**This in an internal dev databse seeding tool.**

Install Bun JS Runtime to work with this tool.

### Important pointers
- Make sure that postgis/postgis is used to run docker container.
- Container must expose port 5432.
- Create a directory named "data" and mount it as volume to "/var/lib/postgresql/data" inside container to persist data on subsequent startups (Optional). 
- SEED env var should always be set to 2903.
- There must be a database schema named "sih_devdb" created in the container.
- The tables must be empty before seeding

### Install dependencies

To install dependencies run:

```bash
bun install
```

### Usage

For help while using the tool:

```bash
bun src/index.ts help
```

**Example Usage:**

```bash
bun src/index pg
bun src/index pg -n 1000
bun src/index pg -t <tablename>
bun src/index pg -t <tablename> -n 1000
bun src/index truncate pg
```
**_The redis database seeding tool is under development and doesn't work._**
**_Make sure to seed "BusStop" before seeding "BusRoute", will result in error otherwise._**
**_If using without specifying -t --table, it will seed all the tables without error._**

Not sure if tables are empty before seeding, truncate the database by running:

```bash
bun src/index.ts truncate pg
```
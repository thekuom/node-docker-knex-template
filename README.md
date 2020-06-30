# Title
## Overview
What does this do?

## Running Locally
### Filling Out .env
`.env` is the file with all the environment variables needed to run the server.
```
cp .env.sample .env
```
or on Windows:
```
copy .env.sample .env
```
Fill or modify any empty variables to fit your local environment.

### Installing Dependencies
Install yarn if you haven't already
```
yarn install
```

### Running in Docker
It is recommended to run the API in Docker. You will need to install Docker and Docker Compose.

To start the server:
```
yarn docker:up
```
The Docker environment is setup so port 8080 in the api service is forwarded to your local machine,
so the API can be accessed by hitting `http://localhost:8080` on your local machine. Make sure this port
is available when running the api.

### Setting up the Database
The database will spin up with Docker Compose. However, you will still need to run migrations and seed the database
if you haven't already.

To run migrations:
```
yarn docker:run yarn migrate:up
```

To run seeds:
```
yarn docker:run yarn seed:run
```

Read the scripts section of the `package.json` for more commands that can be run related to seeds and migrations.
Docker forwards the database port to 54320, so to connect to the database locally, use the host, user, and passwords
defined in your `.env` and port 54320.

## Developing
### Linting
The API has most of its linting rules in `.base-eslintrc.js`, which is extended for the `src` and `db` directories in `.eslintrc.js`.

### Testing
To run tests in the docker container:
```
yarn docker:tests
```

Tests will have a coverage report attached to them. You can see them right after running tests in text format. The test coverage tool will also output an html page located in `coverage/index.html`. Open this file in your browser to view what lines are covered.

If you are experiencing slow test running times in the docker container, you can run tests locally by adjusting your environment variables to point to the port forwarded database on your localhost port 54320. Then run
```
APP_PORT=8000 yarn test
```
or on Windows:
```
cmd /C "set APP_PORT=8000 && yarn test"
```

### Database and ERD
The database is a PostgreSQL database.

It is recommended to install a database management tool to visually interact with your local database. Popular tools include
- [Postico](https://eggerapps.at/postico/)
- [pgAdmin](https://www.pgadmin.org/)

### Debugging
You can run the server in debug mode by running
```
yarn docker:debug:up
```

Then, you can attach to the server debug process in one of three ways:
#### Attaching with Chrome Dev Tools
1. Go to `chrome://inspect` in your browser
2. Under "Remote Targets", click "inspect" underneath `server.ts`
3. Search for the file with CMD+P on Mac. Make sure you choose the files with `[sm]` after their name.
4. Add breakpoints

#### Debugging with Node Inspector
1. Run
```
node inspect 0.0.0.0:9229
```
2. Follow the docs: https://nodejs.org/api/debugger.html
3. Add breakpoints by adding `debugger;` to the line you want to break at in the code.

#### Debugging with VS Code
1. In VS Code, click on the Debug icon on the left hand side of the menu
2. To the right of "Run", choose "Debug Server"
3. Type F5
4. Add breakpoints
5. If the server restarts, you will have to re-attach the debug process by hitting F5 again

### Debugging Tests
You can debug the tests by running
```
yarn docker:debug:tests
```
for running in Docker, or
```
yarn test:debug
```
locally. Note that the tests will not run until a debugger is attached. After attaching a debugger,
the tests will run and break on any breakpoints.

#### Attaching with Chrome Dev Tools
1. Go to `chrome://inspect` in your browser
2. Under "Remote Targets", click "inspect" underneath the file with "mocha" in it
3. Search for the file with CMD+P on Mac. Make sure you choose the files with `[sm]` after their name.
4. Add breakpoints

#### Attaching with VS Code
1. In VS Code, click on the Debug icon on the left hand side of the menu
2. To the right of "Run", choose "Debug Tests"
3. Type F5
4. Add breakpoints

### Port Overview
The following ports are used:
| port | port forwarded to | reason          |
|------|-------------------|-----------------|
| 8080 | 8080              | server          |
| 5432 | 54320             | postgres        |
| 9229 | 9229              | debug server    |
| 9222 | 9222              | debug tests     |

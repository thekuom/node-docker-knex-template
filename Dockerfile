FROM node:14-alpine as base

RUN apk --no-cache add curl postgresql-client

# Load the application code
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install dependencies
RUN yarn install

FROM base as BUILD
RUN yarn build
RUN yarn build --project ./test/tsconfig.json

FROM base as RELEASE
# Define the url as the healthcheck
HEALTHCHECK CMD curl --fail http://localhost:8080/api/v1/health || exit 1

# Start 'er up
CMD ["yarn", "start"]

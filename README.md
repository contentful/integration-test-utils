
## Contentful Integration Test Utils

## About
This repository contains utility functions for integration testing of some of Contentful's open source projects. 

It supports ad-hoc space creation and deletion, environment creation as well as a test space clean-up function which can be run periodically or ad hoc.

## Pre-requisites

Requires at least Node 12


## Installation

Using npm:
```bash
npm install @contentful/integration-test-utils
```

Using yarn:
```bash
yarn add @contentful/integration-test-utils
```

## Usage

```js
const testUtils = require('@contentful/integration-test-utils')
```

## API

#### Create Test Space
Creates a test space with strict naming rules. All space names start with '%'.
The space name will be built like this: `%${language} ${repo} ${testSuiteName}`. 
Its length must be less than 30 characters.

```ts
// returns an empty space with space '%JS CMA Entry API';
const testSpace = await testUtils.createTestSpace({
  client,
  organizationId,
  repo: 'CMA',
  language: 'JS',
  testSuiteName: 'Entry API',
})
```


#### Create Test Environment
Creates a test environment in the provided space and waits for it to be ready (timeout: 5 minutes).
The length of the environment name must be less than 40 characters.

```ts
const testEnvironment = await testUtils.createTestEnvironment(testSpace, 'some-test-env-name')
```


#### Delete Test Space
Deletes the space with the space name provided.

```ts
await testUtils.deleteSpace(client, '%JS CMA Entry API')
```

#### Clean up Test Spaces

Deletes spaces whose names start with the prefix `%` and which were created prior to a specific threshold time. The threshold defaults to one hour (60 * 60 * 1000 ms).
The function has a `dryRun` option, which lists all spaces to be deleted.
```ts
// Deletes all spaces starting with '%' 
// that have been created more than one hour (default threshold) ago
await testUtils.cleanUpTestSpaces()

// With options
await testUtils.cleanUpTestSpaces({
  threshold: 60 * 1000,  // changes the threshold to one minute
  dryRun: true           // lists all spaces starting with '%' without deleting them
})
```

**Usage:**
The test cleaner can be used in different ways, according to need.

- In your code, e.g. inside an `after()` within your test suite
```ts
after(async () => {
  await testUtils.cleanUpTestSpaces()
})
```
- As a bin script (`clean-up-test-spaces`) in a pipeline or manually
```bash
./bin/clean-up-test-spaces
```
- As a script to your `package.json`
```json
"scripts":{
    "clean-up-test-spaces": "clean-up-test-spaces"
}
```

> :warning: `cleanUpSpaces` initializes a CMA client and, for that, expects to find an environment variable called `CONTENTFUL_INTEGRATION_TEST_CMA_TOKEN` containing a functioning [Contentful Management Token](https://www.contentful.com/help/personal-access-tokens/#how-to-get-a-personal-access-token-the-web-app).

> :warning: It will delete all spaces connected to that token which match the naming pattern (starting with '%').

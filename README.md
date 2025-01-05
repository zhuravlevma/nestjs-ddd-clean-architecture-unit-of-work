# Clean Architecture with DDD with Unit of Work Pattern

[Domain model](https://martinfowler.com/eaaCatalog/domainModel.html) with a
clean architecture with ports and adapters. It takes into account some tactical
patterns from DDD.

## Unit of work

```typescript
return this.uow.runInTransaction(async () => {
  const updatedWh = await this.saveWh.saveWarehouse(warehouse);
  await this.saveReport.save(report);
  return updatedWh;
});
```

## Architecture

<img src='https://github.com/zhuravlevma/ddd-typeorm-unit-of-work/assets/44276887/43a82b2e-3d1e-4646-b37a-3325ac82e730' alt="architecture schema" width='50%'>

### Module boundaries

If you have a large monolith that contains many
[bounded contexts](https://martinfowler.com/bliki/BoundedContext.html), then the
service can be divided into modules by context.

If you have a micro service architecture and you prefer to allocate contexts to
different services (which is preferable), then the service can be divided into
modules by [aggregates](https://martinfowler.com/bliki/DDD_Aggregate.html).

In this example, there are more than one bounded contexts, you have a monolith
in front of you. And this monolith is internally divided into modules according
to bounded contexts.

### Event Storming schema

![image](https://github.com/zhuravlevma/nestjs-clean-architecture/assets/44276887/396d6ec0-bc43-4cf3-9dec-a77625f2fd11)

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# arch tests
$ npm run test:arch

# test coverage
$ npm run test:cov
```

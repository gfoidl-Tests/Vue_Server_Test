All tests for `greeting-service-tests-*.ts`) are the same. The difference is in the mocking-behavior.

For me the best approach is `jest.spyOn`.

## jest.mock()

Basically `jest.fn` for a whole module.

A mock is "durable" and needs to cleared / resetted manully.
The original instance can't be accessed in a easy way.

It's quite unhandy to use it in a typesafe (TypeScript) way.

## ts-jest mocked()

Aims to provide easier type information for `jest.mock`.

Seems to work with default exports only.

## jest.spyOn()

Similar to `jest.mock`, but allows restoring the original function.
```ts
const spy = jest.spyOn(...);

//

// restore the original implementation
spy.mockRestore();
```

  
It's also possible to just watch (e.g. how often a method is called).

Further there is no need to clean the mock in an `afterAll`-hook, as each test file is run in isolation.

Put it simple: `jest.sypOn` is a nice sugar for `jest.mock` and it puts the mock on steroids.
